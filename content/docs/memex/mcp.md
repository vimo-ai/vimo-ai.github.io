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

Search conversation history with progressive disclosure.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `query` | string | Yes | Search keywords |
| `level` | string | No | Detail level: `sessions` (default), `talks`, `raw` |
| `cwd` | string \| string[] | No | Filter to specific project(s). Supports exact path, prefix, or glob patterns (e.g. `*/ETerm*`) |
| `exclude_cwd` | string \| string[] | No | Exclude specific project(s). Supports exact path, prefix, or glob patterns (e.g. `*english*`) |
| `time` | string | No | Time shortcut: `1d`, `3d`, `1w`, `1m` |
| `from` | string | No | Start date `YYYY-MM-DD` (mutually exclusive with `time`) |
| `to` | string | No | End date `YYYY-MM-DD` (mutually exclusive with `time`) |
| `limit` | number | No | Max results (default: 5) |

**Level options:**

| Level | Returns | Use when |
|-------|---------|----------|
| `sessions` | L3 session summaries | Quick overview (default) |
| `talks` | L2 per-prompt summaries | Need more detail |
| `raw` | L0 original messages | Need exact content |

**Project filtering examples:**

```json
// Single project (exact match or prefix)
{ "cwd": "/Users/me/projects/myapp" }

// Multiple projects
{ "cwd": ["/Users/me/projects/app1", "/Users/me/projects/app2"] }

// Glob pattern
{ "cwd": "*/ETerm*" }

// Exclude projects
{ "exclude_cwd": "*english*" }

// Combined: include some, exclude others
{ "cwd": "*/vimo/*", "exclude_cwd": ["*test*", "*archive*"] }
```

### get_session

Get session messages. Two modes available:

**Mode 1: Around position** - Get context around a specific message

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `sessionId` | string | Yes | Session ID (full or prefix) |
| `around` | number | Yes | Position from `search_history` result `at` field |
| `context` | number | No | Messages before/after (default: 5, max: 20) |

**Mode 2: Pagination** - Browse from start or end

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `sessionId` | string | Yes | Session ID (full or prefix) |
| `limit` | number | No | Messages to return (default: 10) |
| `order` | string | No | `asc` (from start) or `desc` (from end) |

Note: Content truncated when `limit > 5`.

### get_recent_sessions

Get recent sessions, optionally filtered by project.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `cwd` | string \| string[] | No | Filter to specific project(s). Supports exact path, prefix, or glob patterns |
| `exclude_cwd` | string \| string[] | No | Exclude specific project(s). Supports exact path, prefix, or glob patterns |
| `limit` | number | No | Max results (default: 5) |

See [search_history](#search_history) for project filtering examples.

### list_projects

List all projects with statistics. No parameters.

---

## Typical Workflow

```
1. search_history "authentication" → find relevant sessions
2. get_session sessionId=xxx around=42 → get context around match
```

The `at` field in search results can be passed directly to `get_session`'s `around` parameter.

---

## Usage

In your AI CLI:

```
search my history for "authentication"
```

The AI will call `search_history` and return relevant conversations.
