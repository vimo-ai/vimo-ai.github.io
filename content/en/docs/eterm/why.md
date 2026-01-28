---
title: Why ETerm?
description: A terminal designed for AI CLI workflows
navigation:
  order: 2
---

*Or, prefer the meme version? [This way, sir/madam 🕯️](/docs/eterm/meme)*

---

We're heavy `Claude Code` users. Over time, we kept running into friction — losing track of parallel tasks, no easy way to monitor `Claude` usage, and having to manually `resume` every session after a terminal restart.

We looked around. Existing tools felt... sluggish. So we thought: `Claude` is already this capable — let's see how far it can push the terminal experience. That's how `ETerm` started.

If you share similar pain points, `ETerm` might help.

## Built-in MCP

From the start, we thought `MCP` was cool — "control the terminal directly through MCP" felt like the right direction.

Once we built it, the **task orchestration** capabilities blew us away. `Claude` can spin up multiple windows, work in parallel, and you can watch or step in anytime. Honestly, we didn't see this coming, but now it's become essential to our workflow. We even designed a dedicated `skill` for it.

## Plugin System

We believe a terminal's core should stay clean.

But to support sidebars, custom views, and various utilities, we built a plugin system (plugin marketplace coming soon). This way, we keep the native feel while offering optional, customizable capabilities.

We're opening up as many APIs as we can. If there's something you need, let us know — we're happy to expose anything that can be exposed.

## Built for AI CLI

We previously built a set of standalone tools for AI workflows: [`Memex`](/docs/memex) for history, [`Vlaude`](/docs/vlaude) for remote sessions, [`MCP Router`](/docs/mcp-router) for smarter tool loading.

They work independently, but once integrated into `ETerm`, the experience becomes seamless — real-time sync, zero config, just works. Through plugins, we brought these scattered tools together.

Our goal is to build a terminal that feels natural and immersive for `AI CLI` development — one that supports the overall `vibe`. We're still working on it, and we'd love for you to try it out.
