---
title: Installation
description: Install Memex via Docker, Homebrew, or build from source
navigation:
  order: 2
---

## Memex Full

Full server with MCP integration, Web UI, semantic search, and RAG.

### Homebrew (macOS / Linux)

```bash
brew install vimo-ai/tap/memex
```

### Docker

::code-group
```bash [macOS / Linux]
docker run -d -p 10013:10013 \
  -v ~/.vimo:/data \
  -v ~/.claude/projects:/claude:ro \
  -v ~/.codex:/codex:ro \                              # 可选: Codex
  -v ~/.local/share/opencode:/opencode:ro \            # 可选: OpenCode
  -v ~/.gemini/tmp:/gemini:ro \                        # 可选: Gemini
  -e OLLAMA_HOST=http://host.docker.internal:11434 \   # 可选: 本机 Ollama (Docker Desktop)
  ghcr.io/vimo-ai/memex:latest
```
```ps1 [Windows (PowerShell)]
docker run -d -p 10013:10013 `
  -v "$env:USERPROFILE\.vimo:/data" `
  -v "$env:USERPROFILE\.claude\projects:/claude:ro" `
  -v "$env:USERPROFILE\.codex:/codex:ro" `             # 可选: Codex
  -v "$env:LOCALAPPDATA\opencode:/opencode:ro" `       # 可选: OpenCode
  -v "$env:USERPROFILE\.gemini\tmp:/gemini:ro" `       # 可选: Gemini
  -e OLLAMA_HOST=http://host.docker.internal:11434 `   # 可选: 本机 Ollama (Docker Desktop)
  ghcr.io/vimo-ai/memex:latest
```
::

| Mount | Purpose |
|-------|---------|
| `~/.vimo:/data` | Memex data directory (required) |
| `~/.claude/projects:/claude` | Claude Code sessions |
| `~/.codex:/codex` | Codex CLI sessions (optional) |
| `~/.local/share/opencode:/opencode` | OpenCode sessions (optional) |
| `~/.gemini/tmp:/gemini` | Gemini CLI sessions (optional) |

### Binary

Download from [GitHub Releases](https://github.com/vimo-ai/memex/releases). Available for macOS (arm64/x64), Linux (x64/arm64), and Windows (x64).

### Verify

```bash
curl http://localhost:10013/health
# OK
```

### MCP Integration

::code-group
```bash [Claude Code]
claude mcp add memex -- npx -y mcp-remote http://localhost:10013/api/mcp
```
```bash [Codex]
codex mcp add memex -- npx -y mcp-remote http://localhost:10013/api/mcp
```
```bash [Gemini]
gemini mcp add --transport http memex http://localhost:10013/api/mcp
```
```json [OpenCode]
// Edit ~/.config/opencode/opencode.json
{
  "mcp": {
    "memex": {
      "type": "remote",
      "url": "http://localhost:10013/api/mcp"
    }
  }
}
```
::

Then search in your AI CLI:

```
use memex search "anything you want"
```

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

The background agent (`vimo-agent`) is downloaded automatically on first run. If auto-download fails, download manually from [ai-cli-session-db Releases](https://github.com/vimo-ai/ai-cli-session-db/releases) and place it at `~/.vimo/bin/vimo-agent`.

::callout{type="info"}
Docker users don't need to worry about this - `vimo-agent` is bundled in the image.
::

