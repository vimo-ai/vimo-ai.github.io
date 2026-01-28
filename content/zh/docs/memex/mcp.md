---
title: MCP 工具
description: 将 Memex 用作 AI 编程助手的 MCP 服务器
navigation:
  order: 5
---

Memex 实现了 [Model Context Protocol](https://modelcontextprotocol.io/) (MCP)，允许 AI 编程助手搜索你的对话历史。

## 设置

查看 [快速开始](/docs/memex#full-recommended) 了解 MCP 配置命令。

验证 MCP 是否工作：

```bash
curl -X POST http://localhost:10013/api/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'
```

---

## 工具

### search_history

使用渐进式披露搜索对话历史。

| 参数 | 类型 | 必需 | 描述 |
|-----------|------|----------|-------------|
| `query` | string | 是 | 搜索关键词 |
| `level` | string | 否 | 详细级别：`sessions`（默认）、`talks`、`raw` |
| `cwd` | string \| string[] | 否 | 筛选到特定项目。支持精确路径、前缀或 glob 模式（例如 `*/ETerm*`）|
| `exclude_cwd` | string \| string[] | 否 | 排除特定项目。支持精确路径、前缀或 glob 模式（例如 `*memex*`）|
| `time` | string | 否 | 时间快捷方式：`1d`、`3d`、`1w`、`1m` |
| `from` | string | 否 | 开始日期 `YYYY-MM-DD`（与 `time` 互斥）|
| `to` | string | 否 | 结束日期 `YYYY-MM-DD`（与 `time` 互斥）|
| `limit` | number | 否 | 最大结果数（默认：5）|

**级别选项：**

| 级别 | 返回 | 何时使用 |
|-------|---------|----------|
| `sessions` | L3 会话摘要 | 快速概览（默认）|
| `talks` | L2 每个提示的摘要 | 需要更多细节 |
| `raw` | L0 原始消息 | 需要确切内容 |

**项目筛选示例：**

```json
// 单个项目（精确匹配或前缀）
{ "cwd": "/Users/me/projects/myapp" }

// 多个项目
{ "cwd": ["/Users/me/projects/app1", "/Users/me/projects/app2"] }

// Glob 模式
{ "cwd": "*/ETerm*" }

// 排除项目
{ "exclude_cwd": "*memex*" }

// 组合：包含一些，排除其他
{ "cwd": "*/vimo/*", "exclude_cwd": ["*test*", "*archive*"] }
```

### get_session

获取会话消息。有两种模式可用：

**模式 1：围绕位置** - 获取特定消息周围的上下文

| 参数 | 类型 | 必需 | 描述 |
|-----------|------|----------|-------------|
| `sessionId` | string | 是 | 会话 ID（完整或前缀）|
| `around` | number | 是 | 来自 `search_history` 结果的 `at` 字段的位置 |
| `context` | number | 否 | 前后消息数（默认：5，最大：20）|

**模式 2：分页** - 从开始或结束浏览

| 参数 | 类型 | 必需 | 描述 |
|-----------|------|----------|-------------|
| `sessionId` | string | 是 | 会话 ID（完整或前缀）|
| `limit` | number | 否 | 返回的消息数（默认：10）|
| `order` | string | 否 | `asc`（从开始）或 `desc`（从结束）|

注意：当 `limit > 5` 时内容被截断。

### get_recent_sessions

获取最近的会话，可选按项目筛选。

| 参数 | 类型 | 必需 | 描述 |
|-----------|------|----------|-------------|
| `cwd` | string \| string[] | 否 | 筛选到特定项目。支持精确路径、前缀或 glob 模式 |
| `exclude_cwd` | string \| string[] | 否 | 排除特定项目。支持精确路径、前缀或 glob 模式 |
| `limit` | number | 否 | 最大结果数（默认：5）|

项目筛选示例见 [search_history](#search_history)。

### list_projects

列出所有带统计信息的项目。无参数。

---

## 典型工作流

```
1. search_history "anything you want" → 找到相关会话
2. get_session sessionId=xxx around=42 → 获取匹配周围的上下文
```

搜索结果中的 `at` 字段可以直接传递给 `get_session` 的 `around` 参数。

---

## 使用

在你的 AI CLI 中：

```
use memex find "你想搜什么搜什么"
```

AI 将调用 `search_history` 并返回相关对话。
