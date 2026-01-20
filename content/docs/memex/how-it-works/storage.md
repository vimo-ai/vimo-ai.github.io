---
title: Storage
description: How Memex stores conversation data
navigation:
  order: 2
---

Memex uses two storage backends: SQLite for structured data and full-text search, LanceDB for vector embeddings.

---

## SQLite

Primary storage for all conversation data.

**Path:** `~/.vimo/db/ai-cli-session.db`

**Stores:**
- Messages (original content)
- Sessions (metadata, model, cwd)
- Projects (path, source tool)

**Features:**
- FTS5 full-text search index
- Writer coordination for multi-process access

Powered by [ai-cli-session-db](https://github.com/vimo-ai/ai-cli-session-db).

**Size reference:** A real-world database with 405k messages across 17k sessions takes about 3.3GB.

---

## LanceDB

Vector storage for semantic search.

**Path:** `~/.vimo/lancedb/`

**Stores:**
- Message embeddings (1024-dim vectors from `bge-m3`)
- Compact summary embeddings (L1/L2/L3)

Only populated when Ollama embedding model is available.
