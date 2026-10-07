---
slug: introducing-replane-rust-sdk
title: 'Introducing the Replane Rust SDK'
authors: anton
tags: [announcement, release, rust]
description: The official Rust SDK for Replane is now on crates.io. Typed configs with serde, realtime updates over SSE, client-side override evaluation, and in-memory testing, built on Tokio.
---

import TryReplaneCTA from '@site/src/components/TryReplaneCTA'

Replane now has an official Rust SDK. The [`replane`](https://crates.io/crates/replane) crate brings feature flags, operational settings, and per-user overrides to Rust services, with values that update in realtime and reads that never leave the process.

<!-- truncate -->

## Installation

```bash
cargo add replane
cargo add tokio --features macros,rt-multi-thread
```

The SDK is async and runs on Tokio. TLS uses rustls by default; enable the `native-tls` feature to use the platform's TLS instead.

## Quick start

```rust
use replane::{ConnectOptions, Context, Replane};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let replane = Replane::builder()
        .default_value("api-rate-limit", 100)
        .default_value("feature-new-checkout", false)
        .connect(ConnectOptions::new(
            "https://replane.example.com",
            std::env::var("REPLANE_SDK_KEY")?,
        ))
        .await?;

    // Read a value
    let limit: u32 = replane.get("api-rate-limit")?;

    // Read with context for override evaluation
    let context = Context::new().with("userId", "user-123").with("plan", "premium");
    let user_limit: u32 = replane.get_with("api-rate-limit", &context)?;

    println!("limit: {limit}, premium limit: {user_limit}");
    Ok(())
}
```

`connect` waits for the initial set of configs, so values are ready as soon as it returns. After that, the SDK keeps a Server-Sent Events stream open and applies changes as they're published, reconnecting automatically if the connection drops.

## Typed configs with serde

Config values are JSON, and `get` deserializes them into any type that implements `Deserialize`:

```rust
use serde::Deserialize;

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
struct Pricing {
    free_requests: u32,
    premium_requests: u32,
}

let pricing: Pricing = replane.get("pricing")?;
```

If a config is missing or has an unexpected shape, `get` returns an error you can match on. On hot paths, `get_or` returns a fallback instead.

## Overrides are evaluated locally

Override rules, like "premium users get a higher limit" or "enable for 10% of users", are evaluated inside the SDK against the context you pass. No request is made per read, so checking a flag in a request handler costs a map lookup and a few comparisons.

For per-request code, `with_context` creates a client that carries the context with it. It shares configs and the connection with the original, so it's cheap to create per request:

```rust
let user_client = replane.with_context(&Context::new().with("userId", "user-123"));
let enabled = user_client.get_or("feature-new-checkout", false);
```

## Reacting to changes

Most code just reads the current value when it needs it. For long-lived state, like a connection pool or a rate limiter, subscribe to changes:

```rust
let subscription = replane.subscribe("api-rate-limit", |change| {
    println!("{} changed to {}", change.name, change.value);
});
```

The subscription stops when it's dropped; call `.detach()` to keep it for the lifetime of the client.

## Testing without a server

A client built without connecting works entirely in memory, so tests don't need a Replane instance:

```rust
#[test]
fn uses_new_checkout() {
    let replane = Replane::builder()
        .default_value("feature-new-checkout", true)
        .build();

    assert!(replane.get::<bool>("feature-new-checkout").unwrap());
}
```

To test override rules, seed the client with a snapshot of configs. The [guide](/docs/sdk/rust/guide#testing-with-overrides) has an example.

## Fits into your service

`Replane` is cheap to clone and safe to share across threads, so it can sit directly in your axum or actix state. The SDK logs connection events through `tracing`, and you can pass your own `reqwest::Client` for proxies or custom certificates.

## Get started

- **Rust SDK docs**: [/docs/sdk/rust](/docs/sdk/rust)
- **crates.io**: [crates.io/crates/replane](https://crates.io/crates/replane)
- **API docs**: [docs.rs/replane](https://docs.rs/replane)
- **GitHub**: [github.com/replane-dev/replane-rust](https://github.com/replane-dev/replane-rust)

The SDK is MIT licensed. Issues and pull requests are welcome.

<TryReplaneCTA links={['quickstart', 'self-hosting', 'docs']} />
