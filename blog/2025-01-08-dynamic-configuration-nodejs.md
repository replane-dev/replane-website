---
slug: dynamic-configuration-nodejs
title: 'Dynamic Configuration in Node.js: Beyond Environment Variables'
authors: dmitry
tags: [nodejs, config-management, architecture, best-practices]
description: Environment variables are static. Learn how to implement dynamic configuration in Node.js with realtime updates, type safety, and instant rollback.
---

import TryReplaneCTA from '@site/src/components/TryReplaneCTA'

Environment variables work—until they don't. You set `RATE_LIMIT=100` in your `.env`, deploy, and forget about it. Then Black Friday hits. Your API is hammered. You need to drop that limit to 50. Right now.

The deploy pipeline takes 12 minutes.

This is the moment teams discover the difference between static configuration and dynamic configuration. Static config is baked into your deployment—it changes when you redeploy. Dynamic config lives outside your deployment—it changes when you change it.

<!-- truncate -->

## The Static Configuration Problem

Most Node.js applications start with environment variables:

```typescript
const config = {
  rateLimit: parseInt(process.env.RATE_LIMIT || '100'),
  featureNewCheckout: process.env.FEATURE_NEW_CHECKOUT === 'true',
  cacheMaxAge: parseInt(process.env.CACHE_MAX_AGE || '3600')
}
```

This pattern is fine for truly static values—database URLs, API keys, service endpoints. These values don't change while the application is running, and they shouldn't. But it falls apart for values you need to change quickly:

- **Rate limits** during traffic spikes or incidents
- **Feature flags** for gradual rollouts or kill switches
- **Timeout values** when downstream services are slow
- **Batch sizes** when processing backlogs
- **Log levels** for debugging production issues

Changing any of these requires a deploy. That means opening a PR, waiting for review, merging, waiting for CI, deploying, and hoping the change actually helps. If it doesn't, repeat the cycle.

## What Dynamic Configuration Actually Means

Dynamic configuration has three properties that distinguish it from static config:

**Changes propagate without restarts.** When you update a value in your config store, running application instances receive that update within seconds. No rolling restart, no deploy, no downtime.

**Values are evaluated at read time.** Instead of reading config once at startup and caching forever, you read the current value when you need it. This might be on every request, every minute, or somewhere in between—depending on your use case.

**History is preserved.** Every change creates a version. You can see who changed what, when, and why. If a change causes problems, you roll back to a known-good version instantly.

## Three Approaches to Dynamic Config in Node.js

There are three common patterns for implementing dynamic configuration. Each makes different trade-offs between complexity, latency, and consistency.

### Polling

The simplest approach: fetch config from an external store on a timer.

```typescript
import { readFileSync, watchFile } from 'fs'

interface Config {
  rateLimit: number
  featureNewCheckout: boolean
}

let config: Config = JSON.parse(readFileSync('./config.json', 'utf-8'))

// Poll every 30 seconds
setInterval(async () => {
  try {
    const response = await fetch('https://config-api.internal/v1/config')
    config = await response.json()
  } catch (error) {
    console.error('Failed to refresh config:', error)
    // Keep using last known good config
  }
}, 30_000)

export function getConfig(): Config {
  return config
}
```

Polling is easy to understand and debug. It works with any config backend—a JSON file, Redis, a database, an HTTP API. But it has two downsides: updates are delayed by up to the polling interval, and frequent polling wastes resources when config rarely changes.

### Webhooks

Invert the control flow: the config server pushes updates when they happen.

```typescript
import express from 'express'

let config: Config = { rateLimit: 100, featureNewCheckout: false }

const app = express()

app.post('/config-webhook', express.json(), (req, res) => {
  const { secret, payload } = req.body

  if (secret !== process.env.WEBHOOK_SECRET) {
    return res.status(401).json({ error: 'Invalid secret' })
  }

  config = payload
  console.log('Config updated:', config)
  res.json({ ok: true })
})
```

Webhooks give you faster updates—config changes propagate as soon as the push completes. But you now need to expose an endpoint, handle authentication, deal with retries if the push fails, and solve the distributed systems problem of ensuring all instances receive the update.

### Server-Sent Events (SSE)

Establish a persistent connection. The server streams updates as they happen.

```typescript
import { EventSource } from 'eventsource'

let config: Config = { rateLimit: 100, featureNewCheckout: false }

const source = new EventSource('https://config-api.internal/v1/stream', {
  headers: { Authorization: `Bearer ${process.env.CONFIG_API_KEY}` }
})

source.addEventListener('config_change', (event) => {
  const change = JSON.parse(event.data)
  config = { ...config, [change.name]: change.value }
  console.log('Config updated:', change.name, '→', change.value)
})

source.addEventListener('error', (error) => {
  console.error('SSE connection error:', error)
  // EventSource automatically reconnects
})

export function getConfig(): Config {
  return config
}
```

SSE combines the benefits of polling and webhooks. Updates arrive in real-time—typically under 100ms after the change is made. The client initiates the connection, so there's no need to expose endpoints or handle inbound authentication. The EventSource API handles reconnection automatically.

The downside is operational: SSE connections are long-lived, so you need infrastructure that supports them (not all load balancers and proxies handle persistent connections well). You also need to handle connection drops gracefully.

## Beyond Simple Key-Value Config

Real applications need more than `get(key) -> value`. Consider these requirements:

**Type safety.** You want TypeScript to know that `rateLimit` is a `number` and `featureNewCheckout` is a `boolean`. You want compile-time errors when you pass a string where a number is expected.

**Context-aware values.** The rate limit for premium users should be different from free users. A feature flag might be enabled for 10% of users, or only for users in a specific region. You need to pass context (user ID, plan, region) and get back the right value.

**Default values.** If the config service is unreachable, your application should keep running with sensible defaults. You shouldn't throw errors just because you can't reach your config server.

**Subscriptions.** Some config changes require more than just using a new value on the next request. When the rate limiter config changes, you might need to re-initialize the limiter with new parameters. You need a way to react to specific config changes.

Here's what this looks like in practice with Replane's SDK:

```typescript
import { Replane } from '@replanejs/sdk'

// Define types for your configuration
interface Configs {
  'api-rate-limit': number
  'feature-new-checkout': boolean
  'cache-settings': {
    maxAge: number
    staleWhileRevalidate: number
  }
}

// Initialize with defaults for resilience
const replane = new Replane<Configs>({
  defaults: {
    'api-rate-limit': 100,
    'feature-new-checkout': false,
    'cache-settings': { maxAge: 3600, staleWhileRevalidate: 60 }
  }
})

await replane.connect({
  sdkKey: process.env.REPLANE_SDK_KEY!,
  baseUrl: 'https://cloud.replane.dev'
})

// Type-safe access—TypeScript knows this is a number
const rateLimit = replane.get('api-rate-limit')

// Context-aware evaluation—returns different values based on user
const userRateLimit = replane.get('api-rate-limit', {
  context: { userId: user.id, plan: user.subscription }
})

// React to changes
replane.subscribe('cache-settings', (config) => {
  cacheManager.configure(config.value)
})
```

The SDK handles the SSE connection, reconnection logic, local caching, and context evaluation. Your application code stays simple.

## When to Use Dynamic Configuration

Not every configuration value needs to be dynamic. The overhead of a config management system isn't worth it for values that rarely change and don't need instant updates.

Use dynamic configuration for:

| Use Case           | Example                      | Why Dynamic                                             |
| ------------------ | ---------------------------- | ------------------------------------------------------- |
| Feature flags      | `new-checkout-enabled`       | Enable for 1% of users, watch metrics, increase to 100% |
| Rate limits        | `api-rate-limit`             | Respond to traffic spikes without deploying             |
| Timeouts           | `downstream-timeout-ms`      | Adjust when third-party services are slow               |
| Kill switches      | `payments-enabled`           | Disable a broken feature instantly                      |
| Operational tuning | `batch-size`, `worker-count` | Optimize without redeploys                              |

Keep as static environment variables:

- Database connection strings
- API keys and secrets
- Service URLs and endpoints
- Log destinations

These values are genuinely static—they shouldn't change while the application is running, and changing them usually requires restarting the application anyway.

## The Deployment Decoupling Principle

The core insight behind dynamic configuration is that code deploys and config changes serve different purposes. Code deploys add or change behavior. Config changes adjust behavior within bounds that the code already supports.

When you merge a feature flag check into your code, you're deploying the _capability_ to enable or disable that feature. When you toggle the flag, you're _using_ that capability. These are different operations with different risk profiles, different approval workflows, and different rollback procedures.

Code changes go through code review, CI/CD, staging environments, gradual rollouts. Config changes go through their own workflow—maybe instant for operational values, maybe requiring approval for customer-facing features. The workflows don't need to be the same, and coupling them together (by putting config in code) makes both worse.

Decoupling deployments from configuration gives you:

- **Faster incident response.** Disable a broken feature in seconds, not minutes.
- **Safer rollouts.** Enable features for 1% of users, then 10%, then 100%.
- **Cleaner separation of concerns.** Engineers own code, product can own feature flags, ops can own operational parameters.
- **Better auditability.** Config changes have their own history, separate from git history.

## Common Mistakes

**Putting secrets in dynamic config.** Dynamic config is for values that change frequently and need to propagate quickly. Secrets are the opposite—they should rotate infrequently through secure channels. Keep secrets in your secrets manager (Vault, AWS Secrets Manager, etc.).

**Using dynamic config for everything.** Not every value needs instant updates. If you're putting database connection strings in dynamic config, you're adding complexity without benefit. Those values change when you redeploy anyway.

**Ignoring the cold start problem.** What happens when your application starts but can't reach the config server? If you throw an error, your application won't start during a config server outage. Use defaults, and make sure those defaults are safe.

**Forgetting about caching.** If you're calling `config.get('key')` on every request and that triggers a network call, you've created a performance problem. Cache config values in memory and update them via SSE or polling—don't fetch on demand.

**Not validating config values.** A typo in the dashboard shouldn't bring down your application. Validate config values before using them, and reject invalid configs gracefully.

## Getting Started

If you're ready to move beyond environment variables, here's how to start:

1. **Identify candidates.** Look at your current config values. Which ones do you wish you could change without deploying? Those are your first candidates for dynamic config.

2. **Set up a config backend.** You can start with a simple approach—a JSON file that you edit and deploy, or a Redis hash that you update with a script. Or use a purpose-built tool like Replane that handles versioning, rollback, and realtime updates.

3. **Add defaults.** Before moving any config to dynamic, make sure you have sensible defaults. Your application should function (perhaps in a degraded mode) even if the config server is unreachable.

4. **Migrate incrementally.** Don't move everything at once. Start with one or two values, prove the pattern works, then expand.

5. **Set up monitoring.** Track config change events. If something breaks after a config change, you want to know immediately.

<TryReplaneCTA
description="Replane is an open-source dynamic configuration platform with SDKs for Node.js, Python, and .NET. Changes propagate via SSE in under 100ms, with full version history and instant rollback."
links={['cloud', 'quickstart', 'sdk']}
/>
