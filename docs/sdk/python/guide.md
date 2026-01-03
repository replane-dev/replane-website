---
title: Python SDK Guide
description: Learn how to integrate the Replane Python SDK with FastAPI, Flask, and Django. Includes testing patterns, context-based overrides, and best practices.
sidebar_label: Guide
---

# Python SDK Guide

Framework integration, testing, and best practices for the Python SDK.

## Context and overrides

Context is used to evaluate override rules. Context data stays in your application and is never sent to the server.

### Client-level context

Applied to all `get()` calls:

```python
replane = Replane(
    base_url="https://replane.example.com",
    sdk_key="rp_...",
    context={"environment": "production", "region": "us-east"},
)

# Uses client context
value = replane.get("config-name")
```

### Per-evaluation context

Merged with client context (per-call values take precedence):

```python
value = replane.get("feature-flag", context={
    "user_id": user.id,
    "plan": user.plan,
})
```

## Testing

### In-memory client

Use `InMemoryReplaneClient` or `create_test_client` for tests:

```python
from replane.testing import create_test_client, InMemoryReplaneClient

# Simple usage
client = create_test_client({
    "feature-enabled": True,
    "rate-limit": 100,
})

assert client.get("feature-enabled") is True
assert client.get("rate-limit") == 100
```

### Testing with overrides

```python
client = InMemoryReplaneClient()
client.set_config(
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

assert client.get("feature", context={"plan": "free"}) is False
assert client.get("feature", context={"plan": "pro"}) is True
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
    flags = replane.get("feature-flags")
    assert flags["dark-mode"] is True
```

## Framework integration

### FastAPI

```python
from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends
from replane import AsyncReplane

replane: AsyncReplane | None = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    global replane
    replane = AsyncReplane(
        base_url="https://replane.example.com",
        sdk_key="rp_...",
    )
    await replane.connect()
    yield
    await replane.close()

app = FastAPI(lifespan=lifespan)

def get_replane() -> AsyncReplane:
    assert replane is not None
    return replane

@app.get("/items")
async def get_items(rp: AsyncReplane = Depends(get_replane)):
    max_items = rp.get("max-items", context={"plan": "free"})
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
    max_items = rp.get("max-items")
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
    rate_limit = settings.REPLANE.get(
        "rate-limit",
        context={"user_id": request.user.id}
    )
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

value = replane.get("feature-flag")
```

### Use context managers

Context managers ensure proper cleanup:

```python
with Replane(...) as replane:
    # Client is connected and ready
    value = replane.get("config")
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

