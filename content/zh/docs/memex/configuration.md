---
title: 配置
description: Memex 环境变量和选项
navigation:
  order: 3
---

Memex 支持通过环境变量或配置文件进行配置。所有设置都有合理的默认值。

**优先级：** 环境变量 > 配置文件 > 默认值

---

## 配置文件

可选的 JSON 配置文件位于 `~/.vimo/memex/config.json`：

```json
{
  "server": {
    "port": 10013
  },
  "ollama": {
    "api": "http://localhost:11434",
    "embedding_model": "bge-m3",
    "chat_model": "qwen3:0.6b"
  },
  "features": {
    "enable_ai_chat": false
  },
  "compact": {
    "enabled": false,
    "fts_tokenizer": "trigram"
  }
}
```

---

## 环境变量

| 变量 | 默认值 | 描述 |
|----------|---------|-------------|
| `PORT` | `10013` | HTTP 服务器端口 |
| `VIMO_HOME` | `~/.vimo` | 所有数据的基础目录 |
| `CLAUDE_PROJECTS_PATH` | `~/.claude/projects` | Claude Code 会话 |
| `CODEX_PATH` | `~/.codex` | Codex CLI 会话 |
| `OPENCODE_PATH` | `~/.local/share/opencode` | OpenCode 会话 |
| `GEMINI_TMP_PATH` | `~/.gemini/tmp` | Gemini CLI 会话 |
| `OLLAMA_API` | `http://localhost:11434` | Ollama API 端点 |
| `EMBEDDING_MODEL` | `bge-m3` | 嵌入模型 |
| `CHAT_MODEL` | `qwen3:0.6b` | AI 问答模型 |
| `ENABLE_AI_CHAT` | `false` | 启用 AI 问答功能 |
| `COMPACT_ENABLED` | `false` | 启用 LLM Compact 功能 |

---

## FTS 分词器

控制全文搜索如何索引文本。通过配置文件中的 `compact.fts_tokenizer` 配置。

| 分词器 | 语言 | 匹配 | 索引大小 |
|-----------|----------|----------|------------|
| `trigram`（默认）| 中日韩 + 英语 | 子串 | 较大 |
| `unicode61` | 仅英语 | 词边界 | 较小 |

如果你搜索中文、日文或韩文，使用 `trigram`。对于仅英语项目，使用 `unicode61` 以获得更小的索引大小。

---

## Compact（实验性）

LLM 驱动的会话摘要。灵感来自 [claude-mem](https://github.com/thedotmack/claude-mem)。默认禁用。

```json
{
  "compact": {
    "enabled": true,
    "l2_talk_summary": true,
    "l3_session_summary": true
  }
}
```

需要对话模型（Ollama 或云提供商）。启用后，为 MCP 搜索结果生成摘要。

---

## 模型

- **嵌入**：`bge-m3`（默认）。更快/更小：`nomic-embed-text`
- **对话**：`qwen3:0.6b`（默认）。更快/更小：`llama3.2:3b`

---

## 验证

```bash
# 健康检查
curl http://localhost:10013/health

# 统计信息
curl http://localhost:10013/api/stats

# 嵌入状态
curl http://localhost:10013/api/embedding/status
```

---

## 故障排除

### 语义搜索不工作

```bash
# 检查 Ollama
curl http://localhost:11434/api/tags

# 检查模型
ollama list
```

### 找不到会话

```bash
# 检查数据路径是否存在
ls ~/.claude/projects/
ls ~/.codex/
ls ~/.local/share/opencode/
ls ~/.gemini/tmp/

# 触发手动收集
curl -X POST http://localhost:10013/api/collect
```
