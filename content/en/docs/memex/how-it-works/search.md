---
title: Search
description: Full-text, semantic, and hybrid search
navigation:
  order: 4
---

Memex supports three search modes across multiple data levels.

---

## Search Modes

| Mode | Engine | Best for |
|------|--------|----------|
| `fts` | SQLite FTS5 | Exact keywords, code snippets |
| `vector` | LanceDB | Semantic similarity, concepts |
| `hybrid` | Both combined | General search (default) |

---

## Hybrid Ranking

Hybrid mode combines FTS and vector results using Reciprocal Rank Fusion (RRF):

```
score = Σ 1/(k + rank)
```

Where `k=60` balances precision vs recall. Results from both engines are merged and re-ranked by combined score.

---

## Search Levels

What gets searched depends on the `level` parameter. See [Compact](/docs/memex/how-it-works/compact#how-to-search) for details.

| Level | Searches | Best for |
|-------|----------|----------|
| `sessions` | L3 summaries | Finding relevant sessions |
| `talks` | L2 summaries | Specific solutions |
| `raw` | L0 messages | Exact wording |

**Fallback:** If no results at current level, automatically tries the next level down.

---

## Vector Search Requirements

Vector search requires:
1. Ollama with `bge-m3` embedding model
2. Compact enabled to generate embeddings

Without these, only FTS mode is available.
