module.exports = {
  title: '笔记',
  description: '笔记',
  theme: 'reco',
  /**
   * 基础路径
   * 当部署的网站为https://foo.github.io/bar/，不是根路径时
   * base 的值就应该被设置为 "/bar/" (应当总是以斜杠开始，并以斜杠结束)
   */
  base: "/vuepress-notes/",
 
  locales: {
    "/": {
      lang: "zh-CN",
    },
  },

  // 插件
  plugins: [
    [
      "sakura",
      {
        num: 20, // 默认数量
        show: true, //  是否显示
        zIndex: -1, // 层级
        img: {
          replace: false, // false 默认图 true 换图 需要填写httpUrl地址
        },
      },
    ],
    [
      "cursor-effects",
      {
        size: 4, // size of the particle, default: 2
        shape: "star", // ['star' | 'circle'], // shape of the particle, default: 'star'
        zIndex: 999999999, // z-index property of the canvas, default: 999999999
      },
    ]
  ],

  /**
   * Type is `DefaultThemeConfig`
   */
  themeConfig: {
    logo: '/avator1.jpg',
    authorAvatar: '/avator1.jpg',
    // 自动生成侧边栏
    subSidebar:'auto',
    author: "FYShawn",
    type: 'blog',
    // 顶部导航栏
    nav: [
      { text: "首页", link: "/" },
      {
        text: "FYShawn 的博客",
        items: [
          { text: "掘金", link: "https://juejin.cn/user/1838800372241005" },
          { text: "Github", link: "https://github.com/lxysy" }
        ]
      }
    ],
    // 侧边栏
    // sidebar: [
    //   {
    //     title: "欢迎学习",
    //     path: "/",
    //     collapsable: false,  // 是否折叠
    //     children: [{ title: "博客简介", path: "/" }],
    //   },
    //   {
    //     title: '基础',
    //     collapsable: false, 
    //     children: [{ title: "前端基础知识", path: '/src/font/前端基础知识' }],
    //     // initialOpenGroupIndex: 1 // 可选的, 默认值是 0
    //   },
    //   {
    //     title: "vue",
    //     collapsable: false,
    //     children: [
    //       { title: "模板编译", path: "/src/vueNote/模板编译" },
    //       { title: "第二篇", path: "/src/vueNote/2" },
    //     ]
    //   } 
    // ],
     // 博客配置
     blogConfig: {
      category: {
        location: 2, // 在导航栏菜单中所占的位置，默认2
        text: "博客", // 默认文案 “分类”
      },
      tag: {
        location: 4, // 在导航栏菜单中所占的位置，默认4
        text: "Tag", // 默认文案 “标签”
      },
    },
  },
}

// import { defineConfig } from "vuepress/config";

// export default defineConfig({
//   /**
//    * 基础路径
//    * 当部署的网站为https://foo.github.io/bar/，不是根路径时
//    * base 的值就应该被设置为 "/bar/" (应当总是以斜杠开始，并以斜杠结束)
//    */
//   // base: "/bar/",

//   title: '笔记',
//   description: '笔记',
//   theme: 'reco',

//   /**
//    * Type is `DefaultThemeConfig`
//    */
//   themeConfig: {
//     // logo: './public/logo.png',
//     // 顶部导航栏
//     nav: [
//       { text: "首页", link: "/" },
//       {
//         text: "FYShawn 的博客",
//         items: [
//           { text: "掘金", link: "https://juejin.cn/user/1838800372241005" },
//           { text: "Github", link: "https://github.com/lxysy" }
//         ]
//       }
//     ],
//     // 侧边栏
//     sidebar: [
//       {
//         title: "欢迎学习",
//         path: "/",
//         collapsable: false,  // 是否折叠
//         children: [{ title: "博客简介", path: "/" }],
//       },
//       {
//         title: '基础',
//         collapsable: false, 
//         children: [{ title: "前端基础知识", path: '/src/font/前端基础知识' }],
//         // initialOpenGroupIndex: 1 // 可选的, 默认值是 0
//       },
//       {
//         title: "vue",
//         collapsable: false,
//         children: [
//           { title: "模板编译", path: "/src/vueNote/模板编译" },
//           { title: "第二篇", path: "/src/vueNote/2" },
//         ]
//       } 
//     ]
//   }
// });
