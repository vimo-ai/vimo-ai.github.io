---
title: 插件 SDK
description: 开发 ETerm 插件
navigation:
  order: 5
---

> 版本：0.0.1-beta.1

## 架构概览

ETerm 使用进程隔离的插件架构：

```
ETerm.app (主进程)
    │
    ├── Plugin Views (SwiftUI，从 Bundle 加载)
    │   └── 通过 NotificationCenter 与逻辑层通信
    │
    ↓ Unix Domain Socket IPC


ETermExtensionHost (插件宿主进程)
    │
    └── Plugin Logic (业务逻辑，崩溃不影响主应用)
```

**核心优势**：
- 插件逻辑崩溃不影响主应用
- 视图可以直接使用 SwiftUI
- 共享 `ETermKit.framework` SDK

## 快速开始

### 1. 创建插件

```bash
cd Plugins
./create-plugin.sh MyPlugin              # ID: com.eterm.my-plugin
./create-plugin.sh MyPlugin com.foo.bar  # 自定义 ID
```

### 2. 生成的结构

```
MyPlugin/
├── Package.swift              # SPM 配置
├── build.sh                   # 构建脚本
├── Resources/
│   └── manifest.json          # 插件清单（核心配置）
└── Sources/MyPlugin/
    └── MyPluginPlugin.swift   # 插件入口点
```

### 3. 构建和安装

```bash
cd MyPluginKit
./build.sh                     # 构建并安装到 ~/.vimo/eterm/plugins/
```

重启 ETerm 以加载插件。

## 清单配置

`Resources/manifest.json`：

```json
{
    "id": "com.eterm.my-plugin",
    "name": "My Plugin",
    "version": "0.0.1-beta.1",
    "minHostVersion": "0.0.1-beta.1",
    "sdkVersion": "0.0.1-beta.1",
    "runMode": "main",
    "dependencies": [],
    "capabilities": ["ui.sidebar"],
    "principalClass": "MyPluginPlugin",
    "sidebarTabs": [
        {
            "id": "my-plugin-tab",
            "title": "My Plugin",
            "icon": "star.fill",
            "viewClass": "MyPluginView"
        }
    ],
    "commands": [],
    "subscribes": [],
    "emits": []
}
```

### 必填字段

| 字段 | 描述 |
|-------|-------------|
| `id` | 唯一标识符（反向域名格式）|
| `name` | 显示名称 |
| `version` | 语义化版本 |
| `minHostVersion` | 所需的最低 ETerm 版本 |
| `sdkVersion` | SDK 版本 |
| `principalClass` | 逻辑入口类名（需要 @objc 导出）|

### 可选字段

| 字段 | 描述 |
|-------|-------------|
| `runMode` | `main`（推荐）或 `isolated` |
| `dependencies` | 所需插件 |
| `capabilities` | 声明的能力 |
| `sidebarTabs` | 侧边栏标签配置 |
| `commands` | 注册的命令 |
| `subscribes` | 订阅的事件 |
| `emits` | 发出的事件 |

## 能力

| 能力 | 描述 |
|------------|-------------|
| `ui.sidebar` | 添加侧边栏标签 |
| `ui.infoPanel` | 添加信息面板内容 |
| `ui.tabDecoration` | 装饰终端标签页 |
| `ui.tabTitle` | 自定义标签标题 |
| `ui.pageBar` | 添加页面栏项目 |
| `ui.composer` | 添加组合器 UI |
| `terminal.read` | 读取终端输出 |
| `terminal.write` | 写入终端 |
| `terminal.embed` | 嵌入终端视图 |
| `selection.registerAction` | 添加选择操作 |
| `command.register` | 注册命令 |
| `keyboard.bind` | 绑定键盘快捷键 |
| `service.register` | 为其他插件注册服务 |
| `service.call` | 调用其他插件服务 |
| `socket.client` | Socket 客户端能力 |

## 插件入口点

```swift
import Foundation
import SwiftUI
import ETermKit

@objc(MyPluginPlugin)
@MainActor
public final class MyPluginPlugin: NSObject, ETermKit.Plugin {

    public static var id = "com.eterm.my-plugin"

    private var host: HostBridge?
    @Published private var items: [String] = []

    public override init() {
        super.init()
    }

    // MARK: - Lifecycle

    public func activate(host: HostBridge) {
        self.host = host
        print("[MyPluginPlugin] Activated")
    }

    public func deactivate() {
        print("[MyPluginPlugin] Deactivated")
    }

    // MARK: - Event Handling

    public func handleEvent(_ eventName: String, payload: [String: Any]) {
        // 处理订阅的事件
    }

    public func handleCommand(_ commandId: String) {
        // 处理注册的命令
    }

    // MARK: - View Providers

    public func sidebarView(for tabId: String) -> AnyView? {
        switch tabId {
        case "my-plugin-tab":
            return AnyView(MyPluginSidebarView(items: $items))
        default:
            return nil
        }
    }
}

struct MyPluginSidebarView: View {
    @Binding var items: [String]

    var body: some View {
        List(items, id: \.self) { item in
            Text(item)
        }
    }
}
```

## HostBridge API

通过 `HostBridge` 与主进程通信：

```swift
// 更新 ViewModel 数据（触发 View 刷新）
host.updateViewModel(pluginId, data: [
    "key": "value"
])

// 发出事件
host.emit(eventName: "plugin.my-plugin.dataChanged", payload: ["id": 123])

// 调用其他插件服务
let result = host.callService(
    pluginId: "com.eterm.workspace",
    name: "getFolders",
    params: [:]
)
```

## 示例插件

参考现有插件：

| 插件 | 描述 |
|--------|-------------|
| WorkspaceKit | 完整示例：逻辑 + ViewProvider + 树视图 |
| TranslationKit | 简单示例：侧边栏标签 |
| MCPRouterKit | MCP 服务器管理（带 Rust dylib）|

## 故障排除

### 问：插件加载失败 "Bundle.load() failed"
检查 dylib 链接路径。确保 `build.sh` 正确修复了 ETermKit 链接。

### 问：@objc 类型转换失败
确保 `@objc(ClassName)` 与清单中的 `principalClass` / `viewProviderClass` 匹配。

### 问：如何调试
检查 Xcode 控制台日志，搜索 `[PluginName]` 前缀。
