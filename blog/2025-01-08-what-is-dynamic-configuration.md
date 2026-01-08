---
slug: what-is-dynamic-configuration
title: 'What Is Dynamic Configuration?'
authors: dmitry
tags: [config-management, best-practices, architecture]
description: Dynamic configuration lets you change application settings without redeploying. Learn how it works, when to use it, and how it differs from static config.
---

import TryReplaneCTA from '@site/src/components/TryReplaneCTA'

Your application has settings: rate limits, feature flags, timeout values, cache TTLs. These settings live somewhere—environment variables, config files, a database. When you need to change them, what happens?

If changing a setting requires a code change, a PR, a CI build, and a deploy, you have static configuration. If you can change a setting and have running applications pick it up within seconds, you have dynamic configuration.

The difference matters when things go wrong at 2am, when you're rolling out a risky feature, or when you need to respond to traffic patterns faster than your deployment pipeline allows.

<!-- truncate -->

## Static vs Dynamic Configuration

Static configuration is the default for most applications. Values are set at build time or startup, and they don't change until the next deploy. Environment variables are the canonical example:

```typescript
// Read once at startup, never changes
const config = {
  rateLimit: parseInt(process.env.RATE_LIMIT || '100'),
  cacheMaxAge: parseInt(process.env.CACHE_MAX_AGE || '3600'),
  maintenanceMode: process.env.MAINTENANCE_MODE === 'true'
}
```

Static config works well for values that genuinely don't change during runtime: database connection strings, API endpoints, logging destinations. But it creates friction when applied to values that _should_ change quickly.

Dynamic configuration inverts the model. Instead of baking values into your deployment, you store them in an external system and read them at runtime. When you update a value, running applications receive the update—typically within milliseconds to seconds.

```typescript
// Value can change at any time
const rateLimit = replane.get('rate-limit')
```

The distinction isn't about where the values are stored. It's about _when_ changes take effect. Static config requires a redeploy. Dynamic config takes effect immediately.

## How Dynamic Configuration Works

A dynamic configuration system has three components:

**A configuration store.** This is where you define and edit configuration values. It might be a database, a file system, or a purpose-built tool with a UI. The store maintains the current state of all configs, plus (in good systems) a history of all changes.

**A propagation mechanism.** When a value changes in the store, that change needs to reach running applications. Common approaches include polling (applications check for updates periodically), webhooks (the store pushes updates to applications), and streaming (applications maintain a persistent connection and receive updates in real-time).

**A client library.** Applications need a way to read config values and receive updates. The client handles connection management, caching, and exposing values to application code through a simple API like `get('config-name')`.

Here's what this looks like in practice with Replane:

```typescript
import { Replane } from '@replanejs/sdk'

const replane = new Replane()

// Connect to the config server and receive initial values
await replane.connect({
  sdkKey: process.env.REPLANE_SDK_KEY!,
  baseUrl: 'https://cloud.replane.dev'
})

// Read current value (from local cache, instant)
const rateLimit = replane.get('rate-limit')

// React when value changes
replane.subscribe('rate-limit', (config) => {
  console.log('Rate limit changed to:', config.value)
})
```

The client maintains a local cache of all config values. Reads are instant—no network call. When a value changes on the server, the update streams to all connected clients via Server-Sent Events (SSE), and the cache is updated. The next call to `get()` returns the new value.

## What Makes Configuration "Dynamic"

Three properties distinguish dynamic configuration from static:

**Changes propagate without restarts.** When you update a value in the config store, running applications receive that update without requiring a restart or redeploy. This is the core capability—everything else builds on it.

**Values are evaluated at read time.** Instead of reading configuration once at startup and caching forever, you read the current value when you need it. The value you get reflects the latest state of configuration.

**History is preserved.** Every change creates a version. You can see who changed what, when, and why. If a change causes problems, you can roll back to a previous state instantly.

This combination enables workflows that static configuration can't support: gradual rollouts, instant kill switches, A/B testing, per-user customization.

## When Dynamic Configuration Matters

Dynamic configuration solves specific problems. If you don't have these problems, you might not need it.

### Incident Response

Your payment integration starts throwing errors. With static config, you have two options: wait for a fix to be developed, reviewed, and deployed, or do an emergency deploy with the feature disabled. Both take time—time when users are seeing errors.

With dynamic config, you flip a switch. The payment feature is disabled across all instances within seconds. Users see a graceful degradation message instead of error pages. You fix the bug without the pressure of a production incident, then re-enable the feature when ready.

### Gradual Rollouts

You've built a new checkout flow. It's tested, reviewed, and deployed—but checkout is critical, and you're nervous about enabling it for everyone at once.

With dynamic config, you enable the new checkout for 1% of users. You watch error rates, conversion metrics, latency. Everything looks good, so you increase to 10%, then 50%, then 100%. If something goes wrong at any stage, you can instantly roll back to 0%.

This isn't A/B testing in the statistical sense—you're not measuring which version is "better." You're de-risking a change by exposing it to progressively larger audiences.

### Operational Tuning

Your application has parameters that affect performance and behavior: rate limits, batch sizes, timeouts, retry counts, cache durations. The right values depend on factors that change over time: traffic patterns, database performance, third-party service behavior.

With static config, tuning these values requires a deploy. With dynamic config, you adjust them in response to what you observe. High traffic? Lower the rate limit. Slow database? Increase timeouts. Building a backlog? Increase batch size. Each adjustment takes seconds, not minutes.

### Per-User or Per-Tenant Customization

Enterprise customers expect customization. Different rate limits, different feature access, different UI configurations. With static config, you encode these differences in code: `if (customer.plan === 'enterprise') { ... }`. Every new customization requires a code change.

With dynamic config, you define override rules: "if plan equals enterprise, rate limit is 10000." Adding a new customization is a config change, not a code change. Non-engineers can manage customer-specific settings through a dashboard.

## What Dynamic Configuration Is Not

Dynamic configuration is a specific tool for a specific purpose. It doesn't replace everything.

**It's not a secrets manager.** Secrets (API keys, database passwords, encryption keys) have different requirements: rotation policies, access controls, audit logging. Use a dedicated secrets manager like Vault, AWS Secrets Manager, or Doppler. Don't put secrets in your dynamic config.

**It's not a database.** Dynamic config stores settings, not application data. If you're storing user profiles, transaction records, or content, you need a database. Config stores optimize for low-latency reads and infrequent writes, not arbitrary query patterns.

**It's not environment configuration.** Some values legitimately differ between environments (production vs staging vs development) and don't need to change at runtime. Database URLs, log levels, service endpoints—these can stay in environment variables. Don't over-engineer by making everything dynamic.

**It's not an experimentation platform.** Dynamic config can support simple feature flags and percentage rollouts. But if you need statistical significance calculations, multivariate testing, or automatic winner selection, you need a dedicated experimentation platform like Optimizely or LaunchDarkly's Experimentation product.

## Key Concepts

### Config Keys and Values

A configuration value has a name (the key) and a value. Keys are typically strings like `rate-limit` or `feature-new-checkout`. Values can be any JSON-serializable type: booleans, numbers, strings, objects, arrays.

```typescript
// Boolean flag
const showBanner = replane.get('show-promo-banner') // true

// Number
const rateLimit = replane.get('rate-limit') // 100

// Object
const pricing = replane.get('pricing-tiers')
// { free: { requests: 1000 }, pro: { requests: 50000 } }
```

### Defaults and Fallbacks

What happens if the config server is unreachable? A well-designed client uses defaults—values that the application uses when it can't reach the server or when a specific config doesn't exist.

```typescript
const replane = new Replane({
  defaults: {
    'rate-limit': 100,
    'feature-new-checkout': false
  }
})

// Works even before connect() is called
const rateLimit = replane.get('rate-limit') // 100
```

Defaults are critical for resilience. Your application should function (perhaps in a degraded mode) even if the config server is down. Never let config server unavailability prevent your application from starting.

### Override Rules and Context

Override rules let you return different values based on context. The base value might be `100`, but users on the premium plan get `10000`. Users in the EU region get `true` for GDPR features while others get `false`.

Context is information about the current request: user ID, subscription plan, region, device type, app version. You pass context when reading a config value, and the system evaluates override rules to determine the final value.

```typescript
// Base value: 100
// Override: if plan == 'premium' then 10000

const freeUserLimit = replane.get('rate-limit', {
  context: { plan: 'free' }
}) // 100

const premiumUserLimit = replane.get('rate-limit', {
  context: { plan: 'premium' }
}) // 10000
```

Override rules are evaluated in order, and the first matching rule wins. This lets you build sophisticated targeting: specific users, percentage rollouts, geographic regions, or any combination.

### Version History and Rollback

Every change to a configuration creates a new version. The history shows who changed what, when, and why (if they provided a description). When something goes wrong, you can see exactly what changed and when.

Rollback is the complement to history. Instead of manually reverting a change, you restore a previous version. The config returns to its previous state, and that change propagates to all connected clients. This is faster and less error-prone than making a new change that happens to have the same value as the old one.

## The Architecture Trade-off

Dynamic configuration adds a moving part to your system. Values that were deterministic (set at deploy time, unchanging) are now dynamic (can change at any moment). This has implications.

**Debugging gets harder.** When investigating an issue, you need to know what config values were active at the time. Good config systems provide history and logging to answer this question.

**Testing needs to account for configuration.** Your tests should be able to inject specific config values without hitting a real config server. Most client libraries provide a way to use in-memory or mocked configs for testing.

**Cache invalidation is a concern.** If you cache decisions based on config values (e.g., rate limiter buckets), you need to invalidate or update those caches when config changes. The `subscribe()` pattern helps here.

**There's a new dependency.** Your application now depends on a config service. If the service is unavailable, your application should continue working with cached or default values, not fail.

These trade-offs are worth it when you need the capabilities dynamic configuration provides. They're not worth it for values that don't change in practice.

## Getting Started

If you're considering dynamic configuration for your application:

1. **Identify your pain points.** What config values do you wish you could change without deploying? Start with those.

2. **Choose your propagation method.** Polling is simplest but has latency. SSE gives real-time updates with reasonable complexity. Webhooks work if you already have that infrastructure.

3. **Define sensible defaults.** Every dynamic config should have a default value that works if the config server is unreachable. Don't let config outages become application outages.

4. **Keep secrets separate.** Use your dynamic config for feature flags and operational parameters, not for API keys and passwords.

5. **Start small.** Migrate one or two configs, prove the pattern works for your team, then expand.

<TryReplaneCTA links={['cloud', 'self-hosting', 'concepts']} />
