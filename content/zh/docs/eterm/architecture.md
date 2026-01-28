---
title: 架构
description: ETerm 技术架构
navigation:
  order: 6
---

## 技术栈

| 层级 | 技术 | 备注 |
|-------|------------|-------|
| 应用 | Swift, SwiftUI | macOS 14+ |
| 渲染 | Rust | 性能关键，通过 FFI |
| GPU | Metal | 原生 macOS 图形 |
| IPC | Unix Domain Socket | 插件通信 |
| 插件 | 动态 Bundle | ETermKit SDK |

## 高层架构

```
┌─────────────────────────────────────┐
│           ETerm.app (Swift)         │
│                                     │
│  ┌─────────┐ ┌─────────┐ ┌───────┐  │
│  │ Terminal│ │ Layout  │ │  MCP  │  │
│  └─────────┘ └─────────┘ └───────┘  │
│                                     │
│  ┌─────────────────────────────────┐│
│  │         Plugin Framework        ││
│  └─────────────────────────────────┘│
└──────────────┬──────────────────────┘
               │ FFI (C ABI)
┌──────────────▼──────────────────────┐
│     Rust Rendering Engine           │
│         (sugarloaf-ffi)             │
└──────────────┬──────────────────────┘
               │ Metal
┌──────────────▼──────────────────────┐
│              GPU                    │
└─────────────────────────────────────┘
```

## 目录结构

```
ETerm/
├── ETerm/
│   ├── Application/     # 应用生命周期、命令、事件
│   ├── Core/
│   │   ├── Terminal/    # 终端模拟 (DDD)
│   │   ├── Layout/      # 面板、标签页、分割线
│   │   ├── Keyboard/    # 输入、输入法、快捷键
│   │   ├── Settings/    # 配置
│   │   └── Events/      # 事件总线
│   └── Features/
│       ├── MCP/         # MCP 服务器实现
│       ├── AI/          # AI 集成
│       └── Plugins/     # 插件框架
├── Plugins/             # 11 个内置插件
├── Packages/
│   └── ETermKit/        # 插件 SDK 框架
└── rio/
    └── sugarloaf-ffi/   # Rust 渲染引擎
```

## 核心模块

| 模块 | 用途 |
|--------|---------|
| Terminal | 终端模拟、PTY 管理、状态处理 |
| Layout | 面板分割、标签页管理、拖放 |
| Keyboard | 输入处理、输入法支持、快捷键绑定 |
| MCP | AI 工具的 Model Context Protocol 服务器 |
| Plugins | 插件加载、生命周期、主机桥接 |

## FFI 层

Swift 和 Rust 通过 C ABI 通信。Rust 层处理：

- 终端状态和渲染
- 文本选择
- 通过 Metal 进行 GPU 渲染

## 插件系统

插件是使用 ETermKit SDK 构建的动态 Bundle（`.bundle`）。它们在主进程中运行，可以：

- 添加侧边栏视图
- 装饰标签页
- 注册命令
- 订阅事件

查看 [插件 SDK](/docs/eterm/plugins/sdk) 了解开发指南。
