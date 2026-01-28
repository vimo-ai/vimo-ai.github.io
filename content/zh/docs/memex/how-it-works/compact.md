---
title: Compact
description: 用于增强搜索的多级摘要系统
navigation:
  order: 3
---

Compact 从你的对话中生成 AI 摘要以提高搜索质量。灵感来自 [claude-mem](https://github.com/thedotmack/claude-mem)。

可选功能——没有它一切都能工作。你的原始数据永远不会被修改；Compact 在其上添加摘要。

---

## 级别系统

Memex 将对话数据组织成级别：

| 级别 | 名称 | 粒度 | 描述 |
|-------|------|-------------|-------------|
| L0 | 原始消息 | 每条消息 | 原始内容，始终保留 |
| L1 | 观察 | 每次工具调用 | 使用了哪些工具和结果 |
| L2 | 对话摘要 | 每个提示-响应 | 每次对话轮次的摘要 |
| L3 | 会话摘要 | 每个会话 | 整个会话的概述 |

L0 始终可用——这就是"永不压缩"所保护的。L1/L2/L3 由 Compact 生成。

---

## 工作原理

Compact 使用两个 Ollama 模型：

- **对话模型**（默认：`qwen3:0.6b`）— 从原始消息生成 L1/L2/L3 摘要
- **嵌入模型**（默认：`bge-m3`）— 将摘要转换为向量以进行语义搜索

```
L0 (原始消息)
 │
 ├──▶ L1 (观察) ──▶ L2 (对话摘要) ──▶ L3 (会话摘要)
 │                                │                        │
 └────────────────────────────────┴────────────────────────┘
                                  │
                                  ▼
                          嵌入模型
                                  │
                                  ▼
                          LanceDB (向量)
```

**生成流程：**
1. **L1** 从 L0 工具调用生成
2. **L2** 从 L0 消息 + L1 观察生成
3. **L3** 从 L2 摘要生成

L3 依赖于 L2。要获取会话摘要，必须启用 `l2_talk_summary` 和 `l3_session_summary`。

---

## 如何搜索

MCP [`search_history`](/docs/memex/mcp#search_history) 使用 `level` 参数选择要搜索的内容：

| 值 | 搜索 | 最适合 |
|-------|----------|----------|
| `sessions`（默认）| L3 摘要 | 快速概览，查找相关会话 |
| `talks` | L2 摘要 | 实现细节，特定解决方案 |
| `raw` | L0 消息 | 确切措辞，精确回忆 |

**回退：** 如果当前级别没有结果，自动尝试下一个：`sessions` → `talks` → `raw`。

**为什么 MCP 中没有 L1？** L1（工具级观察）可用于 [上下文注入](/docs/memex/advanced/hooks)，但不在 MCP 搜索中暴露——它对自动上下文检索比手动搜索更有用。

---

## 上下文注入

Compact 还为自动上下文注入的 [Hooks](/docs/memex/advanced/hooks) 功能提供支持：

| Hook | 使用 | 注入内容 |
|------|------|-----------------|
| SessionStart | L3 摘要 | 最近的会话概览 |
| UserPromptSubmit | L2 摘要 + 向量 | 相关对话上下文 |

没有 Compact，SessionStart 的上下文有限。UserPromptSubmit 需要 Compact 和嵌入模型进行向量搜索。

---

## 启用 Compact

Compact 默认禁用。查看 [配置](/docs/memex/configuration#compact-experimental) 以启用。
