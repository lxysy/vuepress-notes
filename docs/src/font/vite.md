# 秒级依赖预构建

Vite 是一个提倡 `no-bundle` 的构建工具，相比于传统的 Webpack，能做到开发时的模块按需编译，而不用先打包完再加载。

我们所说的模块代码其实分为两部分，一部分是源代码，也就是业务代码，另一部分是第三方依赖的代码，即 `node_modules` 中的代码。所谓的 `no-bundle` **只是对于源代码而言**，对于第三方依赖而言，Vite 还是选择 bundle(打包)，并且使用速度极快的打包器 Esbuild 来完成这一过程，达到秒级的依赖编译速度。

## 为什么需要预构建

为什么在开发阶段我们要对第三方依赖进行预构建? 如果不进行预构建会怎么样？

首先 Vite 是基于浏览器原生 ES 模块规范实现的 Dev Server，不论是应用代码，还是第三方依赖的代码，理应符合 ESM 规范才能够正常运行。但我们没有办法控制第三方的打包规范。就目前来看，还有相当多的第三方库仍然没有 ES 版本的产物，比如大名鼎鼎的 `react`:

```js
// react 入口文件
// 只有 CommonJS 格式

if (process.env.NODE_ENV === "production") {
  module.exports = require("./cjs/react.production.min.js");
} else {
  module.exports = require("./cjs/react.development.js");
}
```

这种 CommonJS 格式的代码在 Vite 当中无法直接运行，我们需要将它转换成 ESM 格式的产物。

此外，还有一个比较重要的问题——**请求瀑布流问题**。比如说，知名的`loadsh-es`库本身是有 ES 版本产物的，可以在 Vite 中直接运行。但实际上，它在加载时会发出特别多的请求，导致页面加载的前几秒几都乎处于卡顿状态，拿一个简单的 demo 项目举例，请求情况如下图所示:

```js
import debounce from '../node_modules/lodash-es/debounce';

const handlebtnClick = debounce(function () {
  setCount(count + 1);
}, 600);
```

我们在应用代码中调用了`debounce`方法，这个方法会依赖很多工具函数。

每个`import`都会触发一次新的文件请求，因此在这种 `依赖层级深`、`涉及模块数量多 `的情况下，会触发成百上千个网络请求，巨大的请求量加上 Chrome 对同一个域名下只能同时支持 `6` 个 HTTP 并发请求的限制，导致页面加载十分缓慢，与 Vite 主导性能优势的初衷背道而驰。不过，在进行**依赖的预构建**之后，`lodash-es `这个库的代码被打包成了一个文件，这样请求的数量会骤然减少，页面加载也快了许多。下图是进行预构建之后的请求情况，你可以对照看看:

// TODO

依赖预构建主要做了两件事情：

一是将其他格式(如 UMD 和 CommonJS)的产物转换为 ESM 格式，使其在浏览器通过 `<script type="module"><script>`的方式正常加载。

二是打包第三方库的代码，将各个第三方库分散的文件合并到一起，减少 HTTP 请求数量，避免页面加载性能劣化。

而这两件事情全部由性能优异的 `Esbuild` (基于 Golang 开发)完成，而不是传统的 Webpack/Rollup，所以也不会有明显的打包性能问题，反而是 Vite 项目启动飞快(秒级启动)的一个核心原因。

> Vite 1.x 使用了 Rollup 来进行依赖预构建，在 2.x 版本将 Rollup 换成了 Esbuild，编译速度提升了 [近 100 倍](https://link.juejin.cn/?target=https%3A%2F%2Fesbuild.github.io%2F)！

## 如何开启预构建

在 Vite 中有两种开启预构建的方式，分别是 `自动开启` 和 `手动开启`。

#### 自动开启[#](https://notes.yueluo.club/vite/index.html#自动开启)

预构建默认是是 `自动开启`。项目启动成功后，你可以在根目录下的`node_modules`中发现`.vite`目录，这就是预构建产物文件存放的目录，内容如下:



在浏览器访问页面后，打开 `Dev Tools` 中的网络调试面板，你可以发现第三方包的引入路径已经被重写:

```js
import {
  require_react
} from "/node_modules/.vite/deps/chunk-QJZGAYR5.js?v=2dc7d6a2";

// dep:react
var react_default = require_react();
export {
  react_default as default
};
//# sourceMappingURL=react.js.map
```