---
title: MCP Tools
description: Using Memex as an MCP server for Claude Code
navigation:
  order: 5
---

# MCP Tools

Memex implements the [Model Context Protocol](https://modelcontextprotocol.io/) (MCP), allowing Claude Code to retrieve your conversation history as context.

## Setup

Memex exposes MCP via HTTP at `http://localhost:10013/api/mcp`.

### Option 1: HTTP Transport (Recommended)

If your MCP client supports HTTP/SSE transport, point it to:

```
URL: http://localhost:10013/api/mcp
Method: POST (JSON-RPC 2.0)
```

### Option 2: Claude Code with mcp-remote

For Claude Code, use [mcp-remote](https://github.com/anthropics/claude-code/tree/main/packages/mcp-remote) to bridge HTTP:

```json
// ~/.claude.json (Claude Code config)
{
  "mcpServers": {
    "memex": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "http://localhost:10013/api/mcp"]
    }
  }
}
```

### Option 3: Direct API Usage

If MCP integration isn't available, use the REST API directly:

```bash
# Search history
curl "http://localhost:10013/api/search?q=authentication&limit=5"

# Get session
curl "http://localhost:10013/api/sessions/abc123/messages"
```

### Verify MCP is Working

```bash
curl -X POST http://localhost:10013/api/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'
```

Should return the list of available tools.

## Available Tools

Memex provides 4 MCP tools:

### search_history

Search Claude Code conversation history using full-text search, semantic search, or hybrid mode.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `query` | string | Yes | Search keywords |
| `mode` | string | No | `fts` (full-text), `vector` (semantic), `hybrid` (default) |
| `cwd` | string | No | Current working directory to filter by project |
| `limit` | number | No | Max results (default: 10) |

**Example:**
```json
{
  "name": "search_history",
  "arguments": {
    "query": "authentication implementation",
    "mode": "hybrid",
    "limit": 5
  }
}
```

**Response:**
```json
{
  "results": [
    {
      "messageId": 123,
      "sessionId": "abc-def-123",
      "projectId": 1,
      "projectName": "my-app",
      "type": "assistant",
      "content": "To implement authentication, you can use...",
      "snippet": "...implement <mark>authentication</mark>...",
      "score": 0.95,
      "timestamp": "2024-01-15 10:30:00"
    }
  ],
  "total": 1
}
```

### get_session

Get session details with pagination and in-session search.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `sessionId` | string | Yes | Session ID (full UUID or prefix) |
| `offset` | number | No | Start from message N (default: 0) |
| `limit` | number | No | Number of messages (default: 10) |
| `order` | string | No | `asc` (oldest first) or `desc` (newest first) |
| `search` | string | No | Search keyword within session |

**Note:** When `limit > 5`, message content is truncated to 500 characters. For full content, use `limit <= 5` or paginate.

**Example:**
```json
{
  "name": "get_session",
  "arguments": {
    "sessionId": "abc123",
    "limit": 5,
    "order": "desc"
  }
}
```

**Response:**
```json
{
  "session": {
    "id": "abc123-def456-...",
    "messageCount": 42
  },
  "messages": [
    {
      "id": 100,
      "uuid": "msg-uuid",
      "type": "User",
      "content": "How do I implement...",
      "timestamp": "2024-01-15 10:30:00",
      "index": 41
    }
  ],
  "pagination": {
    "order": "desc",
    "limit": 5,
    "total": 42
  }
}
```

### get_recent_sessions

Get the most recent sessions, optionally filtered by project.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `cwd` | string | No | Current working directory to filter by project |
| `limit` | number | No | Number of sessions (default: 5) |

**Example:**
```json
{
  "name": "get_recent_sessions",
  "arguments": {
    "cwd": "/Users/me/projects/my-app",
    "limit": 3
  }
}
```

**Response:**
```json
{
  "sessions": [
    {
      "id": "abc-def-123",
      "projectId": 1,
      "messageCount": 42,
      "lastMessage": "2024-01-15 10:30:00"
    }
  ],
  "total": 1
}
```

### list_projects

List all projects with statistics.

**Parameters:** None

**Example:**
```json
{
  "name": "list_projects",
  "arguments": {}
}
```

**Response:**
```json
{
  "projects": [
    {
      "id": 1,
      "name": "my-app",
      "path": "/Users/me/projects/my-app",
      "sessionCount": 10,
      "messageCount": 420,
      "lastActive": "2024-01-15 10:30:00"
    }
  ],
  "total": 1
}
```

## JSON-RPC Protocol

Memex uses JSON-RPC 2.0 over HTTP. The MCP endpoint is `/api/mcp`.

### Initialize

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "initialize"
}
```

### List Tools

```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "tools/list"
}
```

### Call Tool

```json
{
  "jsonrpc": "2.0",
  "id": 3,
  "method": "tools/call",
  "params": {
    "name": "search_history",
    "arguments": {
      "query": "authentication",
      "limit": 5
    }
  }
}
```

## Use Cases

### Context Retrieval

When working on a feature, search for previous related conversations:

```
User: Search my history for how I implemented caching before
Claude: [calls search_history with query="caching implementation"]
```

### Session Continuation

Resume a previous conversation:

```
User: What did we discuss in session abc123?
Claude: [calls get_session with sessionId="abc123"]
```

### Project History

See all work on a specific project:

```
User: Show me recent sessions for this project
Claude: [calls get_recent_sessions with cwd="/current/project/path"]
```

## Server Info

Get MCP server information:

```bash
curl http://localhost:10013/api/mcp/info
```

**Response:**
```json
{
  "server": {
    "name": "memex-mcp-server",
    "version": "1.0.0",
    "protocolVersion": "2024-11-05"
  },
  "capabilities": {
    "tools": {}
  },
  "tools": [...]
}
```
