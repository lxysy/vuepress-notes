---
title: electron
date: 2024-01-02
categories:
  - electron
tags:
  - electron
---

electron打包

依赖如下：

```json
"devDependencies": {
    "electron": "^13.0.0",
    "electron-builder": "^22.13.1",
    "electron-devtools-installer": "^3.1.0",
    "vue-cli-plugin-electron-builder": "~2.1.1"
}
```





报错：

```js
⨯ Get "https://npm.taobao.org/mirrors/electron/13.6.9/electron-v13.6.9-linux-x64.zip": Connect failed
github.com/develar/app-builder/pkg/download.(*Downloader).follow.func1
```





下载好electron-v13.6.9-linux-x64.zip，放在/home/lx/.cache/electron后，重新打包即可