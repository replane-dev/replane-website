---
title: Operational Tuning
description: Adjust rate limits, timeouts, batch sizes, and cache TTLs in realtime without deploying. Use dynamic configuration for incident response and per-environment settings.
---

# Operational tuning

Operational tuning lets you adjust system parameters without deploying. Use it for:

- Rate limits and quotas
- Timeouts and retries
- Batch sizes and intervals
- Cache TTLs
- Thresholds and limits

## Why use dynamic configuration?

Traditional approach:
```typescript
// Hardcoded - requires deploy to change
const RATE_LIMIT = 100;
const TIMEOUT_MS = 5000;
const BATCH_SIZE = 50;
```

With Replane:
```typescript
// Dynamic - change in dashboard, updates instantly
const rateLimit = replane.get('api-rate-limit');
const timeout = replane.get('request-timeout-ms');
const batchSize = replane.get('batch-size');
```

## Common use cases

### Rate limiting

Adjust API rate limits per plan:

```typescript
import { Replane } from '@replanejs/sdk'

interface Configs {
  'rate-limit-requests-per-minute': number;
}

const replane = new Replane<Configs>()
await replane.connect({
  sdkKey: process.env.REPLANE_SDK_KEY!,
  baseUrl: 'https://replane.example.com'
})

function checkRateLimit(user: User) {
  const limit = replane.get('rate-limit-requests-per-minute', {
    context: { plan: user.plan }
  });

  return user.requestCount < limit;
}
```

Config setup:
```
Name: rate-limit-requests-per-minute
Base value: 60

Override: Premium users
  Condition: plan equals "premium"
  Value: 1000

Override: Enterprise users
  Condition: plan equals "enterprise"
  Value: 10000
```

### Timeouts

Adjust timeouts based on conditions:

```typescript
interface Configs {
  'api-timeout-ms': number;
  'retry-count': number;
  'retry-delay-ms': number;
}

async function fetchWithTimeout(url: string) {
  const timeout = replane.get('api-timeout-ms');
  const retries = replane.get('retry-count');
  const retryDelay = replane.get('retry-delay-ms');

  for (let i = 0; i <= retries; i++) {
    try {
      const response = await fetch(url, {
        signal: AbortSignal.timeout(timeout)
      });
      return response;
    } catch (error) {
      if (i < retries) {
        await sleep(retryDelay);
      }
    }
  }
  throw new Error('Request failed after retries');
}
```

### Batch processing

Tune batch job parameters:

```typescript
interface Configs {
  'batch-size': number;
  'batch-interval-ms': number;
  'concurrent-workers': number;
}

async function processBatch() {
  const batchSize = replane.get('batch-size');
  const interval = replane.get('batch-interval-ms');
  const workers = replane.get('concurrent-workers');

  const items = await getNextItems(batchSize);

  await Promise.all(
    chunk(items, Math.ceil(items.length / workers))
      .map(chunk => processItems(chunk))
  );

  setTimeout(processBatch, interval);
}
```

### Cache configuration

Dynamic cache TTLs:

```typescript
interface Configs {
  'cache-ttl-seconds': number;
  'cache-max-items': number;
}

class ConfigurableCache {
  async get(key: string) {
    const ttl = replane.get('cache-ttl-seconds');
    const maxItems = replane.get('cache-max-items');

    // Use values for cache behavior
  }
}
```

### Feature limits

Control feature quotas:

```typescript
interface Configs {
  'max-file-size-mb': number;
  'max-uploads-per-day': number;
  'max-team-members': number;
}

function validateUpload(file: File, user: User) {
  const maxSizeMb = replane.get('max-file-size-mb', {
    context: { plan: user.plan }
  });

  if (file.size > maxSizeMb * 1024 * 1024) {
    throw new Error(`File too large. Max: ${maxSizeMb}MB`);
  }
}
```

## Structured configuration

For complex settings, use objects:

```typescript
interface Configs {
  'email-settings': {
    enabled: boolean;
    rateLimit: number;
    retries: number;
    providers: string[];
  };
}

const emailSettings = replane.get('email-settings');

if (emailSettings.enabled) {
  await sendEmail({
    maxRetries: emailSettings.retries,
    rateLimit: emailSettings.rateLimit
  });
}
```

## JSON Schema validation

Prevent invalid values with JSON Schema:

```json
{
  "type": "object",
  "properties": {
    "enabled": { "type": "boolean" },
    "rateLimit": { "type": "number", "minimum": 1, "maximum": 10000 },
    "retries": { "type": "integer", "minimum": 0, "maximum": 10 }
  },
  "required": ["enabled", "rateLimit"]
}
```

The dashboard validates changes against the schema before saving.

## Reacting to changes

Update behavior when configs change:

```typescript
// Initial setup
let rateLimit = replane.get('api-rate-limit');

// Update when config changes
replane.subscribe('api-rate-limit', (config) => {
  rateLimit = config.value;
  console.log('Rate limit updated:', rateLimit);
});

// Use the current value
function checkRateLimit() {
  return requestCount < rateLimit;
}
```

## Environment-specific values

Different values per environment:

| Config | Production | Staging | Development |
|--------|------------|---------|-------------|
| `api-rate-limit` | 100 | 1000 | 10000 |
| `request-timeout-ms` | 5000 | 30000 | 60000 |
| `log-level` | `"error"` | `"info"` | `"debug"` |

## Best practices

### Document your configs

Add descriptions in the dashboard explaining:
- What the config controls
- Valid value ranges
- Impact of changes

### Monitor after changes

After changing operational configs:
1. Watch metrics (latency, error rates)
2. Be ready to roll back
3. Consider gradual changes (100 → 150 → 200)

### Separate concerns

Keep configs focused:

```
✓ api-rate-limit
✓ api-timeout-ms
✓ api-retry-count

✗ api-settings (too broad)
```

## Incident response

Use dynamic configuration for quick incident response:

```typescript
// Kill switch for expensive operation
if (!replane.get('feature-search-enabled')) {
  return { error: 'Search is temporarily disabled' };
}

// Circuit breaker
const circuitOpen = replane.get('circuit-breaker-open');
if (circuitOpen) {
  return getCachedResponse();
}

// Reduce load
const degradedMode = replane.get('degraded-mode-enabled');
if (degradedMode) {
  return getSimplifiedResponse();
}
```

## Next steps

- [Feature Flags](/docs/guides/feature-flags) — Toggle features
- [Override Rules](/docs/guides/override-rules) — Per-user settings
- [JavaScript SDK](/docs/sdk/javascript) — Full API reference
