---
title: 存储
description: Memex 如何存储对话数据
navigation:
  order: 2
---

Memex 使用两个存储后端：SQLite 用于结构化数据和全文搜索，LanceDB 用于向量嵌入。

---

## SQLite

所有对话数据的主要存储。

**路径：** `~/.vimo/db/ai-cli-session.db`

**存储：**
- 消息（原始内容）
- 会话（元数据、模型、工作目录）
- 项目（路径、源工具）

**功能：**
- FTS5 全文搜索索引
- 多进程访问的写入协调

由 [ai-cli-session-db](https://github.com/vimo-ai/ai-cli-session-db) 提供支持。

**大小参考：** 一个包含 17k 会话中 405k 消息的真实数据库大约需要 3.3GB。

---

## LanceDB

用于语义搜索的向量存储。

**路径：** `~/.vimo/lancedb/`

**存储：**
- 消息嵌入（来自 `bge-m3` 的 1024 维向量）
- Compact 摘要嵌入（L1/L2/L3）

仅在 Ollama 嵌入模型可用时填充。
