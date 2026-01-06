---
title: Python SDK API Reference
description: Complete API documentation for the Replane Python SDK including sync Replane class, async AsyncReplane, configs accessor, subscriptions, and exception handling.
sidebar_label: API Reference
---

# Python SDK API Reference

Complete API documentation for the Python SDK.

## `Replane(options)`

Creates a synchronous Replane client. Uses only Python standard library (zero dependencies).

### Options

| Option                      | Type        | Required | Description                                               |
| --------------------------- | ----------- | -------- | --------------------------------------------------------- |
| `base_url`                  | `str`       | No*      | Replane server URL (can also be provided in `connect()`)  |
| `sdk_key`                   | `str`       | No*      | SDK key for authentication (can also be provided in `connect()`) |
| `context`                   | `dict`      | No       | Default context for all override evaluations              |
| `defaults`                  | `dict`      | No       | Default values if server unavailable during init          |
| `required`                  | `list[str]` | No       | Config names that must exist (raises if missing)          |
| `request_timeout_ms`        | `int`       | No       | HTTP request timeout (default: 2000)                      |
| `initialization_timeout_ms` | `int`       | No       | Initial connection timeout (default: 5000)                |
| `retry_delay_ms`            | `int`       | No       | Base retry delay with exponential backoff (default: 200)  |
| `inactivity_timeout_ms`     | `int`       | No       | Reconnect if no events for this duration (default: 30000) |
| `agent`                     | `str`       | No       | Agent identifier for User-Agent header                    |
| `debug`                     | `bool`      | No       | Enable debug logging (default: False)                     |

*`base_url` and `sdk_key` must be provided either in the constructor or in `connect()`.

### Example

```python
replane = Replane(
    base_url="https://cloud.replane.dev",
    sdk_key="rp_...",
    context={"environment": "production"},
    defaults={
        "rate-limit": 100,
        "feature-enabled": False,
    },
    required=["rate-limit", "feature-enabled"],
    request_timeout_ms=3000,
    debug=True,
)
```

## `AsyncReplane(options)`

Creates an asynchronous Replane client. Requires the `async` extra (`pip install replane[async]`).

Same options as `Replane`. Uses `httpx` for async HTTP operations.

```python
from replane import AsyncReplane

async with AsyncReplane(
    base_url="https://cloud.replane.dev",
    sdk_key="rp_...",
) as replane:
    # Access configs from local cache
    value = replane.configs["config-name"]
```

## `replane.subscribe(callback)`

Subscribes to all config changes. Returns an unsubscribe function.

```python
def on_any_change(name: str, config):
    print(f"Config {name} changed to {config.value}")

unsubscribe = replane.subscribe(on_any_change)

# Later: stop receiving updates
unsubscribe()
```

## `replane.subscribe_config(name, callback)`

Subscribes to changes for a specific config. Returns an unsubscribe function.

```python
def on_feature_change(config):
    update_feature_state(config.value)

unsubscribe = replane.subscribe_config("my-feature", on_feature_change)
```

## `replane.connect(base_url=None, sdk_key=None, *, wait=True)`

Connects to the Replane server. Called automatically when using context manager.

Credentials (`base_url` and `sdk_key`) can be provided either in the constructor or in `connect()`. If provided in both, the `connect()` values take precedence.

```python
# Option 1: Credentials in constructor
replane = Replane(base_url="...", sdk_key="...")
replane.connect()

# Option 2: Credentials in connect()
replane = Replane()
replane.connect(base_url="...", sdk_key="...")

# Non-blocking connection
replane.connect(wait=False)
replane.wait_for_init()  # Wait when ready
```

## `replane.close()`

Closes the client and cleans up resources. Called automatically when using context manager.

```python
replane.close()
```

## `replane.is_initialized()`

Returns `True` if the client has completed initial config fetch.

```python
if replane.is_initialized():
    value = replane.configs["config"]
```

## `replane.configs`

A dictionary-like accessor for configurations. Provides bracket notation access with override evaluation using the client's default context.

When using generated TypedDict types, this property enables full type safety.

### Methods

| Method              | Description                                         |
| ------------------- | --------------------------------------------------- |
| `configs[name]`     | Get config value; raises `KeyError` if not found    |
| `configs.get(name)` | Get config value; returns `None` or default if not found |
| `name in configs`   | Check if config exists                              |
| `configs.keys()`    | Return list of all config names                     |

### Example

```python
from replane import Replane
from replane_types import Configs  # Generated TypedDict

with Replane[Configs](
    base_url="https://cloud.replane.dev",
    sdk_key="rp_...",
    context={"plan": "premium"},  # Default context for override evaluation
) as replane:
    # Dictionary-style access with type safety
    settings = replane.configs["app-settings"]
    print(settings["max_upload_size_mb"])  # IDE knows the type
    
    # Check if config exists
    if "feature-flag" in replane.configs:
        flag = replane.configs["feature-flag"]
    
    # Safe access with default
    timeout = replane.configs.get("timeout", 30)
    
    # List all config names
    for name in replane.configs.keys():
        print(name)
```

## `replane.with_context(context)`

Creates a scoped client wrapper with additional context merged with the client's default context.

The returned wrapper has the same interface (`configs`, `subscribe()`, etc.) but uses the merged context for all operations. The original client is unaffected.

### Parameters

| Parameter | Type   | Required | Description               |
| --------- | ------ | -------- | ------------------------- |
| `context` | `dict` | Yes      | Additional context to merge |

### Returns

A `ContextualReplane` (or `ContextualAsyncReplane`) wrapper with the merged context.

### Example

```python
with Replane(
    base_url="https://cloud.replane.dev",
    sdk_key="rp_...",
    context={"environment": "production"},
) as replane:
    # Create a scoped client for a specific user
    user_client = replane.with_context({
        "user_id": user.id,
        "plan": user.plan,
    })
    
    # All operations use the merged context
    rate_limit = user_client.configs["rate-limit"]
    settings = user_client.configs["app-settings"]
    
    # Can be chained for additional context
    request_client = user_client.with_context({"region": "eu"})
    
    # Original client is unaffected
    assert replane.configs["rate-limit"] != user_client.configs["rate-limit"]
```

### Use cases

**Per-request context in web frameworks:**

```python
@app.get("/items")
async def get_items(request: Request):
    user_client = replane.with_context({
        "user_id": request.user.id,
        "plan": request.user.plan,
    })
    max_items = user_client.configs["max-items"]
    return {"max_items": max_items}
```

**Feature flags for specific users:**

```python
def check_feature_for_user(user):
    user_client = replane.with_context({"user_id": user.id})
    return user_client.configs["beta-features"]["new-ui"]
```

## `replane.with_defaults(defaults)`

Creates a scoped client wrapper with additional default values.

The returned wrapper has the same interface (`configs`, `subscribe()`, etc.) but uses the provided defaults when configs are not found. The original client is unaffected.

### Parameters

| Parameter  | Type   | Required | Description                                  |
| ---------- | ------ | -------- | -------------------------------------------- |
| `defaults` | `dict` | Yes      | Default values to use when configs not found |

### Returns

A `ContextualReplane` (or `ContextualAsyncReplane`) wrapper with the additional defaults.

### Example

```python
with Replane(
    base_url="https://cloud.replane.dev",
    sdk_key="rp_...",
) as replane:
    # Create a client with fallback defaults
    safe_client = replane.with_defaults({
        "timeout": 30,
        "max-retries": 3,
    })
    
    # Returns the default if config doesn't exist
    timeout = safe_client.configs["timeout"]  # 30 if not configured
    
    # Can be chained
    safer_client = safe_client.with_defaults({"batch-size": 100})
    
    # Combine with with_context()
    user_client = replane.with_context({"plan": "premium"}).with_defaults({
        "rate-limit": 1000,
    })
```

### Precedence

1. Explicit `default` parameter in `configs.get()` - highest priority
2. Scoped defaults from `with_defaults()`
3. `KeyError` if neither provided - raised (for bracket access)
4. `None` if using `configs.get()` without default

```python
safe_client = replane.with_defaults({"feature": "scoped-default"})

# Explicit default in configs.get() takes precedence
value = safe_client.configs.get("feature", "explicit")  # Returns "explicit"
```

## Exceptions

```python
from replane import (
    ReplaneError,          # Base exception
    ConfigNotFoundError,   # Missing required configs at init
    TimeoutError,          # Operation timed out
    AuthenticationError,   # Invalid SDK key (401)
    NetworkError,          # Network failures
    ClientClosedError,     # Operation on closed client
    NotInitializedError,   # Client not initialized
    MissingDependencyError,# Missing optional dependency
    ErrorCode,             # Error code enum
)
```

Note: Accessing a missing config via `replane.configs["name"]` raises a standard `KeyError`, not `ConfigNotFoundError`. Use `replane.configs.get("name", default)` to avoid exceptions.

### Error handling example

```python
try:
    value = replane.configs["my-config"]
except KeyError as e:
    print(f"Config not found: {e}")
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

