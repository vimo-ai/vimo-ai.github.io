---
title: Installation
description: Install Memex via Docker, Homebrew, or build from source
navigation:
  order: 2
---

## Memex Full

Full server with MCP integration, Web UI, semantic search, and RAG.

::code-group
```bash [Homebrew]
brew install vimo-ai/tap/memex
```
```bash [macOS Apple Silicon]
mkdir -p ~/.vimo/bin && curl -L -o ~/.vimo/bin/memex \
  https://github.com/vimo-ai/memex/releases/latest/download/memex-darwin-arm64 && \
  chmod +x ~/.vimo/bin/memex
```
```bash [macOS Intel]
mkdir -p ~/.vimo/bin && curl -L -o ~/.vimo/bin/memex \
  https://github.com/vimo-ai/memex/releases/latest/download/memex-darwin-x64 && \
  chmod +x ~/.vimo/bin/memex
```
```bash [Linux x64]
mkdir -p ~/.vimo/bin && curl -L -o ~/.vimo/bin/memex \
  https://github.com/vimo-ai/memex/releases/latest/download/memex-linux-x64 && \
  chmod +x ~/.vimo/bin/memex
```
```bash [Linux arm64]
mkdir -p ~/.vimo/bin && curl -L -o ~/.vimo/bin/memex \
  https://github.com/vimo-ai/memex/releases/latest/download/memex-linux-arm64 && \
  chmod +x ~/.vimo/bin/memex
```
::

```bash
memex search "anything you want"
memex list -n 10
```

The background agent (`vimo-agent`) will be downloaded automatically on first run.

### Docker (Linux / All Platforms)

```bash
docker run -d -p 10013:10013 \
  -v ~/.vimo:/data \
  -v ~/.claude/projects:/claude:ro \
  -v ~/.codex:/codex:ro \
  -v ~/.local/share/opencode:/opencode:ro \
  -v ~/.gemini/tmp:/gemini:ro \
  ghcr.io/vimo-ai/memex:latest
```

| Mount | Purpose |
|-------|---------|
| `~/.vimo:/data` | Memex data directory (database at `/data/db/`) |
| `~/.claude/projects:/claude` | Claude Code sessions |
| `~/.codex:/codex` | Codex CLI sessions |
| `~/.local/share/opencode:/opencode` | OpenCode sessions |
| `~/.gemini/tmp:/gemini` | Gemini CLI sessions |

Only mount the CLIs you use. Database mount is required.

### Verify

```bash
curl http://localhost:10013/health
# OK
```

### MCP Integration

See [Quick Start](/docs/memex#full-macos) for MCP configuration.

---

## Memex Lite

Zero-dependency standalone CLI for quick searches. Reads local session files directly, no server needed.

```bash
brew install vimo-ai/tap/memex-lite

memex search "anything you want"
memex list -n 10
```

---

## Build from Source

```bash
git clone https://github.com/vimo-ai/memex.git
cd memex

# Full server
cd memex-rs && cargo build --release
./target/release/memex

# Lite CLI only
cd memex-lite && cargo build --release
./target/release/memex --help
```

Requires Rust 1.75+ and SQLite 3.35+ with FTS5.

---

## Ollama (Optional)

For semantic search and RAG:

```bash
brew install ollama
ollama serve
ollama pull bge-m3      # embeddings
ollama pull qwen3:0.6b  # chat (optional)
```

Memex auto-detects Ollama at `http://localhost:11434`.

---

## Troubleshooting

### vimo-agent auto-download failed

The background agent (`vimo-agent`) is downloaded automatically on first run. If auto-download fails, you can install it manually:

```bash
curl -L -o ~/.vimo/bin/vimo-agent \
  https://github.com/vimo-ai/ai-cli-session-db/releases/latest/download/vimo-agent
chmod +x ~/.vimo/bin/vimo-agent
```

