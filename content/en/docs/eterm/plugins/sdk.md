---
title: Plugin SDK
description: Develop ETerm plugins
navigation:
  order: 5
---

> Version: 0.0.1-beta.1

## Architecture Overview

ETerm uses a process-isolated plugin architecture:

```
ETerm.app (Main Process)
    │
    ├── Plugin Views (SwiftUI, loaded from Bundle)
    │   └── Communicates with Logic via NotificationCenter
    │
    ↓ Unix Domain Socket IPC

ETermExtensionHost (Plugin Host Process)
    │
    └── Plugin Logic (business logic, crashes don't affect main app)
```

**Core Benefits**:
- Plugin logic crashes don't affect the main app
- Views can use SwiftUI directly
- Shared `ETermKit.framework` SDK

## Quick Start

### 1. Create Plugin

```bash
cd Plugins
./create-plugin.sh MyPlugin              # ID: com.eterm.my-plugin
./create-plugin.sh MyPlugin com.foo.bar  # Custom ID
```

### 2. Generated Structure

```
MyPlugin/
├── Package.swift              # SPM configuration
├── build.sh                   # Build script
├── Resources/
│   └── manifest.json          # Plugin manifest (core config)
└── Sources/MyPlugin/
    └── MyPluginPlugin.swift   # Plugin entry point
```

### 3. Build and Install

```bash
cd MyPluginKit
./build.sh                     # Build and install to ~/.vimo/eterm/plugins/
```

Restart ETerm to load the plugin.

## Manifest Configuration

`Resources/manifest.json`:

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

### Required Fields

| Field | Description |
|-------|-------------|
| `id` | Unique identifier (reverse domain format) |
| `name` | Display name |
| `version` | Semantic version |
| `minHostVersion` | Minimum ETerm version required |
| `sdkVersion` | SDK version |
| `principalClass` | Logic entry class name (needs @objc export) |

### Optional Fields

| Field | Description |
|-------|-------------|
| `runMode` | `main` (recommended) or `isolated` |
| `dependencies` | Required plugins |
| `capabilities` | Declared capabilities |
| `sidebarTabs` | Sidebar tab configurations |
| `commands` | Registered commands |
| `subscribes` | Events to subscribe |
| `emits` | Events emitted |

## Capabilities

| Capability | Description |
|------------|-------------|
| `ui.sidebar` | Add sidebar tabs |
| `ui.infoPanel` | Add info panel content |
| `ui.tabDecoration` | Decorate terminal tabs |
| `ui.tabTitle` | Customize tab titles |
| `ui.pageBar` | Add page bar items |
| `ui.composer` | Add composer UI |
| `terminal.read` | Read terminal output |
| `terminal.write` | Write to terminal |
| `terminal.embed` | Embed terminal views |
| `selection.registerAction` | Add selection actions |
| `command.register` | Register commands |
| `keyboard.bind` | Bind keyboard shortcuts |
| `service.register` | Register services for other plugins |
| `service.call` | Call other plugin services |
| `socket.client` | Socket client capabilities |

## Plugin Entry Point

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
        // Handle subscribed events
    }

    public func handleCommand(_ commandId: String) {
        // Handle registered commands
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

Communicate with the main process via `HostBridge`:

```swift
// Update ViewModel data (triggers View refresh)
host.updateViewModel(pluginId, data: [
    "key": "value"
])

// Emit events
host.emit(eventName: "plugin.my-plugin.dataChanged", payload: ["id": 123])

// Call other plugin services
let result = host.callService(
    pluginId: "com.eterm.workspace",
    name: "getFolders",
    params: [:]
)
```

## Example Plugins

Reference existing plugins:

| Plugin | Description |
|--------|-------------|
| WorkspaceKit | Complete example: Logic + ViewProvider + tree view |
| TranslationKit | Simple example: sidebar tab |
| MCPRouterKit | MCP server management (with Rust dylib) |

## Troubleshooting

### Q: Plugin fails to load "Bundle.load() failed"
Check dylib linking paths. Ensure `build.sh` correctly fixes ETermKit linking.

### Q: @objc type conversion fails
Ensure `@objc(ClassName)` matches `principalClass` / `viewProviderClass` in manifest.

### Q: How to debug
Check Xcode Console logs, search for `[PluginName]` prefix.
