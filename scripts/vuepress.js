#!/usr/bin/env node
/**
 * VuePress 启动包装器
 *
 * 背景：webpack 4 生态里 terser-webpack-plugin@1 内部硬编码了
 * crypto.createHash('md4') 计算缓存 key，无法通过 output.hashFunction 覆盖。
 *
 * - Node 16 及更早：链接 OpenSSL 1.1.1，md4 原生可用，不需要任何参数；
 *   且这些版本不认识 --openssl-legacy-provider，传了会直接报错
 *   （放在 NODE_OPTIONS 里则报 "is not allowed in NODE_OPTIONS"）。
 * - Node 17 及更高：切换到 OpenSSL 3，md4 被移入 legacy provider，
 *   必须显式加 --openssl-legacy-provider 才能构建。
 *
 * 因此这里按运行时 Node 版本条件决定是否传参，保证 Node 16 / 18 / 20 / 22
 * 以及未来版本都能直接运行同一条 npm 脚本。
 */
const { spawnSync } = require('child_process')
const path = require('path')

// vuepress 的 exports 只暴露 "." 和 "./config"，不能用子路径直接解析 cli.js，
// 先解析入口 index.js（位于包根目录），再取同级 cli.js
const cli = path.join(path.dirname(require.resolve('vuepress')), 'cli.js')

const major = Number(process.versions.node.split('.')[0])
const args = []

if (major >= 17) {
  args.push('--openssl-legacy-provider')
}

args.push(cli)
args.push(...process.argv.slice(2))

const result = spawnSync(process.execPath, args, { stdio: 'inherit' })

if (result.error) {
  console.error(result.error)
  process.exit(1)
}

process.exit(result.status === null ? 1 : result.status)
