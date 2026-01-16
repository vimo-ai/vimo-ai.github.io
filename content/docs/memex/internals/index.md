---
title: Internals
description: Deep dive into Memex implementation details
navigation:
  order: 7
---

This section covers the internal implementation details of Memex. These documents are intended for developers who want to understand how Memex works under the hood or contribute to the project.

## Topics

- [Scheduler](/docs/memex/internals/scheduler) - Background task scheduling and execution

## Overview

Memex is built with a modular architecture:

```
┌─────────────────────────────────────────┐
│                  API                     │
│            (Axum HTTP Server)            │
└─────────────────┬───────────────────────┘
                  │
    ┌─────────────┼─────────────┐
    ▼             ▼             ▼
┌───────┐   ┌─────────┐   ┌─────────┐
│Search │   │   RAG   │   │   MCP   │
└───┬───┘   └────┬────┘   └────┬────┘
    │            │             │
    └────────────┼─────────────┘
                 ▼
         ┌───────────────┐
         │ Hybrid Search │
         │  Service      │
         └───────┬───────┘
                 │
    ┌────────────┼────────────┐
    ▼            ▼            ▼
┌───────┐  ┌──────────┐  ┌─────────┐
│  FTS  │  │  Vector  │  │ Indexer │
│(SQLite)│  │(LanceDB) │  │         │
└───────┘  └──────────┘  └─────────┘
```

## Background Services

Memex runs several background tasks managed by the Scheduler:

| Task | Interval | Purpose |
|------|----------|---------|
| Collect | 30s | Scan for new Claude Code sessions |
| Index | 60s | Embed new messages into vector store |
| Backup | 1 day | Create database backup |
| Archive | 1 hour | Archive old sessions |
| Compact | 1 day | Optimize LanceDB storage |

See [Scheduler Internals](/docs/memex/internals/scheduler) for detailed call graphs.
