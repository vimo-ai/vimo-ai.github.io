---
title: 收集
description: Memex 如何从 AI CLI 工具收集对话数据
navigation:
  order: 1
---

Memex 直接从 AI CLI 源文件读取——JSONL 或 JSON，具体取决于工具。不修改原始数据。

---

## 支持的工具

macOS 上的默认路径：

| 工具 | 数据路径 | 格式 |
|------|-----------|--------|
| Claude Code | `~/.claude/projects/` | JSONL |
| Codex CLI | `~/.codex/` | JSONL |
| OpenCode | `~/.local/share/opencode/` | JSON |
| Gemini CLI | `~/.gemini/tmp/` | JSON |

每个工具都通过 [ai-cli-session-collector](https://github.com/vimo-ai/AI-cli-session-collector) 有一个专用适配器。路径可以通过环境变量自定义——查看 [配置](/docs/memex/configuration)。

---

## 收集如何工作

**实时（FileWatcher）**

监控会话目录的文件更改。当文件被修改时：
1. 防抖（2 秒）
2. 仅收集该文件
3. 为新消息触发向量索引
4. 如果检测到新用户提示，触发 Compact

**计划任务**

- 启动：初始完整收集
- 每天 02:30：完整收集

详见 [调度器](/docs/memex/how-it-works/scheduler)。

---

## 增量收集

Memex 跟踪每个会话的最新消息时间戳。只导入比最后已知时间戳更新的消息。

首次运行导入所有内容；后续运行仅导入新消息。
