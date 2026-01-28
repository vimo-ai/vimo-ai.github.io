---
title: How it Works
description: Understanding how Memex collects, stores, and searches your conversations
navigation:
  order: 6
---

## Overview

Memex gives your AI coding assistants long-term memory by:

1. **Collecting** raw conversations from Claude Code, Codex, and other tools
2. **Storing** everything in a local SQLite database (never losing original data)
3. **Optionally generating** multi-level summaries for better search
4. **Searching** via full-text, semantic vectors, or both

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  JSONL/JSON │ ──▶ │   SQLite    │ ──▶ │   Search    │
│   (source)  │     │  (messages) │     │  FTS + MCP  │
└─────────────┘     └──────┬──────┘     └─────────────┘
                          │
                          ▼ (optional)
                   ┌─────────────┐     ┌─────────────┐
                   │   Compact   │ ──▶ │  LanceDB    │
                   │  L1/L2/L3   │     │  (vectors)  │
                   └─────────────┘     └─────────────┘
```

**"Never Compacted"** means: your original conversations are always preserved. The Compact layer is optional and additive — it generates summaries to enhance search, but never replaces the source data.

---

## Contents

- [Collection](/docs/memex/how-it-works/collection) - Where data comes from and how it's collected
- [Storage](/docs/memex/how-it-works/storage) - SQLite and LanceDB architecture
- [Compact](/docs/memex/how-it-works/compact) - Multi-level summary system (L0-L3)
- [Search](/docs/memex/how-it-works/search) - Full-text, semantic, and hybrid search
