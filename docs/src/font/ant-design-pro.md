---
title: ant-design-pro
date: 2024-01-02
categories:
  - ant-design-pro
tags:
  - ant-design-pro
---

umi项目重启后src/assets/目录下的图片请求失败404，该目录用于存放需要经过编译处理的资源文件，这些文件会被编译打包到输出目录中，但是在项目重启后，这些文件可能会无法访问

在umi的配置文件（.umirc.js或config/config.js）中使用theme配置：

```js
export default defineConfig({
    ...
    theme: {
 	 ...
     'img-url': 'url-loader'
  },
})
```



前端部分使用Ant Design Rro

### 目录结构

```shell
src
├── access.js   
├── app.jsx             应用入口文件，通常包括路由配置、全局布局等
├── assets              存放静态资源文件
├── components          存放通用的业务组件
├── global.jsx          全局配置文件，如 dva、antd 等的全局配置
├── global.less         全局样式文件
├── locales             
├── manifest.json
├── models              存放 dva 数据模型文件
├── pages               存放页面组件，按照路由划分，每个路由对应一个文件夹，文件夹内包含该路由的页面组件、模型等
├── services            后台接口服务  
├── service-worker.js
└── static
```

### 页面布局

使用了[plugin-layout](https://umijs.org/zh-CN/plugins/plugin-layout)插件，配置启用ant-design-pro的布局，根据配置自动生成菜单、面包屑。

```js
// config.js
import { defineConfig } from 'umi';

layout: {
    // https://umijs.org/zh-CN/plugins/plugin-layout
    locale: true,
    siderWidth: 208,
    ...defaultSettings,
  },
```

在入口文件出还可对自动生成的布局组件进行一定程度的自定义

```jsx
// app.jsx
// https://procomponents.ant.design/components/layout/#%E5%92%8C-umi-%E4%B8%80%E8%B5%B7%E4%BD%BF%E7%94%A8
export const layout = ({ initialState }) => {
  return {
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    waterMarkProps: {
      content: initialState?.currentUser?.username,
    },
    footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history; // 如果没有登录，重定向到 login

      if (!initialState?.currentUser && isNeedLogin(location.pathname)) {
        history.push(loginPath);
      }
    },
    menuHeaderRender: undefined,
    ...initialState?.settings,
  };
};
```



### 国际化

使用[plugin-locale](https://umijs.org/zh-CN/plugins/plugin-locale)插件

```js
// config.js
locale: {
    // default zh-CN
    default: 'zh-CN',
    antd: true,
    // default true, when it is true, will use `navigator.language` overwrite default
    // 浏览器检测语言检测，会重写默认值，localStorage中umi_locale值 > 浏览器检测 > default > 中文
    baseNavigator: true,
  },
```

在模板中使用传递国际化变量：
```jsx
import { useIntl, FormattedMessage, getLocale } from 'umi';

  const intl = useIntl();

  ...
  <Popconfirm 
    title="是否要删除该主机?" 
    onConfirm={async () => {
      await handleDeleteHost(record);
      actionRef.current?.reload();
    }}
    okText={ intl.formatMessage({id:"pages.template.yes", defaultMessage:"确认"}) }
    cancelText={ intl.formatMessage({id:"pages.template.no", defaultMessage:"取消"}) }
  >
    <a><FormattedMessage id="pages.hostTable.delete" defaultMessage="host delete" /></a>
  </Popconfirm>
```


传递国际化变量：

### openApi

将swagger的openapi规范文件导入项目中，并且在项目中实现接口自动引入，类型自动生成

```js
openAPI: [
    {
      requestLibPath: "import { request } from 'umi'",
      // 或者使用在线的版本
      // schemaPath: "https://gw.alipayobjects.com/os/antfincdn/M%24jrzTTYJN/oneapi.json"
      // 复制swagger的url
      schemaPath: join(__dirname, 'oneapi.json'),
      mock: false,
    },
]mock
```

配置完成后，执行

```shell
umi openapi
或
npm run openapi
```

之后会根据swagger的openapi规范文件生成services文件，直接生成了接口请求函数并且包含类型声明

> 运行项目后可在项目运行地址下的`/umi/plugin/openapi`查看配置的`swagger`文档

**mock**

配置为`true`后，会自动生成一个mock文件，升恒的mock数据每次都不同，可随意修改，只有执行`npm run openapi`才会修改

在使用mock时要注意当前的环境变量，使用`npm run start`的方式启动项目

```json
 "scripts": {
    "analyze": "cross-env ANALYZE=1 umi build",
    "build": "umi build",
    "deploy": "npm run build && npm run gh-pages",
    "dev": "npm run start:dev",
    "gh-pages": "gh-pages -d dist",
    "i18n-remove": "pro i18n-remove --locale=zh-CN --write",
    "postinstall": "umi g tmp",
    "lint": "umi g tmp && npm run lint:js && npm run lint:style && npm run lint:prettier && npm run tsc",
    "lint-staged": "lint-staged",
    "lint-staged:js": "eslint --ext .js,.jsx,.ts,.tsx ",
    "lint:fix": "eslint --fix --cache --ext .js,.jsx,.ts,.tsx --format=pretty ./src && npm run lint:style",
    "lint:js": "eslint --cache --ext .js,.jsx,.ts,.tsx --format=pretty ./src",
    "lint:prettier": "prettier -c --write \"src/**/*\" --end-of-line auto",
    "lint:style": "stylelint --fix \"src/**/*.less\" --syntax less",
    "openapi": "umi openapi",
    "precommit": "lint-staged",
    "prettier": "prettier -c --write \"src/**/*\"",
    "start": "cross-env UMI_ENV=dev umi dev",
    "start:dev": "cross-env REACT_APP_ENV=dev MOCK=none UMI_ENV=dev umi dev",
    "start:no-mock": "cross-env MOCK=none UMI_ENV=dev umi dev",
    "start:no-ui": "cross-env UMI_UI=none UMI_ENV=dev umi dev",
    "start:pre": "cross-env REACT_APP_ENV=pre UMI_ENV=dev umi dev",
    "start:test": "cross-env REACT_APP_ENV=test MOCK=none UMI_ENV=dev umi dev",
    "pretest": "node ./tests/beforeTest",
    "test": "umi test",
    "test:all": "node ./tests/run-tests.js",
    "test:component": "umi test ./src/components",
    "tsc": "tsc --noEmit"
  },
```

> 使用`npm run dev` 或 `npm run start:dev` 时会禁用`mock`，具体是否禁用`mock`，需要查看启动时是否设置了环境变量`MOCK=none`



> 以上是antdesignpro实现mock的方式，在页面组件的文件中也自定义了一些mock

### 数据管理

基于hook & umi（@umijs/plugin-model）插件实现了一种轻量级的全局数据共享方案

#### 如何使用

1.新建Model

​		在`src/models`下新建文件，文件会成为model的命名空间，允许使用ts,js,tsx(推荐),jsx(不推荐)。

​		一个model的内容需要是一个标准的javaScript function，并被默认导出，可在function中使用hooks

```ts
import { useState, useCallback } from  'react'

export default () => {
    const [counter, setCounter] = useState(0)
    const increment = useCallback(() => setCounter((C) => c+1))
    const decrement = useCallback(() => setCounter((C) => c-1))
    return {
        counter,
        increment,
        decrement
    }
}
```

2.使用`Model`

需要从`umi`中导入一个`useModel`,`useModel`是一个`React Custom Hook`,传入`namespace`即可获取对应`model`的返回值

```jsx
import { useModel } from 'umi'

export default () => {
    const message = useModel('demo')
    return <div>{message}</div>
}
```

3.`Model`性能优化

`useModel`可以接受第二个参数（可选），当组件只消费`model`中的部分参数，对其他参数的变化并不关心时，可传入一个函数用于过滤，函数的返回值将取代`model`的返回值

```jsx
import { useModel } from 'umi'

export default () => {
   const { add, minus } = useModel('counter',(ret) = > ({
       add: ret.increment,
       minus: ret.decrement
   }))
   return (
       <div>
           <button onClick={add}>+1</button>
           <button onClick={add}>-1</button>
       </div>
   )
}
```

### 全局初始数据

在整个应用加载前，通常会有一些全局依赖的基础数据（用户信息，权限）,antdesignpro提供一个方式初始化这些数据，基umi插件`@umijs/plugin-intial-state`

当前项目的全局数据初始化子在入口文件的`getInitialState`中配置

```jsx
// app.jsx
/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */

export async function getInitialState() {
  const fetchUserInfo = async (userId, token) => {
    try {
      const msg = await queryCurrentUser(userId, token);
      if (msg.code !== 200) {
        // history.push(loginPath);
        return undefined;
      }
      const userInfo = { avatar: '@/src/assets/img/login/favicon.png', ...msg.data };
      return userInfo;
    } catch (error) {
      // history.push(loginPath);
    }

    return undefined;
  }; // 如果是登录页面，不执行

  if (isNeedLogin(history.location.pathname)) {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    if (!token || !userId) {
      history.push(loginPath)
    } else {
      const currentUser = await fetchUserInfo(userId, token);
      return {
        fetchUserInfo,
        currentUser,
        settings: {},
      };
    }
  }
  return {
    fetchUserInfo,
    settings: {},
  };
}
```

#### 在组件中消费

```jsx
import { useModel } from 'umi';

const GlobalHeaderRight = () => {
    const { initialState,loading,refresh,setInitialState } = useModel('@@initialState');
    ...
}

```

### 权限管理

基于`umi`插件`@umijs/plugin-access`,权限的定义依赖于全局初始数据(`@umijs/plugin-intial-state`)

新建`src/access.js`，`export default`一个函数

```js
/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access(initialState) {
  const { currentUser } = initialState || {};
  return {
    canAdmin: currentUser && currentUser.is_admin,
  };
}
```

该文件返回一个function，返回的function会在应用初始化阶段执行，执行后返回的对象会被作为用户所有权限的定义。

#### 页面内权限控制

> 注在使用`useAccess`，`Access`前，需要在config/config中存在配置`access:{}`

```jsx
import React from 'react';
import { useAccess, Access } from 'umi';

const PageA = (props) => {
  const { foo } = props;
  const access = useAccess(); // access 实例的成员: canReadFoo, canUpdateFoo, canDeleteFoo

  if (access.canReadFoo) {
    // 任意操作
  }

  return (
    <div>
      <Access accessible={access.canReadFoo} fallback={<div>Can not read foo content.</div>}>
        Foo content.
      </Access>
      <Access accessible={access.canUpdateFoo()} fallback={<div>Can not update foo.</div>}>
        Update foo.
      </Access>
      <Access accessible={access.canDeleteFoo(foo)} fallback={<div>Can not delete foo.</div>}>
        Delete foo.
      </Access>
    </div>
  );
};

```

#### 路由和菜单的权限控制

对菜单和路由实现权限控制时，可通过添加路由配置属性`access`实现

> 注：通过路由配置属性acess属性实现权限控制时，前提是使用[plugin-layout](https://umijs.org/zh-CN/plugins/plugin-layout)插件

```js
// access的值对相应src/access.js中返回的对象的key
{
    path: '/account',
    access: 'canAdmin', // 会调用src/access.js中返回的access进行鉴权
    routes: [
      {
        path: '/account/center',
        name: 'list',
        component: './account/List',
      },
    ]
  },
```

### 样式和资源

#### CSS Module

脚手架默认使用css modue模块化方案，在各组件引入的样式只在引入的组件中生效。

```jsx
// index.jsx
import styles from './index.less';
export default （{title}）=> <div class={style.title}></div>
```

```less
// indes.less
.title{
    font-size:16px
}
```

如果想要设置一个全局生效的样式，可以使用`：global`

```less
:global(.text){}

:global{
    .text{}
}
```

#### 添加图片字体和文件

可以直接在`jsx`或```tsx`中引用资源文件，大部分资源文件会转化为一个路径，可以将其设置为图片的`src`

```tsx
import logo from './logo.png'
console.log(logo)

return <Image src={logo}>
```

> 最后生成的`logo.png`会变成`logo.89345893.png`，这是为了保证每次发布都会更新照片，不改名字会命中缓存，若想要使用缓存，使用以下写法：
>
> ```tsx
> return <Image srv={logo}>
> ```



### 环境变量

Pro脚手架默认使用Umi作为底层框架，在Umi中提供了大量的默认环境变量；

可在package.json内修改启动命令，以添加对应的环境变量

```json
"scripts": {
	...
    "start": "cross-env UMI_ENV=dev umi dev",
    "start:dev": "cross-env REACT_APP_ENV=dev MOCK=none UMI_ENV=dev umi dev",
    "start:no-mock": "cross-env MOCK=none UMI_ENV=dev umi dev",
    "start:no-ui": "cross-env UMI_UI=none UMI_ENV=dev umi dev",
    "start:pre": "cross-env REACT_APP_ENV=pre UMI_ENV=dev umi dev",
    "start:test": "cross-env REACT_APP_ENV=test MOCK=none UMI_ENV=dev umi dev",
    "pretest": "node ./tests/beforeTest",
    "test": "umi test",
    "test:all": "node ./tests/run-tests.js",
    "test:component": "umi test ./src/components",
    "tsc": "tsc --noEmit"
  },
```

ant-design-pro中默认的环境变量如下：

`REACT_APP_ENV`：指定当前应用的环境，如dev、test、prod

`REACT_APP_API_BASE_URL`：指定API的基础URL

`REACT_APP_APP_ID`：指定当前应用的ID

`REACT_APP_APP_NAME`：指定当前应用的名称

`REACT_APP_APP_VERSION`：指定当前应用的版本号

`REACT_APP_TITLE`：指定当前页面的标题

`REACT_APP_COPYRIGHT`：指定当前应用的版权信息

`REACT_APP_DEFAULT_PAGE_SIZE`：指定默认的分页页码

`REACT_APP_DEFAULT_PAGE_NUM`：指定默认的分页页码

`REACT_APP_DEFAULT_SORTER`：指定默认的排序方式



#### **在`config`外部使用环境变量**

若需要在`config`之外的非`node`环境文件中使用环境变量，则需要在`config`中导出默认`defineConfig()`时配置`define{}`

```js
const { REACT_APP_ENV } = process.env

export default defineConfig({
    define:{
        REACT_APP_ENV:REACT_APP_ENV || false
    }
})
```

```jsx
const test:React.FC<{}> = ()=>{
    return(
    	{REACT_APP_ENV &&
        	<span>
             ...
         	</span>
        }
    )
}
```

#### 多环境多份配置文件

当前存在`config.js`和`config.dev.js`,在`Umi`内可通过指定`UMI_ENV`环境变量来区分不同环境的配置

```shell
├──config
|   ├── config.dev.js
|   ├── config.js
|   ├── defaultSettings.js
|   ├── favicon.png
|   ├── oneapi.json
|   ├── proxy.js
|   └── routes.js
...
```

`config.js`中的配置和对应环境下的的`config.*.js`合并，具体合并规则以`UMI_ENV`的值为准

### 构建

```shell
npm run build 
# 或
umi build

#分析构建文件体积
npm run analyze
```





