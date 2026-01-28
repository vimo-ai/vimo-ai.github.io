---
title: 插件
description: ETerm 内置插件
navigation:
  order: 4
---

ETerm 自带 11 个内置插件。在应用内下载它们。

## AI 集成

### ClaudeKit

Claude Code 集成。

检测 Claude Code 会话并在标签页中显示状态：
- 思考中（蓝色）
- 等待输入（黄色）
- 已完成（橙色）

当多个会话运行时，你可以看到哪些需要关注，而无需切换标签页。会话在重新打开 ETerm 时会自动恢复。

自动工作——无需配置。

### ClaudeMonitorKit

Claude Code 使用量追踪。

显示你的每周使用模式：
- 过去 5 小时的每小时使用量
- 历史使用图表
- 速度预测（本周能否用完配额？）

配置时间计算以跳过周末或睡眠时间，以获得更准确的节奏。

### MemexKit

使用 [Memex](/docs/memex) 搜索你的终端历史。

Memex 索引终端中发生的一切。此插件将该搜索功能带入 ETerm。

需要 Memex 正在运行。

### VlaudeKit

通过 [Vlaude](/docs/vlaude) 进行远程会话控制。

从另一台机器控制 ETerm 会话。远程批准权限请求。

需要配置 Vlaude。

### MCPRouterKit

使用渐进式披露的 MCP 服务器管理。

MCPRouterKit 不是一次性暴露所有 MCP 工具（这会消耗 token），而是先向 Claude 展示摘要。Claude 只在需要时请求工具详情。

详见 [MCP Router](/docs/mcp-router)。

## 生产力

**WorkspaceKit** — 项目文件夹管理。通过拖放或文件选择器添加文件夹。文件夹显示为折叠树。

**TranslationKit** — 选择文本以翻译。包含用于保存单词的词汇本。

**WritingKit** — 按 Cmd+K 打开写作助手。检查语法并保留过去更正的存档。

**OneLineCommandKit** — 按 Cmd+Shift+O 运行快速命令而无需打开新标签页。

## 实用工具

**HistoryKit** — 会话快照。

**DevHelperKit** — 项目脚本运行器。扫描你的工作区以查找 Node/Rust/Go 项目并列出可用脚本。在嵌入式终端中运行脚本。

## 插件位置

插件安装到 `~/.vimo/eterm/plugins/`。

## 开发插件

想构建自己的插件？查看 [插件 SDK](/docs/eterm/plugins/sdk)。
