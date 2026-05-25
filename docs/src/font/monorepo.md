---
title: 使用pnpm快速搭建monorepo项目
date: 2023-10-19
categories:
  - 前端
tags:
  - pnpm
  - monorepo
sticky: 2
---

# 使用pnpm快速搭建monorepo项目

## 创建主项目

1.`mkdir monorepo-demo && cd monorepo-demo`

2.`pnpm init`

创建一个packages目录作为我们的子项目目录使用：
```shell
├── package.json
├── packages
│   ├── components
│   └── utils
```

添加`.gitignore`,需要考虑子目录下的情况
```
/**/node_modules/
```

配置工作空间（`workspace`）,在主目录下传见一个`pnpm-workspace.yaml`文件,`workspace:*`和`workspace:^`都表示使用工作区中的子包，前者接任何版本，后者则是最新的版本
>pnpm内置了对单一存储库的支持，你可以创建一个`workspace`将多个项目合并到一个仓库中

```yaml
packages:
  - 'packages/*'
```

## 安装依赖

1.全局共用依赖

在多个子项目中使用到的依赖，如lodash,dayjs等，使用全局安装的方式，这样所有子项目都可以直接引入使用（依赖安装在主目录下）
>如果在全局安装依赖和子项目中的依赖相同，pnpm会自动优化处理，通过软链接的方式安装，不会重复安装依赖

```shell
pnpm i dayjs -Dw
```

* `pnpm i` 和 `pnpm add`功能相同

* `-D`:作为开发依赖使用

* `-w`:表示把包安装在`root`下，该包会放置在`<root>/node_modules`

2.单一子项目依赖

当子项目中存在独有的依赖时，可将依赖安装到子项目中

> * 对于多个子项目中欧给你是否会存在相同依赖，是否会重复安装，无需关心，`pnpm`会处理
> * `pnpm`会优先保证只下载一个依赖

```shell
# 安装包到目标子项目下 name为对应子项目中package.json中的name
pnpm add <package-name> --filter <target-package-name>

pnpm add lodash --filter utils

# 删除操作
pnpm rm lodash --filter utils
```

* --filter:过滤，用于将命令限制于特定的子集

3.子项目相互作为依赖(核心)

子项目直接是单独管理的，但子项目又不是完全独立的，他们之间存在着一些相互依赖的关系。如组件代码依赖与工具类的一些方法，文档网站又依赖于组件和工具类。

为了实现和使用远程npm包一样的效果，避免修改代码后，发布、重新安装依赖来本地调试，使用pnpm的工作空间（workspace）可以实现本地调试。

执行如下命令
```shell
pnpm add @mono-demo/utils -F @mono-demo/components
```

完成后`@mono-demo/components`的`package.json`改变
```json
{
  "name": "@mono-demo/components",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "@mono-demo/utils": "workspace:^"
  }
}
```

`"@mono-dem `工作空间协议写法，它实现了当utils子项目中的代码更新，你在components中引用的代码也是最新的

> `npm`版本规范：
> * 主版本号(`alpha`):当你做了不兼容的API更改
> * 次版本号(`beta`):当你做了向下兼容的功能性新增
> * 修订号(`rc`):当你做了向下兼容的问题修正
>
> `npm`版本匹配策略：
> * `^1.0.1`: 主版本匹配（1.X）
> * `~1.0.1`: 主、次版本一致匹配（1.1.X）
> * `*`: 全匹配，不受版本号影响，命中一切新发布的版本号  

`workspace`也是符合`npm`版本规范的，从开发调试的角度考虑，各个子项目之前的依赖引用都应该是最新的的代码

安装时就可指定版本匹配策略
```shell
pnpm add @mono-demo/utils@* -F @mono-demo/components
```

## lerna

简介：Lerna是一个用来优化托管在git/npm上的多packages代码库的工作流的一个管理工具，可以让你在主项目下管理多个子项目，从而解决了多包相互以来，且发布时需要手动维护多个包的问题

在lerna中可直接进行模块的引入和调试（实现原理参考fs.symLinkSync(target,path,type)）

lerna是JS生态系统中最初的　monorepo/workspace　工具，当他在2015／2016年创建时，当时的生态中没有内置的功能来处理单个存储库中的多个包，像`lerna bootstrap` `lerna add` `lerna link`这样的命令都是`lerna`的关键部分。经过之后`npm` `pnpm` `yarn`的发展后，这些功能逐渐被包管理器实现，且在`lerna v7`及以上版本停用了这些指令。`lerna`重心则在版本控制和发布

若加入lerna和nx进行管理，按照如下步骤：

### 安装lerna和nx
```shell
pnpm i lerna -Dw
pnpm i nx -Dw

# 默认安装的版本
"lerna": "^8.0.1"
"nx": "^17.2.6"
```

### 常用命令如下

添加子包依赖或者公共依赖时使用以上提到的`pnpm add -F`

1.初始化项目
```shell
lerna init
```

2.创建一个由lerna管理的包
```shell
# 实际上和手动在packages目录下创建项目相同
lerna create <name>
```

6.在对应的packages中执行命令
```shell
lerna exec --scope=package-b npm run start
```

7.显示所有安装的包
```shell
lerna list
```

8.从所有包中清除node_modules目录，不会清除根目录下的node_modules
```shell
lerna clean
```

9.发布项目中的所有包
```shell
lerna publish
```









