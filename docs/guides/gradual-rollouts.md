---
sidebar_position: 3
---

# Gradual Rollouts

Roll out features safely by gradually increasing exposure.

## Percentage-Based Rollouts

Start with a small percentage and increase over time.

### Setup

Create a config for rollout percentages:

```json title="rollouts"
{
  "new-checkout-flow": 0,
  "redesigned-dashboard": 0,
  "ai-suggestions": 0
}
```

### Implementation

```javascript
import { createReplaneClient } from 'replane-sdk'

const client = createReplaneClient({
  sdkKey: process.env.REPLANE_SDK_KEY,
  baseUrl: process.env.REPLANE_URL
})

const rollouts = await client.watchConfigValue('rollouts')

function isFeatureEnabled(userId, featureName) {
  const percentage = rollouts.get()[featureName] || 0

  // Deterministic hash: same user always gets same result
  const hash = hashUserId(userId) % 100

  return hash < percentage
}

// In your route handler
if (isFeatureEnabled(user.id, 'new-checkout-flow')) {
  return renderNewCheckout()
} else {
  return renderOldCheckout()
}

function hashUserId(userId) {
  // Simple hash function (use a better one in production)
  let hash = 0
  for (let i = 0; i < userId.length; i++) {
    hash = (hash << 5) - hash + userId.charCodeAt(i)
    hash = hash & hash
  }
  return Math.abs(hash)
}
```

### Rollout Schedule

**Day 1**: Set to 1% (testing with real users)

```json
{
  "new-checkout-flow": 1
}
```

**Day 2**: If no issues, increase to 5%

```json
{
  "new-checkout-flow": 5
}
```

**Day 3**: Increase to 25%

```json
{
  "new-checkout-flow": 25
}
```

**Day 4**: Increase to 50%

```json
{
  "new-checkout-flow": 50
}
```

**Day 5**: Full rollout

```json
{
  "new-checkout-flow": 100
}
```

## User Cohort Rollouts

Target specific user groups first.

### Setup

```json title="cohorts"
{
  "new-feature-internal": ["team@company.com"],
  "new-feature-beta": [],
  "new-feature-premium": [],
  "new-feature-all": false
}
```

### Implementation

```javascript
const cohorts = await client.watchConfigValue('cohorts')

function hasAccess(user, feature) {
  const config = cohorts.get()

  // Check if enabled for all users
  if (config[`${feature}-all`]) return true

  // Check cohorts in order
  const cohortKeys = ['internal', 'beta', 'premium']

  for (const cohort of cohortKeys) {
    const members = config[`${feature}-${cohort}`] || []
    if (members.includes(user.email) || members.includes(user.id)) {
      return true
    }
  }

  return false
}
```

### Rollout Plan

**Phase 1**: Internal team only

```json
{
  "new-feature-internal": ["team@company.com"],
  "new-feature-beta": [],
  "new-feature-premium": [],
  "new-feature-all": false
}
```

**Phase 2**: Beta users

```json
{
  "new-feature-internal": ["team@company.com"],
  "new-feature-beta": ["user-1@example.com", "user-2@example.com"],
  "new-feature-premium": [],
  "new-feature-all": false
}
```

**Phase 3**: Premium customers

```json
{
  "new-feature-internal": ["team@company.com"],
  "new-feature-beta": ["user-1@example.com", "user-2@example.com"],
  "new-feature-premium": ["premium-user@example.com"],
  "new-feature-all": false
}
```

**Phase 4**: Everyone

```json
{
  "new-feature-internal": [],
  "new-feature-beta": [],
  "new-feature-premium": [],
  "new-feature-all": true
}
```

## A/B Testing

Run experiments by splitting traffic.

```json title="experiments"
{
  "checkout-button-color": {
    "variants": ["blue", "green", "red"],
    "weights": [33, 33, 34]
  }
}
```

Implementation:

```javascript
const experiments = await client.watchConfigValue('experiments')

function getVariant(userId, experimentName) {
  const experiment = experiments.get()[experimentName]
  if (!experiment) return experiment.variants[0]

  const hash = hashUserId(userId) % 100
  let cumulative = 0

  for (let i = 0; i < experiment.variants.length; i++) {
    cumulative += experiment.weights[i]
    if (hash < cumulative) {
      return experiment.variants[i]
    }
  }

  return experiment.variants[0]
}

// Usage
const buttonColor = getVariant(user.id, 'checkout-button-color')
```

## Emergency Rollback

If issues arise, instantly revert:

1. Open Replane UI
2. Find the config
3. Click "Version History"
4. Select the previous version (e.g., 0% or previous cohort list)
5. Click "Rollback"

Changes propagate in seconds.

<!-- Screenshot: Rollback action will be added here -->

## Monitoring Rollouts

Track metrics for both variants:

```javascript
// In your analytics
analytics.track('checkout_completed', {
  variant: isFeatureEnabled(user.id, 'new-checkout-flow') ? 'new' : 'old',
  userId: user.id
})
```

Compare:

- Conversion rates
- Error rates
- Performance metrics
- User feedback

## Best Practices

### Start Small

Always begin with a tiny percentage (1-5%) or internal team only.

### Monitor Closely

Watch error rates and metrics during rollout. Set up alerts.

### Have a Rollback Plan

Document rollback steps before starting. Make sure everyone knows how to revert.

### Deterministic Hashing

Use the same hash function everywhere so users see consistent behavior.

### Communicate Changes

Let your team know when you're rolling out features. Post in Slack/Teams.

### Clean Up

After full rollout (100% or all users), remove the rollout code in your next deploy.

## Next Steps

- [**Feature Flags**](./feature-flags) - Simple on/off toggles
- [**Operational Tuning**](./operational-tuning) - Tune behavior without deploys
- [**JavaScript SDK**](../sdk/javascript) - SDK reference
