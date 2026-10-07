---
title: Rust SDK Guide
description: Learn how to test code that uses the Replane Rust SDK, integrate it with axum, evaluate per-request context, react to config changes, configure TLS, and follow production best practices.
sidebar_label: Guide
---

# Rust SDK Guide

Generated types, testing, axum integration, and best practices for the Rust SDK.

## Generated types

Replane can generate Rust types from your config schemas, so configs are read into checked structs instead of loosely typed JSON.

### Generating the types

1. Open your project's configs in the Replane dashboard and click **Generate Types**.
2. Pick an environment and **Rust**.
3. Save the output as `src/replane_types.rs`.

The generated code uses serde, so add it next to the SDK:

```bash
cargo add serde --features derive
cargo add serde_json
```

Regenerate the file whenever you change a config's schema.

### What gets generated

Every config gets a type named after it in PascalCase. Object schemas become structs, enums become Rust enums, and primitive configs become type aliases:

```rust
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CheckoutSettings {
    pub enabled: bool,
    pub max_items: i64,
}

pub type RateLimit = i64;
```

Fields that aren't `required` in the schema become `Option<T>`, and configs without a schema become `Option<serde_json::Value>`.

### Using generated types

Declare the module and pass the types to `get`:

```rust
mod replane_types;

use replane::{ConnectOptions, Replane};
use replane_types::{CheckoutSettings, RateLimit};

#[tokio::main]
async fn main() -> replane::Result<()> {
    let replane = Replane::builder()
        .connect(ConnectOptions::new("https://replane.example.com", "your-sdk-key"))
        .await?;

    let checkout: CheckoutSettings = replane.get("checkout-settings")?;
    let rate_limit: RateLimit = replane.get("rate-limit")?;

    if checkout.enabled {
        println!("max items: {}, rate limit: {rate_limit}", checkout.max_items);
    }
    Ok(())
}
```

The same types work with `get_with`, `get_or`, and `with_context`. If a value on the server doesn't match the generated type, `get` returns `ReplaneError::Deserialize` instead of panicking.

Generated types also implement `Serialize`, so they can be used as defaults:

```rust
let replane = Replane::builder()
    .default_value("checkout-settings", CheckoutSettings { enabled: false, max_items: 10 })
    .build();
```

Subscription callbacks receive the raw JSON value, so convert it with `serde_json`:

```rust
replane
    .subscribe("checkout-settings", |change| {
        if let Ok(settings) = serde_json::from_value::<CheckoutSettings>(change.value.clone()) {
            println!("max items is now {}", settings.max_items);
        }
    })
    .detach();
```

## Testing

A client built without connecting works entirely in memory. Use defaults to provide config values in tests:

```rust
use replane::Replane;

#[test]
fn test_feature_flag() {
    let replane = Replane::builder()
        .default_value("feature-enabled", true)
        .default_value("max-items", 50)
        .build();

    assert!(replane.get::<bool>("feature-enabled").unwrap());
    assert_eq!(replane.get::<u32>("max-items").unwrap(), 50);
}
```

### Testing with overrides

Seed the client with a snapshot to test override rules:

```rust
use replane::{Condition, Config, Context, Override, Replane, Snapshot};
use serde_json::json;

#[test]
fn test_overrides() {
    let replane = Replane::builder()
        .snapshot(Snapshot {
            configs: vec![Config {
                name: "premium-feature".into(),
                value: json!(false),
                overrides: vec![Override {
                    name: "premium-users".into(),
                    conditions: vec![Condition::Equals {
                        property: "plan".into(),
                        value: Some(json!("premium")),
                    }],
                    value: json!(true),
                }],
            }],
        })
        .build();

    let free = Context::new().with("plan", "free");
    let premium = Context::new().with("plan", "premium");

    assert!(!replane.get_with::<bool>("premium-feature", &free).unwrap());
    assert!(replane.get_with::<bool>("premium-feature", &premium).unwrap());
}
```

### Testing complex types

```rust
use replane::Replane;
use serde::Deserialize;
use serde_json::json;

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
struct ThemeConfig {
    dark_mode: bool,
    primary_color: String,
}

#[test]
fn test_complex_type() {
    let replane = Replane::builder()
        .default_value("theme", json!({ "darkMode": true, "primaryColor": "#3B82F6" }))
        .build();

    let theme: ThemeConfig = replane.get("theme").unwrap();

    assert!(theme.dark_mode);
    assert_eq!(theme.primary_color, "#3B82F6");
}
```

## Debug logging

The SDK logs connection events, reconnects, and config updates with [`tracing`](https://docs.rs/tracing). Enable a subscriber to see them:

```rust
tracing_subscriber::fmt()
    .with_env_filter("replane=debug")
    .init();
```

## axum integration

`Replane` is cheap to clone and thread-safe, so it works directly as axum state:

```rust
use axum::{extract::State, routing::get, Json, Router};
use replane::{ConnectOptions, Replane};
use serde_json::{json, Value};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let replane = Replane::builder()
        .default_value("max-items", 100)
        .connect(ConnectOptions::new(
            std::env::var("REPLANE_BASE_URL")?,
            std::env::var("REPLANE_SDK_KEY")?,
        ))
        .await?;

    let app = Router::new()
        .route("/api/items", get(list_items))
        .with_state(replane);

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await?;
    axum::serve(listener, app).await?;
    Ok(())
}

async fn list_items(State(replane): State<Replane>) -> Json<Value> {
    let max_items: u32 = replane.get_or("max-items", 100);
    Json(json!({ "maxItems": max_items }))
}
```

### Per-request context

Create a client with the request's context to evaluate overrides for the current user:

```rust
use axum::extract::{Path, State};
use replane::{Context, Replane};

async fn checkout(State(replane): State<Replane>, Path(user_id): Path<String>) -> String {
    let replane = replane.with_context(&Context::new().with("userId", user_id));

    if replane.get_or("new-checkout", false) {
        "new checkout".into()
    } else {
        "legacy checkout".into()
    }
}
```

`with_context` shares configs and the connection with the original client, so it's cheap to call per request.

## Reacting to changes

Subscriptions are useful for updating long-lived state, like a rate limiter, when a config changes:

```rust
use std::sync::atomic::{AtomicU64, Ordering};
use std::sync::Arc;

let limit = Arc::new(AtomicU64::new(replane.get_or("rate-limit", 100)));

let current = limit.clone();
replane
    .subscribe("rate-limit", move |change| {
        if let Some(value) = change.value.as_u64() {
            current.store(value, Ordering::Relaxed);
        }
    })
    .detach();
```

The callback receives the base value without overrides and runs on the connection task, so keep it short.

## TLS and HTTP client

TLS uses rustls by default. Switch to the platform's native TLS with features:

```toml
replane = { version = "0.1", default-features = false, features = ["native-tls"] }
```

To configure proxies, certificates, or other HTTP settings, pass your own `reqwest::Client`. Don't set a total request timeout on it, because the replication stream is long-lived:

```rust
let http = reqwest::Client::builder()
    .proxy(reqwest::Proxy::https("http://proxy.internal:8080")?)
    .build()?;

let options = ConnectOptions::new("https://replane.example.com", "your-sdk-key")
    .http_client(http);
```

## Best practices

### Share one client

Create one client at startup and clone it wherever it's needed. Clones share configs and the connection; creating a new client per request would open a new connection each time.

### Use defaults for resilience

Defaults keep your service working before the first connection and for configs the server doesn't have:

```rust
let replane = Replane::builder()
    .default_value("feature-flag", false)
    .default_value("rate-limit", 100)
    .connect(ConnectOptions::new("https://replane.example.com", "your-sdk-key"))
    .await?;
```

### Start even if Replane is unreachable

`connect` returns an error if the initial configs don't arrive within `connect_timeout`, and the client doesn't retry after that. To start with defaults and keep trying in the background:

```rust
use std::time::Duration;
use replane::{ConnectOptions, Replane};

let replane = Replane::builder()
    .default_value("feature-flag", false)
    .build();

let options = ConnectOptions::new("https://replane.example.com", "your-sdk-key");
let client = replane.clone();
tokio::spawn(async move {
    while let Err(e) = client.connect(options.clone()).await {
        tracing::warn!("Replane unavailable, retrying: {e}");
        tokio::time::sleep(Duration::from_secs(5)).await;
    }
});
```

Once connected, the client reconnects automatically if the connection drops.

### Prefer get_or on hot paths

`get_or` never fails: it returns the default when a config is missing or has an unexpected shape. Use `get` when you want to handle those cases explicitly.
