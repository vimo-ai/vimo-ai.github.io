---
title: 使用指南
description: 工作区、令牌以及它们如何协同工作
navigation:
  order: 4
---

## 服务器

进入设置 → 服务器。添加你使用的 MCP 服务器。

每个服务器需要：
- **名称** — 你将如何识别它
- **类型** — stdio（本地进程）或 http（远程端点）
- **对于 stdio**：命令和参数（如 `npx -y @anthropic/github`），如果需要还有环境变量
- **对于 http**：服务器 URL

根据需要打开或关闭服务器。禁用的服务器保留在你的配置中但不会加载。

---

## 工作区

工作区是一个配置集——使用哪些服务器，由令牌标识。

### 默认工作区

始终有一个默认工作区。当请求进来时没有令牌，或令牌不匹配任何内容时，它使用默认工作区。

### 创建工作区

设置 → 工作区 → 添加工作区。

给它一个名称，选择要启用的服务器，MCP Router 生成一个令牌（或者你可以设置自己的）。

### 令牌

令牌是 MCP Router 知道使用哪个工作区的方式。

在你项目的 `.mcp.json` 中：

```json
{
  "mcpServers": {
    "mcp-router": {
      "type": "http",
      "url": "http://localhost:19104",
      "headers": {
        "X-Workspace-Token": "your-token"
      }
    }
  }
}
```

当你的 MCP 客户端连接时，它发送这个令牌。MCP Router 查找它并返回该工作区服务器的工具。没有令牌标头时，请求使用默认工作区。

### 从默认继承

如果你只想让项目使用大多数服务器但跳过一些，你可以启用"从默认继承"，然后禁用特定服务器。减少重复。

---

## Claude Code 集成

### 自动设置

设置 → 集成。点击按钮写入 Claude Code 的全局配置。完成。

这将 MCP Router 添加到 `~/.claude.json`。每个项目都会使用它。

### 每个项目的配置

对于项目特定的设置，在项目根目录添加带令牌的 `.mcp.json`。项目配置优先于相同服务器名称的全局配置。

---

## Codex 集成

同样的想法。设置 → 集成也有一个 Codex 按钮。

或手动添加到 `~/.codex/config.toml`：

```toml
[mcp_servers.mcp-router]
type = "http"
url = "http://localhost:19104"

[mcp_servers.mcp-router.headers]
X-Workspace-Token = "your-token"
```

没有令牌标头时，请求使用默认工作区。

---

## 故障排除

**工具没有出现？**

- 检查服务器在 MCP Router 中是否已启用
- 检查工作区是否有该服务器
- 更改配置后重启你的 MCP 客户端

**服务器无法启动？**

- 检查命令和参数
- 检查环境变量（某些服务器需要 API 密钥）
- 查看 MCP Router 中的服务器日志

**连接被拒绝？**

- 确保 MCP Router 正在运行（检查菜单栏图标）
- 确保没有其他东西在使用端口 19104

---

有问题或问题？在 [GitHub](https://github.com/vimo-ai/mcp-router) 上告诉我们。
