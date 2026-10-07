---
title: Rust SDK API Reference
description: Complete API documentation for the Replane Rust SDK including Replane, ReplaneBuilder, ConnectOptions, get, get_with, get_or, Context, subscribe, snapshots, and ReplaneError.
sidebar_label: API Reference
---

# Rust SDK API Reference

Complete API documentation for the Rust SDK. Generated rustdoc is available on [docs.rs](https://docs.rs/replane).

## Replane

The client. Create it with `Replane::builder()`:

```rust
use replane::{ConnectOptions, Replane};

let replane = Replane::builder()
    .connect(ConnectOptions::new("https://replane.example.com", "your-sdk-key"))
    .await?;
```

`Replane` is cheap to clone. Clones share configs and the connection, so you can store it in application state and pass it around freely. The connection closes when the last clone is dropped.

## ReplaneBuilder

| Method                        | Description                                                                 |
| ----------------------------- | --------------------------------------------------------------------------- |
| `context(context)`            | Context applied to every evaluation; per-call context takes precedence      |
| `default_value(name, value)`  | Value used until the server provides one, and if the server lacks the config |
| `defaults(iter)`              | Several defaults at once, as `(name, serde_json::Value)` pairs              |
| `snapshot(snapshot)`          | Configs from another client's `snapshot()`; take precedence over defaults   |
| `build()`                     | Creates a client that works in memory until `connect` is called             |
| `connect(options).await`      | Builds the client and connects it                                           |

```rust
use replane::{Context, Replane};
use serde_json::json;

let replane = Replane::builder()
    .context(Context::new().with("region", "eu"))
    .default_value("feature-enabled", false)
    .default_value("theme", json!({ "darkMode": false, "fontSize": 14 }))
    .build();
```

## connect

Connects to the server and waits until the initial configs arrive. After that the client stays connected in the background, reconnecting with exponential backoff when the connection drops. Must be called within a Tokio runtime.

```rust
use std::time::Duration;
use replane::ConnectOptions;

replane
    .connect(
        ConnectOptions::new("https://replane.example.com", "your-sdk-key")
            .connect_timeout(Duration::from_secs(10)),
    )
    .await?;
```

### ConnectOptions

| Option               | Default                  | Description                                                     |
| -------------------- | ------------------------ | --------------------------------------------------------------- |
| `base_url`           | required                 | Replane server URL (first argument of `ConnectOptions::new`)    |
| `sdk_key`            | required                 | SDK key for authentication (second argument)                    |
| `connect_timeout`    | 5s                       | How long `connect` waits for the initial configs                |
| `request_timeout`    | 2s                       | Timeout for establishing each stream request                    |
| `inactivity_timeout` | 30s                      | Reconnect if no events or heartbeats arrive for this long       |
| `retry_delay`        | 200ms                    | Initial reconnect delay, doubled per failure up to 10s          |
| `agent`              | `replane-rust-sdk/<ver>` | `User-Agent` header                                             |
| `http_client`        | built-in                 | Custom `reqwest::Client`; must not set a total request timeout  |

## disconnect / is_connected

```rust
replane.disconnect(); // stop receiving updates; already loaded configs keep working
assert!(!replane.is_connected());
```

## get

Returns the config value for the client context, with overrides applied, deserialized into any type implementing `serde::Deserialize`.

```rust
let enabled: bool = replane.get("feature-enabled")?;
let limit: u32 = replane.get("rate-limit")?;
let api_url: String = replane.get("api-url")?;

// Raw JSON value
let raw: serde_json::Value = replane.get("theme")?;
```

### Complex types

```rust
use serde::Deserialize;

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
struct ThemeConfig {
    dark_mode: bool,
    primary_color: String,
    font_size: u32,
}

let theme: ThemeConfig = replane.get("theme")?;
println!("Dark mode: {}", theme.dark_mode);
```

## get_with

Like `get`, with the given context merged over the client context:

```rust
use replane::Context;

let ctx = Context::new()
    .with("userId", "user-123")
    .with("plan", "premium")
    .with("region", "us-east");

let premium_feature: bool = replane.get_with("premium-feature", &ctx)?;
```

## get_or

Returns the default if the config is missing or can't be deserialized into the requested type. Deserialization failures are logged as a `tracing` warning.

```rust
let timeout_ms: u64 = replane.get_or("timeout-ms", 5000);
```

## Context

Properties that override rules are evaluated against. Values can be strings, numbers, booleans, or `None` (null).

```rust
use replane::Context;

let mut ctx = Context::new().with("userId", "user-123").with("age", 30);
ctx.insert("beta", true);
ctx.insert("company", None::<&str>);

// From an array of pairs
let ctx = Context::from([("plan", "premium"), ("region", "eu")]);
```

Each client also gets a random `replaneClientId` context value (`replane::REPLANE_CLIENT_ID_KEY`), which can be used for percentage rollouts. A value provided in the client context takes precedence.

## with_context

Returns a client that shares configs and the connection, with extra context merged in. Useful for per-request or per-user clients:

```rust
let user_client = replane.with_context(&Context::new().with("userId", "user-123"));
let enabled: bool = user_client.get("new-checkout")?;
```

## subscribe

Calls the callback whenever a config changes on the server. Returns a `Subscription`; dropping it unsubscribes.

```rust
let subscription = replane.subscribe("feature-flag", |change| {
    println!("{} changed to {}", change.name, change.value);
});

// Keep the subscription for the lifetime of the client
subscription.detach();
```

The callback receives a `ConfigChange` with the config `name` and its base `value` (a `serde_json::Value`, without overrides applied). It runs on the connection task, so keep it short. Call `get` or `get_with` inside it to get the evaluated value for a context.

## snapshot

Returns a serializable copy of the current configs, which can seed another client:

```rust
let snapshot = replane.snapshot();
let json = serde_json::to_string(&snapshot)?;

let restored = Replane::builder()
    .snapshot(serde_json::from_str(&json)?)
    .build();
```

## Errors

All fallible methods return `replane::Result<T>`, an alias for `Result<T, ReplaneError>`:

| Variant          | When                                                        |
| ---------------- | ----------------------------------------------------------- |
| `NotFound`       | The config doesn't exist                                    |
| `Deserialize`    | The value can't be deserialized into the requested type     |
| `Timeout`        | `connect` timed out; includes the last connection error     |
| `Auth`           | Invalid or missing SDK key                                  |
| `Forbidden`      | The SDK key isn't allowed to access the resource            |
| `Server`         | The server returned a 5xx response                          |
| `Client`         | The server returned another 4xx response                    |
| `Network`        | A network error from reqwest                                |
| `Protocol`       | Unexpected response from the server                         |
| `InvalidOptions` | Invalid connection options, e.g. an empty SDK key           |

```rust
use replane::ReplaneError;

match replane.get::<bool>("my-config") {
    Ok(value) => println!("value: {value}"),
    Err(ReplaneError::NotFound { name }) => println!("config not found: {name}"),
    Err(e) => println!("error [{}]: {e}", e.code()),
}
```

`ReplaneError::code()` returns a stable error code shared with the other Replane SDKs, such as `not_found` or `timeout`.

## Condition operators

The SDK supports these override operators:

| Operator                | Description                |
| ----------------------- | -------------------------- |
| `equals`                | Exact match                |
| `in`                    | Value is in list           |
| `not_in`                | Value is not in list       |
| `less_than`             | Less than comparison       |
| `less_than_or_equal`    | Less than or equal         |
| `greater_than`          | Greater than comparison    |
| `greater_than_or_equal` | Greater than or equal      |
| `segmentation`          | Percentage-based bucketing |
| `and`                   | All conditions must match  |
| `or`                    | Any condition must match   |
| `not`                   | Negate a condition         |

Overrides using an operator the SDK doesn't know are skipped instead of failing the whole config.
