---
title: Architecture
description: How MCP Router is built
navigation:
  order: 5
---

## Overview

MCP Router is a macOS menu bar app with a Rust core.

- **Swift/SwiftUI** — The UI, HTTP server, process management
- **Rust** — MCP protocol handling via FFI

```
┌───────────────────────────────────────────┐
│             MCP Router App                │
├───────────────────────────────────────────┤
│  SwiftUI         │  HTTP Server           │
│  (Menu Bar UI)   │  (localhost:19104)     │
├───────────────────────────────────────────┤
│            Process Manager                │
│      (Spawns and manages servers)         │
├───────────────────────────────────────────┤
│            Rust Core (FFI)                │
│   (MCP protocol, JSON-RPC, stdio)         │
└───────────────────────────────────────────┘
              │
              ▼
    ┌─────────┬─────────┐
    │ Server  │ Server  │  (stdio or http)
    └─────────┴─────────┘
```

---

## HTTP Server

Listens on `localhost:19104`. Receives JSON-RPC requests from MCP clients (Claude Code, Codex, etc.).

When a request comes in:
1. Look at the `X-Workspace-Token` header
2. Find the matching workspace
3. Route to the right servers
4. Return the response

The 4 meta tools (`list_servers`, `list_tools`, `describe`, `call`) are handled by the router itself. Tool calls get forwarded to backend servers.

---

## Process Manager

Spawns MCP server processes and keeps track of them.

For stdio servers, it runs the command and talks to the process via stdin/stdout. For http servers, it just sends HTTP requests to the configured URL.

---

## Rust Core

The MCP protocol has some fiddly parts — JSON-RPC message framing, request-response correlation, proper error handling over stdio.

Rust handles this. Swift calls into Rust via C FFI for the protocol work.

---

## Data Storage

Server configs and workspace settings are stored locally. The menu bar app manages everything — no external database.

File locations:
- `~/.vimo/mcp-router/` — Settings, workspaces, servers config

---

## Source Layout

```
mcp-router/
├── core/                 # Rust core (FFI)
│   └── src/
├── mcp-router/           # Swift app
│   ├── Models/           # Data models
│   ├── Views/            # SwiftUI views
│   └── Services/         # HTTP server, process manager, etc.
└── scripts/              # Build scripts
```

---

Want to dig deeper? Check the [GitHub repo](https://github.com/vimo-ai/mcp-router).
