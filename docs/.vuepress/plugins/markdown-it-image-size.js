// 构建时为图片补上真实宽高（宽高来自 images-manifest.json）。
//
// 为什么：<img> 没有 width/height 时，图片下载完成前高度为 0，正文会被"压扁"。
// 点击右侧大纲跳转时，滚动目标是在图片尚未占位的那一刻算出来的，图片随后加载
// 会把标题推向下方，导致页面停不到目标位置。补上宽高后浏览器会按 aspect-ratio
// 在图片下载前就预留出正确高度，文档总高度恒定，锚点定位不再漂移。
//
// 顺带加上 loading="lazy" / decoding="async"：有占位高度时懒加载不会造成塌陷。
//
// 清单的键是「相对 docs 的路径」（如 src/ai/img/a.png），与 CDN 域名、@ref 无关，
// 因此换图床域名或换 tag 都不需要重新生成清单。

const manifest = require('../images-manifest.json')

// https://cdn.jsdelivr.net/gh/owner/repo@ref/src/ai/img/a.png → src/ai/img/a.png
function relFromUrl (src) {
  const m = /\/gh\/[^/]+\/[^/@]+@[^/]+\/(.+)$/.exec(src)
  return m ? decodeURI(m[1]) : null
}

// 兜底：按文件名匹配（仅当全库唯一时使用）
const byName = {}
for (const key of Object.keys(manifest)) {
  const name = key.slice(key.lastIndexOf('/') + 1)
  byName[name] = byName[name] === undefined ? key : null
}

function lookup (src) {
  if (!src) return null
  if (manifest[src]) return manifest[src]

  const rel = relFromUrl(src)
  if (rel && manifest[rel]) return manifest[rel]

  const name = src.slice(src.lastIndexOf('/') + 1).split('?')[0]
  const hit = byName[name]
  return hit ? manifest[hit] : null
}

module.exports = function imageSizePlugin (md) {
  const fallback = (tokens, idx, options, env, self) =>
    self.renderToken(tokens, idx, options)
  const original = md.renderer.rules.image || fallback

  md.renderer.rules.image = function (tokens, idx, options, env, self) {
    const token = tokens[idx]
    const size = lookup(token.attrGet('src'))

    // 没查到宽高也照样加懒加载，只是少了占位高度
    token.attrSet('loading', 'lazy')
    token.attrSet('decoding', 'async')

    if (size) {
      token.attrSet('width', String(size.w))
      token.attrSet('height', String(size.h))
    }
    return original(tokens, idx, options, env, self)
  }
}
