---
title: Feature Flags
description: Toggle features on or off without deploying code
---

# Feature flags

Feature flags let you enable or disable functionality without deploying code. Use them to:

- Release features gradually
- Test in production with specific users
- Create kill switches for instant rollback
- Run A/B tests

## Create a feature flag

1. Navigate to your project in the Replane dashboard
2. Click **New Config**
3. Enter the details:
   - **Name**: `feature-dark-mode`
   - **Value**: `false`
4. Click **Create**

## Read the flag in your app

```typescript
import { Replane } from '@replanejs/sdk'

const replane = new Replane()
await replane.connect({
  sdkKey: process.env.REPLANE_SDK_KEY!,
  baseUrl: 'https://replane.example.com'
})

if (replane.get('feature-dark-mode')) {
  enableDarkMode()
}
```

## Enable for specific users

Add an override to enable the feature for beta testers:

1. Click on your config
2. Click **Add Override**
3. Configure:
   - **Name**: "Beta users"
   - **Condition**: `userGroup` equals `beta`
   - **Value**: `true`
4. Click **Save**

Now pass the context when reading:

```typescript
const enabled = replane.get('feature-dark-mode', {
  context: { userGroup: user.group }
})
```

Beta users see `true`, everyone else sees `false`.

## Enable for a percentage of users

For gradual rollouts, use percentage-based conditions:

1. Click **Add Override**
2. Configure:
   - **Name**: "10% rollout"
   - **Condition**: `10%` of `userId`
   - **Value**: `true`
3. Click **Save**

```typescript
const enabled = replane.get('feature-dark-mode', {
  context: { userId: user.id }
})
```

The same user always gets the same result (deterministic bucketing).

## React to changes in realtime

Subscribe to flag changes:

```typescript
replane.subscribe('feature-dark-mode', (config) => {
  if (config.value) {
    enableDarkMode()
  } else {
    disableDarkMode()
  }
})
```

## Type-safe flags

Define your flag types:

```typescript
interface Flags {
  'feature-dark-mode': boolean
  'feature-new-checkout': boolean
  'feature-ai-assistant': boolean
}

const replane = new Replane<Flags>({
  // Default values to use if the initial request to fetch configs fails.
  defaults: {
    'feature-dark-mode': false,
    'feature-new-checkout': true,
    'feature-ai-assistant': false
  }
})
await replane.connect({
  sdkKey: process.env.REPLANE_SDK_KEY!,
  baseUrl: 'https://replane.example.com'
})

// TypeScript knows this is a boolean
const darkMode = replane.get('feature-dark-mode')
```

## Best practices

### Naming conventions

Use a consistent prefix for feature flags:

```
feature-dark-mode
feature-new-checkout
feature-ai-recommendations
```

### Clean up old flags

Remove flags after full rollout to avoid code clutter. Replane keeps version history, so you can always see what a flag was set to.

### Use environments

Different values per environment:

| Environment | Value   | Use case                 |
| ----------- | ------- | ------------------------ |
| Production  | `false` | Feature not yet released |
| Staging     | `true`  | Testing the feature      |
| Development | `true`  | Building the feature     |

## Example: Kill switch

Create a kill switch to disable a feature instantly:

```typescript
// Config: feature-payments-enabled, value: true

async function processPayment(order: Order) {
  if (!replane.get('feature-payments-enabled')) {
    throw new Error('Payments are temporarily disabled')
  }

  // Process payment...
}
```

If something goes wrong, set `feature-payments-enabled` to `false` in the dashboard. All instances update immediately via SSE.

## Next steps

- [Override Rules](/docs/guides/override-rules) — Advanced targeting
- [Gradual Rollouts](/docs/guides/gradual-rollouts) — Percentage-based releases
- [JavaScript SDK](/docs/sdk/javascript) — Full API reference
