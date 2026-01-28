---
title: 为什么选择 MCP Router？
description: 我们遇到的问题，以及解决思路
navigation:
  order: 2
---

## 上下文成本

我们装了一堆 `MCP` 服务器——`Chrome DevTools`、`context7`、`GitHub`、数据库……加起来几百个工具。

每次开会话，所有工具的 `schema` 都会被加载进去。还没开始干活，上下文就已经占掉一大块了。

然后我们想——这些工具大部分这次根本用不到，为什么要全部预加载？

于是做了 4 个 `meta tools`。`AI` 按需查询，用到哪个拿哪个的 `schema`，不用的跳过。

## 配置散落各处

每个项目都有自己的 `.mcp.json`，服务器配置到处复制粘贴。

改个参数，每个项目都得改一遍。能做，就是烦。

现在配置统一放在 `MCP Router` 里，一份全局配置搞定。

## 不同项目，不同工具

`Web` 项目要 `Chrome DevTools`，后端项目要数据库工具，`iOS` 项目要 `Xcode` 工具。

`MCP` 支持按项目配置，但那意味着每个项目都要写 `.mcp.json`。改一个服务器，又得全部改一遍。

`Workspace` 解决这个问题——在 `MCP Router` 里配好组合，项目只需要一个标识就知道该用哪套。
