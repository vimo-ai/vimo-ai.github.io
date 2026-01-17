---
title: Architecture
description: Memex internal architecture and module dependencies
navigation:
  order: 6
---

This document describes Memex's internal architecture, auto-generated from source code analysis.

## Module Overview

Memex is organized into the following modules:

| Module | Responsibility |
|--------|----------------|
| `main` | Entry point, CLI, scheduler setup |
| `api` | HTTP REST API (Axum) |
| `shared_adapter` | SQLite database access layer |
| `indexer` | Vector embedding and indexing |
| `embedding` | Ollama integration for embeddings |
| `vector` | LanceDB vector storage |
| `search` | Full-text + semantic search |
| `rag` | RAG-based Q&A |
| `collector` | JSONL session parsing |
| `archive` | Incremental backup & compression |
| `mcp` | MCP server protocol |
| `watcher` | File system monitoring |

## Module Dependencies

```mermaid
flowchart TD
    main[main]
    api[api]
    shared_adapter[shared_adapter]
    indexer[indexer]
    embedding[embedding]
    vector[vector]
    search[search]
    rag[rag]
    collector[collector]
    archive[archive]
    mcp[mcp]
    watcher[watcher]
    config[config]
    backup[backup]
    compressor[archive::compressor]
    state[archive::state]
    domain[domain]
    adapter_registry[adapter::registry]

    main -->|20| archive
    main -->|6| config
    main -->|6| shared_adapter
    main -->|5| indexer
    main -->|4| embedding
    main -->|3| collector
    main -->|2| backup
    main -->|2| watcher
    main -->|1| api
    main -->|1| rag
    main -->|1| search
    main -->|1| vector

    api -->|21| shared_adapter
    api -->|9| indexer
    api -->|4| embedding
    api -->|3| collector
    api -->|3| vector
    api -->|2| search
    api -->|2| rag
    api -->|2| backup

    indexer -->|13| shared_adapter
    indexer -->|6| embedding
    indexer -->|6| vector

    mcp -->|8| shared_adapter

    collector -->|4| shared_adapter
    collector -->|2| adapter_registry

    search -->|4| shared_adapter
    search -->|2| embedding
    search -->|2| vector
    search -->|1| domain

    rag -->|2| search
    rag -->|1| embedding
    rag -->|1| shared_adapter

    watcher -->|1| collector
    watcher -->|1| indexer

    archive -->|6| compressor
    archive -->|6| state
```

Edge labels indicate the number of cross-module function calls.

## Key Insights

### Central Dependencies

**`shared_adapter`** is the most depended-upon module:
- `api` calls it 21 times
- `indexer` calls it 13 times
- `mcp` calls it 8 times

This is the SQLite database abstraction layer - all data persistence flows through it.

### Data Flow

```
                    ┌─────────────┐
                    │   watcher   │ (file changes)
                    └──────┬──────┘
                           ↓
┌─────────────┐     ┌─────────────┐
│  collector  │ ←── │    main     │ (scheduled)
└──────┬──────┘     └─────────────┘
       ↓
┌─────────────┐     ┌─────────────┐
│shared_adapter│ ←── │   indexer   │
└──────┬──────┘     └──────┬──────┘
       │                   ↓
       │            ┌─────────────┐
       │            │  embedding  │ → Ollama
       │            └──────┬──────┘
       │                   ↓
       │            ┌─────────────┐
       └──────────→ │   vector    │ → LanceDB
                    └─────────────┘
```

### API Layer

The `api` module is the HTTP interface, coordinating:
- `indexer` for embedding operations
- `search` for queries
- `rag` for Q&A
- `mcp` for MCP protocol

## Scheduler Tasks

The `main` module sets up periodic tasks:

| Task | Frequency | Modules Involved |
|------|-----------|------------------|
| `collect_all` | 30s | collector → shared_adapter |
| `index_pending` | 60s | indexer → embedding → vector |
| `backup` | daily | backup |
| `check_and_archive_all` | hourly | archive → compressor |
| `compact` | daily | vector |

See [Scheduler Internals](/docs/memex/internals/scheduler) for detailed call trees.

---

*Auto-generated using [iris](https://github.com/vimo-ai/iris) architecture analysis.*
