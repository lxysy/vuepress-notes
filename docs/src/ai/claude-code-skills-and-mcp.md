---
title: Claude Code 已安装 Skills & MCP 工具清单
date: 2026-07-08
categories:
  - AI
  - Claude Code
tags:
  - Claude Code
  - skills
  - MCP
  - AI
---

## 一、用户安装的 Skills (5 个)

存放在 `~/.claude/skills/` 目录下。

### 1. find-skill
- **用途**: 发现和安装社区 Claude Code Skills，搜索 skills.sh 生态系统
- **命令**: `/find-skill <搜索内容>`
- **GitHub**: 内置在 Claude Code 生态中，通过 `/plugin` Marketplace 发现

### 2. frontend-design
- **用途**: 生成生产级前端界面代码，注重排版、色彩、动画和视觉层次，避免通用 AI 审美
- **命令**: `/frontend-design <需求描述>`
- **GitHub**: https://github.com/anthropics/frontend-design

### 3. karpathy-skills / 卡帕西最佳实践
- **用途**: 基于 Andrej Karpathy 观察的 AI 编程最佳实践准则，规范 AI 助手行为（Think Before Coding、主动提问、保持简单、尊重现有代码）
- **命令**: 通过 `.claude/CLAUDE.md` 配置文件生效（非直接调用型 skill）
- **GitHub**: https://github.com/forrestchang/andrej-karpathy-skills

### 4. skill-creator
- **用途**: 开发、测试、评估、改进和基准测试 Claude Code Skills，包含 Create/Eval/Improve/Benchmark 四种模式
- **命令**: `/skill-creator create|eval|improve|benchmark <skill-name>`
- **GitHub**: 内置在 Claude Code 中

### 5. webup-statusline
- **用途**: 生成和安装自定义 Claude Code 状态栏脚本，支持选择显示列（模型、上下文、推理强度、Git、目录等）和颜色主题
- **命令**: `/webup-statusline [theme]`
- **依赖**: jq、Bun
- **GitHub**: 无公开仓库（社区 skill）

## 二、全局配置摘要

```json
{
  "model": "sonnet (→ resolve to deepseek-v4-flash)",
  "effortLevel": "xhigh",
  "statusLine": "~/.claude/scripts/statusline.sh (webup-statusline 生成)",
  "env": {
    "ANTHROPIC_BASE_URL": "https://api.deepseek.com/anthropic",
    "ANTHROPIC_MODEL": "deepseek-v4-flash",
    "ANTHROPIC_DEFAULT_SONNET_MODEL": "deepseek-v4-pro[1M]",
    "ANTHROPIC_DEFAULT_HAIKU_MODEL": "deepseek-v4-flash"
  }
}
```
