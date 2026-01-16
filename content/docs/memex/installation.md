---
title: Installation
description: How to install and run Memex
navigation:
  order: 2
---

Memex can be installed via Docker (recommended) or built from source.

## Quick Start with Docker

```bash
docker run -d -p 10013:10013 \
  -v ~/.claude:/data/claude \
  -v ~/.vimo:/data/vimo \
  -e CLAUDE_PROJECTS_PATH=/data/claude/projects \
  -e VIMO_HOME=/data/vimo \
  ghcr.io/vimo-ai/memex:latest
```

This mounts:
- `~/.claude` → `/data/claude` - Claude Code session data
- `~/.vimo` → `/data/vimo` - Memex database and vector store

**Important**:
- `VIMO_HOME` sets the base directory for SQLite DB and all data
- `CLAUDE_PROJECTS_PATH` tells Memex where to find Claude Code sessions
- Memex also auto-detects Codex CLI (`~/.codex`) and OpenCode (`~/.local/share/opencode`) if present
- Without these, Memex won't find your data inside the container

## Build from Source

### Prerequisites

- Rust 1.75+
- SQLite 3.35+ (with FTS5 support)
- Ollama (optional, for semantic search)

### Clone and Build

```bash
git clone https://github.com/vimo-ai/memex.git
cd memex/memex-rs
cargo build --release
```

### Run

```bash
./target/release/memex serve
```

The server starts on `http://localhost:10013` by default.

## Ollama Setup (Optional)

For semantic search and RAG Q&A, install Ollama and pull the embedding model:

```bash
# Install Ollama (macOS)
brew install ollama

# Start Ollama service
ollama serve

# Pull embedding model (required for semantic search)
ollama pull bge-m3

# Pull chat model (optional, for AI Q&A)
ollama pull qwen3:8b
```

Memex automatically detects Ollama at `http://localhost:11434`.

## Verify Installation

Check if Memex is running:

```bash
curl http://localhost:10013/health
# Response: OK

curl http://localhost:10013/api/stats
# Response: {"projectCount":5,"sessionCount":42,"messageCount":1337,...}
```

## System Service (macOS)

Create a LaunchAgent for auto-start:

```xml
<!-- ~/Library/LaunchAgents/com.vimo.memex.plist -->
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.vimo.memex</string>
    <key>ProgramArguments</key>
    <array>
        <string>/usr/local/bin/memex</string>
        <string>serve</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
    <key>StandardOutPath</key>
    <string>/tmp/memex.log</string>
    <key>StandardErrorPath</key>
    <string>/tmp/memex.err</string>
</dict>
</plist>
```

Load the service:

```bash
launchctl load ~/Library/LaunchAgents/com.vimo.memex.plist
```

## System Service (Linux)

Create a systemd service:

```ini
# /etc/systemd/system/memex.service
[Unit]
Description=Memex AI CLI Session History Manager
After=network.target

[Service]
Type=simple
User=youruser
ExecStart=/usr/local/bin/memex serve
Restart=always
Environment="MEMEX_DATA_DIR=/var/lib/memex"
Environment="CLAUDE_PROJECTS_PATH=/home/youruser/.claude/projects"

[Install]
WantedBy=multi-user.target
```

Enable and start:

```bash
sudo systemctl enable memex
sudo systemctl start memex
```

## Next Steps

- [Configuration](/docs/memex/configuration) - Environment variables and options
- [API Reference](/docs/memex/api) - REST API endpoints
- [MCP Tools](/docs/memex/mcp) - Claude Code integration
