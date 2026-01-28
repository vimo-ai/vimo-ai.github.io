---
title: Claude Code Hooks
description: 自动将记忆上下文注入 Claude Code 会话
navigation:
  order: 1
---

Hooks 让 Claude Code **自动检索**你的对话历史上下文，无需手动搜索。

::callout{type="info"}
**默认：禁用。** Hooks 默认关闭。你需要在 Claude Code 设置和 Memex 配置中都启用它们。
::

**工作原理：**
- **SessionStart** - 打开新会话时注入最近的对话摘要
- **UserPromptSubmit** - 在每个请求之前根据你的消息搜索相关历史

**结果：** Claude "记住"你一直在做什么，而无需每次都解释背景。

---

## 设置

**步骤 1：配置 Claude Code**

编辑 `~/.claude/settings.json`：

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

**步骤 2：在 Memex 中启用注入**

编辑 `~/.vimo/memex/config.json`：

```json
{
  "compact": {
    "inject": {
      "mode": "full"
    }
  }
}
```

**步骤 3：重启 Claude Code**

完成！Claude 现在会自动检索历史上下文。

---

## Hook 类型

| Hook | 触发器 | 效果 |
|------|---------|--------|
| `SessionStart` | 打开新会话 | 注入最近 10 个对话摘要 |
| `UserPromptSubmit` | 发送消息前 | 搜索与你问题相关的历史 |

**SessionStart** 适合：让 Claude 知道你一直在做什么项目。

**UserPromptSubmit** 适合：当你问"我之前是如何修复那个 bug 的"，它会自动找到相关对话。

---

## 配置

### 快速模式

```json
{
  "compact": {
    "inject": {
      "mode": "full"
    }
  }
}
```

| 模式 | 描述 |
|------|-------------|
| `none` | 禁用（默认）|
| `full` | 启用两个 hooks |

### 详细配置

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

| 选项 | 默认值 | 描述 |
|--------|---------|-------------|
| `enabled` | `false` | 启用此 hook |
| `max_items` | `10` | 要注入的项目数（SessionStart）|
| `max_tokens` | `2000` | 最大上下文 tokens |
| `similarity_threshold` | `0.3` | 搜索的相似度阈值（越低 = 更多结果）|

---

## 要求

- Memex 服务器运行
- **SessionStart：** 无特殊要求
- **UserPromptSubmit：** 需要 Ollama + Compact 功能

---

## 验证

```bash
# 测试 SessionStart
curl -X POST http://localhost:10013/api/inject \
  -H 'Content-Type: application/json' \
  -d '{"hook":"SessionStart"}'

# 测试 UserPromptSubmit
curl -X POST http://localhost:10013/api/inject \
  -H 'Content-Type: application/json' \
  -d '{"hook":"UserPromptSubmit","query":"test"}'
```

如果 `hookSpecificOutput.additionalContext` 包含内容，则设置成功。
