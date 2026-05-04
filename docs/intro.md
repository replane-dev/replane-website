---
slug: /
title: Introduction
description: Replane is a dynamic configuration platform for feature flags, A/B testing, operational tuning, and cross-service config. Change settings in realtime without deploys.
---

# Replane Documentation

Replane is a dynamic configuration platform that lets you change application settings in realtime without deploying code. Use it for feature flags, operational tuning, A/B testing, and cross-service configuration.

## Get started

<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 mb-8">

<a href="/docs/getting-started/quickstart" className="block p-4 border-2 border-blue-500 dark:border-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors no-underline">
  <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Quickstart</h3>
  <p className="text-gray-600 dark:text-gray-400 text-sm">Deploy Replane locally in minutes with Docker.</p>
</a>

<a href="/docs/self-hosting/docker" className="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors no-underline">
  <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Self-Hosting</h3>
  <p className="text-gray-600 dark:text-gray-400 text-sm">Run on your infrastructure with Docker or your own orchestration stack.</p>
</a>

<a href="/docs/concepts/overview" className="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors no-underline">
  <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Core Concepts</h3>
  <p className="text-gray-600 dark:text-gray-400 text-sm">Learn about workspaces, projects, configs, and override rules.</p>
</a>

<a href="/docs/sdk/javascript" className="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors no-underline">
  <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">JavaScript SDK</h3>
  <p className="text-gray-600 dark:text-gray-400 text-sm">Integrate Replane into Node.js, browsers, Deno, or Bun.</p>
</a>

</div>

## What you can build

| Use case | Description |
|----------|-------------|
| **Feature flags** | Toggle features on or off without deploying code |
| **Gradual rollouts** | Roll out features to a percentage of users |
| **A/B testing** | Serve different values to different user segments |
| **Operational tuning** | Adjust rate limits, timeouts, and batch sizes in realtime |
| **Kill switches** | Instantly disable features during incidents |
| **Cross-service config** | Share settings across multiple services |

## How it works

```
                                ╭───────────────╮
                                │  PostgreSQL   │
                                ╰───────┬───────╯
                                        │
              ┌─────────────────────────┼─────────────────────────┐
              │                         │                         │
              ▼                         ▼                         ▼
     ╭─────────────────╮       ╭─────────────────╮       ╭─────────────────╮
     │     Replane     │       │     Replane     │       │     Replane     │
     │     US East     │       │     EU West     │       │     AP South    │
     │  ·············  │       │  ·············  │       │  ·············  │
     │  config cache   │       │  config cache   │       │  config cache   │
     ╰────────┬────────╯       ╰────────┬────────╯       ╰────────┬────────╯
              │                         │                         │
              │ SSE                     │ SSE                     │ SSE
              ▼                         ▼                         ▼
     ╭─────────────────╮       ╭─────────────────╮       ╭─────────────────╮
     │    Your App     │       │    Your App     │       │    Your App     │
     │  ·············  │       │  ·············  │       │  ·············  │
     │   local cache   │       │   local cache   │       │   local cache   │
     ╰─────────────────╯       ╰─────────────────╯       ╰─────────────────╯
```

1. **Create configs** in the Replane dashboard — changes are stored in PostgreSQL
2. **Edge servers pull and cache** configs locally for fast reads
3. **SDKs connect to the nearest edge** and cache configs in memory
4. **Reads are instant** — `replane.get()` returns from local cache, no network call
5. **Updates stream in realtime** via SSE, keeping all caches in sync

**High availability** — Each Replane node operates independently with its own cache. As long as at least one node is running, your clients will receive configs. If a node goes down, SDKs automatically reconnect to another.

:::tip Deployment
You can run multiple Replane nodes in your own infrastructure to keep config reads close to your applications and improve availability.
:::

## Key features

- **Realtime updates** — Changes propagate instantly via SSE, no polling required
- **Override rules** — Return different values based on user ID, plan, region, or any context property
- **Version history** — Every change creates an immutable snapshot with full audit trail
- **Instant rollback** — Revert to any previous version with one click
- **JSON Schema validation** — Prevent invalid configurations before they're saved
- **Type-safe SDK** — Full TypeScript support with automatic type inference
- **Self-hosted deployment** — Run Replane on your own infrastructure

## Example

```typescript
import { Replane } from '@replanejs/sdk';

const replane = new Replane();
await replane.connect({
  sdkKey: process.env.REPLANE_SDK_KEY!,
  baseUrl: 'https://replane.example.com',
});

// Get a feature flag
const showNewUI = replane.get('new-ui-enabled');

// Get a value with user context for override evaluation
const rateLimit = replane.get('api-rate-limit', {
  context: { userId: user.id, plan: user.plan }
});

// Subscribe to realtime updates
replane.subscribe('new-ui-enabled', (config) => {
  console.log('Feature flag changed:', config.value);
});
```

## Next steps

- Follow the [Quickstart](/docs/getting-started/quickstart) to deploy Replane
- Read [Core Concepts](/docs/concepts/overview) to understand the data model
- Explore [Guides](/docs/guides/feature-flags) for common use cases
