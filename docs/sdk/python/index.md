---
title: Python SDK
description: Integrate Replane into Python applications with sync and async clients. Zero dependencies for sync, httpx for async. Includes FastAPI, Flask, and Django integration examples.
sidebar_label: Overview
slug: /sdk/python
---

# Python SDK

The official Python SDK for Replane. Works with Python 3.10+ and supports both synchronous and asynchronous usage.

Full API documentation is available on [ReadTheDocs](https://replane.readthedocs.io).

## Installation

```bash
# Sync client only (zero dependencies)
pip install replane

# With async support (requires httpx)
pip install replane[async]
```

## Quick start

### Synchronous client

```python
from replane import Replane

# Using context manager (recommended)
with Replane(
    base_url="https://cloud.replane.dev",
    sdk_key="rp_...",
) as replane:
    # Get a config value
    rate_limit = replane.configs["rate-limit"]

    # Get with context for override evaluation
    user_client = replane.with_context({"user_id": user.id, "plan": user.plan})
    feature_enabled = user_client.configs["new-feature"]

    # Get with fallback default
    timeout = replane.configs.get("request-timeout", 30)
```

### Asynchronous client

Requires `pip install replane[async]`:

```python
from replane import AsyncReplane

async with AsyncReplane(
    base_url="https://cloud.replane.dev",
    sdk_key="rp_...",
) as replane:
    # get() is sync since it reads from local cache
    rate_limit = replane.configs["rate-limit"]

    # With context
    enabled = replane.with_context({"plan": "premium"}).configs["feature"]
```

### Without context manager (sync)

```python
from replane import Replane

# Option 1: Provide credentials in constructor
replane = Replane(
    base_url="https://cloud.replane.dev",
    sdk_key="rp_...",
)
replane.connect()

# Option 2: Provide credentials in connect()
replane = Replane()
replane.connect(
    base_url="https://cloud.replane.dev",
    sdk_key="rp_...",
)

# Use configs
rate_limit = replane.configs["rate-limit"]
user_client = replane.with_context({"user_id": "123"})
feature = user_client.configs["feature-flag"]

# Don't forget to close when done
replane.close()
```

### Without context manager (async)

```python
from replane import AsyncReplane

# Option 1: Provide credentials in constructor
replane = AsyncReplane(
    base_url="https://cloud.replane.dev",
    sdk_key="rp_...",
)
await replane.connect()

# Option 2: Provide credentials in connect()
replane = AsyncReplane()
await replane.connect(
    base_url="https://cloud.replane.dev",
    sdk_key="rp_...",
)

# Use configs
rate_limit = replane.configs["rate-limit"]
user_client = replane.with_context({"user_id": "123"})
feature = user_client.configs["feature-flag"]

# Don't forget to close when done
await replane.close()
```

### Type-safe with generated types

Generate TypedDict types from the Replane dashboard for full type safety:

```python
from replane import Replane
from replane_types import Configs  # Generated from dashboard

with Replane[Configs](
    base_url="https://cloud.replane.dev",
    sdk_key="rp_...",
) as replane:
    # Dictionary-style access with full type safety
    settings = replane.configs["app-settings"]
    print(settings["maxUploadSizeMb"])  # IDE knows the type
```

## Features

- **Sync and async** — Choose based on your application
- **Zero dependencies** — Sync client uses only stdlib
- **Real-time updates** — SSE connection for instant changes
- **Context-based overrides** — Target users, plans, regions
- **Type-safe** — TypedDict support with `.configs` accessor
- **Testing utilities** — In-memory client for unit tests

## Next steps

- [API Reference](/docs/sdk/python/api) — Full API documentation
- [Guide](/docs/sdk/python/guide) — Framework integration, testing, best practices
- [Feature Flags](/docs/guides/feature-flags) — Toggle features
- [Override Rules](/docs/guides/override-rules) — Target specific users

