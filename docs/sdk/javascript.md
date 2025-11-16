---
sidebar_position: 1
---

# JavaScript / TypeScript SDK

Official SDK for accessing Replane configs from JavaScript and TypeScript applications.

## Installation

```bash npm2yarn
npm install replane-sdk
```

## Quick Start

```typescript
import { createReplaneClient } from 'replane-sdk';

const client = createReplaneClient({
  apiKey: process.env.REPLANE_API_KEY!,
  baseUrl: 'https://replane.yourdomain.com',
});

// Fetch a config value
const flags = await client.getConfigValue<Record<string, boolean>>('feature-flags');

if (flags['new-feature']) {
  console.log('Feature enabled!');
}
```

## API Reference

### createReplaneClient(options)

Creates a new Replane client instance.

#### Options

| Option | Type | Required | Default | Description |
|--------|------|----------|---------|-------------|
| `apiKey` | `string` | Yes | - | API key for authentication. Each key is tied to a specific project. |
| `baseUrl` | `string` | Yes | - | Base URL of your Replane instance (no trailing slash) |
| `fetchFn` | `function` | No | `globalThis.fetch` | Custom fetch function (for testing or unsupported environments) |
| `timeoutMs` | `number` | No | `2000` | Request timeout in milliseconds |
| `retries` | `number` | No | `2` | Number of retry attempts on transient failures |
| `retryDelayMs` | `number` | No | `100` | Base delay between retries in milliseconds |

#### Returns

Client object with methods: `{ getConfigValue, watchConfigValue, close }`

#### Example

```typescript
const client = createReplaneClient({
  apiKey: 'rpk_abc123...',
  baseUrl: 'https://config.company.com',
  timeoutMs: 5000,
  retries: 3,
});
```

### client.getConfigValue(name, overrides?)

Fetches a config value by name. Returns a promise that resolves to the parsed JSON value.

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | `string` | Yes | Config name to fetch |
| `overrides` | `object` | No | Override client options for this request |

#### Returns

`Promise<T>` - Parsed JSON config value

#### Errors

Throws `ReplaneError` on:
- Non-2xx responses (including 404 for missing configs)
- Network errors
- Invalid JSON

#### Examples

**Basic usage**:

```typescript
const flags = await client.getConfigValue('feature-flags');
console.log(flags); // { "new-onboarding": true, ... }
```

**With type safety**:

```typescript
interface FeatureFlags {
  'new-onboarding': boolean;
  'dark-mode': boolean;
}

const flags = await client.getConfigValue<FeatureFlags>('feature-flags');
if (flags['new-onboarding']) {
  // TypeScript knows this is a boolean
}
```

**With fallback**:

```typescript
const flags = await client
  .getConfigValue('feature-flags')
  .catch(() => ({ 'new-feature': false }));
```

**With overrides**:

```typescript
const config = await client.getConfigValue('slow-config', {
  timeoutMs: 10000,
  retries: 5,
});
```

### client.watchConfigValue(name, overrides?)

Creates a watcher that receives realtime updates for a config value via Server-Sent Events (SSE).

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | `string` | Yes | Config name to watch |
| `overrides` | `object` | No | Override client options for this request |

#### Returns

`Promise<Watcher<T>>` - Watcher object with methods: `{ get, close }`

- `get()` - Returns the most recent value
- `close()` - Stops watching and closes the SSE connection

#### Errors

Throws if the initial fetch fails. Subsequent updates are pushed automatically.

#### Examples

**Basic usage**:

```typescript
const flags = await client.watchConfigValue('feature-flags');

// Read current value
if (flags.get()['new-feature']) {
  console.log('Feature enabled');
}

// Value updates automatically when changed in Replane UI
setInterval(() => {
  console.log('Current flags:', flags.get());
}, 1000);

// Clean up when done
flags.close();
```

**In Express middleware**:

```typescript
// Initialize once
const rateConfig = await client.watchConfigValue('rate-limits');

app.use((req, res, next) => {
  const limits = rateConfig.get();
  const rpm = limits['api-requests-per-minute'];

  // Apply rate limiting
  if (rateLimiter.isExceeded(req.ip, rpm)) {
    return res.status(429).json({ error: 'Too many requests' });
  }

  next();
});

// Cleanup on shutdown
process.on('SIGTERM', () => {
  rateConfig.close();
});
```

**Typed watcher**:

```typescript
interface RateLimits {
  'api-requests-per-minute': number;
  'max-concurrent-connections': number;
}

const limits = await client.watchConfigValue<RateLimits>('rate-limits');
const rpm = limits.get()['api-requests-per-minute']; // TypeScript knows this is a number
```

### client.close()

Gracefully shuts down the client and closes all active watchers. Subsequent calls to `getConfigValue` or `watchConfigValue` will throw.

#### Example

```typescript
// During application shutdown
client.close();
```

### createInMemoryReplaneClient(initialData)

Creates a client backed by an in-memory store. Useful for testing or local development.

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `initialData` | `Record<string, any>` | Yes | Map of config name to value |

#### Returns

Client with same API as `createReplaneClient`

#### Notes

- `getConfigValue` resolves to values from `initialData`
- Throws `ReplaneError` if config name is missing
- `watchConfigValue` works but uses polling (no SSE)

#### Example

```typescript
import { createInMemoryReplaneClient } from 'replane-sdk';

const client = createInMemoryReplaneClient({
  'feature-flags': { 'new-feature': true },
  'rate-limits': { 'api-requests-per-minute': 100 },
});

const flags = await client.getConfigValue('feature-flags');
console.log(flags); // { "new-feature": true }
```

## Error Handling

### ReplaneError

The SDK throws `ReplaneError` for HTTP failures:

```typescript
try {
  const config = await client.getConfigValue('non-existent');
} catch (error) {
  if (error instanceof ReplaneError) {
    console.error('HTTP error:', error.message);
    console.error('Status code:', error.statusCode);
  } else {
    console.error('Other error:', error);
  }
}
```

### Retry Behavior

Transient failures (5xx responses or network errors) are automatically retried:

```typescript
const client = createReplaneClient({
  apiKey: 'rpk_...',
  baseUrl: 'https://config.company.com',
  retries: 3,          // Retry up to 3 times
  retryDelayMs: 200,   // Wait 200ms between retries (with jitter)
});
```

Non-transient errors (4xx) are not retried.

## Environment Support

- **Node.js 18+**: Built-in `fetch` support
- **Browsers**: Modern browsers with `fetch` and `EventSource`
- **Edge runtimes**: Cloudflare Workers, Vercel Edge, Deno
- **Older environments**: Provide a polyfill via `fetchFn`

## TypeScript

The SDK is written in TypeScript and exports full type definitions.

```typescript
import { createReplaneClient, ReplaneError } from 'replane-sdk';
import type { ReplaneClient, Watcher } from 'replane-sdk';

const client: ReplaneClient = createReplaneClient({
  apiKey: 'rpk_...',
  baseUrl: 'https://config.company.com',
});

const watcher: Watcher<Record<string, boolean>> = await client.watchConfigValue('flags');
```

## Best Practices

### Store API Keys Securely

```typescript
// ✅ Good: Use environment variables
const client = createReplaneClient({
  apiKey: process.env.REPLANE_API_KEY!,
  baseUrl: process.env.REPLANE_URL!,
});

// ❌ Bad: Hardcode credentials
const client = createReplaneClient({
  apiKey: 'rpk_abc123...',
  baseUrl: 'https://...',
});
```

### Use Watchers for Frequently Accessed Configs

```typescript
// ❌ Fetches on every request
app.get('/api/data', async (req, res) => {
  const flags = await client.getConfigValue('feature-flags');
  // ...
});

// ✅ Cached in memory, updated in realtime
const flags = await client.watchConfigValue('feature-flags');

app.get('/api/data', (req, res) => {
  const currentFlags = flags.get();
  // ...
});
```

### Provide Fallbacks

```typescript
const config = await client
  .getConfigValue('my-config')
  .catch(() => ({
    // Safe defaults
    'feature-enabled': false,
    'rate-limit': 100,
  }));
```

### Clean Up Resources

```typescript
// Close individual watchers
const watcher = await client.watchConfigValue('config');
// ... use watcher
watcher.close();

// Or close entire client
client.close(); // Closes all watchers
```

## Examples

### Feature Flags

```typescript
const flags = await client.getConfigValue('feature-flags');

if (flags['new-checkout']) {
  return renderNewCheckout();
} else {
  return renderOldCheckout();
}
```

### Rate Limiting

```typescript
const limits = await client.watchConfigValue('rate-limits');

setInterval(() => {
  const rpm = limits.get()['api-requests-per-minute'];
  rateLimiter.setLimit(rpm);
}, 1000);
```

### Multiple Projects

Each API key is tied to a specific project. For multiple projects, create separate clients:

```typescript
const projectAClient = createReplaneClient({
  apiKey: process.env.PROJECT_A_API_KEY!,
  baseUrl: 'https://config.company.com',
});

const projectBClient = createReplaneClient({
  apiKey: process.env.PROJECT_B_API_KEY!,
  baseUrl: 'https://config.company.com',
});

const flagsA = await projectAClient.getConfigValue('flags');
const flagsB = await projectBClient.getConfigValue('flags');
```

## Next Steps

- [**API Reference**](../api) - Direct API access
- [**Guides**](../guides/feature-flags) - Common use cases
