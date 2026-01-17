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
| `VIMO_HOME` | `~/.vimo` | Base directory for all Vimo data |
| `MEMEX_DATA_DIR` | `~/.vimo/db` | Data directory (LanceDB, backups, archive) |
| `MEMEX_WEB_DIR` | `~/.vimo/memex/web` | Web frontend static files |
| `CLAUDE_PROJECTS_PATH` | `~/.claude/projects` | Claude Code session data location |
| `CODEX_PATH` | `~/.codex` | Codex CLI data location |
| `OPENCODE_PATH` | `~/.local/share/opencode` | OpenCode data location |
| `GEMINI_PATH` | `~/.gemini/history` | Gemini CLI data location |
| `OLLAMA_API` | `http://localhost:11434` | Ollama API endpoint |
| `EMBEDDING_MODEL` | `bge-m3` | Ollama model for embeddings |
| `CHAT_MODEL` | `qwen3:8b` | Ollama model for AI Q&A |
| `ENABLE_AI_CHAT` | `false` | Enable AI Q&A feature (`true` or `1`) |

## Data Paths

Memex separates data storage from web frontend:

| Path | Description |
|------|-------------|
| `{VIMO_HOME}/db/ai-cli-session.db` | SQLite database (shared with other Vimo tools) |
| `{VIMO_HOME}/db/lancedb/` | LanceDB vector store |
| `{VIMO_HOME}/db/backups/` | Database backups |
| `{VIMO_HOME}/db/archive/` | Session archives |
| `{VIMO_HOME}/memex/web/` | Web frontend static files |
| `{CLAUDE_PROJECTS_PATH}/` | Claude Code session files (source) |
| `{CODEX_PATH}/` | Codex CLI session files (source) |
| `{OPENCODE_PATH}/` | OpenCode session files (source) |
| `{GEMINI_PATH}/` | Gemini CLI session files (source) |

**Architecture**: Database (`~/.vimo/db/`) is shared across Vimo tools. Web UI (`~/.vimo/memex/web/`) is Memex-specific.

**For most users**: Just set `VIMO_HOME` (default: `~/.vimo`). Everything works automatically.

## Minimal Setup

No configuration needed for basic usage:

```bash
# Just run with defaults
./memex serve
```

Memex will:
1. Start on port 10013
2. Store data in `~/.vimo/db/`
3. Scan all supported AI CLI data directories for sessions
4. Enable FTS (full-text search) immediately

## With Ollama

For semantic search, ensure Ollama is running:

```bash
# Start Ollama
ollama serve

# Pull embedding model
ollama pull bge-m3

# Run Memex (auto-detects Ollama)
./memex serve
```

## With AI Q&A

Enable the AI chat feature:

```bash
# Pull chat model
ollama pull qwen3:8b

# Enable AI Q&A
ENABLE_AI_CHAT=true ./memex serve
```

## Custom Port

```bash
PORT=8080 ./memex serve
```

## Custom Data Directory

```bash
MEMEX_DATA_DIR=/var/lib/memex ./memex serve
```

## Docker Configuration

Pass environment variables to Docker:

```bash
docker run -d \
  -p 10013:10013 \
  -v ~/.claude:/data/claude:ro \
  -v ~/.vimo/db:/data/db \
  -v ~/.vimo/memex/web:/data/web:ro \
  -e MEMEX_DATA_DIR=/data/db \
  -e MEMEX_WEB_DIR=/data/web \
  -e CLAUDE_PROJECTS_PATH=/data/claude/projects \
  -e OLLAMA_API=http://host.docker.internal:11434 \
  -e EMBEDDING_MODEL=bge-m3 \
  -e ENABLE_AI_CHAT=true \
  -e CHAT_MODEL=qwen3:8b \
  ghcr.io/vimo-ai/memex:latest
```

**Path mapping**:
- `MEMEX_DATA_DIR=/data/db` - Database, LanceDB, backups (read-write)
- `MEMEX_WEB_DIR=/data/web` - Web frontend (read-only, built separately)
- `CLAUDE_PROJECTS_PATH=/data/claude/projects` - Session source (read-only)

**Linux note**: `host.docker.internal` works on Docker Desktop (macOS/Windows). On native Linux, use `--add-host=host.docker.internal:host-gateway` or your host's IP address.

## Model Recommendations

### Embedding Models

| Model | Size | Quality | Speed |
|-------|------|---------|-------|
| `bge-m3` | 1.3GB | Excellent | Fast |
| `nomic-embed-text` | 274MB | Good | Very Fast |
| `mxbai-embed-large` | 670MB | Very Good | Fast |

### Chat Models (for AI Q&A)

| Model | Size | Quality | Speed |
|-------|------|---------|-------|
| `qwen3:8b` | 4.7GB | Excellent | Moderate |
| `llama3.2:3b` | 2GB | Good | Fast |
| `gemma2:9b` | 5.4GB | Very Good | Moderate |

## Checking Configuration

Verify current settings via the stats API:

```bash
curl http://localhost:10013/api/stats
```

Response shows enabled features:

```json
{
  "projectCount": 5,
  "sessionCount": 42,
  "messageCount": 1337,
  "semanticSearchEnabled": true,
  "aiChatEnabled": false
}
```

Check embedding status:

```bash
curl http://localhost:10013/api/embedding/status
```

```json
{
  "available": true,
  "model": "bge-m3",
  "ollamaConnected": true,
  "indexedCount": 5000
}
```

## Troubleshooting

### Semantic search not available

1. Check Ollama is running: `curl http://localhost:11434/api/tags`
2. Verify model is pulled: `ollama list`
3. Check connection: `curl http://localhost:10013/api/search/semantic/status`

### Database location

The SQLite database is at `{VIMO_HOME}/db/ai-cli-session.db` (default: `~/.vimo/db/ai-cli-session.db`). This is shared with other Vimo tools.

For Docker: set `MEMEX_DATA_DIR=/data/db` and mount `~/.vimo/db:/data/db`.

### Web UI not loading

If the web UI shows blank:
1. Check web directory exists: `ls ~/.vimo/memex/web/`
2. Should contain `index.html` and `assets/`
3. Build frontend: `cd memex/web && pnpm build`
4. Deploy: `./scripts/build.sh memex`

### No sessions showing up

If `/api/stats` shows `sessionCount: 0`:

1. Check data paths exist:
   - Claude Code: `ls ~/.claude/projects/`
   - Codex CLI: `ls ~/.codex/`
   - OpenCode: `ls ~/.local/share/opencode/`
   - Gemini CLI: `ls ~/.gemini/history/`
2. Trigger manual collection: `curl -X POST http://localhost:10013/api/collect`
3. For Docker: ensure environment variables point to container paths
4. Check logs for path errors

### Slow indexing

If vector indexing is slow:
1. Use a smaller batch size: `POST /api/index/batch?limit=50`
2. Monitor progress: `GET /api/embedding/stats`
3. Consider a faster embedding model like `nomic-embed-text`
