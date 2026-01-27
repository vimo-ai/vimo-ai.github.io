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

### Full

```bash [Terminal]
brew install vimo-ai/tap/memex

memex search "anything you want"
memex list -n 10
```

### Lite

Zero-dependency version, reads local session data directly:

```bash [Terminal]
brew install vimo-ai/tap/memex-lite
```

### Full (Docker)

For Linux and other platforms:

```bash [Terminal]
docker run -d -p 10013:10013 \
  -v ~/.vimo:/data \
  -v ~/.claude/projects:/claude:ro \
  -v ~/.codex:/codex:ro \
  -v ~/.local/share/opencode:/opencode:ro \
  -v ~/.gemini/tmp:/gemini:ro \
  ghcr.io/vimo-ai/memex:latest
```

### Configure MCP

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

The background agent (`vimo-agent`) will be downloaded automatically on first run. If auto-download fails, see [Installation](/docs/memex/installation#troubleshooting).

## Documentation

- [Installation](/docs/memex/installation) - Docker, build from source, troubleshooting
- [Configuration](/docs/memex/configuration) - Environment variables and options
- [API Reference](/docs/memex/api) - REST API endpoints
- [MCP Tools](/docs/memex/mcp) - Claude Code integration
- [How it Works](/docs/memex/how-it-works) - Data flow, architecture, and internals
- [Advanced](/docs/memex/advanced) - Claude Code Hooks and more
