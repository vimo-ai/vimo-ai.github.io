---
title: Claude Code Hooks
description: Auto-inject memory context into Claude Code sessions
navigation:
  order: 1
---

Hooks let Claude Code **automatically retrieve** your conversation history context, no manual search needed.

::callout{type="info"}
**Default: Disabled.** Hooks are off by default. You need to enable them in both Claude Code settings and Memex config.
::

**How it works:**
- **SessionStart** - Injects recent conversation summaries when you open a new session
- **UserPromptSubmit** - Searches relevant history based on your message before each request

**Result:** Claude "remembers" what you've been working on without you explaining the background every time.

---

## Setup

**Step 1: Configure Claude Code**

Edit `~/.claude/settings.json`:

```json
{
  "hooks": {
    "SessionStart": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "curl -s -X POST http://localhost:10013/api/inject -H 'Content-Type: application/json' -d '{\"hook\":\"SessionStart\"}' 2>/dev/null || echo '{}'"
          }
        ]
      }
    ],
    "UserPromptSubmit": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "curl -s -X POST http://localhost:10013/api/inject -H 'Content-Type: application/json' -d '{\"hook\":\"UserPromptSubmit\",\"query\":\"$PROMPT\"}' 2>/dev/null || echo '{}'"
          }
        ]
      }
    ]
  }
}
```

**Step 2: Enable injection in Memex**

Edit `~/.vimo/memex/config.json`:

```json
{
  "compact": {
    "inject": {
      "mode": "full"
    }
  }
}
```

**Step 3: Restart Claude Code**

Done! Claude will now automatically retrieve history context.

---

## Hook Types

| Hook | Trigger | Effect |
|------|---------|--------|
| `SessionStart` | New session opened | Injects recent 10 conversation summaries |
| `UserPromptSubmit` | Before sending message | Searches history related to your question |

**SessionStart** is good for: Letting Claude know what projects you've been working on.

**UserPromptSubmit** is good for: When you ask "how did I fix that bug before", it automatically finds relevant conversations.

---

## Configuration

### Quick Mode

```json
{
  "compact": {
    "inject": {
      "mode": "full"
    }
  }
}
```

| Mode | Description |
|------|-------------|
| `none` | Disabled (default) |
| `full` | Enable both hooks |

### Detailed Configuration

```json
{
  "compact": {
    "inject": {
      "session_start": {
        "enabled": true,
        "max_items": 10,
        "max_tokens": 2000
      },
      "user_prompt": {
        "enabled": true,
        "similarity_threshold": 0.3,
        "max_tokens": 2000
      }
    }
  }
}
```

| Option | Default | Description |
|--------|---------|-------------|
| `enabled` | `false` | Enable this hook |
| `max_items` | `10` | Number of items to inject (SessionStart) |
| `max_tokens` | `2000` | Maximum context tokens |
| `similarity_threshold` | `0.3` | Similarity threshold for search (lower = more results) |

---

## Requirements

- Memex server running
- **SessionStart:** No special requirements
- **UserPromptSubmit:** Requires Ollama + Compact feature

---

## Verify

```bash
# Test SessionStart
curl -X POST http://localhost:10013/api/inject \
  -H 'Content-Type: application/json' \
  -d '{"hook":"SessionStart"}'

# Test UserPromptSubmit
curl -X POST http://localhost:10013/api/inject \
  -H 'Content-Type: application/json' \
  -d '{"hook":"UserPromptSubmit","query":"test"}'
```

If `hookSpecificOutput.additionalContext` contains content, the setup is successful.
