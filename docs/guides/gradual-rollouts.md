---
sidebar_position: 4
title: Gradual Rollouts
description: Release features to a percentage of users
---

# Gradual rollouts

Gradual rollouts let you release features to a subset of users and increase exposure over time. Use them to:

- Reduce risk when launching new features
- Test performance under increasing load
- Gather feedback before full release
- Roll back instantly if issues arise

## How percentage rollouts work

Replane uses deterministic bucketing:

1. Hash the bucketing key (e.g., `userId`) with the config name
2. Convert hash to a number 0-99
3. Compare against the percentage threshold

```
User A: hash("feature-x" + "user-a") % 100 = 23
User B: hash("feature-x" + "user-b") % 100 = 67
User C: hash("feature-x" + "user-c") % 100 = 45

At 30% rollout:
- User A (23): ✓ Enabled
- User B (67): ✗ Disabled
- User C (45): ✗ Disabled

At 50% rollout:
- User A (23): ✓ Enabled
- User B (67): ✗ Disabled
- User C (45): ✓ Enabled (now included)
```

Key properties:
- **Deterministic**: Same user always gets same result
- **Consistent**: Users enabled at 10% stay enabled at 20%
- **Client-side**: No server round-trip needed

## Create a percentage rollout

1. Create a feature flag config with `false` as base value
2. Add an override:
   - **Condition**: `10%` of `userId`
   - **Value**: `true`
3. Save

## Read with context

```typescript
const enabled = replane.get('feature-new-checkout', {
  context: { userId: user.id }
});

if (enabled) {
  showNewCheckout();
} else {
  showOldCheckout();
}
```

## Increase the rollout

Edit the override and change the percentage:

```
10% → 25% → 50% → 75% → 100%
```

Users previously included stay included as you increase.

## Rollout strategies

### Linear increase

Simple incremental rollout:

```
Day 1: 5%
Day 2: 10%
Day 3: 25%
Day 4: 50%
Day 5: 75%
Day 6: 100%
```

### Staged rollout

Pause at key milestones to validate:

```
Stage 1: 1% - Verify basic functionality
Stage 2: 10% - Monitor error rates
Stage 3: 50% - Check performance under load
Stage 4: 100% - Full release
```

### Ring-based rollout

Target different groups in sequence:

```
Config: feature-new-editor
Base value: false

Override 1: Internal team
  Condition: email endsWith "@company.com"
  Value: true

Override 2: Beta users
  Condition: userGroup equals "beta"
  Value: true

Override 3: 10% rollout
  Condition: 10% of userId
  Value: true
```

Internal team tests first, then beta users, then gradual public rollout.

## Bucketing keys

### User ID (most common)

Each user gets consistent experience:

```typescript
replane.get('feature', { context: { userId: user.id } });
```

### Session ID

Per-session randomization (user might see different values across sessions):

```typescript
replane.get('feature', { context: { sessionId: session.id } });
```

### Organization ID

All users in same org get same experience:

```typescript
replane.get('feature', { context: { orgId: user.organizationId } });
```

### Device ID

Consistent across anonymous users on same device:

```typescript
replane.get('feature', { context: { deviceId: getDeviceId() } });
```

## Combining conditions

Target specific segments with percentage:

```
Override: 20% of premium users
Conditions:
  - plan equals "premium"
  - 20% of userId
Value: true
```

```typescript
// Only premium users are considered for the rollout
replane.get('feature', {
  context: { userId: user.id, plan: user.plan }
});
```

## Monitoring rollouts

### Track metrics by variant

```typescript
const variant = replane.get('checkout-flow', {
  context: { userId: user.id }
});

analytics.track('checkout_started', {
  variant,
  userId: user.id
});
```

### Compare performance

Monitor key metrics for each group:
- Error rates
- Latency
- Conversion rates
- User engagement

### Set up alerts

Alert on metric differences between control and treatment groups.

## Rollback

If issues arise, reduce the percentage or set base value:

**Option 1**: Reduce percentage
```
50% → 10% → 0%
```

**Option 2**: Disable override
- Delete or disable the percentage override
- All users get base value (`false`)

**Option 3**: Use version history
- Click on version history
- Restore a previous version

Changes propagate instantly via SSE.

## A/B testing

For true A/B tests with multiple variants:

```
Config: experiment-checkout
Base value: "control"

Override: Treatment A
  Condition: userId in bucket 0-33%
  Value: "treatment-a"

Override: Treatment B
  Condition: userId in bucket 34-66%
  Value: "treatment-b"
```

```typescript
const variant = replane.get('experiment-checkout', {
  context: { userId: user.id }
});

switch (variant) {
  case 'treatment-a':
    showCheckoutVariantA();
    break;
  case 'treatment-b':
    showCheckoutVariantB();
    break;
  default:
    showControlCheckout();
}
```

## Best practices

### Start small

Begin with 1-5% to catch issues early:

```
1% → 5% → 10% → 25% → 50% → 100%
```

### Monitor between stages

Wait and observe metrics before increasing:
- At least 1 hour for quick validation
- 24-48 hours for meaningful data

### Document your rollout

Note the plan and current stage:

```
Config description:
Rollout plan: 5% (Mon) → 25% (Wed) → 50% (Fri) → 100% (Mon)
Current: 25% since 2024-01-15
```

### Have a rollback plan

Before starting:
- Know how to roll back
- Define rollback triggers (error rate > 1%, latency > 500ms)
- Test rollback in staging

### Clean up after full rollout

Once at 100% for a week with no issues:
1. Remove the override
2. Change base value to `true`
3. Consider removing the feature flag from code

## Next steps

- [Feature Flags](/docs/guides/feature-flags) — Toggle features
- [Override Rules](/docs/guides/override-rules) — Advanced targeting
- [JavaScript SDK](/docs/sdk/javascript) — Full API reference
