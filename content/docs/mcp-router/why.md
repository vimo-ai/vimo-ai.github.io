---
title: Why MCP Router?
description: The problems and our approach
navigation:
  order: 2
---

## Context Cost

We installed a bunch of MCP servers. Chrome DevTools, context7, GitHub, databases... hundreds of tools in total.

Every session, all these tool schemas get loaded. Before we even start working, a big chunk of context is already taken.

Then we thought — most of these tools won't even be used this time. Why load everything upfront?

So we made 4 meta tools. AI queries on demand. Grab the schema when you need it, skip what you don't.

## Config Everywhere

Every project had its own `.mcp.json`. Server configs copy-pasted everywhere.

Change a parameter, update every project. Doable, just tedious.

Now configs live in MCP Router. One global mcp-router config and we're done.

## Different Projects, Different Tools

Web projects need Chrome DevTools. Backend projects need database tools. iOS projects need Xcode tools.

MCP supports per-project config, but that means writing `.mcp.json` in every project. Change a server, update them all again.

Workspaces solve this — configure the combinations in MCP Router, projects just carry a token to know which set to use.

---

If any of this sounds familiar, give it a try.
