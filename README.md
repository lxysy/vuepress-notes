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

**<u>打包时的node版本选用v16.20.2</u>**
### 部署
在使用部署脚本前先提交关于文档的更改到main分支，这里的部署脚本实际就是将打包后的文件上传到gh-page分支
windows下时
```shell
cd docs/.vuepress/dist

git init
git add -A
git commit -m 'deploy'

# 如果发布到 https://<USERNAME>.github.io/<REPO> 或者使用https

git push -f git@github.com:lxysy/vuepress-notes.git master:gh-pages
```

