---
title: 安装
description: 下载和配置 MCP Router
navigation:
  order: 3
---

## 下载

从 [GitHub Releases](https://github.com/vimo-ai/mcp-router/releases) 下载，解压并移动到应用程序文件夹。

## 启动

打开应用。它会在菜单栏显示一个闪电图标。

## 配置 MCP

从应用一键安装（设置 → 集成），或手动：

::code-group
```bash [Claude Code]
claude mcp add mcp-router -- npx -y mcp-remote http://localhost:19104
```
```bash [Codex]
codex mcp add mcp-router -- npx -y mcp-remote http://localhost:19104
```
::

重启你的 CLI，就可以开始使用了。
