---
slug: use-cases-feature-flags
title: "Use Case: Managing Feature Flags with Replane"
authors: replane
tags: [feature-flags, use-cases, guides]
description: Learn how Replane makes feature flags simple and powerful with safe releases, gradual rollouts, and instant rollback capabilities.
---

Feature flags are one of the most common use cases for configuration management. Let's explore how Replane makes feature flags simple and powerful.

<!-- truncate -->

## What Are Feature Flags?

Feature flags (also called feature toggles) let you enable or disable features without deploying new code. This enables:

- **Safe releases**: Deploy code with features off, then enable them gradually
- **A/B testing**: Show different features to different users
- **Kill switches**: Quickly disable problematic features
- **Gradual rollouts**: Release to 1% → 10% → 50% → 100% of users

## Basic Setup

Create a config named `feature-flags`:

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

const flags = await client.getConfigValue('feature-flags');

if (flags['new-onboarding']) {
  return renderNewOnboarding();
} else {
  return renderOldOnboarding();
}
```

## Real-World Example: E-commerce Checkout

You're redesigning the checkout flow. Deploy it behind a flag:

```json
{
  "new-checkout-flow": false
}
```

**Day 1**: Enable for internal team

```json
{
  "new-checkout-flow": false,
  "new-checkout-internal": ["team@company.com"]
}
```

**Day 3**: Enable for 5% of users

```json
{
  "new-checkout-percentage": 5
}
```

**Day 5**: Issues found, disable immediately

```json
{
  "new-checkout-percentage": 0
}
```

**Day 7**: Issues fixed, re-enable for 10%

```json
{
  "new-checkout-percentage": 10
}
```

**Day 10**: Full rollout

```json
{
  "new-checkout-percentage": 100
}
```

## Percentage-Based Rollouts

Implement deterministic hashing for consistent user experience:

```javascript
function hashUserId(userId) {
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = ((hash << 5) - hash) + userId.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash);
}

function isFeatureEnabled(userId, featureName) {
  const rollouts = await client.getConfigValue('rollouts');
  const percentage = rollouts[featureName] || 0;
  const hash = hashUserId(userId) % 100;
  return hash < percentage;
}

// Usage
if (isFeatureEnabled(user.id, 'new-checkout')) {
  // User sees new checkout (consistent for this user)
}
```

## User Cohort Targeting

Target specific user groups:

```json
{
  "beta-users": ["user-123", "user-456"],
  "internal-team": ["team@company.com"],
  "premium-customers": true
}
```

Check membership:

```javascript
const cohorts = await client.getConfigValue('cohorts');

function hasAccess(user, featureName) {
  const betaList = cohorts['beta-users'] || [];
  if (betaList.includes(user.id)) return true;

  const internalList = cohorts['internal-team'] || [];
  if (internalList.includes(user.email)) return true;

  if (user.isPremium && cohorts['premium-customers']) return true;

  return false;
}
```

## Safety with JSON Schema

Prevent invalid flag configurations:

```json
{
  "type": "object",
  "properties": {
    "new-onboarding": { "type": "boolean" },
    "dark-mode": { "type": "boolean" },
    "billing-v2": { "type": "boolean" }
  },
  "additionalProperties": false,
  "required": ["new-onboarding", "dark-mode"]
}
```

<!-- Screenshot: Schema validation error will be added here -->

This ensures:
- Only boolean values allowed
- Required flags are always present
- No typos in flag names

## Realtime Updates

Use watchers for instant updates:

```javascript
// Initialize once
const flags = await client.watchConfigValue('feature-flags');

// Use anywhere in your app
function isEnabled(flagName) {
  return flags.get()[flagName] || false;
}

// Value updates automatically when changed in Replane UI
```

No restart required. Changes propagate in seconds.

## Monitoring & Analytics

Track feature flag usage:

```javascript
analytics.track('feature_accessed', {
  feature: 'new-checkout',
  enabled: isEnabled('new-checkout'),
  userId: user.id
});
```

Compare conversion rates between variants to make data-driven decisions.

## Emergency Rollback

Something went wrong? Revert instantly:

1. Open Replane UI
2. Navigate to `feature-flags`
3. Click "Version History"
4. Select previous version
5. Click "Rollback"

Changes propagate to all app instances in seconds.

## Best Practices

### Use Descriptive Names

```javascript
// ❌ Bad
"flag1": true

// ✅ Good
"new-checkout-flow-enabled": true
```

### Group Related Flags

Create separate configs for different domains:
- `feature-flags` - UI features
- `api-flags` - API behavior
- `experiments` - A/B tests

### Default to Safe Values

```javascript
const flags = await client
  .getConfigValue('feature-flags')
  .catch(() => ({
    'new-feature': false  // Safe default
  }));
```

### Document Flags

Maintain a README listing:
- What each flag does
- Owner
- Removal plan

### Clean Up Old Flags

After full rollout, remove the flag:
1. Set to final value (usually `true`)
2. Deploy code without the flag check
3. Delete from config (or keep for audit history)

## When NOT to Use Feature Flags

Avoid flags for:
- **Permanent configuration** (use environment variables)
- **Secrets** (use a secret manager)
- **Code that always changes together** (deploy normally)

Use flags for temporary switches that control behavior independently from code deployments.

## Next Steps

- [**Gradual Rollouts Guide**](/docs/guides/gradual-rollouts)
- [**Operational Tuning**](/docs/guides/operational-tuning)
- [**JavaScript SDK Docs**](/docs/sdk/javascript)

---

*Want to try feature flags with Replane? Check out the [Quickstart Guide](/docs/getting-started/quickstart).*
