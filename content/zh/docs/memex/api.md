---
title: API 参考
description: Memex REST API 端点
navigation:
  order: 4
---

Memex 在端口 `10013` 上暴露 REST API。所有响应都是 JSON。

## 健康检查和统计

```bash
GET /health              # 返回 "OK"
GET /api/stats           # 数据库统计信息
```

---

## 项目

```bash
GET /api/projects                    # 列出所有项目
GET /api/projects/{id}               # 获取项目详情
GET /api/projects/{id}/sessions      # 获取项目会话
```

---

## 会话

```bash
GET /api/sessions                    # 列出会话
GET /api/sessions/search?idPrefix=   # 按 ID 前缀搜索
GET /api/sessions/{id}               # 获取会话详情
GET /api/sessions/{id}/messages      # 获取会话消息
```

**`/api/sessions` 的查询参数：**

| 参数 | 默认值 | 描述 |
|-----------|---------|-------------|
| `projectId` | - | 按项目筛选 |
| `limit` | 50 | 最大结果数 |

**`/api/sessions/{id}/messages` 的查询参数：**

| 参数 | 默认值 | 描述 |
|-----------|---------|-------------|
| `limit` | 50 | 最大消息数 |
| `offset` | 0 | 跳过前 N 条 |
| `order` | asc | `asc` 或 `desc` |

---

## 搜索

```bash
GET /api/search?q=keyword            # 全文搜索 (FTS5)
GET /api/search/semantic?q=keyword   # 语义搜索
GET /api/search/hybrid?q=keyword     # 混合搜索
GET /api/search/semantic/status      # 检查语义搜索状态
```

**查询参数：**

| 参数 | 默认值 | 描述 |
|-----------|---------|-------------|
| `q` | 必需 | 搜索查询 |
| `limit` | 20 | 最大结果数 |
| `projectId` | - | 按项目筛选 |
| `mode` | - | `fts`、`vector`、`hybrid` |
| `startDate` | - | 筛选开始日期 |
| `endDate` | - | 筛选结束日期 |

---

## RAG 问答

```bash
GET /api/ask?q=question              # 快速问答
POST /api/ask                        # 带选项的问答
GET /api/ask/status                  # 检查 AI 问答状态
```

**POST 请求体：**
```json
{
  "question": "我是如何实现登录的？",
  "contextWindow": 3,
  "maxSources": 5,
  "projectId": 1
}
```

---

## 收集和索引

```bash
POST /api/collect                    # 触发会话收集
POST /api/index                      # 索引特定会话
POST /api/index/all                  # 完整向量索引
POST /api/index/batch?limit=100      # 批量索引
```

---

## 嵌入

```bash
GET /api/embedding/status            # 服务状态
GET /api/embedding/stats             # 索引统计信息
POST /api/embedding/trigger          # 触发批量索引
POST /api/embedding/trigger-all      # 开始完整索引
GET /api/embedding/failed            # 列出失败的尝试
POST /api/embedding/reset-failed     # 重置以重新索引
POST /api/embedding/compact          # 压缩 LanceDB
```

---

## 备份

```bash
POST /api/backup                     # 创建备份
GET /api/backup/list                 # 列出备份
```

---

## MCP

```bash
POST /api/mcp                        # MCP JSON-RPC 端点
GET /api/mcp/info                    # 服务器信息和工具
```

详见 [MCP 工具](/docs/memex/mcp)。
