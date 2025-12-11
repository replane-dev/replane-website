---
sidebar_position: 1
---

# Feature Flags

Use Replane to manage feature flags across your applications without deploying code.

## Basic Feature Flags

Create a config named `feature-flags` with simple boolean values:

```json
{
  "new-onboarding": true,
  "dark-mode": false,
  "billing-v2": false,
  "advanced-search": true
}
```

In your application:

```javascript
import { createReplaneClient } from '@replanejs/sdk'

const client = await createReplaneClient({
  sdkKey: process.env.REPLANE_SDK_KEY,
  baseUrl: process.env.REPLANE_URL
})

// Check a flag
const flags = client.get('feature-flags')

if (flags['new-onboarding']) {
  // Show new onboarding flow
} else {
  // Show old onboarding
}
```

## Targeted Rollouts with Override Rules

Use [**override rules**](./override-rules) to target specific users or groups without managing separate values:

**Config:** `new-feature-enabled`  
**Base value:** `false`  
**Override:** VIP Users

- Condition: Property `userEmail` in `["vip1@example.com", "vip2@example.com"]`
- Value: `true`

```javascript
// Regular user - gets base value (false)
const enabled1 = client.get('new-feature-enabled', {
  context: { userEmail: 'user@example.com' }
})

// VIP user - gets override value (true)
const enabled2 = client.get('new-feature-enabled', {
  context: { userEmail: 'vip1@example.com' }
})
```

See the [**Override Rules Guide**](./override-rules) for advanced targeting scenarios.

## Tier-Based Features

Target users by subscription tier:

**Config:** `feature-flags`  
**Base value:**

```json
{
  "advanced-search": false,
  "export-data": false
}
```

**Override:** Premium Users

- Condition: Property `tier` equals `"premium"`
- Value:

```json
{
  "advanced-search": true,
  "export-data": true
}
```

```javascript
const flags = client.get('feature-flags', {
  context: { tier: user.subscription.tier }
})

if (flags['advanced-search']) {
  // Show advanced search (premium users only)
}
```

## Realtime Flag Updates

The client automatically receives realtime updates via Server-Sent Events (SSE). Subscribe to changes:

```javascript
// Subscribe to flag changes
const unsubscribe = client.subscribe('feature-flags', (config) => {
  console.log('Flags updated:', config.value)
  // React to the change, e.g., update UI
})

// Get current value anytime
function isEnabled(flagName) {
  const flags = client.get('feature-flags')
  return flags[flagName] || false
}

// The value updates automatically when someone changes it in the UI
```

## JSON Schema for Safety

Prevent invalid flag configurations with a schema:

```json title="Schema for feature-flags"
{
  "type": "object",
  "properties": {
    "new-onboarding": { "type": "boolean" },
    "dark-mode": { "type": "boolean" },
    "billing-v2": { "type": "boolean" },
    "advanced-search": { "type": "boolean" }
  },
  "additionalProperties": false,
  "required": ["new-onboarding", "dark-mode"]
}
```

<!-- Screenshot: Schema validation will be added here -->

This ensures:

- Only boolean values are allowed
- Required flags are always present
- No typos in flag names

## Best Practices

### Use Descriptive Names

```javascript
// ❌ Bad
"flag1": true
"f2": false

// ✅ Good
"new-onboarding-flow": true
"billing-v2-enabled": false
```

### Group Related Flags

Create separate configs for different domains:

- `feature-flags` - UI features
- `api-flags` - API behavior
- `experiments` - A/B tests

### Default to Safe Values

Always provide fallbacks during client initialization:

```javascript
const client = await createReplaneClient({
  sdkKey: process.env.REPLANE_SDK_KEY,
  baseUrl: process.env.REPLANE_URL,
  fallbacks: {
    'feature-flags': {
      'new-feature': false // Safe default
    }
  }
})
```

### Document Your Flags

Keep a README or wiki documenting:

- What each flag does
- Who owns it
- When it was added
- Removal plan

## Migration Strategy

When removing a flag:

1. Set it to the final value (e.g., `true` for fully rolled out)
2. Remove the code that checks it
3. Delete the flag from config (or leave it for audit history)

## Next Steps

- [**Operational Tuning**](./operational-tuning) - Adjust app behavior without deploys
- [**Gradual Rollouts**](./gradual-rollouts) - Safe feature releases
- [**JavaScript SDK**](../sdk/javascript) - Full SDK reference
