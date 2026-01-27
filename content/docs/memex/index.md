---
title: Memex
description: AI CLI Session History Manager - On-demand retrieval, precise recall
navigation:
  order: 1
---

<div class="flex justify-center my-8">
  <img src="/logos/memex.svg" alt="Memex Logo" class="w-64" />
</div>

<p class="text-center text-lg text-gray-400 mb-8">
  One Memory. All CLIs. Never Compacted. Exact Search.
</p>

## What is Memex?

Memex adds long-term memory to AI coding assistants through on-demand search. Instead of losing your valuable conversations, you can search and retrieve precise context whenever you need it.

### Supported Tools

- ✅ Claude Code
- ✅ Codex CLI
- ✅ OpenCode
- ✅ Gemini CLI

## Features

- **On-demand search** - You control when to search; automatic injection is opt-in
- **Original preservation** - Raw messages always kept; summaries are optional layers
- **Multi-CLI support** - Claude Code, Codex, OpenCode, Gemini in one database
- **Powerful search** - Full-text (FTS5) + semantic vectors + hybrid ranking
- **MCP integration** - Search directly from your AI CLI
- **REST API** - Integrate into any workflow
- **Local storage** - All data stays on your machine

::callout{type="info"}
**Why Memex?** Read the full explanation in [Why Memex?](/docs/memex/why)
::

## Quick Start

### Homebrew (macOS / Linux)

::code-group
```bash [Full]
brew install vimo-ai/tap/memex

# Verify server is running
curl http://localhost:10013/health
# OK
```
```bash [Lite]
# Zero-dependency CLI, reads local sessions directly
brew install vimo-ai/tap/memex-lite

memex search "anything you want"
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

### Configure MCP (Full / Docker)

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
# Edit ~/.config/opencode/opencode.json
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

Then search in your AI CLI:

```
use memex search "anything you want"
```

## Documentation

- [Installation](/docs/memex/installation) - Docker, build from source, troubleshooting
- [Configuration](/docs/memex/configuration) - Environment variables and options
- [API Reference](/docs/memex/api) - REST API endpoints
- [MCP Tools](/docs/memex/mcp) - Claude Code integration
- [How it Works](/docs/memex/how-it-works) - Data flow, architecture, and internals
- [Advanced](/docs/memex/advanced) - Claude Code Hooks and more
