---
title: Configuration
description: Memex environment variables and options
navigation:
  order: 3
---

Memex is configured via environment variables. All settings have sensible defaults.

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
| `CHAT_MODEL` | `qwen3:8b` | Model for AI Q&A |
| `ENABLE_AI_CHAT` | `false` | Enable AI Q&A feature |

---

## Models

- **Embedding**: `bge-m3` (default). For faster/smaller: `nomic-embed-text`
- **Chat**: `qwen3:8b` (default). For faster/smaller: `llama3.2:3b`

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

