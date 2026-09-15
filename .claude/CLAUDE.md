# VuePress 笔记项目规范

## VuePress Frontmatter 规则

本项目的所有 Markdown 文档头部必须包含 VuePress 格式的 frontmatter，由 `---` 包裹的 YAML 块：

```yaml
---
title: <文档标题>
date: <YYYY-MM-DD>
categories:
  - <一级分类>
  - <二级分类（可选）>
tags:
  - <标签1>
  - <标签2>
---
```

### 规则要点
- `title` — 文档标题
- `date` — 创建或更新日期，格式 `YYYY-MM-DD`
- `categories` — 分类层级，至少一级，可嵌套（如 `- 框架` → `- React`）
- `tags` — 标签列表，至少一个

### 参考示例
```yaml
---
title: Hook的闭包陷阱原因和解决方案
date: 2026-07-01
categories:
  - 框架
  - React
tags:
  - React
  - hook
  - 前端
---
```

**为什么：** 该项目的 VuePress 静态站点生成器依赖 frontmatter 来生成导航、分类归档和标签页，缺少或格式错误会导致文档无法正确展示。

**如何执行：** 每次在本项目中创建新的 .md 文件时，自动套用上述 frontmatter 模板，根据文档内容填充 title、date、categories 和 tags。编辑已有文档时补充缺失的 frontmatter。

## `sticky` 字段规则（vuepress-theme-reco）

`sticky` 用于文章置顶，排序规则为**升序排列**（**值越小越靠前**）：

```yaml
---
title: 示例
sticky: 1   # 比 sticky: 2 排得更靠前
---
```

- `sticky: 1` → 优先展示
- `sticky: 2` → 排在 `sticky: 1` 之后
- 不设置 `sticky` → 不置顶，按日期倒序排列

> ⚠️ 该行为与直觉上的"权重越大越靠前"相反，已在部署环境验证确认。

**如何执行：** 多个置顶文章按需求设置递增的 `sticky` 值，值最小的排最前。

## 图片文件命名规则

**图片文件名必须是纯 ASCII**（字母、数字、`-`），禁止使用中文或其他非 ASCII 字符。文档名可以中文，图片名不行。

```markdown
<!-- ✅ 正确 -->
![component-prompt-01](./img/component-prompt-01.png)

<!-- ❌ 错误：文件名含中文，CI 构建会失败 -->
![组件化管理prompt-01](./img/组件化管理prompt-01.png)
```

命名格式为 `<文档名对应的英文短横线 slug>-NN.png`，NN 为两位序号、按图片在文档中出现的顺序递增，统一放在同级的 `./img/` 目录下：

| 文档 | 图片命名 |
| --- | --- |
| `组件化管理prompt.md` | `component-prompt-01.png` … |
| `Memory管理.md` | `memory-management-01.png` … |
| `结构化大模型输出.md` | `structured-output-01.png` … |

**为什么：** VuePress 的 markdown-loader 会对图片路径做百分号编码，把 `./img/组件化管理prompt-01.png` 变成 `./img/%E7%BB%84%E4%BB%B6...png`；webpack 再拿这个字面量去磁盘上找文件就找不到了，报 `Module not found` 导致 `docs:build` 失败。**Windows 本地不会编码，所以本地 `npm run docs:build` 能过，只有 Linux 上的 GitHub Actions 才会暴露**——即"本地正常、CI 挂掉"。

**如何执行：** 往文档中添加图片时，一律先用 ASCII slug 命名再引用；如果图片是粘贴进来的（Typora 等生成的 `image-<时间戳>.png` 本身就是 ASCII，无需改名）。需要把已有的中文名图片改过来时，重命名文件后同步更新文档中的引用路径，改完务必本地跑一次 `npm run docs:build` 确认构建通过。
