---
title: Claude Code Hooks
description: Auto-inject memory context into Claude Code sessions
navigation:
  order: 5
---

Claude Code supports [Hooks](https://docs.anthropic.com/en/docs/claude-code/hooks) that execute commands at specific events. Memex provides an HTTP API for context injection.

---

## Quick Setup

Add to `~/.claude/settings.json`:

```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "type": "command",
        "command": "curl -s -X POST http://localhost:10013/api/inject -H 'Content-Type: application/json' -d '{\"mode\":\"combine\",\"query\":\"$PROMPT\"}' 2>/dev/null || echo '{}'"
      }
    ]
  }
}
```

This injects relevant memory context based on your prompt before each Claude response.

---

## Injection Modes

| Mode | Trigger | Description |
|------|---------|-------------|
| `none` | - | Disabled (pure MCP Pull mode) |
| `full` | SessionStart | Inject recent session summaries (L3) |
| `combine` | UserPromptSubmit | Vector search, combine all sources |
| `fallback` | UserPromptSubmit | Vector search, try sources in order |

---

## API Reference

### POST /api/inject

**Request:**

```json
{
  "mode": "combine",
  "query": "your user prompt",
  "project": "/optional/project/path"
}
```

**Response:**

```json
{
  "hookSpecificOutput": {
    "hookEventName": "UserPromptSubmit",
    "additionalContext": "# Relevant Memory Context\n\n..."
  },
  "meta": {
    "count": 3,
    "estimatedTokens": 500,
    "mode": "combine"
  }
}
```

**Silent Failure:** If Memex is unavailable, returns `{}` (empty context). Claude Code continues normally.

---

## Configuration

Configure injection behavior in `~/.vimo/memex/config.json`:

```json
{
  "compact": {
    "inject": {
      "mode": "combine",
      "sources": ["summaries", "messages"],
      "similarity_threshold": 0.3,
      "distance_type": "cosine",
      "max_tokens": 2000,
      "limit_per_source": 5
    }
  }
}
```

### Options

| Option | Default | Description |
|--------|---------|-------------|
| `mode` | `none` | Default injection mode |
| `sources` | `["summaries"]` | Data sources to search |
| `similarity_threshold` | `0.3` | Minimum similarity (0-1) |
| `distance_type` | `cosine` | Vector distance: `cosine`, `euclidean`, `dot` |
| `max_tokens` | `2000` | Maximum context tokens |
| `limit_per_source` | `5` | Results per source |
| `project_scope` | `false` | Filter by current project |

### Sources

| Source | Level | Description |
|--------|-------|-------------|
| `messages` | L0 | Raw message content |
| `observations` | L1 | Tool call observations |
| `talks` | L2 | Conversation summaries |
| `sessions` | L3 | Session summaries |
| `summaries` | L1+L2+L3 | All summary levels |

---

## Example Configurations

### Minimal (Default)

```json
{
  "compact": {
    "inject": {
      "mode": "none"
    }
  }
}
```

### Session Start Summary

```json
{
  "hooks": {
    "SessionStart": [
      {
        "type": "command",
        "command": "curl -s -X POST http://localhost:10013/api/inject -H 'Content-Type: application/json' -d '{\"mode\":\"full\"}' 2>/dev/null || echo '{}'"
      }
    ]
  }
}
```

### Full Context Injection

```json
{
  "hooks": {
    "SessionStart": [
      {
        "type": "command",
        "command": "curl -s -X POST http://localhost:10013/api/inject -H 'Content-Type: application/json' -d '{\"mode\":\"full\"}' 2>/dev/null || echo '{}'"
      }
    ],
    "UserPromptSubmit": [
      {
        "type": "command",
        "command": "curl -s -X POST http://localhost:10013/api/inject -H 'Content-Type: application/json' -d '{\"mode\":\"combine\",\"query\":\"$PROMPT\"}' 2>/dev/null || echo '{}'"
      }
    ]
  }
}
```

---

## Requirements

- Memex HTTP server running (`http://localhost:10013`)
- Compact feature enabled for L1/L2/L3 sources
- Ollama with embedding model for vector search

---

## Troubleshooting

### No context injected

```bash
# Test API directly
curl -X POST http://localhost:10013/api/inject \
  -H 'Content-Type: application/json' \
  -d '{"mode":"combine","query":"test query"}'

# Check compact status
curl http://localhost:10013/api/compact/status

# Check embedding status
curl http://localhost:10013/api/embedding/status
```

### Low quality results

1. Adjust `similarity_threshold` (lower = more results)
2. Add more `sources` to search
3. Ensure Compact has generated summaries
