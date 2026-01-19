---
title: Configuration
description: Memex environment variables and options
navigation:
  order: 3
---

Memex supports configuration via environment variables or config file. All settings have sensible defaults.

**Priority:** Environment variables > Config file > Defaults

---

## Config File

Optional JSON config at `~/.vimo/memex/config.json`:

```json
{
  "server": {
    "port": 10013
  },
  "ollama": {
    "api": "http://localhost:11434",
    "embedding_model": "bge-m3",
    "chat_model": "qwen3:0.6b"
  },
  "features": {
    "enable_ai_chat": false
  },
  "compact": {
    "enabled": false,
    "fts_tokenizer": "trigram"
  }
}
```

---

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `10013` | HTTP server port |
| `VIMO_HOME` | `~/.vimo` | Base directory for all data |
| `CLAUDE_PROJECTS_PATH` | `~/.claude/projects` | Claude Code sessions |
| `CODEX_PATH` | `~/.codex` | Codex CLI sessions |
| `OPENCODE_PATH` | `~/.local/share/opencode` | OpenCode sessions |
| `GEMINI_TMP_PATH` | `~/.gemini/tmp` | Gemini CLI sessions |
| `OLLAMA_API` | `http://localhost:11434` | Ollama API endpoint |
| `EMBEDDING_MODEL` | `bge-m3` | Model for embeddings |
| `CHAT_MODEL` | `qwen3:0.6b` | Model for AI Q&A |
| `ENABLE_AI_CHAT` | `false` | Enable AI Q&A feature |
| `COMPACT_ENABLED` | `false` | Enable LLM Compact feature |

---

## FTS Tokenizer

Controls how full-text search indexes text. Configure via `compact.fts_tokenizer` in config file.

| Tokenizer | Language | Matching | Index Size |
|-----------|----------|----------|------------|
| `trigram` (default) | CJK + English | Substring | Larger |
| `unicode61` | English only | Word boundary | Smaller |

Use `trigram` if you search in Chinese, Japanese, or Korean. Use `unicode61` for English-only projects with smaller index size.

---

## Compact (Experimental)

LLM-powered session summarization. Inspired by [claude-mem](https://github.com/thedotmack/claude-mem). Disabled by default.

```json
{
  "compact": {
    "enabled": true,
    "l2_talk_summary": true,
    "l3_session_summary": true
  }
}
```

Requires a chat model (Ollama or cloud provider). When enabled, generates summaries for MCP search results.

---

## Models

- **Embedding**: `bge-m3` (default). For faster/smaller: `nomic-embed-text`
- **Chat**: `qwen3:0.6b` (default). For faster/smaller: `llama3.2:3b`

---

## Verify

```bash
# Health check
curl http://localhost:10013/health

# Stats
curl http://localhost:10013/api/stats

# Embedding status
curl http://localhost:10013/api/embedding/status
```

---

## Troubleshooting

### Semantic search not working

```bash
# Check Ollama
curl http://localhost:11434/api/tags

# Check model
ollama list
```

### No sessions found

```bash
# Check data paths exist
ls ~/.claude/projects/
ls ~/.codex/
ls ~/.local/share/opencode/
ls ~/.gemini/tmp/

# Trigger manual collection
curl -X POST http://localhost:10013/api/collect
```

