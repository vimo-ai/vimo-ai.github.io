---
title: Installation
description: Download and configure MCP Router
navigation:
  order: 3
---

## Download

Download from [GitHub Releases](https://github.com/vimo-ai/mcp-router/releases), unzip, and move to Applications.

## Launch

Open the app. It shows a lightning icon in the menu bar.

## Configure MCP

One-click install from the app (Settings → Integration), or manually:

::code-group
```bash [Claude Code]
claude mcp add mcp-router -- npx -y mcp-remote http://localhost:19104
```
```bash [Codex]
codex mcp add mcp-router -- npx -y mcp-remote http://localhost:19104
```
::

Restart your CLI and you're ready to go.
