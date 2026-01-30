---
title: JavaScript SDK Guide
description: Learn how to configure the Replane JavaScript SDK with TypeScript support, context-based overrides, realtime updates, error handling, testing patterns, and best practices.
sidebar_label: Guide
---

# JavaScript SDK Guide

Configuration, testing, and best practices for the JavaScript/TypeScript SDK.

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

For React applications, use the dedicated [`@replanejs/react`](/docs/sdk/react) package which provides optimized hooks and components:

```tsx
import { ReplaneProvider, useConfig } from '@replanejs/react';

function App() {
  return (
    <ReplaneProvider connection={connection}>
      <Dashboard />
    </ReplaneProvider>
  );
}

function Dashboard() {
  const darkMode = useConfig<boolean>('feature-dark-mode');

  return <div className={darkMode ? 'dark' : 'light'}>...</div>;
}
```

The React SDK handles subscriptions, re-renders, Suspense, and error boundaries automatically. See the [React SDK Guide](/docs/sdk/react/guide) for full documentation.

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

Each SDK key is tied to one project and environment. For multiple projects, create separate clients:

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
