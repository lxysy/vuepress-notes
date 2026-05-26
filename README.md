# vuepress-notes
学习笔记

## 参考资料：

### 框架：
https://vuepress.vuejs.org/zh/

### 主题：
http://v1.vuepress-reco.recoluan.com/views/1.x/

### 文章：
https://juejin.cn/post/7189073364365869093?searchId=20231019100419A26FC2508D2F3E32F2BA#heading-18
自动化部署
https://juejin.cn/post/6937532951223599141

### 插件：

樱花效果
vuepress-plugin-sakura
```shell
npm install vuepress-plugin-sakura -D
```

鼠标点击效果
vuepress-plugin-cursor-effects
```shell
npm install vuepress-plugin-cursor-effects -D
```

### 部署

项目使用 GitHub Actions 自动构建与部署。

**工作流文件：** `.github/workflows/doc.yml`

流程：
1. 推送到 `main` 分支自动触发
2. 使用 Node 18 安装依赖（`npm ci`）
3. 构建静态文件（`npm run docs:build`）
4. 通过 `peaceiris/actions-gh-pages` 将构建产物推送到 `gh-pages` 分支
5. GitHub Pages 自动从 `gh-pages` 分支部署

> **注意：** 由于 VuePress 1.x 依赖 webpack 4，在 Node 17+ 上构建需设置 `NODE_OPTIONS=--openssl-legacy-provider`，已在 CI 中配置。

