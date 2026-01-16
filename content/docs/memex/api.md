---
title: API Reference
description: Memex REST API endpoints
navigation:
  order: 4
---

Memex exposes a REST API on port `10013` (default). All responses are JSON.

**Parameter naming:** All query parameters use `camelCase` (e.g., `projectId`, `startDate`).

## Health & Stats

### GET /health

Health check endpoint.

```bash
curl http://localhost:10013/health
```

**Response:** `OK`

### GET /api/stats

Get database statistics.

```bash
curl http://localhost:10013/api/stats
```

**Response:**
```json
{
  "projectCount": 5,
  "sessionCount": 42,
  "messageCount": 1337,
  "semanticSearchEnabled": true,
  "aiChatEnabled": false
}
```

## Projects

### GET /api/projects

List all projects.

```bash
curl http://localhost:10013/api/projects
```

**Response:**
```json
{
  "total": 5,
  "projects": [
    {
      "id": 1,
      "name": "my-project",
      "path": "/Users/me/projects/my-project",
      "sessionCount": 10
    }
  ]
}
```

### GET /api/projects/{id}

Get project details by ID.

```bash
curl http://localhost:10013/api/projects/1
```

**Response:**
```json
{
  "id": 1,
  "name": "my-project",
  "path": "/Users/me/projects/my-project",
  "sessionCount": 10,
  "messageCount": 420
}
```

### GET /api/projects/{id}/sessions

Get all sessions for a project.

```bash
curl http://localhost:10013/api/projects/1/sessions
```

**Response:**
```json
{
  "sessions": [
    {
      "id": "abc-def-123",
      "messageCount": 42,
      "lastMessage": "2024-01-15T10:30:00"
    }
  ],
  "total": 10
}
```

## Sessions

### GET /api/sessions

List sessions with optional filtering.

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `projectId` | number | - | Filter by project |
| `limit` | number | 50 | Max results |

```bash
curl "http://localhost:10013/api/sessions?limit=10"
```

### GET /api/sessions/search

Search sessions by ID prefix.

| Parameter | Type | Description |
|-----------|------|-------------|
| `idPrefix` | string | Session ID prefix to match |
| `limit` | number | Max results (default: 20) |

```bash
curl "http://localhost:10013/api/sessions/search?idPrefix=abc123"
```

### GET /api/sessions/{id}

Get session details by ID (full UUID or prefix).

```bash
curl http://localhost:10013/api/sessions/abc123
```

**Response:**
```json
{
  "id": "abc123-def456-...",
  "projectId": 1,
  "projectName": "my-project",
  "messageCount": 42,
  "firstMessage": "2024-01-15T09:00:00",
  "lastMessage": "2024-01-15T10:30:00"
}
```

### GET /api/sessions/{id}/messages

Get messages for a session.

| Parameter | Type | Description |
|-----------|------|-------------|
| `limit` | number | Max messages (default: 50) |
| `offset` | number | Skip first N messages |
| `order` | string | `asc` or `desc` (default: asc) |

```bash
curl "http://localhost:10013/api/sessions/abc123/messages?limit=10&order=desc"
```

**Response:**
```json
{
  "messages": [
    {
      "id": 100,
      "type": "user",
      "content": "How do I implement...",
      "timestamp": "2024-01-15T10:30:00"
    }
  ],
  "total": 42
}
```

## Search

### GET /api/search

Full-text search (FTS5).

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `q` | string | required | Search query |
| `limit` | number | 20 | Max results |
| `projectId` | number | - | Filter by project |

```bash
curl "http://localhost:10013/api/search?q=authentication&limit=10"
```

**Response:**
```json
{
  "results": [
    {
      "messageId": 123,
      "sessionId": "abc-def-123",
      "projectId": 1,
      "projectName": "my-project",
      "type": "assistant",
      "content": "To implement authentication...",
      "snippet": "...implement <mark>authentication</mark>...",
      "score": 0.95,
      "timestamp": "2024-01-15T10:30:00"
    }
  ],
  "total": 1
}
```

### GET /api/search/semantic

Semantic search using vector embeddings. Requires Ollama.

| Parameter | Type | Description |
|-----------|------|-------------|
| `q` | string | Search query |
| `limit` | number | Max results |
| `projectId` | number | Filter by project |
| `mode` | string | `fts`, `vector`, or `hybrid` |
| `startDate` | string | Filter start date |
| `endDate` | string | Filter end date |

### GET /api/search/semantic/status

Check semantic search availability.

**Response:**
```json
{
  "available": true,
  "ollamaConnected": true,
  "vectorCount": 5000,
  "embeddingModel": "bge-m3"
}
```

### GET /api/search/hybrid

Hybrid search combining FTS and vector search. Same parameters as semantic search.

## RAG Q&A

### POST /api/ask

Ask a question using RAG (Retrieval-Augmented Generation).

**Request:**
```json
{
  "question": "How did I implement the login feature?",
  "contextWindow": 3,
  "maxSources": 5,
  "projectId": 1
}
```

**Response:**
```json
{
  "answer": "Based on your conversation history...",
  "sources": [
    {
      "sessionId": "abc-123",
      "content": "...",
      "score": 0.92
    }
  ]
}
```

### GET /api/ask

Quick Q&A via GET request.

| Parameter | Type | Description |
|-----------|------|-------------|
| `q` | string | Question |
| `contextWindow` | number | Context size (default: 3) |
| `maxSources` | number | Max sources (default: 5) |
| `projectId` | number | Filter by project |

```bash
curl "http://localhost:10013/api/ask?q=how+to+implement+auth"
```

### GET /api/ask/status

Check AI Q&A availability.

## Collection & Indexing

### POST /api/collect

Trigger manual collection of Claude Code sessions.

```bash
curl -X POST http://localhost:10013/api/collect
```

**Response:**
```json
{
  "projectsScanned": 5,
  "sessionsScanned": 42,
  "messagesInserted": 156,
  "errors": []
}
```

### POST /api/index

Index a specific session by path (for real-time updates).

**Request:**
```json
{
  "path": "~/.claude/projects/-Users-me-myproject/session-uuid.jsonl"
}
```

### POST /api/index/all

Trigger full vector indexing of all messages.

### POST /api/index/batch

Index a batch of unindexed messages.

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `limit` | number | 100 | Batch size |

## Embedding Management

### GET /api/embedding/status

Get embedding service status.

### GET /api/embedding/stats

Get indexing statistics.

**Response:**
```json
{
  "pending": 100,
  "failed": 2,
  "indexed": 5000,
  "ollamaAvailable": true,
  "embeddingModel": "bge-m3",
  "isRunning": false
}
```

### POST /api/embedding/trigger

Trigger incremental embedding indexing (batch of 100).

### POST /api/embedding/trigger-all

Start background full indexing task.

### GET /api/embedding/failed

List failed indexing attempts.

### POST /api/embedding/reset-failed

Reset failed messages for re-indexing.

### POST /api/embedding/compact

Compact LanceDB storage (merge fragments, clean old versions).

## Backup

### POST /api/backup

Create a database backup.

**Response:**
```json
{
  "path": "/Users/me/.vimo/db/backups/memex-2024-01-15.db",
  "size": 1048576,
  "timestamp": "2024-01-15T10:30:00"
}
```

### GET /api/backup/list

List available backups.

## Admin

### GET /api/admin/stats

Alias for `/api/stats`.

### POST /api/admin/fix-metadata

Re-scan sessions to fix missing metadata (e.g., cwd).

### POST /api/admin/merge-projects

Merge duplicate projects by path.

### POST /api/admin/deduplicate-projects

Remove duplicate project entries.

## MCP Protocol

See [MCP Tools](/docs/memex/mcp) for MCP integration details.

### POST /api/mcp

MCP JSON-RPC endpoint.

### GET /api/mcp

MCP GET request (via query parameters).

### GET /api/mcp/info

Get MCP server information and available tools.
