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
