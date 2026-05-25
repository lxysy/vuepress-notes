---
title: Webpack & Vite 在 Vue2/Vue3 项目中的配置与常见场景
date: 2025-05-25
categories:
  - 工程化
  - 构建工具
tags:
  - webpack
  - vite
  - vue
  - 工程化
---

## 一、整体对比

| 维度 | Webpack | Vite |
|------|---------|------|
| 适用 Vue 版本 | Vue2 / Vue3 | Vue3（原生支持），Vue2 需插件 |
| 开发服务器 | 全量打包后启动（慢） | 原生 ESM，按需编译（秒启） |
| HMR 速度 | 随项目体积线性增长 | 几乎恒定，不随体积变化 |
| 生产构建 | webpack + terser | Rollup + esbuild |
| 配置复杂度 | 较高，loader/plugin 显式声明 | 较低，开箱即用，约定优于配置 |
| 生态成熟度 | 极成熟，插件覆盖所有场景 | 较成熟，大部分场景有覆盖 |
| 浏览器要求 | 无限制 | 开发环境需支持 ESM 的现代浏览器 |

---

## 二、Vue CLI (Webpack) 配置

### 1. 基础配置 `vue.config.js`

```javascript
// vue.config.js — Vue CLI 项目的核心配置文件
const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  // 部署路径（子路径部署时使用）
  publicPath: process.env.NODE_ENV === 'production' ? '/my-app/' : '/',

  // 输出目录
  outputDir: 'dist',

  // 静态资源目录
  assetsDir: 'static',

  // 生产环境 sourceMap
  productionSourceMap: false,

  // 开发服务器配置
  devServer: {
    port: 8080,
    open: true,
    proxy: {
      '/api': {
        target: 'http://192.168.1.100:3000',
        changeOrigin: true,
        pathRewrite: { '^/api': '' },
      },
    },
  },

  // 直接修改 webpack 配置
  configureWebpack: {
    resolve: {
      alias: {
        '@': require('path').resolve(__dirname, 'src'),
        '@comp': require('path').resolve(__dirname, 'src/components'),
      },
    },
    plugins: [],
  },

  // 链式修改（更细粒度，推荐）
  chainWebpack(config) {
    // 移除 prefetch 插件（减少带宽）
    config.plugins.delete('prefetch')

    // 添加 html-webpack-plugin 选项
    config.plugin('html').tap(args => {
      args[0].title = 'My Vue App'
      return args
    })
  },
})
```

### 2. 路径别名与扩展名

```javascript
// vue.config.js
const path = require('path')

module.exports = {
  chainWebpack(config) {
    config.resolve.alias
      .set('@', path.resolve(__dirname, 'src'))
      .set('@api', path.resolve(__dirname, 'src/api'))
      .set('@assets', path.resolve(__dirname, 'src/assets'))
      .set('@comp', path.resolve(__dirname, 'src/components'))
      .set('@views', path.resolve(__dirname, 'src/views'))
      .set('@store', path.resolve(__dirname, 'src/store'))
      .set('@utils', path.resolve(__dirname, 'src/utils'))

    config.resolve.extensions
      .merge(['.js', '.vue', '.json', '.ts', '.tsx'])
  },
}
```

### 3. CSS 相关配置

```javascript
// vue.config.js
module.exports = {
  css: {
    // 提取为独立 CSS 文件（默认生产开启）
    extract: process.env.NODE_ENV === 'production',

    // sourceMap
    sourceMap: false,

    // 向 CSS 相关的 loader 传递选项
    loaderOptions: {
      // 全局 Sass 变量/混合
      sass: {
        additionalData: `
          @import "~@/styles/variables.scss";
          @import "~@/styles/mixins.scss";
        `,
      },
      scss: {
        additionalData: `
          @import "~@/styles/variables.scss";
          @import "~@/styles/mixins.scss";
        `,
      },
      // Less 同理
      less: {
        lessOptions: {
          modifyVars: { 'primary-color': '#1890ff' },
          javascriptEnabled: true,
        },
      },
      // postcss
      postcss: {
        postcssOptions: {
          plugins: [require('autoprefixer')],
        },
      },
    },

    // CSS modules 配置
    requireModuleExtension: true,
  },
}
```

### 4. 多环境变量

```bash
# .env                 # 所有环境通用
# .env.development     # vue-cli-service serve
# .env.production      # vue-cli-service build
# .env.staging         # vue-cli-service build --mode staging

# 只有 VUE_APP_ 前缀的变量会注入客户端
VUE_APP_TITLE=My App
VUE_APP_API_BASE=https://api.example.com
VUE_APP_VERSION=$npm_package_version
```

```javascript
// 使用
console.log(process.env.VUE_APP_API_BASE)
```

### 5. 代码分割（splitChunks）

```javascript
// vue.config.js
module.exports = {
  configureWebpack: {
    optimization: {
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          // 提取 Vue 全家桶
          vue: {
            test: /[\\/]node_modules[\\/](vue|vue-router|vuex|pinia)[\\/]/,
            name: 'chunk-vue',
            priority: 20,
          },
          // 提取 UI 框架
          element: {
            test: /[\\/]node_modules[\\/](element-plus|element-ui|ant-design-vue)[\\/]/,
            name: 'chunk-ui',
            priority: 15,
          },
          // 提取 echarts（体积大，单独拆）
          echarts: {
            test: /[\\/]node_modules[\\/]echarts[\\/]/,
            name: 'chunk-echarts',
            priority: 10,
          },
          // 其余第三方库
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            name: 'chunk-vendors',
            priority: 0,
          },
          // 公共业务代码
          common: {
            minChunks: 2,
            priority: -10,
            reuseExistingChunk: true,
          },
        },
      },
    },
  },
}
```

### 6. 常用 Loader 与 Plugin 配置

```javascript
// vue.config.js
module.exports = {
  chainWebpack(config) {
    // ---- SVG 图标：使用 svg-sprite-loader ----
    config.module
      .rule('svg')
      .exclude.add(require('path').resolve(__dirname, 'src/icons'))
      .end()

    config.module
      .rule('svg-sprite')
      .test(/\.svg$/)
      .include.add(require('path').resolve(__dirname, 'src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({ symbolId: 'icon-[name]' })

    // ---- Markdown 文件导入 ----
    config.module
      .rule('markdown')
      .test(/\.md$/)
      .use('html-loader').loader('html-loader').end()
      .use('markdown-loader').loader('markdown-loader')

    // ---- 压缩图片 ----
    config.module
      .rule('images')
      .test(/\.(png|jpe?g|gif|webp)(\?.*)?$/)
      .use('image-webpack-loader')
      .loader('image-webpack-loader')
      .options({ bypassOnDebug: true })

    // ---- 分析打包体积 ----
    if (process.env.ANALYZE) {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
      config.plugin('analyzer').use(BundleAnalyzerPlugin, [{ analyzerPort: 8888 }])
    }
  },
}
```

### 7. 完整多页应用配置

```javascript
// vue.config.js
module.exports = {
  pages: {
    index: {
      entry: 'src/pages/main/main.js',
      template: 'public/index.html',
      filename: 'index.html',
      title: '主应用',
      chunks: ['chunk-vendors', 'chunk-common', 'index'],
    },
    admin: {
      entry: 'src/pages/admin/admin.js',
      template: 'public/admin.html',
      filename: 'admin.html',
      title: '管理后台',
      chunks: ['chunk-vendors', 'chunk-common', 'admin'],
    },
  },
}
```

---

## 三、Vite 配置

### 1. 基础配置 `vite.config.js`

```javascript
// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  // 部署基础路径
  base: '/',

  plugins: [vue()],

  // 路径别名
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@comp': resolve(__dirname, 'src/components'),
      '@api': resolve(__dirname, 'src/api'),
      '@store': resolve(__dirname, 'src/store'),
      '@utils': resolve(__dirname, 'src/utils'),
    },
    extensions: ['.js', '.ts', '.tsx', '.vue', '.json'],
  },

  // 开发服务器
  server: {
    port: 3000,
    open: true,
    host: true,               // 监听所有地址（局域网可访问）
    proxy: {
      '/api': {
        target: 'http://192.168.1.100:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/ws': {
        target: 'ws://192.168.1.100:3000',
        ws: true,
      },
    },
    // 预热文件（频繁使用的模块提前转换）
    warmup: {
      clientFiles: ['./src/views/**/*.vue'],
    },
  },

  // 构建配置
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    // 代码分割
    rollupOptions: {
      output: {
        manualChunks: {
          'vue-vendor': ['vue', 'vue-router', 'pinia'],
          'ui-vendor': ['element-plus'],
        },
      },
    },
  },

  // CSS
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/variables.scss";`,
      },
    },
  },
})
```

### 2. 环境变量

```bash
# .env                 # 所有环境加载
# .env.development     # vite dev
# .env.production      # vite build

# 只有 VITE_ 前缀的变量暴露给客户端
VITE_APP_TITLE=My App
VITE_API_BASE=https://api.example.com
```

```javascript
// 使用
import.meta.env.VITE_API_BASE       // 变量值
import.meta.env.MODE                // 'development' | 'production'
import.meta.env.DEV                 // boolean
import.meta.env.PROD                // boolean
```

```typescript
// env.d.ts — 类型声明
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE: string
  readonly VITE_APP_TITLE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

### 3. 常用插件配置

```bash
npm i -D @vitejs/plugin-vue @vitejs/plugin-legacy
npm i -D unplugin-auto-import unplugin-vue-components
npm i -D vite-plugin-compression vite-plugin-imagemin
npm i -D vite-svg-loader rollup-plugin-visualizer
```

```javascript
// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import legacy from '@vitejs/plugin-legacy'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import viteCompression from 'vite-plugin-compression'
import { visualizer } from 'rollup-plugin-visualizer'
import svgLoader from 'vite-svg-loader'

export default defineConfig({
  plugins: [
    vue(),

    // ---- 兼容旧浏览器 ----
    legacy({
      targets: ['defaults', 'not IE 11'],
    }),

    // ---- 自动导入 API（无需 import { ref } from 'vue'）----
    AutoImport({
      imports: ['vue', 'vue-router', 'pinia'],
      resolvers: [ElementPlusResolver()],
      dts: 'src/auto-imports.d.ts',
    }),

    // ---- 自动导入组件 ----
    Components({
      resolvers: [ElementPlusResolver()],
      dts: 'src/components.d.ts',
    }),

    // ---- SVG 作为组件导入 ----
    svgLoader(),

    // ---- Gzip 压缩 ----
    viteCompression({
      threshold: 10240,          // 大于 10KB 才压缩
      deleteOriginFile: false,   // 保留原文件
    }),

    // ---- 打包体积分析 ----
    visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
})
```

### 4. CSS 配置

```javascript
// vite.config.js
export default defineConfig({
  css: {
    // CSS modules 行为
    modules: {
      localsConvention: 'camelCaseOnly',
    },

    // 预处理器全局变量
    preprocessorOptions: {
      scss: {
        additionalData: `
          @use "@/styles/variables" as *;
          @use "@/styles/mixins" as *;
        `,
        api: 'modern-compiler',  // 使用现代 Sass API（更快）
      },
      less: {
        modifyVars: { 'primary-color': '#1890ff' },
        javascriptEnabled: true,
      },
    },

    // postcss
    postcss: {
      plugins: [
        require('autoprefixer'),
      ],
    },

    // Lightning CSS（实验性，比 postcss 快 100x）
    // transformer: 'lightningcss',
  },
})
```

### 5. 构建优化

```javascript
// vite.config.js
export default defineConfig({
  build: {
    // chunk 大小警告阈值
    chunkSizeWarningLimit: 500,

    // 禁用 CSS 代码分割（提取到一个文件）
    // cssCodeSplit: false,

    // 最小化压缩
    minify: 'esbuild',           // 默认，快
    // minify: 'terser',         // 稍慢，压缩率略高

    // terser 额外选项
    terserOptions: {
      compress: {
        drop_console: true,      // 移除 console
        drop_debugger: true,     // 移除 debugger
      },
    },

    rollupOptions: {
      // 外部依赖（不打包进来）
      // external: ['vue', 'element-plus'],

      output: {
        // 手动分包
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('vue') || id.includes('pinia') || id.includes('router')) {
              return 'vue-vendor'
            }
            if (id.includes('element-plus') || id.includes('ant-design-vue')) {
              return 'ui-vendor'
            }
            if (id.includes('echarts') || id.includes('d3') || id.includes('@antv')) {
              return 'chart-vendor'
            }
            return 'vendor'
          }
        },

        // 输出文件命名
        chunkFileNames: 'js/[name]-[hash:8].js',
        entryFileNames: 'js/[name]-[hash:8].js',
        assetFileNames: '[ext]/[name]-[hash:8].[ext]',
      },
    },
  },
})
```

### 6. 完整生产级配置示例

```javascript
// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig(({ mode }) => {
  const isProd = mode === 'production'
  const env = loadEnv(mode, process.cwd())

  return {
    base: env.VITE_BASE_URL || '/',

    plugins: [vue()],

    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        '@views': resolve(__dirname, 'src/views'),
        '@comp': resolve(__dirname, 'src/components'),
        '@api': resolve(__dirname, 'src/api'),
        '@store': resolve(__dirname, 'src/store'),
        '@utils': resolve(__dirname, 'src/utils'),
        '@assets': resolve(__dirname, 'src/assets'),
      },
    },

    server: {
      port: 3000,
      host: true,
      proxy: {
        '/api': {
          target: env.VITE_PROXY_TARGET || 'http://localhost:8080',
          changeOrigin: true,
          rewrite: (p) => p.replace(/^\/api/, ''),
        },
      },
    },

    build: {
      outDir: 'dist',
      sourcemap: !isProd,
      chunkSizeWarningLimit: 500,
      rollupOptions: {
        output: {
          manualChunks: {
            'vue-vendor': ['vue', 'vue-router', 'pinia'],
          },
        },
      },
    },

    css: {
      preprocessorOptions: {
        scss: { additionalData: `@use "@/styles/variables" as *;` },
      },
    },
  }
})
```

---

## 四、常见场景配置

### 场景 1：Electron 桌面应用

```javascript
// vue.config.js（Vue CLI + electron-builder）
module.exports = {
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      builderOptions: {
        appId: 'com.example.myapp',
        productName: 'MyApp',
        directories: { output: 'dist_electron' },
        win: { target: 'nsis', icon: 'public/icon.ico' },
        mac: { target: 'dmg', icon: 'public/icon.icns' },
      },
    },
  },
}
```

```javascript
// vite.config.js（Vite + electron-vite）
import { defineConfig } from 'electron-vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  main: {
    // 主进程配置
  },
  preload: {
    // 预加载脚本配置
  },
  renderer: {
    plugins: [vue()],
    resolve: { alias: { '@': resolve('src/renderer/src') } },
  },
})
```

### 场景 2：Monorepo 共享组件库

```javascript
// packages/components/vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      name: 'MyUI',
      fileName: (format) => `my-ui.${format}.js`,
      formats: ['es', 'umd'],
    },
    rollupOptions: {
      external: ['vue'],                // 不打入 Vue
      output: {
        globals: { vue: 'Vue' },        // UMD 外部映射
      },
    },
  },
})
```

```json
// package.json
{
  "main": "./dist/my-ui.umd.js",
  "module": "./dist/my-ui.es.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/my-ui.es.js",
      "require": "./dist/my-ui.umd.js"
    }
  }
}
```

### 场景 3：H5 移动端适配

```javascript
// 需要配合 postcss-px-to-viewport
// postcss.config.js
module.exports = {
  plugins: {
    'postcss-px-to-viewport-8-plugin': {
      viewportWidth: 375,         // 设计稿宽度
      unitPrecision: 5,
      viewportUnit: 'vw',
      selectorBlackList: ['.ignore', '.hairlines'],
      minPixelValue: 1,
      mediaQuery: false,
      exclude: [/node_modules/],
    },
    autoprefixer: {},
  },
}
```

```javascript
// vite.config.js — 完整移动端配置
export default defineConfig({
  css: {
    postcss: {
      plugins: [
        require('postcss-px-to-viewport-8-plugin')({
          viewportWidth: 375,
        }),
      ],
    },
  },
  build: {
    // 移动端资源内联（减少请求）
    assetsInlineLimit: 4096,
  },
})
```

### 场景 4：大屏数据可视化（多分辨率适配）

```javascript
// 大屏场景：保持 16:9 比例 + rem 缩放
// 1. rem 适配脚本（public/flexible.js）
(function () {
  const baseWidth = 1920
  const baseFontSize = 16
  function resize() {
    const scale = document.documentElement.clientWidth / baseWidth
    document.documentElement.style.fontSize = baseFontSize * Math.min(scale, 1.5) + 'px'
  }
  window.addEventListener('resize', resize)
  resize()
})()

// 2. vite 配置注入
export default defineConfig({
  build: {
    rollupOptions: {
      // 大屏通常需要 echarts/d3 等大型库
      output: {
        manualChunks: {
          echarts: ['echarts'],
          d3: ['d3', 'd3-sankey'],
        },
      },
    },
  },
})
```

```javascript
// vue.config.js — Webpack 版大屏配置
module.exports = {
  publicPath: './',
  productionSourceMap: false,
  configureWebpack: {
    optimization: {
      splitChunks: {
        cacheGroups: {
          echarts: {
            test: /[\\/]node_modules[\\/]echarts[\\/]/,
            name: 'chunk-echarts',
            priority: 20,
          },
        },
      },
    },
  },
}
```

### 场景 5：Nginx 部署与 History 模式

```nginx
# nginx.conf
server {
    listen 80;
    server_name example.com;

    root /var/www/my-app/dist;
    index index.html;

    # SPA History 路由回退
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API 反向代理
    location /api {
        proxy_pass http://backend:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # 静态资源强缓存（带 hash 的文件）
    location /assets {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # gzip（配合 vite-plugin-compression）
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml image/svg+xml;
    gzip_min_length 1024;
}
```

```javascript
// 前端路由配置 — Vue Router
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),  // 或 process.env.BASE_URL
  routes: [...],
})
```

### 场景 6：CDN 部署与资源外链

```javascript
// vite.config.js — CDN 部署
export default defineConfig({
  base: 'https://cdn.example.com/my-app/',  // CDN 地址

  build: {
    rollupOptions: {
      // 将不需要打包的库通过 CDN 外链引入
      external: ['vue', 'vue-router', 'axios'],
      output: {
        globals: {
          vue: 'Vue',
          'vue-router': 'VueRouter',
          axios: 'axios',
        },
      },
    },
  },
})
```

```html
<!-- index.html — 对应外链引入 -->
<script src="https://cdn.jsdelivr.net/npm/vue@3/dist/vue.global.prod.js"></script>
<script src="https://cdn.jsdelivr.net/npm/vue-router@4/dist/vue-router.global.prod.js"></script>
<script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
```

```javascript
// vue.config.js — Webpack 版 externals
module.exports = {
  configureWebpack: {
    externals: {
      vue: 'Vue',
      'vue-router': 'VueRouter',
      echarts: 'echarts',
    },
  },
}
```

### 场景 7：CI/CD 构建脚本

```yaml
# .gitlab-ci.yml
stages:
  - install
  - build
  - deploy

variables:
  NODE_VERSION: "18"

cache:
  key: ${CI_COMMIT_REF_SLUG}
  paths:
    - node_modules/

install:
  stage: install
  script:
    - npm ci
  only:
    - master
    - develop

build:
  stage: build
  script:
    # 不同环境用不同 .env 文件
    - cp .env.${CI_ENVIRONMENT_NAME} .env.production
    - npm run build
  artifacts:
    paths:
      - dist/
    expire_in: 7 days
  only:
    - master
    - develop
  environment:
    name: ${CI_COMMIT_REF_NAME == "master" ? "production" : "staging"}

deploy:
  stage: deploy
  script:
    - rsync -avz --delete dist/ user@server:/var/www/my-app/
  only:
    - master
  when: manual            # 手动触发部署
```

```bash
# package.json 中的 NPM 脚本
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "build:staging": "vite build --mode staging",
    "build:prod": "vite build --mode production",
    "preview": "vite preview",
    "analyze": "vite build --mode analyze",
    "lint": "eslint src --ext .vue,.js,.ts",
    "test": "jest --coverage"
  }
}
```

---

## 五、Vue2 项目迁移到 Vite

```bash
# 1. 安装依赖
npm i -D vite @vitejs/plugin-vue2 vite-plugin-vue2

# 2. 移除 Vue CLI 相关
npm uninstall @vue/cli-service @vue/cli-plugin-babel @vue/cli-plugin-eslint
```

```javascript
// vite.config.js — Vue2 迁移版
import { defineConfig } from 'vite'
import { createVuePlugin } from 'vite-plugin-vue2'

export default defineConfig({
  plugins: [createVuePlugin()],

  resolve: {
    alias: {
      '@': '/src',
      // Vue2 需要显式引用带 compiler 的版本
      vue: 'vue/dist/vue.esm.js',
    },
  },

  server: {
    port: 3000,
    proxy: { '/api': 'http://localhost:8080' },
  },

  build: {
    outDir: 'dist',
  },
})
```

```javascript
// 迁移 checklist：
// 1. index.html 从 public/ 移到根目录，手动引入 /src/main.js
// 2. 环境变量 VUE_APP_ → VITE_
// 3. require() → import()
// 4. @vue/composition-api → 移除（Vue2.7+ 内置）
// 5. vue.config.js → vite.config.js
```

---

## 六、常见问题速查

| 问题 | Webpack 方案 | Vite 方案 |
|------|-------------|----------|
| 路径别名 | `chainWebpack` 中 `config.resolve.alias` | `resolve.alias` |
| 代理 | `devServer.proxy` | `server.proxy` |
| 环境变量 | `VUE_APP_` 前缀 | `VITE_` 前缀 |
| 全局 Sass 变量 | `css.loaderOptions.sass` | `css.preprocessorOptions.scss` |
| 分包 | `splitChunks.cacheGroups` | `rollupOptions.output.manualChunks` |
| 打包分析 | `webpack-bundle-analyzer` | `rollup-plugin-visualizer` |
| SVG 组件 | `svg-sprite-loader` | `vite-svg-loader` |
| 旧浏览器 | `browserslist` + babel | `@vitejs/plugin-legacy` |
| Gzip | `compression-webpack-plugin` | `vite-plugin-compression` |
| 跨域 | `devServer.proxy` | `server.proxy` |
| 懒加载 | `import()` 动态导入 | `import()` 动态导入 |
| 组件库按需 | `babel-plugin-import` | `unplugin-vue-components` |
| TS 类型检查 | `fork-ts-checker-webpack-plugin` | `vue-tsc --noEmit` |
