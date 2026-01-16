---
title: Why Memex?
description: Understanding the problem and how Memex solves it
navigation:
  order: 2
---

## The Problem: AI Assistants' Missing Memory

AI coding assistants are incredibly powerful, but they have a fundamental limitation: **they only remember the current conversation**.

### Real-World Challenges

**Scenario 1: Lost Context**
```
Three months ago, you had a detailed discussion about database indexing strategies.
Today, you're working on a similar optimization problem.
Claude has no memory of that previous conversation.
→ You need to re-explain everything from scratch.
```

**Scenario 2: Manual Archaeology**
```
You remember configuring Nginx SSL with specific parameters, but which session was it?
Opening sessions one by one: "Nope... not this one... maybe this one?"
30 minutes later, you still haven't found it.
→ Critical context is buried in hundreds of sessions.
```

**Scenario 3: Repeated Mistakes**
```
You debugged a complex Rust async issue last month.
Today, similar error appears in a new project.
Claude doesn't remember the solution you discovered together.
→ You waste time rediscovering the same fix.
```

## How Memex Solves This

Memex adds long-term memory to Claude through **on-demand retrieval** - you control what context Claude sees, when it sees it, and how much detail to include.

### Core Capability 1: On-Demand Search, Controlled Retrieval

**How It Works**

Instead of automatically injecting context at every session start, Memex lets you search precisely when you need it:

```
Current conversation in Claude Code:

You: We need to optimize this database query
Claude: I can help with that...

You: Search my history for previous database optimization discussions
Claude: [calls search_history MCP tool]
      Found 5 relevant conversations:
      1. [2024-11-20] API Server - Index optimization for user queries
      2. [2024-10-15] Dashboard - Query performance tuning
      ...

You: Show me details from the first one
Claude: [calls get_session] In that conversation, you optimized...
```

**Key Benefits**

- **No token waste**: Only search when you need it. No search = no token consumption.
- **Fully transparent**: You see the search results before Claude uses them.
- **Complete control**: You decide which session details to load, not AI guessing.

**What This Means**

Traditional approach: Start every session → AI auto-injects "possibly relevant" context → consume tokens whether you need it or not.

Memex approach: Work normally → Need context? Search → Review results → Load what you need.

### Core Capability 2: Complete Preservation, Every Message Intact

**How It Works**

Memex stores your conversation data directly through an Adapter architecture:

```
Claude Code sessions (original format)
         ↓
    Adapter Layer (parsing)
         ↓
    SQLite Database (exact storage)
         ↓
When you search: retrieve original messages, not summaries
```

**Key Benefits**

- **No AI compression**: Stores original records, doesn't use AI to "summarize" your conversations
- **No token cost for storage**: No API calls to compress your data
- **No detail loss**: Search results show actual messages, tool calls, code changes - everything intact
- **Precise recall**: Find the exact parameter value, not "something about configuration"

**What This Means**

Some solutions compress your history using AI (consuming tokens and losing details).
Memex preserves everything exactly as it happened.

### Core Capability 3: Powerful Search Capabilities

**Three Search Modes**

**Full-Text Search (FTS5)**
Fast keyword matching for precise queries:
```
Search: "connection pool timeout"
→ Finds exact keyword matches
→ Millisecond-level response time
```

**Semantic Search (Vector)**
Understanding meaning beyond keywords:
```
Search: "how to optimize slow database queries"
→ Finds related discussions even if they used different words
→ Uses Ollama embeddings + LanceDB
```

**Hybrid Search (Best of Both)**
Combines keyword precision with semantic understanding:
```
Search: "authentication"
→ RRF (Reciprocal Rank Fusion) combines both approaches
→ Ranks results by relevance
```

**Flexible Filters**

- **Time range**: `--startDate 2025-01-01 --endDate 2025-01-31`
- **Project**: `--projectId 5` (find across specific projects)
- **Session prefix**: `--idPrefix abc123` (locate specific sessions)

### Core Capability 4: Complete Toolchain

**MCP Protocol Integration**

Use directly in Claude Code without leaving your conversation:

```
You: Search for that Redis caching discussion
Claude: [MCP call] Found it in the API server project from December...
```

**Web UI**

Visual interface for browsing and exploring:
- Project tree structure visualization
- Three search modes with instant switching
- Session details with Markdown rendering
- RAG Q&A (ask questions about your history)
- Statistics dashboard (projects, sessions, indexing status)

**REST API**

Integrate into any toolchain:
```bash
# Search from any script or tool
curl "http://localhost:10013/api/search/hybrid?q=nginx&limit=5"
```

## Usage Patterns

### Pattern 1: Architecture Decision Recall

**Context**: Designing a new feature, you remember discussing similar architecture months ago.

**Workflow**:
1. Ask Claude to search your history: "Find our previous cache layer design discussions"
2. Claude calls `search_history` → returns list of relevant sessions
3. Review titles and dates → identify the right conversation
4. "Show me details from session #2"
5. Claude retrieves that session → you see the full technical discussion
6. Continue designing with historical context

**Value**: Reuse past decisions instead of reinventing the wheel.

### Pattern 2: Precise Parameter Lookup

**Context**: Need to know exact configuration values used before.

**Workflow**:
1. "What timeout did we set for the database connection pool?"
2. Claude searches → finds the configuration discussion
3. Directly shows: `connectionTimeout: 5000, idleTimeout: 60000`
4. You apply the same values → maintain consistency

**Value**: Exact numbers, not vague recollection.

### Pattern 3: Solution Replication

**Context**: Encountered an error similar to one you solved before.

**Workflow**:
1. "This Rust async error looks familiar, search our debugging history"
2. Claude finds 2 related discussions
3. Review the first one → see the complete debugging process
4. Apply the same solution → problem solved in 5 minutes

**Value**: Don't debug the same issue twice.

### Pattern 4: Knowledge Synthesis

**Context**: Want to consolidate learning from multiple projects.

**Workflow**:
1. Use Web UI to search across all projects
2. Query: "error handling patterns"
3. See results from 6 different projects
4. Click through to review approaches in each context
5. Synthesize best practices

**Value**: Build cumulative knowledge across all your work.

## Architectural Advantages

### Adapter Design

Memex uses an Adapter pattern to support multiple data formats:

```
┌─────────────────────────┐
│   Memex Core Engine     │
│  (Search, Storage, MCP) │
└───────────┬─────────────┘
            │
    ┌───────┴────────┐
    │   Adapters     │
    └───────┬────────┘
            │
    ┌───────┴────────┬────────────┬────────────┐
    │                │            │            │
Claude Code    Codex CLI    OpenCode      More...
                                       (Gemini CLI, etc.)
```

**Benefits**:
- Easy to extend to new AI assistants
- Each adapter handles format-specific parsing
- Core engine remains stable

### Local-First Architecture

```
Your Machine
├── ~/.claude/projects/        # Claude Code data
├── ~/.codex/                  # Codex CLI data
├── ~/.local/share/opencode/   # OpenCode data
├── ~/.vimo/db/                # Memex storage
│   ├── ai-cli-session.db      # SQLite (FTS5 index)
│   └── lancedb/               # Vector storage
└── Memex Server (localhost:10013)
```

**Benefits**:
- Complete data ownership
- No cloud dependencies for storage
- Privacy-first design
- Works offline (except embeddings need Ollama)

## Future Vision

Memex's architecture lays the foundation for future capabilities:

### Team Collaboration
Share technical decisions and best practices across team members. One developer's debugging session becomes searchable knowledge for the whole team.

### Multi-Device Sync
Seamless experience between home and office. Your work laptop conversation history available on your personal machine.

### Broader AI Assistant Support
Continue extending Adapter support to more AI assistants (Gemini CLI, Cursor, Copilot...). One memory layer for all your AI interactions.

---

**We believe**: AI assistants will continue to evolve, but your knowledge should persist forever.

Memex gives you that permanence - on your terms, under your control.

## Getting Started

Ready to give Claude long-term memory? Head to the [Installation Guide](/docs/memex/installation) to get started.

For technical details, see the [Architecture Documentation](/docs/memex/architecture).
