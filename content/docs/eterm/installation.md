---
title: Installation
description: How to install ETerm
navigation:
  order: 3
---

## Requirements

- macOS 14.0 or later

## Download

Get the latest release from [GitHub Releases](https://github.com/vimo-ai/ETerm/releases).

## Install

Drag ETerm.app to your Applications folder.

## First Launch

On first launch, ETerm may request Full Disk Access. Grant it in System Settings → Privacy & Security.

## Plugins

ETerm comes with a minimal core. You can download additional plugins directly from within the app.

## Data & Configuration

ETerm stores data in `~/.vimo/`:

| Path | Purpose |
|------|---------|
| `~/.vimo/eterm/config/` | Configuration files |
| `~/.vimo/eterm/plugins/` | Installed plugins |
| `~/.vimo/eterm/logs/` | Debug logs |
| `~/.vimo/db/` | Shared database ([Memex](/docs/memex), [Vlaude](/docs/vlaude), etc.) |

You can override the base path with the `VIMO_HOME` environment variable.

## Next Steps

- [Why ETerm?](/docs/eterm/why) — Learn what ETerm is about
- [Plugins](/docs/eterm/plugins) — See available plugins
