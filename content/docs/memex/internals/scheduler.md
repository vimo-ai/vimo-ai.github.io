---
title: Scheduler Internals
description: How Memex background tasks work
navigation:
  order: 8
---

Memex runs several background tasks to keep your session data indexed and backed up. This document explains the internal call structure of each task.

## Task Overview

```rust
// In main.rs setup_scheduler()
scheduler.every(30.seconds()).run(|| collect_all());
scheduler.every(60.seconds()).run(|| index_pending());
scheduler.every(1.day()).run(|| backup());
scheduler.every(1.hour()).run(|| check_and_archive_all());
scheduler.every(1.day()).run(|| compact());
```

## Task: collect_all

Scans Claude Code session files and imports new messages.

```
collect_all
├── adapters                          # Get registered parsers
├── blocking_get_or_create_project    # Find or create project
│   └── get_or_create_project_with_encoded
├── blocking_get_session_latest_timestamp
│   └── get_session_latest_timestamp
├── blocking_upsert_session           # Update session metadata
│   └── upsert_session
├── blocking_insert_messages          # Insert new messages
│   └── insert_messages
└── extract_project_name              # Parse project from path
```

**Key Files:**
- `src/collector/mod.rs`
- `src/shared_adapter.rs`

## Task: index_pending

Generates embeddings for unindexed messages and stores them in LanceDB.

```
index_pending
├── count_unindexed_messages          # Check if work needed
└── index_batch
    ├── get_unindexed_messages        # Fetch batch
    ├── chunk                         # Split long messages
    │   ├── separate_code_and_text
    │   ├── split_text_by_paragraph
    │   └── split_by_length
    ├── embed_batch                   # Call Ollama
    ├── insert                        # Store in LanceDB
    ├── mark_messages_indexed         # Update status
    └── mark_messages_index_failed    # Handle failures
```

**Key Files:**
- `src/indexer/mod.rs`
- `src/embedding/mod.rs`
- `src/vector/mod.rs`

## Task: backup

Creates daily SQLite backups with rotation.

```
backup
├── has_backup_today                  # Skip if already done
│   └── list_backups
├── get_latest_backup                 # For incremental
│   └── list_backups
├── (create backup file)
└── cleanup_old_backups               # Rotate old backups
    └── list_backups
```

**Key Files:**
- `src/backup/mod.rs`

## Task: check_and_archive_all

Compresses old session files into `.tar.xz` archives.

```
check_and_archive_all
├── try_lock                          # Prevent concurrent runs
├── find_archivable_files             # Find old files
├── do_archive                        # Daily archives
│   ├── daily_archive_path
│   └── compress_files
│       └── (xz compression)
├── do_merge                          # Weekly/monthly merges
│   ├── find_daily_archives
│   ├── find_weekly_archives
│   ├── find_monthly_archives
│   ├── is_date_covered_by_weekly
│   ├── weekly_archive_path
│   ├── monthly_archive_path
│   └── yearly_archive_path
├── record_success                    # Update state
│   └── save
└── (release lock)
```

**Archive Strategy:**

| Period | Retention | Merge Target |
|--------|-----------|--------------|
| Daily | 7 days | Weekly |
| Weekly | 4 weeks | Monthly |
| Monthly | 12 months | Yearly |
| Yearly | Forever | - |

**Key Files:**
- `src/archive/mod.rs`
- `src/archive/compressor.rs`
- `src/archive/state.rs`

## Task: compact

Optimizes LanceDB vector storage.

```
compact
└── compact (vector/mod.rs)
    └── (LanceDB internal compaction)
```

**Key Files:**
- `src/vector/mod.rs`

## Error Handling

Each task uses `try_lock` or similar mechanisms to prevent concurrent execution:

```rust
// Simplified pattern
if !state.try_lock() {
    return; // Another instance running
}
defer!(state.release());

match do_work() {
    Ok(_) => state.record_success(),
    Err(e) => state.record_failure(e),
}
```

Failed tasks are retried on the next scheduled run. Persistent failures are logged but don't crash the application.

---

*Generated from source code analysis using [akin](https://github.com/vimo-ai/akin).*
