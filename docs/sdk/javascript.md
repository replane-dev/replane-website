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
import { createReplaneClient } from '@replanejs/sdk'

// Define your config types
interface Configs {
  'feature-dark-mode': boolean
  'api-rate-limit': number
  'pricing-tiers': { free: number; premium: number }
}

// Initialize the client
const replane = await createReplaneClient<Configs>({
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
replane.close()
```

## API Reference

### `createReplaneClient<T>(options)`

Creates a new Replane client. Returns a Promise that resolves when the initial config fetch completes.

#### Options

| Option         | Type                                  | Required | Description                                          |
| -------------- | ------------------------------------- | -------- | ---------------------------------------------------- |
| `sdkKey`       | `string`                              | Yes      | SDK key for authentication                           |
| `baseUrl`      | `string`                              | Yes      | Replane server URL                                   |
| `required`     | `string[] \| Record<string, boolean>` | No       | Configs that must exist for the client to initialize |
| `fallbacks`    | `Record<string, unknown>`             | No       | Fallback values if fetch fails                       |
| `context`      | `Record<string, unknown>`             | No       | Default context to use for all override evaluations  |
| `fetchFn`      | `typeof fetch`                        | No       | Custom fetch implementation                          |
| `timeoutMs`    | `number`                              | No       | Request timeout (default: 2000)                      |
| `retryDelayMs` | `number`                              | No       | Delay between retries (default: 200)                 |
| `logger`       | `Logger`                              | No       | Custom logger                                        |

#### Example

```typescript
const replane = await createReplaneClient<Configs>({
  sdkKey: process.env.REPLANE_SDK_KEY,
  baseUrl: 'https://replane.example.com',
  required: ['rate-limit', 'pricing-tiers'],
  fallbacks: {
    'feature-flag': false,
    'rate-limit': 100
  },
  context: {
    env: 'production',
    region: 'us-east'
  },
  timeoutMs: 5000,
  retries: 3
})
```

### `replane.get<K>(name, options?)`

Gets a config value. Returns the current value synchronously.

#### Parameters

| Parameter         | Type                                                               | Required | Description                                                        |
| ----------------- | ------------------------------------------------------------------ | -------- | ------------------------------------------------------------------ |
| `name`            | `keyof T`                                                          | Yes      | Config name                                                        |
| `options.context` | `Record<string, string \| number \| boolean \| null \| undefined>` | No       | Context for override evaluation                                    |
| `options.default` | `T[K]`                                                             | No       | Default value to return if config not found (prevents throwing)    |

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

### `replane.subscribe(callback)` or `replane.subscribe(name, callback)`

Subscribes to config changes. Returns an unsubscribe function.

#### All configs

```typescript
const unsubscribe = replane.subscribe((config) => {
  console.log(`${config.name} changed to:`, config.value)
})
```

#### Specific config

```typescript
const unsubscribe = replane.subscribe('feature-flag', (config) => {
  console.log('Feature flag changed:', config.value)
  // config.value is typed based on your Configs interface
})
```

### `replane.close()`

Closes the client and cleans up resources. Call this when shutting down your application.

```typescript
process.on('SIGTERM', () => {
  replane.close()
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

const replane = await createReplaneClient<Configs>({
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
const replane = await createReplaneClient<Configs>({
  sdkKey: process.env.REPLANE_SDK_KEY,
  baseUrl: 'https://replane.example.com',
  context: {
    env: 'production',
    region: 'us-east'
  }
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

## Required configs

Ensure critical configs exist on startup:

```typescript
const replane = await createReplaneClient<Configs>({
  sdkKey: process.env.REPLANE_SDK_KEY,
  baseUrl: 'https://replane.example.com',
  required: ['rate-limit', 'is-admin']
})
// Throws if database-url or api-key is missing
```

Or with an object:

```typescript
required: {
  'database-url': true,
  'api-key': true,
  'optional-feature': false
}
```

## Fallback values

Provide fallback values if the initial fetch fails:

```typescript
const replane = await createReplaneClient<Configs>({
  sdkKey: process.env.REPLANE_SDK_KEY,
  baseUrl: 'https://replane.example.com',
  fallbacks: {
    'feature-flag': false,
    'rate-limit': 100,
    'timeout-ms': 5000
  }
})
```

The client starts with fallback values and updates when connection is restored.

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
// Subscribe to all changes
const unsubAll = replane.subscribe((config) => {
  console.log(`${config.name} updated:`, config.value)
})

// Subscribe to specific config
const unsubFeature = replane.subscribe('feature-flag', (config) => {
  // React to change
  updateUI(config.value)
})

// Unsubscribe when done
unsubAll()
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

### Initialization errors

```typescript
try {
  const replane = await createReplaneClient<Configs>({
    sdkKey: process.env.REPLANE_SDK_KEY,
    baseUrl: 'https://replane.example.com'
  })
} catch (error) {
  if (error instanceof ReplaneError) {
    console.error('Replane error:', error.code, error.message)
  }
  // Use fallback configuration
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

Use `createInMemoryReplaneClient` for tests:

```typescript
import { createInMemoryReplaneClient } from '@replanejs/sdk'

const replane = createInMemoryReplaneClient<Configs>({
  'feature-flag': true,
  'rate-limit': 100,
  'pricing': { free: { requests: 100 }, premium: { requests: 10000 } }
})

// Use in tests
expect(replane.get('feature-flag')).toBe(true)
```

### Custom fetch

Mock the fetch function:

```typescript
const mockFetch = vi.fn().mockResolvedValue({
  ok: true,
  json: () => Promise.resolve({ configs: [...] })
});

const replane = await createReplaneClient<Configs>({
  sdkKey: 'test-key',
  baseUrl: 'https://test.com',
  fetchFn: mockFetch
});
```

## Multiple projects

Each SDK key is tied to one project. For multiple projects, create separate clients:

```typescript
const projectA = await createReplaneClient<ProjectAConfigs>({
  sdkKey: process.env.PROJECT_A_SDK_KEY,
  baseUrl: 'https://replane.example.com'
})

const projectB = await createReplaneClient<ProjectBConfigs>({
  sdkKey: process.env.PROJECT_B_SDK_KEY,
  baseUrl: 'https://replane.example.com'
})
```

## Best practices

### Initialize once

Create the client once at application startup:

```typescript
// config.ts
export const replane = await createReplaneClient<Configs>({
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
  replane.close()
})

process.on('SIGINT', () => {
  replane.close()
})
```

### Use fallbacks for resilience

```typescript
const replane = await createReplaneClient<Configs>({
  sdkKey: process.env.REPLANE_SDK_KEY,
  baseUrl: 'https://replane.example.com',
  fallbacks: {
    // Sensible defaults if Replane is unavailable
    'feature-flag': false,
    'rate-limit': 100
  }
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
