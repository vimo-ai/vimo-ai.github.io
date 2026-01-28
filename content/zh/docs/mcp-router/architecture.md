---
title: 架构
description: MCP Router 如何构建
navigation:
  order: 5
---

## 概述

MCP Router 是一个带有 Rust 核心的 macOS 菜单栏应用。

- **Swift/SwiftUI** — UI、HTTP 服务器、进程管理
- **Rust** — 通过 FFI 处理 MCP 协议

```
┌───────────────────────────────────────────┐
│             MCP Router App                │
├───────────────────────────────────────────┤
│  SwiftUI         │  HTTP Server           │
│  (菜单栏 UI)     │  (localhost:19104)     │
├───────────────────────────────────────────┤
│            Process Manager                │
│      (生成和管理服务器)                    │
├───────────────────────────────────────────┤
│            Rust Core (FFI)                │
│   (MCP 协议、JSON-RPC、stdio)             │
└───────────────────────────────────────────┘
              │
              ▼
    ┌─────────┬─────────┐
    │ Server  │ Server  │  (stdio 或 http)
    └─────────┴─────────┘
```

---

## HTTP 服务器

监听 `localhost:19104`。接收来自 MCP 客户端（Claude Code、Codex 等）的 JSON-RPC 请求。

当请求进来时：
1. 查看 `X-Workspace-Token` 标头
2. 找到匹配的工作区
3. 路由到正确的服务器
4. 返回响应

4 个元工具（`list_servers`、`list_tools`、`describe`、`call`）由路由器本身处理。工具调用被转发到后端服务器。

---

## 进程管理器

生成 MCP 服务器进程并跟踪它们。

对于 stdio 服务器，它运行命令并通过 stdin/stdout 与进程通信。对于 http 服务器，它只是向配置的 URL 发送 HTTP 请求。

---

## Rust 核心

MCP 协议有一些棘手的部分——JSON-RPC 消息帧、请求-响应关联、stdio 上的正确错误处理。

Rust 处理这些。Swift 通过 C FFI 调用 Rust 进行协议工作。

---

## 数据存储

服务器配置和工作区设置存储在本地。菜单栏应用管理一切——无需外部数据库。

文件位置：
- `~/.vimo/mcp-router/` — 设置、工作区、服务器配置

---

## 源代码布局

```
mcp-router/
├── core/                 # Rust 核心 (FFI)
│   └── src/
├── mcp-router/           # Swift 应用
│   ├── Models/           # 数据模型
│   ├── Views/            # SwiftUI 视图
│   └── Services/         # HTTP 服务器、进程管理器等
└── scripts/              # 构建脚本
```

---

想深入了解？查看 [GitHub 仓库](https://github.com/vimo-ai/mcp-router)。
