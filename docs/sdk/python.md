---
sidebar_position: 2
title: Python SDK
description: Integrate Replane into Python applications with sync and async support
---

# Python SDK

The official Python SDK for Replane. Works with Python 3.10+ and supports both synchronous and asynchronous usage.

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
    sdk_key="sk_live_...",
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
    sdk_key="sk_live_...",
) as replane:
    # get() is sync since it reads from local cache
    rate_limit = replane.get("rate-limit")

    # With context
    enabled = replane.get("feature", context={"plan": "premium"})
```

## API Reference

### `Replane(options)`

Creates a synchronous Replane client. Uses only Python standard library (zero dependencies).

#### Options

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `base_url` | `str` | Yes | Replane server URL |
| `sdk_key` | `str` | Yes | SDK key for authentication |
| `context` | `dict` | No | Default context for all override evaluations |
| `fallbacks` | `dict` | No | Fallback values if server unavailable during init |
| `required` | `list[str]` | No | Config names that must exist (raises if missing) |
| `request_timeout_ms` | `int` | No | HTTP request timeout (default: 2000) |
| `initialization_timeout_ms` | `int` | No | Initial connection timeout (default: 5000) |
| `retry_delay_ms` | `int` | No | Base retry delay with exponential backoff (default: 200) |
| `inactivity_timeout_ms` | `int` | No | Reconnect if no events for this duration (default: 30000) |
| `debug` | `bool` | No | Enable debug logging (default: False) |

#### Example

```python
replane = Replane(
    base_url="https://replane.example.com",
    sdk_key="sk_live_...",
    context={"environment": "production"},
    fallbacks={
        "rate-limit": 100,
        "feature-enabled": False,
    },
    required=["rate-limit", "feature-enabled"],
    request_timeout_ms=3000,
    debug=True,
)
```

### `AsyncReplane(options)`

Creates an asynchronous Replane client. Requires the `async` extra (`pip install replane[async]`).

Same options as `Replane`. Uses `httpx` for async HTTP operations.

```python
from replane import AsyncReplane

async with AsyncReplane(
    base_url="https://replane.example.com",
    sdk_key="sk_live_...",
) as replane:
    # get() is synchronous - reads from local cache
    value = replane.get("config-name")
```

### `replane.get(name, *, context=None, default=None)`

Gets a config value. Returns the current value synchronously (reads from local cache).

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | `str` | Yes | Config name |
| `context` | `dict` | No | Context for override evaluation (merged with client context) |
| `default` | `Any` | No | Default value if config not found |

#### Returns

The config value, or `default` if not found.

#### Example

```python
# Simple get
enabled = replane.get("feature-flag")

# With context
limit = replane.get("rate-limit", context={"plan": "premium"})

# With default
timeout = replane.get("request-timeout", default=30)
```

### `replane.subscribe(callback)`

Subscribes to all config changes. Returns an unsubscribe function.

```python
def on_any_change(name: str, config):
    print(f"Config {name} changed to {config.value}")

unsubscribe = replane.subscribe(on_any_change)

# Later: stop receiving updates
unsubscribe()
```

### `replane.subscribe_config(name, callback)`

Subscribes to changes for a specific config. Returns an unsubscribe function.

```python
def on_feature_change(config):
    update_feature_state(config.value)

unsubscribe = replane.subscribe_config("my-feature", on_feature_change)
```

### `replane.connect(*, wait=True)`

Connects to the Replane server. Called automatically when using context manager.

```python
replane = Replane(...)
replane.connect()  # Blocks until initialized

# Or non-blocking
replane.connect(wait=False)
replane.wait_for_init()  # Wait when ready
```

### `replane.close()`

Closes the client and cleans up resources. Called automatically when using context manager.

```python
replane.close()
```

### `replane.is_initialized()`

Returns `True` if the client has completed initial config fetch.

```python
if replane.is_initialized():
    value = replane.get("config")
```

## Context and overrides

Context is used to evaluate override rules. Context data stays in your application and is never sent to the server.

### Client-level context

Applied to all `get()` calls:

```python
replane = Replane(
    base_url="https://replane.example.com",
    sdk_key="sk_live_...",
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

### Context properties

Common context properties:

```python
{
    "user_id": "user-123",      # User identifier
    "plan": "premium",          # Subscription tier
    "region": "us-east",        # Geographic region
    "device_type": "mobile",    # Device type
    "app_version": "2.1.0",     # App version
    "environment": "production" # Environment
}
```

### Override examples

**Percentage rollout** (gradual feature release):
```python
# Server config has 10% rollout based on user_id
# Same user always gets same result (deterministic hashing)
enabled = replane.get("new-checkout", context={"user_id": user.id})
```

**Plan-based features**:
```python
max_items = replane.get("max-items", context={"plan": user.plan})
# Returns different values for free/pro/enterprise plans
```

**Geographic targeting**:
```python
content = replane.get("homepage-banner", context={"country": request.country})
```

## Required configs

Ensure critical configs exist on startup:

```python
replane = Replane(
    base_url="https://replane.example.com",
    sdk_key="sk_live_...",
    required=["rate-limit", "feature-enabled"],
)
# Raises ConfigNotFoundError if any required config is missing
```

## Fallback values

Provide fallback values if the server is unavailable during initialization:

```python
replane = Replane(
    base_url="https://replane.example.com",
    sdk_key="sk_live_...",
    fallbacks={
        "feature-flag": False,
        "rate-limit": 100,
        "timeout-ms": 5000,
    },
)
```

The client starts with fallback values and updates when connection is restored.

## Realtime updates

The SDK maintains a persistent SSE connection for realtime updates.

### How it works

1. Client connects to `/api/sdk/v1/replication/stream`
2. Server sends all current configs
3. Connection stays open
4. Server pushes changes as they happen
5. `get()` always returns the latest value

### Subscribing to changes

```python
# Subscribe to all changes
def on_any_change(name, config):
    print(f"{name} updated: {config.value}")

unsubscribe_all = replane.subscribe(on_any_change)

# Subscribe to specific config
def on_feature_change(config):
    update_ui(config.value)

unsubscribe_feature = replane.subscribe_config("feature-flag", on_feature_change)

# Unsubscribe when done
unsubscribe_all()
unsubscribe_feature()
```

### Async callbacks

With `AsyncReplane`, callbacks can be async:

```python
async def on_change(name: str, config):
    await database.log_config_change(name, config.value)

replane.subscribe(on_change)
```

## Error handling

### Exception hierarchy

```python
from replane import (
    ReplaneError,          # Base exception
    ConfigNotFoundError,   # Config doesn't exist
    TimeoutError,          # Operation timed out
    AuthenticationError,   # Invalid SDK key (401)
    NetworkError,          # Network failures
    ClientClosedError,     # Operation on closed client
    NotInitializedError,   # Client not initialized
    MissingDependencyError,# Missing optional dependency
    ErrorCode,             # Error code enum
)
```

### Error handling example

```python
try:
    value = replane.get("my-config")
except ConfigNotFoundError as e:
    print(f"Config not found: {e.config_name}")
except TimeoutError as e:
    print(f"Timed out after {e.timeout_ms}ms")
except AuthenticationError:
    print("Invalid SDK key - check credentials")
except NetworkError as e:
    print(f"Network error: {e.message}")
except ReplaneError as e:
    print(f"Error [{e.code}]: {e.message}")
    if e.__cause__:
        print(f"Caused by: {e.__cause__}")
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

### Dynamic config updates

```python
client = create_test_client({})
changes = []

client.subscribe(lambda name, cfg: changes.append(name))
client.set("config1", "value1")

assert changes == ["config1"]
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
        sdk_key="sk_live_...",
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
            sdk_key="sk_live_...",
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
    sdk_key="sk_live_...",
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

### Use fallbacks for resilience

```python
replane = Replane(
    base_url="https://replane.example.com",
    sdk_key="sk_live_...",
    fallbacks={
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

## Environment compatibility

| Environment | Support |
|-------------|---------|
| Python 3.10+ | Full |
| Sync client | Zero dependencies (stdlib only) |
| Async client | Requires `httpx>=0.25.0` |

## Next steps

- [Feature Flags](/docs/guides/feature-flags) — Toggle features
- [Override Rules](/docs/guides/override-rules) — Target specific users
- [Gradual Rollouts](/docs/guides/gradual-rollouts) — Percentage-based releases
