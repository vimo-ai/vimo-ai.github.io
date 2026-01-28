---
title: Collection
description: How Memex collects conversation data from AI CLI tools
navigation:
  order: 1
---

Memex reads directly from AI CLI source files — JSONL or JSON, depending on the tool. No modification to original data.

---

## Supported Tools

Default paths on macOS:

| Tool | Data Path | Format |
|------|-----------|--------|
| Claude Code | `~/.claude/projects/` | JSONL |
| Codex CLI | `~/.codex/` | JSONL |
| OpenCode | `~/.local/share/opencode/` | JSON |
| Gemini CLI | `~/.gemini/tmp/` | JSON |

Each tool has a dedicated adapter via [ai-cli-session-collector](https://github.com/vimo-ai/AI-cli-session-collector). Paths can be customized via environment variables — see [Configuration](/docs/memex/configuration).

---

## How Collection Works

**Real-time (FileWatcher)**

Monitors session directories for file changes. When a file is modified:
1. Debounce (2 seconds)
2. Collect only that file
3. Trigger vector indexing for new messages
4. Trigger Compact if new user prompt detected

**Scheduled**

- Startup: initial full collection
- Daily 02:30: full collection

See [Scheduler](/docs/memex/how-it-works/scheduler) for details.

---

## Incremental Collection

Memex tracks the latest message timestamp per session. Only messages newer than the last known timestamp are imported.

First run imports everything; subsequent runs import only new messages.
