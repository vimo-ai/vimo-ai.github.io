---
title: Why Memex?
description: Understanding the pain points and the design philosophy behind Memex
navigation:
  order: 2
---

*Or, prefer the meme version? [This way, sir/madam 🕯️](/docs/memex/meme)*

---

We use `Claude Code` every day. We also use `Codex`, `Gemini`, and `OpenCode`.

During development, we often need to retrieve details from past conversations — specific implementation details, particular parameter values, or just confirming "what exactly did we do last time, so we can roll back."

Searching through sessions one by one is painfully slow, and these tools don't talk to each other — what you discussed in `Claude` completely disappears when you switch to another tool. To bridge this gap, we built `Memex`.

## Keep Everything, Never Compress

I don't want my information compressed and lose details.

When looking up historical information, the details themselves are what matter most. That's why `Memex` chooses not to compress storage. No compression, no AI rewriting. What you search for is the real, original conversation — not a "roughly what happened" version.

Of course, we also provide an optional `compact` feature to optimize multi-layer retrieval when AI calls `MCP`, reducing `Token` consumption. We're also planning to build some interesting things on top of this.

But regardless, the underlying stored data is always your original conversation with `AI CLI` — never compressed.

## Unified Memory Across Tools

We discovered that by collecting conversation content via `JSONL` and providing it to `AI CLI` through `MCP`, we can break down the information walls between different `CLI` tools, because the memory lives on `Memex`.

## Fully Customizable

We've seen that everyone's workflow is different. Some prefer occasional manual searches, some want context auto-loaded, some prefer compressed summaries while others insist on raw records, some have cloud services available, and some care more about privacy and need local deployment.

`Memex` supports on-demand search — you decide when to load and what to load. You can also enable context injection for never-ending long-term sessions. We try to make all features above the collection logic configurable. The core goal is always to stay flexible. We hand the choices over to you, so you can adjust usage based on your own situation.
