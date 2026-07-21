---
title: WSL 离线安装指南
date: 2026-07-21
categories:
  - 工具
  - WSL
tags:
  - WSL
  - Windows
  - 环境配置
---

# WSL 离线安装指南

> 适用于 Windows 11，配合 FlClash 代理加速下载

## 问题背景

Docker Desktop 依赖 WSL 2，`wsl --install` 从微软服务器下载很慢，且代理（FlClash）的 SSL 拦截会导致 GitHub 下载失败。

## 整体思路

`wsl --install` 实际做了 4 件事，我们分开手动完成：

| 组件 | 方式 | 是否需要代理 |
|------|------|-------------|
| WSL 功能 | DISM 命令 | 不需要 |
| 虚拟机平台 | DISM 命令 | 不需要 |
| WSL 内核/运行时 | winget 或浏览器下载 `.msixbundle` | 需要 |
| Linux 发行版 | curl 下载 `.AppxBundle` | 需要 |

---

## 步骤 1：启用 Windows 功能（需要管理员权限）

以**管理员身份**打开 PowerShell，执行：

```powershell
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
```

## 步骤 2：下载并安装 WSL 运行时（Microsoft.WSL）

### 方式 A：浏览器下载（推荐）

用浏览器打开：
```
https://github.com/microsoft/WSL/releases/latest
```
下载 `Microsoft.WSL_*.msixbundle`，双击安装。

### 方式 B：winget（需先配好 WinHTTP 代理）

```powershell
# 设置 WinHTTP 代理（临时）
netsh winhttp set proxy proxy-server=127.0.0.1:7890

# 安装
winget install Microsoft.WSL --source winget

# 安装完后重置
netsh winhttp reset proxy
```

## 步骤 3：下载 Linux 发行版

```bash
# 通过代理下载 Ubuntu 24.04（FlClash 默认端口 7890）
curl -x http://127.0.0.1:7890 -k -L -o Ubuntu2404.AppxBundle \
  "https://publicwsldistros.blob.core.windows.net/wsldistrostorage/Ubuntu2404-240425.AppxBundle"
```

然后双击 `.AppxBundle` 安装。

## 步骤 4：初始化

重启电脑后，打开终端运行：

```bash
wsl --set-default-version 2
ubuntu2404.exe
```

按提示设置 Linux 用户名和密码即可。

## 验证安装

```powershell
wsl --version       # 应显示版本号（非 "wsl --install" 提示）
wsl --list --verbose # 应显示已安装的发行版
```

打开 Docker Desktop，WSL 相关错误应消失。
