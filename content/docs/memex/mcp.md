---
title: MCP Tools
description: Using Memex as an MCP server for AI coding assistants
navigation:
  order: 5
---

Memex implements the [Model Context Protocol](https://modelcontextprotocol.io/) (MCP), allowing AI coding assistants to search your conversation history.

## Setup

See [Quick Start](/docs/memex#full-recommended) for MCP configuration commands.

Verify MCP is working:

```bash
curl -X POST http://localhost:10013/api/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'
```

---

## Tools

### search_history

Search conversation history using full-text, semantic, or hybrid mode.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `query` | string | Yes | Search keywords |
| `mode` | string | No | `fts`, `vector`, or `hybrid` (default) |
| `cwd` | string | No | Filter by project path |
| `limit` | number | No | Max results (default: 10) |

### get_session

Get session details with pagination.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `sessionId` | string | Yes | Session ID (full or prefix) |
| `offset` | number | No | Start from message N |
| `limit` | number | No | Number of messages (default: 10) |
| `order` | string | No | `asc` or `desc` |
| `search` | string | No | Search within session |

Note: Content truncated to 500 chars when `limit > 5`.

### get_recent_sessions

Get recent sessions, optionally filtered by project.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `cwd` | string | No | Filter by project path |
| `limit` | number | No | Number of sessions (default: 5) |

### list_projects

List all projects with statistics. No parameters.

---

## Usage

In your AI CLI:

```
search my history for "authentication"
```

The AI will call `search_history` and return relevant conversations.
