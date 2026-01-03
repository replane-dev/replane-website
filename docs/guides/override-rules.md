---
title: Override Rules
description: Return different config values based on user context. Target specific users, segments, or regions with conditions like equals, in, numeric comparisons, and percentage-based bucketing.
---

# Override rules

Override rules let you return different config values based on context. Use them for:

- User targeting (specific users or segments)
- A/B testing (different variants)
- Regional configuration (different values per region)
- Gradual rollouts (percentage-based)

## How overrides work

1. Your app passes context: `{ userId: "123", plan: "premium" }`
2. Replane evaluates overrides in order
3. First matching override's value is returned
4. If no override matches, base value is returned

```
Context: { plan: "premium" }
                │
                ▼
┌─────────────────────────────┐
│ Override 1: plan === "free" │ ──── No match
└─────────────────────────────┘
                │
                ▼
┌─────────────────────────────────┐
│ Override 2: plan === "premium"  │ ──── Match! Return override value
└─────────────────────────────────┘
                │
                ▼
        (stops here)
```

## Create an override

1. Click on a config in the dashboard
2. Click **Add Conditional Override**
3. Configure:
   - **Name**: Human-readable description
   - **Conditions**: Rules that must all match
   - **Value**: What to return when conditions match
4. Click **Save**

## Condition types

### Equals

Exact match on a context property.

**Example**: Enable for premium users

```
plan equals "premium"
```

```typescript
replane.get('feature', { context: { plan: 'premium' } }); // matches
replane.get('feature', { context: { plan: 'free' } }); // no match
```

### In / Not in

Check if value is in (or not in) a list.

**Example**: Enable for US and Canada

```
country in ["US", "CA"]
```

```typescript
replane.get('feature', { context: { country: 'US' } }); // matches
replane.get('feature', { context: { country: 'UK' } }); // no match
```

### Numeric comparisons

Compare numbers with `<`, `<=`, `>`, `>=`.

**Example**: Enable for users with 10+ purchases

```
purchaseCount >= 10
```

```typescript
replane.get('feature', { context: { purchaseCount: 15 } }); // matches
replane.get('feature', { context: { purchaseCount: 5 } }); // no match
```

### Percentage

Enable for a percentage of users based on a bucketing key.

**Example**: Enable for 25% of users

```
25% of userId
```

```typescript
// Some users will match, others won't (deterministic per userId)
replane.get('feature', { context: { userId: 'user-123' } });
```

The same user always gets the same result.

## Multiple conditions

All conditions in an override must match (AND logic).

**Example**: Premium users in the US

```
plan equals "premium"
AND
country equals "US"
```

```typescript
// Must match both conditions
replane.get('feature', {
  context: { plan: 'premium', country: 'US' }
}); // matches

replane.get('feature', {
  context: { plan: 'premium', country: 'UK' }
}); // no match (wrong country)
```

## Override priority

Overrides are evaluated in order. First match wins.

**Example configuration**:

| Priority | Override | Condition | Value |
|----------|----------|-----------|-------|
| 1 | VIP users | `userId in ["vip-1", "vip-2"]` | `"vip"` |
| 2 | Premium | `plan === "premium"` | `"premium"` |
| 3 | Free | `plan === "free"` | `"free"` |
| — | Base | (none) | `"default"` |

```typescript
// VIP user with premium plan → "vip" (first match)
replane.get('feature', {
  context: { userId: 'vip-1', plan: 'premium' }
});

// Regular premium user → "premium"
replane.get('feature', {
  context: { userId: 'user-123', plan: 'premium' }
});
```

Drag and drop overrides in the dashboard to reorder them.

## Context best practices

### Common context properties

| Property | Type | Use case |
|----------|------|----------|
| `userId` | string | User targeting, percentage rollouts |
| `plan` | string | Subscription tier features |
| `country` | string | Regional configuration |
| `region` | string | Infrastructure region |
| `deviceType` | string | Mobile vs desktop features |
| `appVersion` | string | Version-specific behavior |
| `env` | string | Environment-specific values |

### Set default context

Configure context at the client level:

```typescript
import { Replane } from '@replanejs/sdk'

const replane = new Replane({
  context: {
    region: 'us-east',
    userId: 'user-123'
  }
})
await replane.connect({
  sdkKey: process.env.REPLANE_SDK_KEY!,
  baseUrl: 'https://replane.example.com'
})

// Every get() call includes env and region
const value = replane.get('config-name');
```

### Merge context per request

Override or extend client context:

```typescript
// Merges with client context
const value = replane.get('config-name', {
  context: {
    userId: user.id,
    plan: user.plan
  }
});
```

## Examples

### Premium features

```
Config: advanced-analytics
Base value: false

Override: Premium users
  Condition: plan equals "premium"
  Value: true
```

### Regional pricing

```
Config: pricing-tier
Base value: "standard"

Override: EU region
  Condition: region in ["eu-west", "eu-central"]
  Value: "eu"

Override: APAC region
  Condition: region in ["ap-south", "ap-northeast"]
  Value: "apac"
```

### Beta program

```
Config: feature-new-editor
Base value: false

Override: Beta users
  Condition: userFlags contains "beta"
  Value: true

Override: Internal team
  Condition: email endsWith "@company.com"
  Value: true
```

## Debugging overrides

Check which override matched:

1. Open the config in the dashboard
2. Use the **Evaluate** panel
3. Enter test context values
4. See which override matches and the returned value

## Next steps

- [Gradual Rollouts](/docs/guides/gradual-rollouts) — Percentage-based releases
- [Feature Flags](/docs/guides/feature-flags) — Toggle features
- [JavaScript SDK](/docs/sdk/javascript) — Full API reference
