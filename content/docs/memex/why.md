---
title: Why Memex?
description: Understanding the problem and how Memex solves it
navigation:
  order: 2
---

*Or, prefer the sermon version? [This way, sir/madam 🕯️](/docs/memex/sermon)*

---

We use Claude Code every day. We also use Codex, Gemini, OpenCode.

We often need things from past conversations — exact implementation details, specific parameter values, or just "what did we do last time so we can roll back."

Searching through sessions one by one wasn't working. And our tools didn't share any context — what we discussed in Claude stayed in Claude.

So we built Memex.

## Keep Everything

We didn't want summaries. We wanted the exact messages, the exact code, the exact parameters. So Memex stores everything as-is. No compression, no AI rewriting.

When you search, you get the real conversation — not a "this is roughly what happened" version.

## One Brain for All

We got tired of context-switching between tools. Now they share one memory. Search once, find everything — doesn't matter which CLI it came from.

It's simple: Claude, Codex, Gemini, OpenCode — they all write to the same place. Memex reads from all of them.

## Your Call

We've seen different workflows. Some people search occasionally. Some want context auto-loaded. Some prefer compressed summaries, others want raw records.

Right now, Memex does on-demand search — you decide when and what to load. We're working on compression options (Ollama, cloud, Claude SDK) next.

The goal is to stay flexible. Different needs, different setups — we'd rather give you choices than pick one way.

---

If any of this sounds familiar, give it a try.
