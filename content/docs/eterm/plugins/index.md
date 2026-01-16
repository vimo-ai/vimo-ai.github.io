---
title: Plugins
description: ETerm built-in plugins
navigation:
  order: 4
---

ETerm ships with 11 built-in plugins. Download them from within the app.

## AI Integration

### ClaudeKit

Claude Code integration.

Detects Claude Code sessions and shows status in the tab:
- Thinking (blue)
- Waiting for input (yellow)
- Completed (orange)

When multiple sessions are running, you can see which ones need attention without switching tabs. Sessions are automatically restored when you reopen ETerm.

Works automatically — no configuration needed.

### ClaudeMonitorKit

Usage tracking for Claude Code.

Shows your weekly usage pattern:
- Hourly usage over the past 5 hours
- Historical usage chart
- Pace prediction (will you finish your quota this week?)

Configure time calculations to skip weekends or sleep hours for more accurate pacing.

### MemexKit

Search your terminal history with [Memex](/docs/memex).

Memex indexes everything that happens in your terminal. This plugin brings that search into ETerm.

Requires Memex to be running.

### VlaudeKit

Remote session control via [Vlaude](/docs/vlaude).

Control ETerm sessions from another machine. Approve permission requests remotely.

Requires Vlaude to be configured.

### MCPRouterKit

MCP server management with progressive disclosure.

Instead of exposing all MCP tools at once (which costs tokens), MCPRouterKit shows Claude a summary first. Claude requests tool details only when needed.

See [MCP Router](/docs/mcp-router) for details.

## Productivity

**WorkspaceKit** — Project folder management. Add folders via drag-and-drop or file picker. Folders are displayed as a collapsed tree.

**TranslationKit** — Select text to translate. Includes a vocabulary book for saving words.

**WritingKit** — Press Cmd+K to open the writing assistant. Checks grammar and keeps an archive of past corrections.

**OneLineCommandKit** — Press Cmd+Shift+O to run a quick command without opening a new tab.

## Utilities

**HistoryKit** — Session snapshots.

**DevHelperKit** — Project script runner. Scans your workspace for Node/Rust/Go projects and lists available scripts. Run scripts in an embedded terminal.

## Plugin Location

Plugins are installed to `~/.vimo/eterm/plugins/`.

## Developing Plugins

Want to build your own? See [Plugin SDK](/docs/eterm/plugins/sdk).
