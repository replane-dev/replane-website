---
title: API Reference
description: Python SDK API documentation
sidebar_label: API Reference
---

# API Reference

Complete API documentation for the Python SDK.

## `Replane(options)`

Creates a synchronous Replane client. Uses only Python standard library (zero dependencies).

### Options

| Option                      | Type        | Required | Description                                               |
| --------------------------- | ----------- | -------- | --------------------------------------------------------- |
| `base_url`                  | `str`       | Yes      | Replane server URL                                        |
| `sdk_key`                   | `str`       | Yes      | SDK key for authentication                                |
| `context`                   | `dict`      | No       | Default context for all override evaluations              |
| `defaults`                  | `dict`      | No       | Default values if server unavailable during init          |
| `required`                  | `list[str]` | No       | Config names that must exist (raises if missing)          |
| `request_timeout_ms`        | `int`       | No       | HTTP request timeout (default: 2000)                      |
| `initialization_timeout_ms` | `int`       | No       | Initial connection timeout (default: 5000)                |
| `retry_delay_ms`            | `int`       | No       | Base retry delay with exponential backoff (default: 200)  |
| `inactivity_timeout_ms`     | `int`       | No       | Reconnect if no events for this duration (default: 30000) |
| `agent`                     | `str`       | No       | Agent identifier for User-Agent header                    |
| `debug`                     | `bool`      | No       | Enable debug logging (default: False)                     |

### Example

```python
replane = Replane(
    base_url="https://replane.example.com",
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
    base_url="https://replane.example.com",
    sdk_key="rp_...",
) as replane:
    # get() is synchronous - reads from local cache
    value = replane.get("config-name")
```

## `replane.get(name, *, context=None, default=None)`

Gets a config value. Returns the current value synchronously (reads from local cache).

### Parameters

| Parameter | Type   | Required | Description                                                  |
| --------- | ------ | -------- | ------------------------------------------------------------ |
| `name`    | `str`  | Yes      | Config name                                                  |
| `context` | `dict` | No       | Context for override evaluation (merged with client context) |
| `default` | `Any`  | No       | Default value if config not found                            |

### Returns

The config value, or `default` if not found.

### Example

```python
# Simple get
enabled = replane.get("feature-flag")

# With context
limit = replane.get("rate-limit", context={"plan": "premium"})

# With default
timeout = replane.get("request-timeout", default=30)
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

## `replane.connect(*, wait=True)`

Connects to the Replane server. Called automatically when using context manager.

```python
replane = Replane(...)
replane.connect()  # Blocks until initialized

# Or non-blocking
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
    value = replane.get("config")
```

## Exceptions

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

