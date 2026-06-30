#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

# 生成静态文件
npm run docs:build

# 进入生成的文件夹
cd docs/.vuepress/dist

git init
git add -A
git commit -m 'deploy'

# 如 SSH 被墙，可改用 https 方式推送
# git push -f https://github.com/lxysy/vuepress-notes.git master:gh-pages
git push -f git@github.com:lxysy/vuepress-notes.git master:gh-pages

cd -
