---
title: 安装
description: 通过 Docker、Homebrew 或从源码构建安装 Memex
navigation:
  order: 2
---

## Memex 完整版

完整服务器，包含 MCP 集成、Web UI、语义搜索和 RAG。

### Homebrew (macOS / Linux)

```bash
brew install vimo-ai/tap/memex
```

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

| 挂载 | 用途 |
|-------|---------|
| `~/.vimo:/data` | Memex 数据目录（必需）|
| `~/.claude/projects:/claude` | Claude Code 会话 |
| `~/.codex:/codex` | Codex CLI 会话（可选）|
| `~/.local/share/opencode:/opencode` | OpenCode 会话（可选）|
| `~/.gemini/tmp:/gemini` | Gemini CLI 会话（可选）|

### 二进制文件

从 [GitHub Releases](https://github.com/vimo-ai/memex/releases) 下载。支持 macOS (arm64/x64)、Linux (x64/arm64) 和 Windows (x64)。

### 验证

```bash
curl http://localhost:10013/health
# OK
```

### MCP 集成

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
```json [OpenCode]
// 编辑 ~/.config/opencode/opencode.json
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

---

## Memex 精简版

零依赖独立 CLI，用于快速搜索。直接读取本地会话文件，无需服务器。

```bash
brew install vimo-ai/tap/memex-lite

memex search "你想搜什么搜什么"
memex list -n 10
```

---

## 从源码构建

```bash
git clone https://github.com/vimo-ai/memex.git
cd memex

# 完整服务器
cd memex-rs && cargo build --release
./target/release/memex

# 仅精简版 CLI
cd memex-lite && cargo build --release
./target/release/memex --help
```

需要 Rust 1.75+ 和带 FTS5 的 SQLite 3.35+。

---

## Ollama（可选）

用于语义搜索和 RAG：

```bash
brew install ollama
ollama serve
ollama pull bge-m3      # 嵌入模型
ollama pull qwen3:0.6b  # 对话模型（可选）
```

Memex 在 `http://localhost:11434` 自动检测 Ollama。

---

## 故障排除

### vimo-agent 自动下载失败

后台代理（`vimo-agent`）在首次运行时自动下载。如果自动下载失败，请从 [ai-cli-session-db Releases](https://github.com/vimo-ai/ai-cli-session-db/releases) 手动下载并放置在 `~/.vimo/bin/vimo-agent`。

::callout{type="info"}
Docker 用户无需担心这个问题 - `vimo-agent` 已捆绑在镜像中。
::
