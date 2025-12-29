---
title: JavaScript SDK
description: Integrate Replane into Node.js, browsers, Deno, or Bun
---

# JavaScript SDK

The official JavaScript/TypeScript SDK for Replane. Works in Node.js 18+, browsers, Deno, and Bun.

## Installation

```bash npm2yarn
npm install @replanejs/sdk
```

## Quick start

```typescript
import { Replane } from '@replanejs/sdk'

// Define your config types
interface Configs {
  'feature-dark-mode': boolean
  'api-rate-limit': number
  'pricing-tiers': { free: number; premium: number }
}

// Create the client
const replane = new Replane<Configs>()

// Connect to the server
await replane.connect({
  sdkKey: process.env.REPLANE_SDK_KEY,
  baseUrl: 'https://replane.example.com'
})

// Get a config value
const darkModeEnabled = replane.get('feature-dark-mode')

// Get with context for override evaluation
const rateLimit = replane.get('api-rate-limit', {
  context: { userId: user.id, plan: user.plan }
})

// Subscribe to realtime updates
replane.subscribe('feature-dark-mode', (config) => {
  console.log('Dark mode changed:', config.value)
})

// Cleanup when done
replane.disconnect()
```

## API Reference

### `new Replane<T>(options?)`

Creates a new Replane client instance. The client is usable immediately if you provide `defaults` or a `snapshot`.

#### Constructor Options

| Option     | Type                      | Required | Description                                  |
| ---------- | ------------------------- | -------- | -------------------------------------------- |
| `defaults` | `Record<string, unknown>` | No       | Default values to use before connecting      |
| `context`  | `Record<string, unknown>` | No       | Default context for all override evaluations |
| `snapshot` | `ReplaneSnapshot<T>`      | No       | Restore from a previous `getSnapshot()` call |
| `logger`   | `Logger`                  | No       | Custom logger (default: console)             |

### `replane.connect(options)`

Connects to the Replane server and starts receiving real-time updates via SSE. Returns a Promise that resolves when the connection is established.

#### Connect Options

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

#### Example

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

### `replane.get<K>(name, options?)`

Gets a config value. Returns the current value synchronously.

#### Parameters

| Parameter         | Type                                                               | Required | Description                                                     |
| ----------------- | ------------------------------------------------------------------ | -------- | --------------------------------------------------------------- |
| `name`            | `keyof T`                                                          | Yes      | Config name                                                     |
| `options.context` | `Record<string, string \| number \| boolean \| null \| undefined>` | No       | Context for override evaluation                                 |
| `options.default` | `T[K]`                                                             | No       | Default value to return if config not found (prevents throwing) |

#### Returns

The config value with type `T[K]`, or the default value if provided and config is not found.

#### Example

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

### `replane.subscribe(name, callback)`

Subscribes to a specific config's changes. Returns an unsubscribe function.

```typescript
const unsubscribe = replane.subscribe('feature-flag', (config) => {
  console.log('Feature flag changed:', config.value)
  // config.value is typed based on your Configs interface
})
```

### `replane.disconnect()`

Disconnects from the server and cleans up resources. Safe to call multiple times. Call this when shutting down your application.

```typescript
process.on('SIGTERM', () => {
  replane.disconnect()
  process.exit(0)
})
```

## Type safety

Define your config types for full TypeScript support:

```typescript
interface Configs {
  'feature-dark-mode': boolean
  'api-rate-limit': number
  'allowed-regions': string[]
  'pricing': {
    free: { requests: number }
    premium: { requests: number }
  }
}

const replane = new Replane<Configs>()
await replane.connect({
  sdkKey: process.env.REPLANE_SDK_KEY,
  baseUrl: 'https://replane.example.com'
})

// TypeScript knows the types
const darkMode = replane.get('feature-dark-mode') // boolean
const regions = replane.get('allowed-regions') // string[]
const pricing = replane.get('pricing') // { free: {...}, premium: {...} }

// Type error - 'invalid-config' doesn't exist
const invalid = replane.get('invalid-config')
```

## Context and overrides

Context is used to evaluate override rules. Pass it at the client level or per request.

### Client-level context

Applied to all `get()` calls:

```typescript
const replane = new Replane<Configs>({
  context: {
    env: 'production',
    region: 'us-east'
  }
})
await replane.connect({
  sdkKey: process.env.REPLANE_SDK_KEY,
  baseUrl: 'https://replane.example.com'
})

// Uses client context
const value = replane.get('config-name')
```

### Per-evaluation context

Merged with client context:

```typescript
const value = replane.get('feature-flag', {
  context: {
    userId: user.id,
    plan: user.plan
  }
})
```

### Context properties

Common context properties:

```typescript
{
  userId: 'user-123',       // User identifier
  plan: 'premium',          // Subscription tier
  region: 'us-east',        // Geographic region
  deviceType: 'mobile',     // Device type
  appVersion: '2.1.0',      // App version
  env: 'production'         // Environment
  rateLimit: 100,           // Number
  isAdmin: true,            // Boolean
}
```

## Default values

Provide default values to use before connecting or if the config is not found:

```typescript
const replane = new Replane<Configs>({
  defaults: {
    'feature-flag': false,
    'rate-limit': 100,
    'timeout-ms': 5000
  }
})
await replane.connect({
  sdkKey: process.env.REPLANE_SDK_KEY,
  baseUrl: 'https://replane.example.com'
})
```

The client starts with default values and updates when connection is established.

## Realtime updates

The SDK maintains a persistent SSE connection for realtime updates.

### How it works

1. Client connects to `/api/sdk/v1/replication/stream`
2. Server sends all current configs related to the SDK key
3. Connection stays open
4. Server pushes changes as they happen
5. `get()` always returns the latest value

### Subscribing to changes

```typescript
// Subscribe to specific config
const unsubFeature = replane.subscribe('feature-flag', (config) => {
  // React to change
  updateUI(config.value)
})

// Unsubscribe when done
unsubFeature()
```

### React integration

```typescript
import { useEffect, useState } from 'react';

function useConfig<K extends keyof Configs>(name: K) {
  const [value, setValue] = useState(() => replane.get(name));

  useEffect(() => {
    return replane.subscribe(name, (config) => {
      setValue(config.value as Configs[K]);
    });
  }, [name]);

  return value;
}

// Usage
function App() {
  const darkMode = useConfig('feature-dark-mode');

  return <div className={darkMode ? 'dark' : 'light'}>...</div>;
}
```

## Error handling

### Connection errors

```typescript
const replane = new Replane<Configs>()

try {
  await replane.connect({
    sdkKey: process.env.REPLANE_SDK_KEY,
    baseUrl: 'https://replane.example.com'
  })
} catch (error) {
  if (error instanceof ReplaneError) {
    console.error('Replane error:', error.code, error.message)
  }
  // Use fallback configuration from defaults
}
```

### Config not found

```typescript
// Option 1: Catch the error
try {
  const value = replane.get('missing-config')
} catch (error) {
  if (error instanceof ReplaneError && error.code === 'not_found') {
    console.error('Config not found')
  }
}

// Option 2: Use a default value (recommended)
const value = replane.get('missing-config', { default: 'fallback' })
// Returns 'fallback' if config doesn't exist, no error thrown
```

## Testing

### In-memory client

Use `defaults` without calling `connect()` for tests:

```typescript
import { Replane } from '@replanejs/sdk'

const replane = new Replane<Configs>({
  defaults: {
    'feature-flag': true,
    'rate-limit': 100,
    'pricing': { free: { requests: 100 }, premium: { requests: 10000 } }
  }
})

// No connect() call - works purely from defaults
expect(replane.get('feature-flag')).toBe(true)
```

### Custom fetch

Mock the fetch function:

```typescript
const mockFetch = vi.fn().mockResolvedValue({
  ok: true,
  json: () => Promise.resolve({ configs: [...] })
});

const replane = new Replane<Configs>()
await replane.connect({
  sdkKey: 'test-key',
  baseUrl: 'https://test.com',
  fetchFn: mockFetch
});
```

## Multiple projects

Each SDK key is tied to one project. For multiple projects, create separate clients:

```typescript
const projectA = new Replane<ProjectAConfigs>()
await projectA.connect({
  sdkKey: process.env.PROJECT_A_SDK_KEY,
  baseUrl: 'https://replane.example.com'
})

const projectB = new Replane<ProjectBConfigs>()
await projectB.connect({
  sdkKey: process.env.PROJECT_B_SDK_KEY,
  baseUrl: 'https://replane.example.com'
})
```

## Best practices

### Initialize once

Create the client once at application startup:

```typescript
// config.ts
export const replane = new Replane<Configs>()
await replane.connect({
  sdkKey: process.env.REPLANE_SDK_KEY,
  baseUrl: 'https://replane.example.com'
})

// app.ts
import { replane } from './config'
const value = replane.get('feature-flag')
```

### Clean up on shutdown

```typescript
process.on('SIGTERM', () => {
  replane.disconnect()
})

process.on('SIGINT', () => {
  replane.disconnect()
})
```

### Use defaults for resilience

```typescript
const replane = new Replane<Configs>({
  defaults: {
    // Sensible defaults if Replane is unavailable
    'feature-flag': false,
    'rate-limit': 100
  }
})
await replane.connect({
  sdkKey: process.env.REPLANE_SDK_KEY,
  baseUrl: 'https://replane.example.com'
})
```

### Type your configs

Always define config types for safety and autocomplete:

```typescript
interface Configs {
  'feature-new-ui': boolean
  'max-upload-size': number
  // ...
}
```

## Environment compatibility

| Environment       | Support                   |
| ----------------- | ------------------------- |
| Node.js 18+       | Full                      |
| Node.js 16-17     | Requires fetch polyfill   |
| Browsers (modern) | Full                      |
| Deno              | Full                      |
| Bun               | Full                      |
| Edge Workers      | Full (Cloudflare, Vercel) |

## Next steps

- [Feature Flags](/docs/guides/feature-flags) — Toggle features
- [Override Rules](/docs/guides/override-rules) — Target specific users
- [Gradual Rollouts](/docs/guides/gradual-rollouts) — Percentage-based releases
