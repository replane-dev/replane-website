---
sidebar_position: 4
---

# A/B Testing

Use Replane to run A/B tests and experiments without engineering overhead.

## Basic A/B Test

Store variant percentages in config:

```json title="ab-tests"
{
  "button-color": {
    "blue": 50,
    "green": 50
  },
  "pricing-page": {
    "layout-a": 50,
    "layout-b": 50
  }
}
```

## Implementation

```javascript
import { createReplaneClient } from '@replanejs/sdk'

const client = await createReplaneClient({
  sdkKey: process.env.REPLANE_SDK_KEY,
  baseUrl: process.env.REPLANE_URL
})

const tests = client.get('ab-tests')

// Deterministic assignment based on user ID
function getVariant(userId, testName) {
  const variants = tests[testName]
  const variantNames = Object.keys(variants)
  const percentages = Object.values(variants)

  // Hash user ID to get consistent assignment
  let hash = 0
  for (let i = 0; i < userId.length; i++) {
    hash = (hash << 5) - hash + userId.charCodeAt(i)
    hash = hash & hash
  }

  const bucket = Math.abs(hash) % 100
  let cumulative = 0

  for (let i = 0; i < variantNames.length; i++) {
    cumulative += percentages[i]
    if (bucket < cumulative) {
      return variantNames[i]
    }
  }

  return variantNames[variantNames.length - 1]
}

// Usage
const buttonColor = getVariant(user.id, 'button-color')
```

## Adjusting Splits

Product team can adjust variant percentages in realtime:

**Initial 50/50 split:**

```json
{
  "button-color": {
    "blue": 50,
    "green": 50
  }
}
```

**Green performing better, shift to 25/75:**

```json
{
  "button-color": {
    "blue": 25,
    "green": 75
  }
}
```

**Winner determined, go 100% green:**

```json
{
  "button-color": {
    "blue": 0,
    "green": 100
  }
}
```

Changes propagate instantly to all application instances.

## Multi-Variant Tests

Test more than two variants:

```json
{
  "hero-headline": {
    "variant-a": 25,
    "variant-b": 25,
    "variant-c": 25,
    "variant-d": 25
  }
}
```

## Targeting Specific Users

Combine with user attributes for targeted tests:

```javascript
function shouldShowVariant(user, testName) {
  // Premium users get special treatment
  if (user.isPremium) {
    return 'premium-variant'
  }

  // Beta users always get new features
  if (user.isBeta) {
    return 'beta-variant'
  }

  // Everyone else gets random assignment
  return getVariant(user.id, testName)
}
```

## Tracking Results

Log variant assignments for analytics:

```javascript
const variant = getVariant(user.id, 'button-color')

// Track assignment
analytics.track('experiment_viewed', {
  experiment: 'button-color',
  variant: variant,
  userId: user.id
})

// Track conversion
analytics.track('button_clicked', {
  experiment: 'button-color',
  variant: variant,
  userId: user.id
})
```

## Best Practices

### Use Consistent Hashing

Always use the same hash function for the same user to ensure consistent experience.

### Avoid Bias

- Don't change splits while test is running
- Run tests long enough to account for weekly patterns
- Consider time-of-day and seasonal effects

### Document Tests

Maintain a registry of active tests:

- What's being tested
- Success metrics
- Start date
- Owner
- When to evaluate results

### Clean Up

After determining a winner:

1. Update config to 100% winning variant
2. Deploy code with winner hardcoded
3. Remove A/B test config
4. Archive results for future reference

## Using Override Rules for A/B Tests

For more advanced targeting, use [**override rules**](./override-rules) to assign variants based on user properties:

**Config:** `experiment-button-color`  
**Base value:** `"blue"`

**Override:** Premium Users

- Condition: Property `tier` equals `"premium"`
- Value: `"gold"`

**Override:** Beta Users

- Condition: Property `betaOptIn` equals `true`
- Value: `"green"`

```javascript
// Returns variant based on user properties
const buttonColor = client.get('experiment-button-color', {
  context: {
    tier: user.tier,
    betaOptIn: user.preferences.beta
  }
})
```

This gives you fine-grained control over experiment targeting without custom hashing logic.

## Next Steps

- [**Override Rules**](./override-rules) - Advanced targeting with context-based rules
- [**Feature Flags**](./feature-flags) - Learn about feature flag basics
- [**Gradual Rollouts**](./gradual-rollouts) - Roll out features safely
- [**Operational Tuning**](./operational-tuning) - Adjust app behavior in realtime
