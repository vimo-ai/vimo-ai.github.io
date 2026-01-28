---
title: 安装
description: 如何安装 ETerm
navigation:
  order: 3
---

## 系统要求

- macOS 14.0 或更高版本

## 下载

从 [GitHub Releases](https://github.com/vimo-ai/ETerm/releases) 获取最新版本。

## 安装

将 ETerm.app 拖到你的应用程序文件夹。

## 首次启动

首次启动时，ETerm 可能会请求完全磁盘访问权限。在系统设置 → 隐私与安全性中授予权限。

## 插件

ETerm 自带最小核心。你可以直接在应用内下载额外的插件。

## 数据与配置

ETerm 将数据存储在 `~/.vimo/` 中：

| 路径 | 用途 |
|------|---------|
| `~/.vimo/eterm/config/` | 配置文件 |
| `~/.vimo/eterm/plugins/` | 已安装的插件 |
| `~/.vimo/eterm/logs/` | 调试日志 |
| `~/.vimo/db/` | 共享数据库（[Memex](/docs/memex)、[Vlaude](/docs/vlaude) 等）|

你可以通过 `VIMO_HOME` 环境变量覆盖基础路径。

## 下一步

- [为什么选择 ETerm？](/docs/eterm/why) — 了解 ETerm 是什么
- [插件](/docs/eterm/plugins) — 查看可用插件
