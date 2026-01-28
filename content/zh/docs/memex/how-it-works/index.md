---
title: 工作原理
description: 了解 Memex 如何收集、存储和搜索你的对话
navigation:
  order: 6
---

## 概述

Memex 通过以下方式为你的 AI 编程助手提供长期记忆：

1. **收集** 来自 Claude Code、Codex 和其他工具的原始对话
2. **存储** 所有内容在本地 SQLite 数据库中（永不丢失原始数据）
3. **可选生成** 多级摘要以获得更好的搜索
4. **搜索** 通过全文、语义向量或两者

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  JSONL/JSON │ ──▶ │   SQLite    │ ──▶ │   Search    │
│   (source)  │     │  (messages) │     │  FTS + MCP  │
└─────────────┘     └──────┬──────┘     └─────────────┘
                          │
                          ▼ (optional)
                   ┌─────────────┐     ┌─────────────┐
                   │   Compact   │ ──▶ │  LanceDB    │
                   │  L1/L2/L3   │     │  (vectors)  │
                   └─────────────┘     └─────────────┘
```

**"永不压缩"** 意味着：你的原始对话始终被保留。Compact 层是可选的和增量的——它生成摘要以增强搜索，但永远不会替换源数据。

---

## 内容

- [收集](/docs/memex/how-it-works/collection) - 数据来自何处以及如何收集
- [存储](/docs/memex/how-it-works/storage) - SQLite 和 LanceDB 架构
- [Compact](/docs/memex/how-it-works/compact) - 多级摘要系统（L0-L3）
- [搜索](/docs/memex/how-it-works/search) - 全文、语义和混合搜索
