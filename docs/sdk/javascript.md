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

// Watch a config (receives realtime updates via SSE)
const flags = await client.watchConfig<Record<string, boolean>>('feature-flags');

// Get the current value
if (flags.getValue()['new-feature']) {
  console.log('Feature enabled!');
}

// With context for override evaluation
const enabled = flags.getValue({
  userId: 'user-123',
  plan: 'premium',
});
```

## API Reference

### createReplaneClient(options)

Creates a new Replane client instance.

#### Options

| Option | Type | Required | Default | Description |
|--------|------|----------|---------|-------------|
| `apiKey` | `string` | Yes | - | API key for authentication. Each key is tied to a specific project. |
| `baseUrl` | `string` | Yes | - | Base URL of your Replane instance (no trailing slash) |
| `context` | `object` | No | `{}` | Default context for all config evaluations (can be overridden per-request) |
| `fetchFn` | `function` | No | `globalThis.fetch` | Custom fetch function (for testing or unsupported environments) |
| `timeoutMs` | `number` | No | `2000` | Request timeout in milliseconds |
| `retries` | `number` | No | `2` | Number of retry attempts on transient failures |
| `retryDelayMs` | `number` | No | `200` | Base delay between retries in milliseconds |
| `logger` | `object` | No | `console` | Custom logger with debug, info, warn, error methods |

#### Returns

Client object with methods: `{ watchConfig, close }`

#### Example

```typescript
const client = createReplaneClient({
  apiKey: 'rpk_abc123...',
  baseUrl: 'https://config.company.com',
  context: {
    environment: 'production',
    region: 'us-east',
  },
  timeoutMs: 5000,
  retries: 3,
});
```

### client.watchConfig(name, options?)

Creates a watcher that receives realtime updates for a config value via Server-Sent Events (SSE). The watcher evaluates override rules client-side based on context you provide.

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | `string` | Yes | Config name to watch |
| `options` | `object` | No | Options for this watcher |
| `options.context` | `object` | No | Context merged with client-level context for override evaluation |

#### Returns

`Promise<ConfigWatcher<T>>` - Watcher object with methods:
- `getValue(context?)` - Returns current value with override evaluation based on context
- `close()` - Stops watching and closes the SSE connection

#### Errors

Throws if the initial fetch fails. Subsequent SSE update errors are logged but don't throw.

#### Examples

**Basic usage**:

```typescript
const flags = await client.watchConfig<Record<string, boolean>>('feature-flags');

// Get current value
console.log(flags.getValue()); // { "new-onboarding": true, ... }
```

**With context for override evaluation**:

```typescript
const watcher = await client.watchConfig<boolean>('premium-features');

// Evaluate for different users
const freeUser = watcher.getValue({ plan: 'free' }); // false
const premiumUser = watcher.getValue({ plan: 'premium' }); // true
```

**With type safety**:

```typescript
interface FeatureFlags {
  'new-onboarding': boolean;
  'dark-mode': boolean;
}

const flags = await client.watchConfig<FeatureFlags>('feature-flags');
if (flags.getValue()['new-onboarding']) {
  // TypeScript knows this is a boolean
}
```

**Client-level context**:

```typescript
const client = createReplaneClient({
  apiKey: process.env.REPLANE_API_KEY!,
  baseUrl: 'https://config.company.com',
  context: {
    environment: 'production',
    region: 'us-east',
  },
});

const watcher = await client.watchConfig('feature');
// Uses client-level context
watcher.getValue();
// Merges with client-level context
watcher.getValue({ userId: '123' });
```

**In Express middleware**:

```typescript
// Initialize once
const rateConfig = await client.watchConfig<Record<string, number>>('rate-limits');

app.use((req, res, next) => {
  const limits = rateConfig.getValue();
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

const limits = await client.watchConfig<RateLimits>('rate-limits');
const rpm = limits.getValue()['api-requests-per-minute']; // TypeScript knows this is a number
```

**A/B testing with context**:

```typescript
const experiment = await client.watchConfig<string>('homepage-variant');

app.get('/', (req, res) => {
  // Evaluate based on user ID for consistent experience
  const variant = experiment.getValue({
    userId: req.user.id,
    country: req.geo.country,
  });
  
  res.render(variant === 'b' ? 'homepage-v2' : 'homepage-v1');
});
```

### client.close()

Gracefully shuts down the client and closes all active watchers. Subsequent calls to `watchConfig` will throw.

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

- `watchConfig` resolves to watchers with values from `initialData`
- Throws `ReplaneError` if config name is missing
- Watchers work but don't receive SSE updates (values remain static from `initialData`)

#### Example

```typescript
import { createInMemoryReplaneClient } from 'replane-sdk';

const client = createInMemoryReplaneClient({
  'feature-flags': { 'new-feature': true },
  'rate-limits': { 'api-requests-per-minute': 100 },
});

const flags = await client.watchConfig('feature-flags');
console.log(flags.getValue()); // { "new-feature": true }
```

## Error Handling

### ReplaneError

The SDK throws `ReplaneError` for HTTP failures:

```typescript
try {
  const watcher = await client.watchConfig('non-existent');
} catch (error) {
  if (error instanceof ReplaneError) {
    console.error('Replane error:', error.message);
    console.error('Error code:', error.code);
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
import type { ReplaneClient, ConfigWatcher } from 'replane-sdk';

const client: ReplaneClient = createReplaneClient({
  apiKey: 'rpk_...',
  baseUrl: 'https://config.company.com',
});

const watcher: ConfigWatcher<Record<string, boolean>> = await client.watchConfig('flags');
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

### Use Watchers for All Configs

All config access uses watchers with realtime updates:

```typescript
// Initialize watchers once at startup
const flags = await client.watchConfig('feature-flags');

app.get('/api/data', (req, res) => {
  // Always up-to-date via SSE, no network request needed
  const currentFlags = flags.getValue();
  // ...
});
```

### Provide Fallbacks

```typescript
let config: ConfigWatcher<MyConfig>;
try {
  config = await client.watchConfig('my-config');
} catch (error) {
  // Use in-memory client with safe defaults
  const fallbackClient = createInMemoryReplaneClient({
    'my-config': {
      'feature-enabled': false,
      'rate-limit': 100,
    },
  });
  config = await fallbackClient.watchConfig('my-config');
}
```

### Clean Up Resources

```typescript
// Close individual watchers
const watcher = await client.watchConfig('config');
// ... use watcher
watcher.close();

// Or close entire client
client.close(); // Closes all watchers
```

## Examples

### Feature Flags

```typescript
const flags = await client.watchConfig<Record<string, boolean>>('feature-flags');

if (flags.getValue()['new-checkout']) {
  return renderNewCheckout();
} else {
  return renderOldCheckout();
}
```

### Rate Limiting

```typescript
const limits = await client.watchConfig<Record<string, number>>('rate-limits');

// Value is always up-to-date via SSE
const rpm = limits.getValue()['api-requests-per-minute'];
rateLimiter.setLimit(rpm);
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

const flagsA = await projectAClient.watchConfig('flags');
const flagsB = await projectBClient.watchConfig('flags');
```

## Next Steps

- [**API Reference**](../api) - Direct API access
- [**Guides**](../guides/feature-flags) - Common use cases
