---
title: JavaScript SDK API Reference
description: Complete API documentation for the Replane JavaScript/TypeScript SDK including Replane class, connect options, get method, subscriptions, and snapshot functionality.
sidebar_label: API Reference
---

# JavaScript SDK API Reference

Complete API documentation for the JavaScript/TypeScript SDK.

## `new Replane<T>(options?)`

Creates a new Replane client instance. The client is usable immediately if you provide `defaults` or a `snapshot`.

### Constructor Options

| Option     | Type                      | Required | Description                                  |
| ---------- | ------------------------- | -------- | -------------------------------------------- |
| `defaults` | `Record<string, unknown>` | No       | Default values to use before connecting      |
| `context`  | `Record<string, unknown>` | No       | Default context for all override evaluations |
| `snapshot` | `ReplaneSnapshot<T>`      | No       | Restore from a previous `getSnapshot()` call |
| `logger`   | `Logger`                  | No       | Custom logger (default: console)             |

## `replane.connect(options)`

Connects to the Replane server and starts receiving real-time updates via SSE. Returns a Promise that resolves when the connection is established.

### Connect Options

| Option                | Type           | Required | Description                             |
| --------------------- | -------------- | -------- | --------------------------------------- |
| `sdkKey`              | `string`       | Yes      | SDK key for authentication              |
| `baseUrl`             | `string`       | Yes      | Replane server URL                      |
| `fetchFn`             | `typeof fetch` | No       | Custom fetch implementation             |
| `requestTimeoutMs`    | `number`       | No       | SSE request timeout (default: 2000)     |
| `connectTimeoutMs`    | `number`       | No       | Connection timeout (default: 5000)      |
| `retryDelayMs`        | `number`       | No       | Delay between retries (default: 200)    |
| `inactivityTimeoutMs` | `number`       | No       | SSE inactivity timeout (default: 30000) |
| `agent`               | `string`       | No       | Agent identifier for User-Agent header  |

### Example

```typescript
const replane = new Replane<Configs>({
  defaults: {
    'feature-flag': false,
    'rate-limit': 100
  },
  context: {
    env: 'production',
    region: 'us-east'
  }
})

await replane.connect({
  sdkKey: process.env.REPLANE_SDK_KEY,
  baseUrl: 'https://replane.example.com',
  requestTimeoutMs: 5000,
  connectTimeoutMs: 10000
})
```

## `replane.get<K>(name, options?)`

Gets a config value. Returns the current value synchronously.

### Parameters

| Parameter         | Type                                                               | Required | Description                                                     |
| ----------------- | ------------------------------------------------------------------ | -------- | --------------------------------------------------------------- |
| `name`            | `keyof T`                                                          | Yes      | Config name                                                     |
| `options.context` | `Record<string, string \| number \| boolean \| null \| undefined>` | No       | Context for override evaluation                                 |
| `options.default` | `T[K]`                                                             | No       | Default value to return if config not found (prevents throwing) |

### Returns

The config value with type `T[K]`, or the default value if provided and config is not found.

### Example

```typescript
// Simple get
const enabled = replane.get('feature-dark-mode') // boolean

// With context
const limit = replane.get('api-rate-limit', {
  context: { plan: 'premium' }
}) // number

// With default value - won't throw if config doesn't exist
const timeout = replane.get('timeout-ms', { default: 5000 }) // number
```

## `replane.subscribe(name, callback)`

Subscribes to a specific config's changes. Returns an unsubscribe function.

```typescript
const unsubscribe = replane.subscribe('feature-flag', (config) => {
  console.log('Feature flag changed:', config.value)
  // config.value is typed based on your Configs interface
})

// Later: stop receiving updates
unsubscribe()
```

## `replane.disconnect()`

Disconnects from the server and cleans up resources. Safe to call multiple times. Call this when shutting down your application.

```typescript
process.on('SIGTERM', () => {
  replane.disconnect()
  process.exit(0)
})
```

## `replane.getSnapshot()`

Returns a serializable snapshot of the current config state. Use for SSR hydration or persisting state.

```typescript
const snapshot = replane.getSnapshot()

// Later, restore from snapshot
const newClient = new Replane({ snapshot })
```
