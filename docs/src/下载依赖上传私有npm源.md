---
title: 下载依赖上传私有npm源
date: 2024-04-26
categories:
  - 下载依赖上传私有npm源
  - 离线文档
tags:
  - .tgz
  - 私有源
---

参考
https://segmentfault.com/a/1190000040027813
https://gitee.com/chaimzhang/batch-download-tgz

安装
```shell
npm install node-tgz-downloader -g
```

修改npm源地址，淘宝源地址使用该工具下载可能会失败
```shell
registry = https://registry.npmjs.org
```

下载好所需的依赖后
```shell
download-tgz package-lock package-lock.json
```

这个命令会根据package-lock.json文件，下载所需要的依赖包tgz,下载的tgz文件会在项目根目录/tarballs下


新建目录tgz,去重并将依赖提取出来
```shell
find . -name '*.tgz' -exec cp -f {} ../tgz \;
```

之后考虑批量上传到nexus上
```bash
#!/bin/bash
#tgz文件存放的路径
targetDir=./newtgzs

#这里替换为实际的nexus地址
publishRestful=http://192.168.1.1:8081/service/rest/v1/component?repository=npm-release

# 列出.taz文件所在目录中所有的.taz名称
echo ">>> 文件所在目录：$targetDir <<<"
dir=$(ls -l $targetDir | awk '/.tgz$/ {print $NF}')

echo ">>>目录：$dir <<<"
cd $targetDir

for file in $dir
do
  echo ">>> $targetDir/$f1le 上传开始 \n"

  #这里替换为管理员账号密码
  ret=`curl -u 账号:密码 -X POST "$publishRestful" -H "Accept: application/json" -H "Content-Type: multipart/form-data" -F "npm.asset=@$file;type=application/x-compressed"`

  echo $ret
  echo ">>> $targetDir/$file 上传完成 \n"
done

```