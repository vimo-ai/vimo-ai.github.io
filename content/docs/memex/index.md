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

## Key Capabilities

- **On-Demand Search** - You control when to search, no automatic injection
- **Complete Preservation** - Stores original records without AI compression
- **Powerful Search** - FTS5 full-text + semantic vectors + hybrid ranking
- **MCP Integration** - Search directly from Claude Code conversations
- **Web UI** - Visual browsing, RAG Q&A, statistics dashboard
- **REST API** - Integrate into any toolchain

::callout{type="info"}
**Why Memex?** Read the full explanation in [Why Memex?](/docs/memex/why)
::

## Quick Start

### Lite (Quick Search)

Reads local session data directly, no server needed. Perfect for quick one-off searches.

```bash [Terminal]
brew install vimo-ai/tap/memex
```

```bash [Terminal]
memex search "authentication"
memex list -n 10
```

### Full (Recommended)

Run as a service with MCP integration. Search history directly in Claude Code.

**1. Start Docker**

```bash [Terminal]
docker run -d -p 10013:10013 \
  -v ~/.vimo:/data \
  -v ~/.claude/projects:/claude:ro \
  -v ~/.codex:/codex:ro \
  -v ~/.local/share/opencode:/opencode:ro \
  -v ~/.gemini/tmp:/gemini:ro \
  ghcr.io/vimo-ai/memex:latest
```

**2. Configure MCP**

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

**3. Use in Your AI CLI**

Restart your AI CLI, then search history:

```
use memex search "anything you want"
```

## Documentation

- [Installation](/docs/memex/installation) - Docker, build from source, system service
- [Configuration](/docs/memex/configuration) - Environment variables and options
- [API Reference](/docs/memex/api) - REST API endpoints
- [MCP Tools](/docs/memex/mcp) - Claude Code integration
- [Architecture](/docs/memex/architecture) - Module dependencies and design
