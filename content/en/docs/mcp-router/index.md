---
title: MCP Router
description: Manage multiple MCP servers through one endpoint.
navigation:
  order: 1
---

## What is MCP Router?

MCP Router runs an HTTP server on `localhost:19104`. You configure your MCP servers once in MCP Router, then point Claude Code (or other MCP clients) to this single endpoint.

### What it does

- **Single endpoint** — One HTTP endpoint routes to multiple MCP servers
- **Progressive disclosure** — AI queries tools on demand instead of loading all schemas upfront
- **Workspace isolation** — Different projects can use different server combinations

### Architecture

The core is written in Rust. The current UI is a macOS menu bar app (Swift/SwiftUI), but the Rust core can run on other platforms.

---

## Quick Start

### 1. Download

Download from [GitHub Releases](https://github.com/vimo-ai/mcp-router/releases), unzip, and move to Applications.

### 2. Add Servers

In the app, go to Settings → Servers and add your MCP servers. Supported types:

- **stdio** — Local processes (npx, uvx, node, python, etc.)
- **http** — Remote HTTP MCP servers

### 3. Configure Claude Code

MCP Router can write to Claude Code's global config automatically (Settings → Integration).

Or manually add to your project's `.mcp.json`:

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

### 4. Use

When Claude Code connects, it sees 4 meta tools:

| Tool | Purpose |
|------|---------|
| `mcp_router__list_servers` | List available servers |
| `mcp_router__list_tools` | List tools for a server |
| `mcp_router__describe` | Get tool parameter schema |
| `mcp_router__call` | Call a tool |

AI uses these to progressively discover and call your backend tools.

#### Full Mode

Enable Full mode in Settings to expose 3 additional management tools:

| Tool | Purpose |
|------|---------|
| `mcp_router__add_server` | Add a new MCP server |
| `mcp_router__remove_server` | Remove a server |
| `mcp_router__update_server` | Update server config |

This lets AI add MCP servers for you during conversation.

---

## Progressive Disclosure

When you install an MCP server directly, all its tools appear in `tools/list`. Each tool's schema is sent to the AI at session start, consuming context tokens.

With MCP Router, the AI starts with only 4 meta tools. It queries `list_servers` → `list_tools` → `describe` as needed, loading schemas only when actually calling a tool.

This reduces initial context usage when you have many servers with many tools.

---

## Documentation

- [Why MCP Router?](/docs/mcp-router/why) — The problems and our approach
- [Installation](/docs/mcp-router/installation) — Build, configure, run
- [Usage Guide](/docs/mcp-router/usage) — Workspaces, tokens, server management
- [Architecture](/docs/mcp-router/architecture) — Technical details
