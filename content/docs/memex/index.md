---
title: Memex
description: Claude Code Session History Manager - On-demand retrieval, precise recall
navigation:
  order: 1
---

## What is Memex?

Memex adds long-term memory to Claude Code through on-demand search. Instead of Claude forgetting everything from your previous conversations, you can search and retrieve precise context whenever you need it.

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

```bash
# Using Docker
docker run -d -p 10013:10013 \
  -v ~/.claude:/data/claude \
  -v ~/.vimo:/data/vimo \
  -e CLAUDE_PROJECTS_PATH=/data/claude/projects \
  -e VIMO_HOME=/data/vimo \
  ghcr.io/vimo-ai/memex:latest

# Or build from source
cargo build --release
./target/release/memex serve
```

Verify it's working:

```bash
curl http://localhost:10013/health    # → OK
curl http://localhost:10013/api/stats # → {"projectCount":...}
```

## Claude Code Quick Start

Get from zero to searching your history in 4 steps:

1. **Start Memex** (see Quick Start above)

2. **Verify sessions imported** (auto-imports on startup)
   ```bash
   curl http://localhost:10013/api/stats
   # Should show sessionCount > 0
   ```

3. **Try a search**
   ```bash
   curl "http://localhost:10013/api/search?q=authentication&limit=3"
   ```

4. **Configure MCP** (optional) - See [MCP Tools](/docs/memex/mcp) for Claude Code integration

> **Note**: If `sessionCount` is 0, trigger manual collection: `curl -X POST http://localhost:10013/api/collect`

## Architecture

```
Claude Code (.jsonl)
       ↓
   Collector (scan & parse)
       ↓
   SQLite DB (sessions, messages)
       ↓
   ┌───────────────┐
   │   Indexer     │ → LanceDB (vectors)
   └───────────────┘
       ↓
   Search / RAG / MCP
```

For detailed module dependencies and call graphs, see [Architecture](/docs/memex/architecture).

## Documentation

- [Installation](/docs/memex/installation) - Docker, build from source, system service
- [Configuration](/docs/memex/configuration) - Environment variables and options
- [API Reference](/docs/memex/api) - REST API endpoints
- [MCP Tools](/docs/memex/mcp) - Claude Code integration
- [Architecture](/docs/memex/architecture) - Module dependencies and design
- [Scheduler Internals](/docs/memex/internals/scheduler) - Background task details

## Configuration

| Env Variable | Default | Description |
|--------------|---------|-------------|
| `PORT` | 10013 | HTTP server port |
| `VIMO_HOME` | ~/.vimo | Base directory (SQLite, LanceDB, backups) |
| `CLAUDE_PROJECTS_PATH` | ~/.claude/projects | Claude Code session data |
| `OLLAMA_API` | http://localhost:11434 | Ollama server for embeddings |

See [Configuration](/docs/memex/configuration) for all options.
