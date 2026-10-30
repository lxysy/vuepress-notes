#!/usr/bin/env node
'use strict'

/**
 * 图片流水线：本地写 Markdown → 自动上传图床 → 改写引用 → 补宽高清单 → 清理本地文件
 *
 * 用法：
 *   node scripts/images.js sync            扫描全部 md，把本地图片推到图床并改写引用
 *   node scripts/images.js sync --dry-run  只报告会做什么，不实际执行
 *   node scripts/images.js sync --stage    额外把改写后的文件加入暂存区（供 pre-commit 钩子调用）
 *   node scripts/images.js typora <图片...>  Typora 自定义上传命令（stdout 只输出 URL）
 *   node scripts/images.js check           检查 md 里是否还有残留的本地图片引用
 *   node scripts/images.js prune [--yes]   列出（--yes 则删除）图床上已无人引用的图
 *
 * 设计要点：
 * - 图片不再进博客仓库，仓库里只留 md + 一份 images-manifest.json（宽高清单）
 * - manifest 的键统一用「相对 docs 的路径」（如 src/ai/img/a.png），与域名、@ref 解耦，
 *   将来换 CDN 或换 tag 都不用重新生成清单
 * - 宽高由本脚本自行解析文件头得出（PNG/JPEG/GIF/WebP/SVG），不依赖任何第三方包
 */

const fs = require('fs')
const path = require('path')
const https = require('https')
const { spawnSync } = require('child_process')

const ROOT = path.resolve(__dirname, '..')
const DOCS = path.join(ROOT, 'docs')
const MANIFEST = path.join(DOCS, '.vuepress', 'images-manifest.json')
const CONFIG = JSON.parse(fs.readFileSync(path.join(__dirname, 'images.config.json'), 'utf8'))
const ASSETS = path.resolve(ROOT, CONFIG.assetsDir)
const TRASH = path.resolve(ROOT, CONFIG.trashDir)

const ARGS = process.argv.slice(2)
const CMD = ARGS[0] || 'sync'
const FLAGS = new Set(ARGS.filter(a => a.startsWith('--')))
const DRY = FLAGS.has('--dry-run')
const STAGE = FLAGS.has('--stage')

// 所有提示走 stderr，保证 typora 模式下 stdout 只有 URL
function log (...args) { console.error(...args) }

// ---------------------------------------------------------------- 基础工具

const posix = p => p.split(path.sep).join('/')

function relToDocs (abs) {
  return posix(path.relative(DOCS, abs))
}

function cdnUrl (rel) {
  return `${CONFIG.cdn}/${CONFIG.repo}@${CONFIG.ref}/${rel}`
}

function readManifest () {
  try {
    return JSON.parse(fs.readFileSync(MANIFEST, 'utf8'))
  } catch (e) {
    return {}
  }
}

function writeManifest (data) {
  const keys = Object.keys(data).sort()
  const lines = ['{']
  keys.forEach((k, i) => {
    const comma = i < keys.length - 1 ? ',' : ''
    lines.push(`  ${JSON.stringify(k)}: { "w": ${data[k].w}, "h": ${data[k].h} }${comma}`)
  })
  lines.push('}')
  fs.mkdirSync(path.dirname(MANIFEST), { recursive: true })
  fs.writeFileSync(MANIFEST, lines.join('\n') + '\n', 'utf8')
}

function git (args, cwd) {
  const r = spawnSync('git', args, { cwd, encoding: 'utf8' })
  if (r.status !== 0) {
    throw new Error(`git ${args.join(' ')}\n${r.stderr || r.stdout}`)
  }
  return (r.stdout || '').trim()
}

// 提交图床仓库时用主仓库的身份，避免「Please tell me who you are」
function gitIdentity () {
  const pick = (key, fallback) => {
    const r = spawnSync('git', ['config', key], { cwd: ROOT, encoding: 'utf8' })
    return (r.status === 0 && r.stdout.trim()) || fallback
  }
  return {
    name: pick('user.name', 'lxysy'),
    email: pick('user.email', 'lxysy@users.noreply.github.com')
  }
}

// ---------------------------------------------------------------- 宽高解析

const IMG_EXT = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg'])

function imageSize (file) {
  const ext = path.extname(file).toLowerCase()
  let buf
  try {
    const fd = fs.openSync(file, 'r')
    buf = Buffer.alloc(128 * 1024)
    const n = fs.readSync(fd, buf, 0, buf.length, 0)
    fs.closeSync(fd)
    buf = buf.subarray(0, n)
  } catch (e) {
    return null
  }

  try {
    if (ext === '.svg') return svgSize(file)
    if (buf.length > 24 && buf.readUInt32BE(0) === 0x89504e47) {
      return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) }
    }
    if (buf.length > 10 && buf.toString('ascii', 0, 4) === 'GIF8') {
      return { w: buf.readUInt16LE(6), h: buf.readUInt16LE(8) }
    }
    if (buf.length > 30 && buf.toString('ascii', 0, 4) === 'RIFF' && buf.toString('ascii', 8, 12) === 'WEBP') {
      const fmt = buf.toString('ascii', 12, 16)
      if (fmt === 'VP8X') {
        return { w: buf.readUIntLE(24, 3) + 1, h: buf.readUIntLE(27, 3) + 1 }
      }
      if (fmt === 'VP8 ') {
        return { w: buf.readUInt16LE(26) & 0x3fff, h: buf.readUInt16LE(28) & 0x3fff }
      }
      if (fmt === 'VP8L') {
        const bits = buf.readUInt32LE(21)
        return { w: (bits & 0x3fff) + 1, h: ((bits >> 14) & 0x3fff) + 1 }
      }
    }
    if (buf[0] === 0xff && buf[1] === 0xd8) {
      let i = 2
      while (i < buf.length - 9) {
        if (buf[i] !== 0xff) { i++; continue }
        const marker = buf[i + 1]
        if (marker === 0xd8 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) { i += 2; continue }
        if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
          return { h: buf.readUInt16BE(i + 5), w: buf.readUInt16BE(i + 7) }
        }
        i += 2 + buf.readUInt16BE(i + 2)
      }
    }
  } catch (e) {
    return null
  }
  return null
}

function svgSize (file) {
  const head = fs.readFileSync(file, 'utf8').slice(0, 2000)
  const w = /<svg[^>]*\bwidth\s*=\s*["']([\d.]+)/i.exec(head)
  const h = /<svg[^>]*\bheight\s*=\s*["']([\d.]+)/i.exec(head)
  if (w && h) return { w: Math.round(+w[1]), h: Math.round(+h[1]) }
  const vb = /\bviewBox\s*=\s*["']([\d.\-\s]+)["']/i.exec(head)
  if (vb) {
    const parts = vb[1].trim().split(/[\s,]+/)
    if (parts.length === 4) return { w: Math.round(+parts[2]), h: Math.round(+parts[3]) }
  }
  return null
}

// ---------------------------------------------------------------- 可选压缩

// 压缩是可选能力：装了 sharp 才生效，没有就原样上传。
// Node 16 上装，请用 npm i -D sharp@0.32（0.33 起要求 Node 18+）
async function maybeCompress (abs, rel) {
  const raw = () => ({ buffer: fs.readFileSync(abs), rel })

  let sharp
  try {
    sharp = require('sharp')
  } catch (e) {
    const bytes = fs.statSync(abs).size
    if (bytes > 800 * 1024) {
      log(`  · ${path.basename(abs)} 有 ${(bytes / 1048576).toFixed(1)} MB，未安装 sharp 无法压缩`)
    }
    return raw()
  }

  const ext = path.extname(abs).toLowerCase()
  if (ext === '.svg' || ext === '.gif') return raw()

  try {
    const base = sharp(abs).rotate().resize({ width: CONFIG.maxWidth, withoutEnlargement: true })
    const [png, webp] = await Promise.all([
      base.clone().png({ compressionLevel: 9, palette: true }).toBuffer(),
      base.clone().webp({ quality: 82 }).toBuffer()
    ])
    const best = png.length <= webp.length
      ? { buf: png, ext: '.png' }
      : { buf: webp, ext: '.webp' }

    // 压缩后反而更大，就保留原文件
    if (best.buf.length >= fs.statSync(abs).size) return raw()

    return { buffer: best.buf, rel: rel.replace(/\.[^.]+$/, best.ext) }
  } catch (e) {
    log(`  · ${path.basename(abs)} 压缩失败，按原样上传：${e.message}`)
    return raw()
  }
}

// ---------------------------------------------------------------- 图床仓库

function ensureAssets () {
  if (!fs.existsSync(path.join(ASSETS, '.git'))) {
    log(`▸ 首次使用，克隆图床仓库 ${CONFIG.repo} → ${posix(path.relative(ROOT, ASSETS))}`)
    if (DRY) return
    git(['clone', `https://github.com/${CONFIG.repo}.git`, ASSETS], ROOT)
  }
  if (DRY) return
  try {
    const dirty = git(['status', '--porcelain'], ASSETS)
    if (dirty) {
      log('⚠ 图床工作副本有未提交改动，跳过拉取')
    } else {
      git(['pull', '--ff-only', 'origin', CONFIG.ref], ASSETS)
    }
  } catch (e) {
    log('⚠ 图床仓库拉取失败，继续使用本地副本：' + e.message.split('\n')[0])
  }
}

function targetRel (abs) {
  const rel = path.relative(DOCS, abs)
  // 跨盘符时 path.relative 会直接返回绝对路径（Windows 特性），同样归入 inbox
  if (path.isAbsolute(rel) || rel.startsWith('..')) {
    const day = new Date().toISOString().slice(0, 10)
    const base = path.basename(abs).replace(/[^\w.-]+/g, '-')
    return posix(path.join('inbox', day, base))
  }
  return posix(rel)
}

function commitAssets (message) {
  const id = gitIdentity()
  git(['add', '-A'], ASSETS)
  const status = git(['status', '--porcelain'], ASSETS)
  if (!status) {
    log('· 图床无新增文件')
    return false
  }
  git(['-c', `user.name=${id.name}`, '-c', `user.email=${id.email}`, 'commit', '-m', message], ASSETS)
  git(['push', 'origin', `HEAD:${CONFIG.ref}`], ASSETS)
  log(`✔ 图床已推送（${status.split('\n').length} 个文件）`)
  return true
}

// jsDelivr 对未缓存的文件会先 301 到 GitHub raw，主动预热一次可避免读者踩到
function warm (url) {
  return new Promise(resolve => {
    const req = https.get(url, { timeout: 15000 }, res => {
      log(`  · 预热 ${res.statusCode} ${url.replace(CONFIG.cdn + '/', '')}`)
      res.resume()
      resolve()
    })
    req.on('error', () => resolve())
    req.on('timeout', () => { req.destroy(); resolve() })
  })
}

// ---------------------------------------------------------------- 上传

async function uploadAll (files) {
  const result = new Map()
  if (!files.length) return result

  const plans = files.map(abs => ({ abs, rel: targetRel(abs) }))
  log(`▸ 待上传 ${plans.length} 张：`)
  plans.forEach(p => log(`  · ${posix(path.relative(ROOT, p.abs))} → ${p.rel}`))

  if (DRY) {
    plans.forEach(p => result.set(p.abs, { url: cdnUrl(p.rel), rel: p.rel, size: imageSize(p.abs) }))
    return result
  }

  ensureAssets()

  for (const p of plans) {
    const out = await maybeCompress(p.abs, p.rel)
    const dest = path.join(ASSETS, out.rel)
    fs.mkdirSync(path.dirname(dest), { recursive: true })
    fs.writeFileSync(dest, out.buffer)
    result.set(p.abs, { url: cdnUrl(out.rel), rel: out.rel, size: imageSize(dest) })
  }

  commitAssets(`chore(assets): add ${plans.length} image(s) at ${new Date().toISOString().slice(0, 16).replace('T', ' ')}`)

  for (const p of plans) await warm(result.get(p.abs).url)
  return result
}

// ---------------------------------------------------------------- 扫描 md

function walkMd (dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) walkMd(full, out)
    else if (entry.name.endsWith('.md')) out.push(full)
  }
  return out
}

const MD_IMG = /!\[[^\]]*\]\(\s*<?([^)\s>]+)/g
const HTML_IMG = /<img\b[^>]*?\bsrc\s*=\s*(["'])(.*?)\1/gi

function isLocalRef (ref) {
  return !/^(https?:)?\/\//i.test(ref) && !/^(data|file|mailto):/i.test(ref) && !ref.startsWith('/')
}

function safeDecode (s) {
  try {
    return decodeURI(s)
  } catch (e) {
    return s // 路径里有裸 % 或反斜杠时 decodeURI 会抛错，按原样处理
  }
}

function collectRefs () {
  const refs = [] // { md, raw, abs }
  for (const md of walkMd(DOCS)) {
    if (md.includes(`${path.sep}.vuepress${path.sep}`)) continue
    const text = fs.readFileSync(md, 'utf8')
    const push = raw => {
      const clean = safeDecode(raw.split('#')[0].split('?')[0])
      if (!isLocalRef(clean)) return
      const abs = path.resolve(path.dirname(md), clean)
      if (!fs.existsSync(abs)) return
      if (abs.includes(`${path.sep}.vuepress${path.sep}public${path.sep}`)) return
      if (!IMG_EXT.has(path.extname(abs).toLowerCase())) return
      refs.push({ md, raw, abs })
    }
    let m
    while ((m = MD_IMG.exec(text))) push(m[1])
    while ((m = HTML_IMG.exec(text))) push(m[2])
  }
  return refs
}

function replaceAll (text, from, to) {
  return text.split(from).join(to)
}

function moveToTrash (abs) {
  const day = new Date().toISOString().slice(0, 10)
  const dest = path.join(TRASH, day, path.basename(abs))
  fs.mkdirSync(path.dirname(dest), { recursive: true })
  let final = dest
  let i = 1
  while (fs.existsSync(final)) {
    final = path.join(path.dirname(dest), `${path.basename(dest, path.extname(dest))}-${i++}${path.extname(dest)}`)
  }
  // 源文件可能和 .images-trash 不在同一个盘，rename 会 EXDEV，退化为复制+删除
  try {
    fs.renameSync(abs, final)
  } catch (e) {
    if (e.code !== 'EXDEV') throw e
    fs.copyFileSync(abs, final)
    fs.unlinkSync(abs)
  }
  return final
}

// ---------------------------------------------------------------- 命令

async function cmdSync () {
  const refs = collectRefs()
  if (!refs.length) {
    log('✔ 没有需要上传的本地图片')
    return
  }

  const unique = [...new Set(refs.map(r => r.abs))]
  const uploaded = await uploadAll(unique)

  // 更新清单：键是相对 docs 的路径
  const manifest = readManifest()
  for (const info of uploaded.values()) {
    if (info.size && info.size.w && info.size.h) {
      manifest[info.rel] = { w: info.size.w, h: info.size.h }
    }
  }
  if (!DRY) writeManifest(manifest)
  log(`✔ 宽高清单已更新（共 ${Object.keys(manifest).length} 条）`)

  // 改写 md
  const byMd = new Map()
  for (const r of refs) {
    if (!byMd.has(r.md)) byMd.set(r.md, [])
    byMd.get(r.md).push(r)
  }

  for (const [md, list] of byMd) {
    let text = fs.readFileSync(md, 'utf8')
    for (const r of list) {
      const info = uploaded.get(r.abs)
      if (!info) continue
      text = replaceAll(text, r.raw, info.url)
    }
    if (!DRY) fs.writeFileSync(md, text, 'utf8')
    log(`✔ 改写 ${posix(path.relative(ROOT, md))}（${list.length} 处）`)
  }

  // 清理本地图片
  if (!DRY) {
    for (const abs of unique) {
      if (!fs.existsSync(abs)) continue
      try {
        const t = moveToTrash(abs)
        log(`  · 已移动 ${posix(path.relative(ROOT, abs))} → ${posix(path.relative(ROOT, t))}`)
      } catch (e) {
        log(`  ⚠ 清理 ${abs} 失败（不影响上传）：${e.message}`)
      }
    }
  }

  if (STAGE && !DRY) {
    const files = [...byMd.keys(), MANIFEST].map(f => posix(path.relative(ROOT, f)))
    git(['add', '--', ...files], ROOT)
    log(`✔ 已暂存 ${files.length} 个文件`)
  }

  log(`\n完成：${unique.length} 张图片已迁移，${byMd.size} 个 md 已改写`)
}

async function cmdTypora (files) {
  if (!files.length) {
    log('用法：node scripts/images.js typora <图片路径...>')
    process.exit(1)
  }

  const abs = files.map(f => path.resolve(f)).filter(f => fs.existsSync(f))
  if (!abs.length) {
    log('没有可上传的文件')
    process.exit(1)
  }

  const uploaded = await uploadAll(abs)

  // 更新清单
  const manifest = readManifest()
  for (const info of uploaded.values()) {
    if (info.size && info.size.w && info.size.h) manifest[info.rel] = { w: info.size.w, h: info.size.h }
  }
  if (!DRY) writeManifest(manifest)

  // 清理本地源文件（移到 .images-trash，可随时找回）；失败也不能影响 URL 输出
  // keepLocalCopy: true 时保留原地，方便事后找回或改图（此时 md 里已是 CDN 链接，
  // 留着不会被 sync 再次扫描，是安全的）
  if (!CONFIG.keepLocalCopy && !DRY) {
    for (const f of abs) {
      if (!fs.existsSync(f)) continue
      try {
        moveToTrash(f)
      } catch (e) {
        log(`  ⚠ 清理 ${f} 失败：${e.message}`)
      }
    }
  }

  // Typora 读 stdout 的最后 N 行作为 URL
  const urls = abs.map(f => uploaded.get(f).url)
  process.stdout.write(`Upload Success:\n${urls.join('\n')}\n`)
}

function cmdCheck () {
  const refs = collectRefs()
  if (!refs.length) {
    log('✔ 干净：md 里没有残留的本地图片引用')
    return
  }
  log(`✖ 仍有 ${refs.length} 处本地引用：`)
  refs.slice(0, 30).forEach(r => log(`  ${posix(path.relative(ROOT, r.md))}  →  ${r.raw}`))
  process.exitCode = 1
}

// ---------------------------------------------------------------- 孤儿清理

// 可能引用图片地址的文本文件（含 config 之类，避免误删仍有引用的图）
const TEXT_EXT = new Set(['.md', '.ts', '.js', '.vue', '.json', '.styl', '.stylus', '.css', '.html', '.yml', '.yaml'])
const SKIP_DIR = new Set(['node_modules', 'dist', '.temp', '.cache', '.git'])

function walkText (dir, out = []) {
  let entries
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true })
  } catch (e) {
    return out
  }
  for (const entry of entries) {
    if (SKIP_DIR.has(entry.name)) continue
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) walkText(full, out)
    else if (TEXT_EXT.has(path.extname(entry.name).toLowerCase())) out.push(full)
  }
  return out
}

function listAssets () {
  const out = []
  if (!fs.existsSync(ASSETS)) return out
  const stack = [ASSETS]
  while (stack.length) {
    const dir = stack.pop()
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.name === '.git') continue
      const full = path.join(dir, entry.name)
      if (entry.isDirectory()) stack.push(full)
      else out.push(posix(path.relative(ASSETS, full)))
    }
  }
  return out.sort()
}

// 从 docs 下的文本文件里收集「本图床仓库」被引用到的相对路径
// 不绑定具体 CDN 域名，只认 /<owner>/<repo>@<ref>/<path>，换域名后依然有效
function collectCdnRefs () {
  const repo = CONFIG.repo.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const re = new RegExp(`/${repo}@[^/\\s"')]+/([^)\\s"'?#]+)`, 'g')
  const used = new Set()
  for (const file of walkText(DOCS)) {
    let text
    try {
      text = fs.readFileSync(file, 'utf8')
    } catch (e) {
      continue
    }
    let m
    re.lastIndex = 0
    while ((m = re.exec(text))) used.add(safeDecode(m[1]))
  }
  return used
}

const insideAssets = p => {
  const r = path.relative(ASSETS, p)
  return !!r && !r.startsWith('..') && !path.isAbsolute(r)
}

async function cmdPrune () {
  if (!fs.existsSync(ASSETS)) {
    log('✖ 图床工作副本不存在，先跑一次 npm run images:sync')
    process.exitCode = 1
    return
  }

  const used = collectCdnRefs()
  const all = listAssets()
  const allSet = new Set(all)
  const orphans = all.filter(rel => !used.has(rel))

  log(`▸ 图床共 ${all.length} 个文件，文档中引用 ${used.size} 个`)

  const manifest = readManifest()
  const missing = Object.keys(manifest).filter(k => !allSet.has(k))
  if (missing.length) {
    log(`⚠ manifest 有 ${missing.length} 条指向不存在的文件（这些图不会注入宽高）：`)
    missing.slice(0, 10).forEach(k => log(`  ${k}`))
  }

  if (!orphans.length) {
    log('✔ 没有孤儿图：图床上每个文件都有引用')
    return
  }

  let bytes = 0
  log(`\n✖ ${orphans.length} 个文件已无人引用：`)
  for (const rel of orphans) {
    const size = fs.statSync(path.join(ASSETS, rel)).size
    bytes += size
    const dirty = Object.prototype.hasOwnProperty.call(manifest, rel) ? '  [manifest 有残留条目]' : ''
    log(`  ${(size / 1024).toFixed(0).padStart(5)} KB  ${rel}${dirty}`)
  }
  log(`\n合计 ${(bytes / 1048576).toFixed(2)} MB`)

  if (!FLAGS.has('--yes')) {
    log('\n以上仅为报告，未删除。确认无误后执行：')
    log('  npm run images:prune -- --yes')
    return
  }

  for (const rel of orphans) {
    const abs = path.join(ASSETS, rel)
    fs.unlinkSync(abs)
    delete manifest[rel]
    // 自底向上清掉因删除而变空的目录
    let dir = path.dirname(abs)
    while (insideAssets(dir)) {
      if (fs.readdirSync(dir).length) break
      fs.rmdirSync(dir)
      dir = path.dirname(dir)
    }
    log(`  · 删除 ${rel}`)
  }

  writeManifest(manifest)
  commitAssets(`chore(assets): prune ${orphans.length} unused image(s)`)
  log(`✔ 已清理 ${orphans.length} 个孤儿图，释放 ${(bytes / 1048576).toFixed(2)} MB`)
}

function usage () {
  log(`图片流水线

  node scripts/images.js sync [--dry-run] [--stage]   上传本地图片并改写 md 引用
  node scripts/images.js typora <图片...>             Typora 自定义上传命令
  node scripts/images.js check                        检查残留的本地图片引用
  node scripts/images.js prune [--yes]                列出（--yes 则删除）图床上无人引用的图

配置：scripts/images.config.json`)
}

;(async () => {
  try {
    if (CMD === 'sync') await cmdSync()
    else if (CMD === 'typora') await cmdTypora(ARGS.slice(1).filter(a => !a.startsWith('--')))
    else if (CMD === 'check') cmdCheck()
    else if (CMD === 'prune') await cmdPrune()
    else usage()
  } catch (e) {
    log('✖ ' + (e && e.message ? e.message : e))
    process.exit(1)
  }
})()
