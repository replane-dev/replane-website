---
title: Rust SDK
description: Integrate Replane into Rust services with Tokio. Features synchronous typed reads via serde, local override evaluation, subscriptions, defaults, snapshots, and rustls or native TLS.
sidebar_label: Overview
slug: /sdk/rust
---

# Rust SDK

The official Rust SDK for Replane. Built on Tokio and reqwest, published on [crates.io](https://crates.io/crates/replane) as `replane`.

## Installation

```bash
cargo add replane
cargo add tokio --features macros,rt-multi-thread
```

Or in `Cargo.toml`:

```toml
[dependencies]
replane = "0.1"
tokio = { version = "1", features = ["macros", "rt-multi-thread"] }
```

TLS uses rustls by default. To use the platform's native TLS instead:

```toml
replane = { version = "0.1", default-features = false, features = ["native-tls"] }
```

## Quick start

```rust
use replane::{ConnectOptions, Context, Replane};

#[tokio::main]
async fn main() -> replane::Result<()> {
    // Connect and wait for the initial configs
    let replane = Replane::builder()
        .default_value("max-items", 100)
        .connect(ConnectOptions::new("https://replane.example.com", "your-sdk-key"))
        .await?;

    // Get a config value
    let feature_enabled: bool = replane.get("feature-enabled")?;

    // Get a value with context for override evaluation
    let ctx = Context::new().with("userId", "user-123").with("plan", "premium");
    let max_items: u32 = replane.get_with("max-items", &ctx)?;

    println!("feature: {feature_enabled}, max items: {max_items}");
    Ok(())
}
```

### Type-safe with generated types

Generate Rust types from the Replane dashboard and read configs straight into them:

```rust
mod replane_types; // Generated from dashboard

use replane_types::{CheckoutSettings, RateLimit};

let checkout: CheckoutSettings = replane.get("checkout-settings")?;
let rate_limit: RateLimit = replane.get("rate-limit")?;

println!("{}", checkout.max_items); // Typed fields, checked by the compiler
```

See [Generated types](/docs/sdk/rust/guide#generated-types) for setup.

## Features

- **Real-time updates** via Server-Sent Events (SSE)
- **Synchronous reads** — configs are kept in memory, `get` never touches the network
- **Client-side evaluation** — context never leaves your application
- **Gradual rollouts** with percentage-based segmentation, consistent with the other SDKs
- **Override rules** with flexible conditions
- **Type-safe** configuration access through `serde::Deserialize`, with types generated from your config schemas
- **Defaults and snapshots** for resilience and for testing without a server
- **rustls or native TLS**, or bring your own `reqwest::Client`

## Next steps

- [API Reference](/docs/sdk/rust/api) — Full API documentation
- [Guide](/docs/sdk/rust/guide) — Testing, axum integration, best practices
- [Feature Flags](/docs/guides/feature-flags) — Toggle features
- [Override Rules](/docs/guides/override-rules) — Target specific users
