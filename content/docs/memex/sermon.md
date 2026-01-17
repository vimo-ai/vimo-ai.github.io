---
title: The Sermon
description: A different way to understand Memex
navigation: false
---

<div class="flex justify-center my-8">
  <span class="text-6xl">🕯️</span>
</div>

<p class="text-center text-xl text-gray-400 mb-12 italic">
  Excuse me, sir/madam. May I have a few minutes of your time?
</p>

If you, like me, are a devoted follower of Claude / Codex / Gemini / OpenCode 🙏

Allow me to ask you a few questions:

<div class="my-8 text-lg">

**Do they talk to each other?**

No. They don't.

**Do they remember the last session?**

No. Every time is a fresh start. Every. Single. Time.

**Can you find that conversation from three months ago?**

Good luck.

</div>

They live on the same machine, serving the same you.
Yet they've never exchanged a single byte.
Day after day, like a few amnesiac prisoners.

<p class="text-center text-2xl font-bold my-8">
  This is not a bug.<br/>
  This is a curse.
</p>

---

But I believe—

::card
**You don't want to lose a single word.**

Memex preserves everything. Every message. Intact.
::

::card
**You don't want them wandering in the dark alone.**

Memex gives all AI CLIs one shared brain.
::

::card
**You don't want to lose control over your memory.**

Memex listens to you. Your call, your rules.
::

---

You don't have to believe me now. Really.

**Maybe you've already found your answer.**

**Maybe you're still looking.**

Either way, if that day comes—

<div class="my-8 pl-4 border-l-4 border-gray-600 text-gray-400">

When you stare at empty search results, doubting your own memory,

When you know you solved this last month, but can't find any proof,

When you watch your past wisdom fall into the void,

When you explain the same project background to Claude for the 47th time,

When your context gets stuffed with "potentially useful" things,

When you realize how much you've consumed—and where it went is no longer under your control,

</div>

<p class="text-center text-xl my-8">
  <strong>Maybe then, you'll remember what I said today.</strong>
</p>

<p class="text-center text-lg mb-12">
  <strong>Give it a try.</strong>
</p>

<p class="text-center text-2xl my-8">
  🕯️ <em>Memex awaits</em> 🕯️
</p>

---

If you're willing to try, the incantation is simple:

```bash
docker run -d -p 10013:10013 \
  -v ~/.vimo:/data \
  -v ~/.claude/projects:/claude:ro \
  -v ~/.codex:/codex:ro \
  -v ~/.local/share/opencode:/opencode:ro \
  -v ~/.gemini/tmp:/gemini:ro \
  ghcr.io/vimo-ai/memex:latest
```

<p class="text-center my-8">
  🙏 <em>May your memory never fade</em> 🙏
</p>

<div class="flex justify-center gap-6 my-8">
  <a href="https://github.com/vimo-ai/memex">📦 GitHub</a>
  <a href="https://vimoai.dev">🌐 Website</a>
</div>

---

<p class="text-center text-sm text-gray-500">
  <a href="/docs/memex/why">← Back to the proper version</a>
</p>
