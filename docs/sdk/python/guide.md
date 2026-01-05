---
title: Python SDK Guide
description: Learn how to integrate the Replane Python SDK with FastAPI, Flask, and Django. Includes testing patterns, context-based overrides, and best practices.
sidebar_label: Guide
---

# Python SDK Guide

Framework integration, testing, and best practices for the Python SDK.

## Type-safe with TypedDict

Generate TypedDict types from the Replane dashboard for full type safety with your configs.

### Using generated types

```python
from replane import Replane
from replane_types import Configs  # Generated from Replane dashboard

# Pass the Configs TypedDict as a type parameter
with Replane[Configs](
    base_url="https://replane.example.com",
    sdk_key="rp_...",
) as replane:
    # Access configs with dictionary-style notation
    settings = replane.configs["app-settings"]

    # Full type safety - IDE knows the structure
    print(settings["maxUploadSizeMb"])
    print(settings["allowedFileTypes"])
```

### The `.configs` accessor

The `.configs` property provides a dictionary-like interface:

```python
# Bracket access (raises KeyError if missing)
value = replane.configs["feature-flag"]

# Safe access with default
timeout = replane.configs.get("timeout", 30)

# Check if config exists
if "feature-flag" in replane.configs:
    flag = replane.configs["feature-flag"]

# List all config names
for name in replane.configs.keys():
    print(name)
```

### Accessing configs

| Method                                 | Description                                          |
| -------------------------------------- | ---------------------------------------------------- |
| `replane.configs["name"]`              | Returns config value; raises `KeyError` if not found |
| `replane.configs.get("name")`          | Returns config value or `None` if not found          |
| `replane.configs.get("name", default)` | Returns config value or `default` if not found       |
| `"name" in replane.configs`            | Check if config exists                               |

Use bracket notation when you want an error on missing configs. Use `.get()` for safe access with fallback values.

## Context and overrides

Context is used to evaluate override rules. Context data stays in your application and is never sent to the server.

### Client-level context

Applied to all config accesses:

```python
replane = Replane(
    base_url="https://replane.example.com",
    sdk_key="rp_...",
    context={"environment": "production", "region": "us-east"},
)

# Uses client context
value = replane.configs["config-name"]
```

### Per-evaluation context

Merged with client context (per-call values take precedence):

```python
value = replane.with_context({
    "user_id": user.id,
    "plan": user.plan,
}).configs["feature-flag"]
```

### Scoped clients with `with_context()`

Create lightweight scoped clients for specific users or requests:

```python
with Replane(
    base_url="https://replane.example.com",
    sdk_key="rp_...",
) as replane:
    # Create a scoped client for a specific user
    user_client = replane.with_context({
        "user_id": user.id,
        "plan": user.plan,
    })

    # All operations use the merged context
    rate_limit = user_client.configs["rate-limit"]
    settings = user_client.configs["app-settings"]

    # Chaining for additional context
    request_client = user_client.with_context({"region": request.region})
```

This is especially useful in web frameworks for per-request context:

```python
@app.get("/items")
async def get_items(request: Request):
    user_client = replane.with_context({
        "user_id": request.user.id,
        "plan": request.user.plan,
    })
    return {"max_items": user_client.configs["limits"]["max_items"]}
```

### Scoped defaults with `with_defaults()`

Create scoped clients with fallback values for missing configs:

```python
with Replane(
    base_url="https://replane.example.com",
    sdk_key="rp_...",
) as replane:
    # Create a client with fallback defaults
    safe_client = replane.with_defaults({
        "timeout": 30,
        "max-retries": 3,
    })

    # Returns the default if config doesn't exist
    timeout = safe_client.configs["timeout"]  # 30 if not configured
```

Combine both methods for flexible scoping:

```python
# User-specific context with safe defaults
user_client = replane.with_context({
    "user_id": user.id,
    "plan": user.plan,
}).with_defaults({
    "rate-limit": 100,
    "max-upload-size": 10,
})

# Uses context for override evaluation, falls back to defaults
rate_limit = user_client.configs["rate-limit"]
```

## Testing

### In-memory client

Use `InMemoryReplaneClient` or `create_test_client` for tests:

```python
from replane.testing import create_test_client, InMemoryReplaneClient

# Simple usage
replane = create_test_client({
    "feature-enabled": True,
    "rate-limit": 100,
})

assert replane.configs["feature-enabled"] is True
assert replane.configs["rate-limit"] == 100
```

### Testing with overrides

```python
replane = InMemoryReplaneClient()
replane.set_config(
    "feature",
    value=False,
    overrides=[{
        "name": "premium-users",
        "conditions": [
            {"operator": "in", "property": "plan", "expected": ["pro", "enterprise"]}
        ],
        "value": True,
    }],
)

assert replane.with_context({"plan": "free"}).configs["feature"] is False
assert replane.with_context({"plan": "pro"}).configs["feature"] is True
```

### Pytest fixture

```python
import pytest
from replane.testing import create_test_client

@pytest.fixture
def replane():
    return create_test_client({
        "feature-flags": {"dark-mode": True, "new-ui": False},
        "rate-limits": {"default": 100, "premium": 1000},
    })

def test_feature_flag(replane):
    flags = replane.configs["feature-flags"]
    assert flags["dark-mode"] is True
```

## Framework integration

### FastAPI

```python
from contextlib import asynccontextmanager
from typing import Annotated

from fastapi import FastAPI, Depends
from replane import AsyncReplane

_replane: AsyncReplane | None = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    global _replane
    _replane = AsyncReplane(
        base_url="https://replane.example.com",
        sdk_key="rp_...",
    )
    await _replane.connect()
    yield
    await _replane.close()

app = FastAPI(lifespan=lifespan)

def get_replane() -> AsyncReplane:
    assert _replane is not None
    return _replane

# Define reusable dependency type
Replane = Annotated[AsyncReplane, Depends(get_replane)]

@app.get("/items")
async def get_items(replane: Replane):
    free_client = replane.with_context({"plan": "free"})
    max_items = free_client.configs["max-items"]
    return {"max_items": max_items}
```

### Flask

```python
from flask import Flask
from replane import Replane

app = Flask(__name__)
replane: Replane | None = None

def get_replane():
    global replane
    if replane is None:
        replane = Replane(
            base_url="https://replane.example.com",
            sdk_key="rp_...",
        )
        replane.connect()
    return replane

@app.route("/items")
def get_items():
    rp = get_replane()
    max_items = rp.configs["max-items"]
    return {"max_items": max_items}

@app.teardown_appcontext
def close_replane(exception):
    if replane is not None:
        replane.close()
```

### Django

```python
# settings.py
from replane import Replane

REPLANE = Replane(
    base_url="https://replane.example.com",
    sdk_key="rp_...",
)
REPLANE.connect()

# views.py
from django.conf import settings

def my_view(request):
    user_client = settings.REPLANE.with_context({"user_id": request.user.id})
    rate_limit = user_client.configs["rate-limit"]
    # ...
```

## Best practices

### Initialize once

Create the client once at application startup:

```python
# config.py
from replane import Replane
import os

replane = Replane(
    base_url=os.environ["REPLANE_URL"],
    sdk_key=os.environ["REPLANE_SDK_KEY"],
)
replane.connect()

# app.py
from config import replane

value = replane.configs["feature-flag"]
```

### Use context managers

Context managers ensure proper cleanup:

```python
with Replane(...) as replane:
    # Client is connected and ready
    value = replane.configs["config"]
# Client is automatically closed
```

### Use defaults for resilience

```python
replane = Replane(
    base_url="https://replane.example.com",
    sdk_key="rp_...",
    defaults={
        "feature-flag": False,
        "rate-limit": 100,
    },
)
```

### Clean up on shutdown

```python
import atexit

replane = Replane(...)
replane.connect()

atexit.register(replane.close)
```
