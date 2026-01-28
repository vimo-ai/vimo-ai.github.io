---
title: Memex
description: AI CLI 会话历史管理器 - 按需检索，精确回忆
navigation:
  order: 1
---

<div class="flex justify-center my-8">
  <img src="/logos/memex.svg" alt="Memex Logo" class="w-64" />
</div>

<p class="text-center text-lg text-gray-400 mb-8">
  一个记忆。所有 CLI。永不压缩。精确搜索。
</p>

## 什么是 Memex？

Memex 通过按需搜索为 AI 编程助手添加长期记忆。你的宝贵对话不会丢失，可以在需要时搜索并检索精确的上下文。

### 支持的工具

- ✅ Claude Code
- ✅ Codex CLI
- ✅ OpenCode
- ✅ Gemini CLI

## 特性

- **按需搜索** - 你控制何时搜索；自动注入是可选功能
- **原始保存** - 始终保留原始消息；摘要是可选层
- **多 CLI 支持** - Claude Code、Codex、OpenCode、Gemini 在一个数据库中
- **强大搜索** - 全文搜索（FTS5）+ 语义向量 + 混合排序
- **MCP 集成** - 直接从你的 AI CLI 中搜索
- **REST API** - 集成到任何工作流
- **本地存储** - 所有数据保留在你的机器上

::callout{type="info"}
**为什么选择 Memex？** 阅读完整说明：[为什么选择 Memex？](/docs/memex/why)
::

## 快速开始

### Homebrew (macOS / Linux)

::code-group
```bash [完整版]
brew install vimo-ai/tap/memex

# 验证服务器正在运行
curl http://localhost:10013/health
# OK
```
```bash [精简版]
# 零依赖 CLI，直接读取本地会话
brew install vimo-ai/tap/memex-lite

memex search "你想搜什么搜什么"
memex list -n 10
```
::

### Docker

::code-group
```bash [macOS / Linux]
docker run -d -p 10013:10013 \
  -v ~/.vimo:/data \
  -v ~/.claude/projects:/claude:ro \
  -v ~/.codex:/codex:ro \                              # 可选: Codex
  -v ~/.local/share/opencode:/opencode:ro \            # 可选: OpenCode
  -v ~/.gemini/tmp:/gemini:ro \                        # 可选: Gemini
  -e OLLAMA_HOST=http://host.docker.internal:11434 \   # 可选: 本机 Ollama (Docker Desktop)
  ghcr.io/vimo-ai/memex:latest
```
```ps1 [Windows (PowerShell)]
docker run -d -p 10013:10013 `
  -v "$env:USERPROFILE\.vimo:/data" `
  -v "$env:USERPROFILE\.claude\projects:/claude:ro" `
  -v "$env:USERPROFILE\.codex:/codex:ro" `             # 可选: Codex
  -v "$env:LOCALAPPDATA\opencode:/opencode:ro" `       # 可选: OpenCode
  -v "$env:USERPROFILE\.gemini\tmp:/gemini:ro" `       # 可选: Gemini
  -e OLLAMA_HOST=http://host.docker.internal:11434 `   # 可选: 本机 Ollama (Docker Desktop)
  ghcr.io/vimo-ai/memex:latest
```
::

### 配置 MCP (完整版 / Docker)

::code-group
```bash [Claude Code]
claude mcp add memex -- npx -y mcp-remote http://localhost:10013/api/mcp
```
```bash [Codex]
codex mcp add memex -- npx -y mcp-remote http://localhost:10013/api/mcp
```
```bash [Gemini]
gemini mcp add --transport http memex http://localhost:10013/api/mcp
```
```bash [OpenCode]
# 编辑 ~/.config/opencode/opencode.json
{
  "mcp": {
    "memex": {
      "type": "remote",
      "url": "http://localhost:10013/api/mcp"
    }
  }
}
```
::

然后在你的 AI CLI 中搜索：

```
use memex search "你想搜什么搜什么"
```

## 文档

- [安装](/docs/memex/installation) - Docker、从源码构建、故障排除
- [配置](/docs/memex/configuration) - 环境变量和选项
- [API 参考](/docs/memex/api) - REST API 端点
- [MCP 工具](/docs/memex/mcp) - Claude Code 集成
- [工作原理](/docs/memex/how-it-works) - 数据流、架构和内部机制
- [高级](/docs/memex/advanced) - Claude Code Hooks 等
