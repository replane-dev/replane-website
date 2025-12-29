---
title: Python SDK
description: Integrate Replane into Python applications with sync and async support
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
    base_url="https://replane.example.com",
    sdk_key="rp_...",
) as replane:
    # Get a config value
    rate_limit = replane.get("rate-limit")

    # Get with context for override evaluation
    feature_enabled = replane.get(
        "new-feature",
        context={"user_id": user.id, "plan": user.plan},
    )

    # Get with fallback default
    timeout = replane.get("request-timeout", default=30)
```

### Asynchronous client

Requires `pip install replane[async]`:

```python
from replane import AsyncReplane

async with AsyncReplane(
    base_url="https://replane.example.com",
    sdk_key="rp_...",
) as replane:
    # get() is sync since it reads from local cache
    rate_limit = replane.get("rate-limit")

    # With context
    enabled = replane.get("feature", context={"plan": "premium"})
```

## Features

- **Sync and async** — Choose based on your application
- **Zero dependencies** — Sync client uses only stdlib
- **Real-time updates** — SSE connection for instant changes
- **Context-based overrides** — Target users, plans, regions
- **Testing utilities** — In-memory client for unit tests

## Next steps

- [API Reference](/docs/sdk/python/api) — Full API documentation
- [Guide](/docs/sdk/python/guide) — Framework integration, testing, best practices
- [Feature Flags](/docs/guides/feature-flags) — Toggle features
- [Override Rules](/docs/guides/override-rules) — Target specific users

