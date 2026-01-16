---
title: Architecture
description: ETerm technical architecture
navigation:
  order: 6
---

## Tech Stack

| Layer | Technology | Notes |
|-------|------------|-------|
| App | Swift, SwiftUI | macOS 14+ |
| Rendering | Rust | Performance-critical, via FFI |
| GPU | Metal | Native macOS graphics |
| IPC | Unix Domain Socket | Plugin communication |
| Plugins | Dynamic bundles | ETermKit SDK |

## High-Level Architecture

```
┌─────────────────────────────────────┐
│           ETerm.app (Swift)         │
│                                     │
│  ┌─────────┐ ┌─────────┐ ┌───────┐  │
│  │ Terminal│ │ Layout  │ │  MCP  │  │
│  └─────────┘ └─────────┘ └───────┘  │
│                                     │
│  ┌─────────────────────────────────┐│
│  │         Plugin Framework        ││
│  └─────────────────────────────────┘│
└──────────────┬──────────────────────┘
               │ FFI (C ABI)
┌──────────────▼──────────────────────┐
│     Rust Rendering Engine           │
│         (sugarloaf-ffi)             │
└──────────────┬──────────────────────┘
               │ Metal
┌──────────────▼──────────────────────┐
│              GPU                    │
└─────────────────────────────────────┘
```

## Directory Structure

```
ETerm/
├── ETerm/
│   ├── Application/     # App lifecycle, commands, events
│   ├── Core/
│   │   ├── Terminal/    # Terminal emulation (DDD)
│   │   ├── Layout/      # Panel, Tab, Divider
│   │   ├── Keyboard/    # Input, IME, Shortcuts
│   │   ├── Settings/    # Configuration
│   │   └── Events/      # EventBus
│   └── Features/
│       ├── MCP/         # MCP server implementation
│       ├── AI/          # AI integration
│       └── Plugins/     # Plugin framework
├── Plugins/             # 11 built-in plugins
├── Packages/
│   └── ETermKit/        # Plugin SDK framework
└── rio/
    └── sugarloaf-ffi/   # Rust rendering engine
```

## Core Modules

| Module | Purpose |
|--------|---------|
| Terminal | Terminal emulation, PTY management, state handling |
| Layout | Panel splitting, tab management, drag & drop |
| Keyboard | Input handling, IME support, shortcut binding |
| MCP | Model Context Protocol server for AI tools |
| Plugins | Plugin loading, lifecycle, host bridge |

## FFI Layer

Swift and Rust communicate via C ABI. The Rust layer handles:

- Terminal state and rendering
- Text selection
- GPU rendering via Metal

## Plugin System

Plugins are dynamic bundles (`.bundle`) built with ETermKit SDK. They run in the main process and can:

- Add sidebar views
- Decorate tabs
- Register commands
- Subscribe to events

See [Plugin SDK](/docs/eterm/plugins/sdk) for development guide.
