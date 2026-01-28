---
title: API Reference
description: Memex REST API endpoints
navigation:
  order: 4
---

Memex exposes a REST API on port `10013`. All responses are JSON.

## Health & Stats

```bash
GET /health              # Returns "OK"
GET /api/stats           # Database statistics
```

---

## Projects

```bash
GET /api/projects                    # List all projects
GET /api/projects/{id}               # Get project details
GET /api/projects/{id}/sessions      # Get project sessions
```

---

## Sessions

```bash
GET /api/sessions                    # List sessions
GET /api/sessions/search?idPrefix=   # Search by ID prefix
GET /api/sessions/{id}               # Get session details
GET /api/sessions/{id}/messages      # Get session messages
```

**Query parameters for `/api/sessions`:**

| Parameter | Default | Description |
|-----------|---------|-------------|
| `projectId` | - | Filter by project |
| `limit` | 50 | Max results |

**Query parameters for `/api/sessions/{id}/messages`:**

| Parameter | Default | Description |
|-----------|---------|-------------|
| `limit` | 50 | Max messages |
| `offset` | 0 | Skip first N |
| `order` | asc | `asc` or `desc` |

---

## Search

```bash
GET /api/search?q=keyword            # Full-text search (FTS5)
GET /api/search/semantic?q=keyword   # Semantic search
GET /api/search/hybrid?q=keyword     # Hybrid search
GET /api/search/semantic/status      # Check semantic search status
```

**Query parameters:**

| Parameter | Default | Description |
|-----------|---------|-------------|
| `q` | required | Search query |
| `limit` | 20 | Max results |
| `projectId` | - | Filter by project |
| `mode` | - | `fts`, `vector`, `hybrid` |
| `startDate` | - | Filter start date |
| `endDate` | - | Filter end date |

---

## RAG Q&A

```bash
GET /api/ask?q=question              # Quick Q&A
POST /api/ask                        # Q&A with options
GET /api/ask/status                  # Check AI Q&A status
```

**POST body:**
```json
{
  "question": "How did I implement login?",
  "contextWindow": 3,
  "maxSources": 5,
  "projectId": 1
}
```

---

## Collection & Indexing

```bash
POST /api/collect                    # Trigger session collection
POST /api/index                      # Index specific session
POST /api/index/all                  # Full vector indexing
POST /api/index/batch?limit=100      # Batch indexing
```

---

## Embedding

```bash
GET /api/embedding/status            # Service status
GET /api/embedding/stats             # Indexing statistics
POST /api/embedding/trigger          # Trigger batch indexing
POST /api/embedding/trigger-all      # Start full indexing
GET /api/embedding/failed            # List failed attempts
POST /api/embedding/reset-failed     # Reset for re-indexing
POST /api/embedding/compact          # Compact LanceDB
```

---

## Backup

```bash
POST /api/backup                     # Create backup
GET /api/backup/list                 # List backups
```

---

## MCP

```bash
POST /api/mcp                        # MCP JSON-RPC endpoint
GET /api/mcp/info                    # Server info & tools
```

See [MCP Tools](/docs/memex/mcp) for details.
