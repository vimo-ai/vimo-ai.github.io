---
title: MCP Router
description: 通过一个端点管理多个 MCP 服务器
navigation:
  order: 1
---

## 什么是 MCP Router？

MCP Router 在 `localhost:19104` 上运行一个 HTTP 服务器。你在 MCP Router 中配置一次 MCP 服务器，然后将 Claude Code（或其他 MCP 客户端）指向这个单一端点。

### 它的作用

- **单一端点** — 一个 HTTP 端点路由到多个 MCP 服务器
- **渐进式披露** — AI 按需查询工具，而不是预先加载所有模式
- **工作区隔离** — 不同项目可以使用不同的服务器组合

### 架构

核心用 Rust 编写。当前的 UI 是 macOS 菜单栏应用（Swift/SwiftUI），但 Rust 核心可以在其他平台上运行。

---

## 快速开始

### 1. 下载

从 [GitHub Releases](https://github.com/vimo-ai/mcp-router/releases) 下载，解压并移动到应用程序文件夹。

### 2. 添加服务器

在应用中，进入设置 → 服务器并添加你的 MCP 服务器。支持的类型：

- **stdio** — 本地进程（npx、uvx、node、python 等）
- **http** — 远程 HTTP MCP 服务器

### 3. 配置 Claude Code

MCP Router 可以自动写入 Claude Code 的全局配置（设置 → 集成）。

或手动添加到项目的 `.mcp.json`：

```json
{
  "mcpServers": {
    "mcp-router": {
      "type": "http",
      "url": "http://localhost:19104"
    }
  }
}
```

### 4. 使用

当 Claude Code 连接时，它会看到 4 个元工具：

| 工具 | 用途 |
|------|---------|
| `mcp_router__list_servers` | 列出可用服务器 |
| `mcp_router__list_tools` | 列出服务器的工具 |
| `mcp_router__describe` | 获取工具参数模式 |
| `mcp_router__call` | 调用工具 |

AI 使用这些来逐步发现和调用你的后端工具。

#### 完整模式

在设置中启用完整模式以暴露 3 个额外的管理工具：

| 工具 | 用途 |
|------|---------|
| `mcp_router__add_server` | 添加新的 MCP 服务器 |
| `mcp_router__remove_server` | 移除服务器 |
| `mcp_router__update_server` | 更新服务器配置 |

这让 AI 在对话期间为你添加 MCP 服务器。

---

## 渐进式披露

当你直接安装 MCP 服务器时，其所有工具都会出现在 `tools/list` 中。每个工具的模式在会话开始时发送给 AI，消耗上下文 token。

使用 MCP Router，AI 只从 4 个元工具开始。它根据需要查询 `list_servers` → `list_tools` → `describe`，仅在实际调用工具时加载模式。

当你有许多服务器和许多工具时，这减少了初始上下文使用。

---

## 文档

- [为什么选择 MCP Router？](/docs/mcp-router/why) — 问题和我们的方法
- [安装](/docs/mcp-router/installation) — 构建、配置、运行
- [使用指南](/docs/mcp-router/usage) — 工作区、令牌、服务器管理
- [架构](/docs/mcp-router/architecture) — 技术细节
