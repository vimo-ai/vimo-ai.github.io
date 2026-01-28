---
title: Usage Guide
description: Workspaces, tokens, and how they fit together
navigation:
  order: 4
---

## Servers

Go to Settings → Servers. Add the MCP servers you use.

Each server needs:
- **Name** — How you'll identify it
- **Type** — stdio (local process) or http (remote endpoint)
- **For stdio**: command and arguments (like `npx -y @anthropic/github`), plus environment variables if needed
- **For http**: the server URL

Toggle servers on or off as needed. Disabled servers stay in your config but don't load.

---

## Workspaces

A workspace is a configuration set — which servers to use, identified by a token.

### Default Workspace

There's always a Default Workspace. When a request comes in without a token, or with a token that doesn't match anything, it uses Default.

### Creating a Workspace

Settings → Workspaces → Add Workspace.

Give it a name, pick which servers to enable, and MCP Router generates a token (or you can set your own).

### Tokens

The token is how MCP Router knows which workspace to use.

In your project's `.mcp.json`:

```json
{
  "mcpServers": {
    "mcp-router": {
      "type": "http",
      "url": "http://localhost:19104",
      "headers": {
        "X-Workspace-Token": "your-token"
      }
    }
  }
}
```

When your MCP client connects, it sends this token. MCP Router looks it up and returns tools from that workspace's servers. Without the token header, requests use the Default Workspace.

### Inheriting from Default

If you just want a project to use most servers but skip a few, you can enable "Inherit from Default" and then disable specific servers. Less duplication.

---

## Claude Code Integration

### Automatic Setup

Settings → Integration. Click the button to write to Claude Code's global config. Done.

This adds MCP Router to `~/.claude.json`. Every project will use it.

### Per-Project Config

For project-specific setups, add `.mcp.json` in your project root with the token. Project config takes precedence over global for the same server name.

---

## Codex Integration

Same idea. Settings → Integration has a button for Codex too.

Or manually add to `~/.codex/config.toml`:

```toml
[mcp_servers.mcp-router]
type = "http"
url = "http://localhost:19104"

[mcp_servers.mcp-router.headers]
X-Workspace-Token = "your-token"
```

Without the token header, requests use the Default Workspace.

---

## Troubleshooting

**Tools not appearing?**

- Check that the server is enabled in MCP Router
- Check that the workspace has that server
- Restart your MCP client after changing configs

**Server not starting?**

- Check the command and arguments
- Check environment variables (some servers need API keys)
- Look at the server logs in MCP Router

**Connection refused?**

- Make sure MCP Router is running (check the menu bar icon)
- Make sure nothing else is using port 19104

---

Questions or issues? Let us know on [GitHub](https://github.com/vimo-ai/mcp-router).
