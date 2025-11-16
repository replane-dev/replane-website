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
import { createReplaneClient } from 'replane-sdk';

const client = createReplaneClient({
  apiKey: process.env.REPLANE_API_KEY,
  baseUrl: process.env.REPLANE_URL,
});

// Check a flag
const flags = await client.getConfigValue('feature-flags');

if (flags['new-onboarding']) {
  // Show new onboarding flow
} else {
  // Show old onboarding
}
```

## Percentage-Based Rollouts

Roll out features gradually by storing percentages:

```json title="rollout-config"
{
  "billing-v2-percentage": 25,
  "advanced-search-percentage": 50
}
```

Implementation:

```javascript
const rollouts = await client.getConfigValue('rollout-config');
const userHash = hashUserId(user.id); // Deterministic hash

function isFeatureEnabled(featureName, percentage) {
  return (userHash % 100) < percentage;
}

if (isFeatureEnabled('billing-v2', rollouts['billing-v2-percentage'])) {
  // User sees billing v2
}
```

## User Cohorts

Target specific user groups:

```json title="cohort-flags"
{
  "beta-users": ["user-123", "user-456", "user-789"],
  "internal-users": ["admin@company.com"],
  "premium-feature-enabled": true
}
```

Check membership:

```javascript
const cohorts = await client.getConfigValue('cohort-flags');

if (cohorts['beta-users'].includes(user.id)) {
  // Show beta features
}
```

## Realtime Flag Updates

Use watchers to get instant updates when flags change:

```javascript
const flags = await client.watchConfigValue('feature-flags');

// Later in your code
function isEnabled(flagName) {
  return flags.get()[flagName] || false;
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

Always provide fallbacks:

```javascript
const flags = await client
  .getConfigValue('feature-flags')
  .catch(() => ({
    'new-feature': false,  // Safe default
  }));
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
