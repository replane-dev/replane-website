---
sidebar_position: 2
---

# Operational Tuning

Adjust application behavior in realtime without deploying code.

## Rate Limits

Store rate limit configurations:

```json title="rate-limits"
{
  "api-requests-per-minute": 100,
  "api-requests-per-hour": 5000,
  "max-concurrent-connections": 50,
  "max-payload-size-mb": 10
}
```

Use in your API:

```javascript
import { createReplaneClient } from 'replane-sdk'

const client = createReplaneClient({
  sdkKey: process.env.REPLANE_SDK_KEY,
  baseUrl: process.env.REPLANE_URL
})

const limits = await client.watchConfigValue('rate-limits')

// In your rate limiter
function getRateLimit() {
  return limits.get()['api-requests-per-minute']
}
```

When you need to increase limits during a traffic spike:

1. Update the config in the Replane UI
2. Changes propagate instantly to all app instances
3. No restart required

## Cache TTLs

Tune cache behavior dynamically:

```json title="cache-config"
{
  "user-profile-ttl-seconds": 300,
  "product-catalog-ttl-seconds": 3600,
  "homepage-ttl-seconds": 60
}
```

Implementation:

```javascript
const cacheConfig = await client.watchConfigValue('cache-config')

async function getCachedUserProfile(userId) {
  const ttl = cacheConfig.get()['user-profile-ttl-seconds']
  return cache.get(`user:${userId}`, { ttl })
}
```

## Batch Sizes

Control background job batch sizes:

```json title="job-config"
{
  "email-batch-size": 100,
  "webhook-batch-size": 50,
  "export-batch-size": 1000
}
```

Use in your worker:

```javascript
const jobConfig = await client.watchConfigValue('job-config')

async function processEmails() {
  const batchSize = jobConfig.get()['email-batch-size']
  const emails = await getEmailQueue(batchSize)
  // Process batch...
}
```

## Timeouts & Retries

Store timeout and retry policies:

```json title="resilience-config"
{
  "api-timeout-ms": 5000,
  "database-timeout-ms": 3000,
  "max-retries": 3,
  "retry-delay-ms": 1000
}
```

## Feature Thresholds

Control when features trigger:

```json title="thresholds"
{
  "free-tier-max-items": 100,
  "premium-tier-max-items": 10000,
  "bulk-import-min-items": 50,
  "large-file-warning-mb": 50
}
```

## Circuit Breaker Settings

Manage circuit breaker behavior:

```json title="circuit-breaker"
{
  "failure-threshold": 5,
  "timeout-ms": 10000,
  "reset-timeout-ms": 30000
}
```

## JSON Schema for Safety

Prevent invalid configurations:

```json title="Schema for rate-limits"
{
  "type": "object",
  "properties": {
    "api-requests-per-minute": {
      "type": "integer",
      "minimum": 1,
      "maximum": 10000
    },
    "max-concurrent-connections": {
      "type": "integer",
      "minimum": 1,
      "maximum": 1000
    }
  },
  "required": ["api-requests-per-minute"],
  "additionalProperties": false
}
```

This ensures values stay within safe ranges.

## Best Practices

### Start Conservative

Begin with safe, conservative values:

```json
{
  "api-requests-per-minute": 50, // Start low
  "max-concurrent-connections": 20
}
```

Increase gradually based on monitoring.

### Monitor Impact

After changing a config:

- Watch error rates
- Monitor latency
- Check resource usage

### Document Units

Be explicit about units in config names:

```javascript
// ❌ Ambiguous
"timeout": 5

// ✅ Clear
"timeout-ms": 5000
"cache-ttl-seconds": 300
```

### Use Watchers for Hot Paths

For frequently accessed configs, use `watchConfigValue`:

```javascript
// ❌ Fetches on every request
async function rateLimit(req) {
  const limits = await client.getConfigValue('rate-limits')
  // ...
}

// ✅ Cached in memory, updated in realtime
const limits = await client.watchConfigValue('rate-limits')

function rateLimit(req) {
  const rpm = limits.get()['api-requests-per-minute']
  // ...
}
```

### Rollback Plan

If a config change causes issues:

1. Go to Replane UI
2. Click "Version History"
3. Select the previous version
4. Click "Rollback"

Changes propagate instantly.

## Incident Response Example

**Scenario**: API is overloaded during traffic spike

1. Open Replane UI
2. Navigate to `rate-limits` config
3. Increase `api-requests-per-minute` from 100 to 200
4. Save
5. All app instances update within seconds
6. Monitor metrics
7. Adjust further if needed

No deploy, no restart, no downtime.

## Next Steps

- [**Feature Flags**](./feature-flags) - Toggle features on/off
- [**Gradual Rollouts**](./gradual-rollouts) - Safe feature releases
- [**JavaScript SDK**](../sdk/javascript) - SDK reference
