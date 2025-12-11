---
sidebar_position: 1
---

# JavaScript / TypeScript SDK

Official SDK for accessing Replane configs from JavaScript and TypeScript applications.

## Installation

```bash npm2yarn
npm install @replanejs/sdk
```

## Quick Start

```typescript
import { createReplaneClient } from '@replanejs/sdk'

// Define your config types
interface Configs {
  'feature-flags': Record<string, boolean>
  'api-settings': {
    rateLimit: number
    timeout: number
  }
}

// Create client (receives realtime updates via SSE)
const client = await createReplaneClient<Configs>({
  sdkKey: process.env.REPLANE_SDK_KEY!,
  baseUrl: 'https://replane.yourdomain.com'
})

// Get a config value
const flags = client.get('feature-flags')
if (flags['new-feature']) {
  console.log('Feature enabled!')
}

// With context for override evaluation
const settings = client.get('api-settings', {
  context: {
    userId: 'user-123',
    plan: 'premium'
  }
})
```

## API Reference

### createReplaneClient(options)

Creates a new Replane client instance that maintains a realtime connection via Server-Sent Events (SSE).

#### Options

| Option                   | Type                 | Required | Default            | Description                                                                                                   |
| ------------------------ | -------------------- | -------- | ------------------ | ------------------------------------------------------------------------------------------------------------- |
| `sdkKey`                 | `string`             | Yes      | -                  | SDK key for authentication. Each key is tied to a specific project.                                           |
| `baseUrl`                | `string`             | Yes      | -                  | Base URL of your Replane instance (no trailing slash)                                                         |
| `context`                | `object`             | No       | `{}`               | Default context for all config evaluations (can be overridden per-request)                                    |
| `required`               | `object` or `array`  | No       | -                  | Required configs. If any are missing, initialization throws. Can be object with boolean values or array.      |
| `fallbacks`              | `object`             | No       | -                  | Fallback values to use if initial fetch fails. Allows client to start even when API is unavailable.           |
| `fetchFn`                | `function`           | No       | `globalThis.fetch` | Custom fetch function (for testing or unsupported environments)                                               |
| `requestTimeoutMs`       | `number`             | No       | `2000`             | Request timeout in milliseconds                                                                               |
| `initializationTimeoutMs`| `number`             | No       | `5000`             | Timeout for client initialization in milliseconds                                                             |
| `retryDelayMs`           | `number`             | No       | `200`              | Base delay between retries in milliseconds (with jitter)                                                      |
| `logger`                 | `object`             | No       | `console`          | Custom logger with debug, info, warn, error methods                                                           |

#### Returns

`Promise<ReplaneClient<T>>` - Resolves to a client object with methods: `{ get, subscribe, close }`

#### Example

```typescript
interface Configs {
  'feature-flags': Record<string, boolean>
  'api-key': string
  'rate-limit': number
}

const client = await createReplaneClient<Configs>({
  sdkKey: 'rp_abc123...',
  baseUrl: 'https://config.company.com',
  context: {
    environment: 'production',
    region: 'us-east'
  },
  required: ['api-key'], // Throw if api-key is missing
  fallbacks: {
    'feature-flags': { 'new-feature': false },
    'api-key': 'fallback-key',
    'rate-limit': 100
  },
  requestTimeoutMs: 5000
})
```

### client.get(configName, options?)

Gets the current config value. The client maintains an up-to-date cache that receives realtime updates via Server-Sent Events (SSE) in the background.

#### Parameters

| Parameter         | Type     | Required | Description                                                      |
| ----------------- | -------- | -------- | ---------------------------------------------------------------- |
| `configName`      | `string` | Yes      | Config name to fetch. Must be a valid key from your Configs type |
| `options`         | `object` | No       | Options for this request                                         |
| `options.context` | `object` | No       | Context merged with client-level context for override evaluation |

#### Returns

The config value of type `T[K]` (synchronous). The return type is automatically inferred from your Configs interface.

#### Errors

Throws `ReplaneError` with code `not_found` if the config doesn't exist.

#### Examples

**Basic usage**:

```typescript
interface Configs {
  'feature-flags': Record<string, boolean>
}

const client = await createReplaneClient<Configs>({
  sdkKey: process.env.REPLANE_SDK_KEY!,
  baseUrl: 'https://config.company.com'
})

const flags = client.get('feature-flags')
console.log(flags) // { "new-onboarding": true, ... }
```

**With context for override evaluation**:

```typescript
interface Configs {
  'premium-features': boolean
}

const client = await createReplaneClient<Configs>({
  sdkKey: process.env.REPLANE_SDK_KEY!,
  baseUrl: 'https://config.company.com'
})

// Evaluate for different users
const freeUser = client.get('premium-features', {
  context: { plan: 'free' }
}) // false

const premiumUser = client.get('premium-features', {
  context: { plan: 'premium' }
}) // true
```

**Client-level context**:

```typescript
const client = await createReplaneClient({
  sdkKey: process.env.REPLANE_SDK_KEY!,
  baseUrl: 'https://config.company.com',
  context: {
    environment: 'production',
    region: 'us-east'
  }
})

// Uses client-level context
const value1 = client.get('feature')

// Merges with client-level context
const value2 = client.get('feature', {
  context: { userId: '123' }
})
```

**In Express middleware**:

```typescript
interface Configs {
  'rate-limits': Record<string, number>
}

const client = await createReplaneClient<Configs>({
  sdkKey: process.env.REPLANE_SDK_KEY!,
  baseUrl: 'https://config.company.com'
})

app.use((req, res, next) => {
  const limits = client.get('rate-limits')
  const rpm = limits['api-requests-per-minute']

  // Apply rate limiting
  if (rateLimiter.isExceeded(req.ip, rpm)) {
    return res.status(429).json({ error: 'Too many requests' })
  }

  next()
})

// Cleanup on shutdown
process.on('SIGTERM', () => {
  client.close()
})
```

**A/B testing with context**:

```typescript
interface Configs {
  'homepage-variant': string
}

const client = await createReplaneClient<Configs>({
  sdkKey: process.env.REPLANE_SDK_KEY!,
  baseUrl: 'https://config.company.com'
})

app.get('/', (req, res) => {
  // Evaluate based on user ID for consistent experience
  const variant = client.get('homepage-variant', {
    context: {
      userId: req.user.id,
      country: req.geo.country
    }
  })

  res.render(variant === 'b' ? 'homepage-v2' : 'homepage-v1')
})
```

### client.subscribe(callback) or client.subscribe(configName, callback)

Subscribe to config changes and receive real-time updates when configs are modified.

#### Overloads

**1. Subscribe to all config changes:**

```typescript
client.subscribe((config) => {
  console.log(`Config ${config.name} changed to:`, config.value)
})
```

**2. Subscribe to a specific config:**

```typescript
client.subscribe('feature-flag', (config) => {
  console.log(`feature-flag changed to:`, config.value)
})
```

#### Parameters

| Parameter    | Type       | Required | Description                                                           |
| ------------ | ---------- | -------- | --------------------------------------------------------------------- |
| `callback`   | `function` | Yes      | Function called when config(s) change. Receives `{ name, value }`.   |
| `configName` | `string`   | No       | If provided, only changes to this specific config trigger callback.  |

#### Returns

A function to unsubscribe from the config changes.

#### Examples

**Subscribe to all changes**:

```typescript
const unsubscribe = client.subscribe((config) => {
  console.log(`Config ${config.name} updated:`, config.value)

  // React to specific configs
  if (config.name === 'feature-flag') {
    console.log('Feature flag changed!')
  }
})

// Later: unsubscribe
unsubscribe()
```

**Subscribe to specific config**:

```typescript
interface Configs {
  'feature-flag': boolean
  'max-users': number
}

const client = await createReplaneClient<Configs>({
  sdkKey: process.env.REPLANE_SDK_KEY!,
  baseUrl: 'https://config.company.com'
})

const unsubscribe = client.subscribe('feature-flag', (config) => {
  console.log('Feature flag changed:', config.value)
  // config.value is automatically typed as boolean
})

// Cleanup
unsubscribe()
```

**Multiple subscriptions**:

```typescript
const unsubscribe1 = client.subscribe('feature-flag', (config) => {
  console.log('Feature flag:', config.value)
})

const unsubscribe2 = client.subscribe('max-users', (config) => {
  console.log('Max users:', config.value)
})

// Cleanup both
unsubscribe1()
unsubscribe2()
```

### client.close()

Gracefully shuts down the client and cleans up resources. Subsequent calls to `get()` will throw.

#### Example

```typescript
// During application shutdown
client.close()
```

### createInMemoryReplaneClient(initialData)

Creates a client backed by an in-memory store instead of making HTTP requests. Useful for testing or local development where you want deterministic config values without a server.

#### Parameters

| Parameter     | Type                  | Required | Description                 |
| ------------- | --------------------- | -------- | --------------------------- |
| `initialData` | `Record<string, any>` | Yes      | Map of config name to value |

#### Returns

Client with same API as `createReplaneClient`: `{ get, subscribe, close }`

#### Notes

- `get(name)` resolves to the value from `initialData`
- Throws `ReplaneError` if config name is missing
- Client works as usual but doesn't receive SSE updates (values remain static from `initialData`)
- `subscribe()` returns no-op unsubscribe function

#### Example

```typescript
import { createInMemoryReplaneClient } from '@replanejs/sdk'

interface Configs {
  'feature-flags': Record<string, boolean>
  'rate-limits': Record<string, number>
}

const client = createInMemoryReplaneClient<Configs>({
  'feature-flags': { 'new-feature': true },
  'rate-limits': { 'api-requests-per-minute': 100 }
})

const flags = client.get('feature-flags')
console.log(flags) // { "new-feature": true }

const limits = client.get('rate-limits')
console.log(limits['api-requests-per-minute']) // 100
```

## Error Handling

### ReplaneError

The SDK throws `ReplaneError` for various failures:

```typescript
import { ReplaneError } from '@replanejs/sdk'

try {
  const client = await createReplaneClient({
    sdkKey: 'invalid-key',
    baseUrl: 'https://config.company.com'
  })
} catch (error) {
  if (error instanceof ReplaneError) {
    console.error('Replane error:', error.message)
    console.error('Error code:', error.code)
  } else {
    console.error('Other error:', error)
  }
}

// Or when getting a non-existent config
try {
  const value = client.get('non-existent-config')
} catch (error) {
  if (error instanceof ReplaneError && error.code === 'not_found') {
    console.error('Config not found')
  }
}
```

### Retry Behavior

Transient failures (5xx responses or network errors) are automatically retried with exponential backoff:

```typescript
const client = await createReplaneClient({
  sdkKey: 'rp_...',
  baseUrl: 'https://config.company.com',
  retryDelayMs: 200 // Base delay (exponential backoff with jitter applied)
})
```

Non-transient errors (4xx) are not retried. Background SSE connection errors are logged and automatically retried, but don't affect `get()` calls (which return the last known value).

## Environment Support

- **Node.js 18+**: Built-in `fetch` support
- **Browsers**: Modern browsers with `fetch` and `EventSource`
- **Edge runtimes**: Cloudflare Workers, Vercel Edge, Deno
- **Older environments**: Provide a polyfill via `fetchFn`

## TypeScript

The SDK is written in TypeScript and exports full type definitions.

```typescript
import { createReplaneClient, ReplaneError, createInMemoryReplaneClient } from '@replanejs/sdk'
import type { ReplaneClient, ReplaneContext, GetConfigOptions } from '@replanejs/sdk'

interface Configs {
  'feature-flags': Record<string, boolean>
  'rate-limit': number
}

const client: ReplaneClient<Configs> = await createReplaneClient<Configs>({
  sdkKey: 'rp_...',
  baseUrl: 'https://config.company.com'
})

const flags = client.get('feature-flags') // Typed as Record<string, boolean>
```

## Best Practices

### Store SDK Keys Securely

```typescript
// ✅ Good: Use environment variables
const client = await createReplaneClient({
  sdkKey: process.env.REPLANE_SDK_KEY!,
  baseUrl: process.env.REPLANE_URL!
})

// ❌ Bad: Hardcode credentials
const client = await createReplaneClient({
  sdkKey: 'rpk_abc123...',
  baseUrl: 'https://...'
})
```

### Initialize Once, Read Many Times

The client maintains a realtime connection and up-to-date cache:

```typescript
// Initialize once at startup
const client = await createReplaneClient<Configs>({
  sdkKey: process.env.REPLANE_SDK_KEY!,
  baseUrl: 'https://config.company.com'
})

app.get('/api/data', (req, res) => {
  // Always up-to-date via SSE, no network request needed
  const flags = client.get('feature-flags')
  // ...
})
```

### Provide Fallbacks

```typescript
interface Configs {
  'my-config': {
    'feature-enabled': boolean
    'rate-limit': number
  }
}

const client = await createReplaneClient<Configs>({
  sdkKey: process.env.REPLANE_SDK_KEY!,
  baseUrl: 'https://config.company.com',
  fallbacks: {
    'my-config': {
      'feature-enabled': false,
      'rate-limit': 100
    }
  }
})

// If initial fetch fails, fallback values are used
// Once connected, receives realtime updates
```

### Clean Up Resources

```typescript
// Close client on shutdown
process.on('SIGTERM', () => {
  client.close()
})

// Or manually
client.close()
```

## Examples

### Feature Flags

```typescript
interface Configs {
  'feature-flags': Record<string, boolean>
}

const client = await createReplaneClient<Configs>({
  sdkKey: process.env.REPLANE_SDK_KEY!,
  baseUrl: 'https://config.company.com'
})

const flags = client.get('feature-flags')

if (flags['new-checkout']) {
  return renderNewCheckout()
} else {
  return renderOldCheckout()
}
```

### Rate Limiting

```typescript
interface Configs {
  'rate-limits': Record<string, number>
}

const client = await createReplaneClient<Configs>({
  sdkKey: process.env.REPLANE_SDK_KEY!,
  baseUrl: 'https://config.company.com'
})

// Value is always up-to-date via SSE
const limits = client.get('rate-limits')
const rpm = limits['api-requests-per-minute']
rateLimiter.setLimit(rpm)
```

### Multiple Projects

Each SDK key is tied to a specific project. For multiple projects, create separate clients:

```typescript
interface ProjectAConfigs {
  'flags': Record<string, boolean>
}

interface ProjectBConfigs {
  'flags': Record<string, boolean>
}

const projectAClient = await createReplaneClient<ProjectAConfigs>({
  sdkKey: process.env.PROJECT_A_SDK_KEY!,
  baseUrl: 'https://config.company.com'
})

const projectBClient = await createReplaneClient<ProjectBConfigs>({
  sdkKey: process.env.PROJECT_B_SDK_KEY!,
  baseUrl: 'https://config.company.com'
})

const flagsA = projectAClient.get('flags')
const flagsB = projectBClient.get('flags')
```

## Next Steps

- [**API Reference**](../api) - Direct API access
- [**Guides**](../guides/feature-flags) - Common use cases
