---
sidebar_position: 5
---

# Override Rules

Override rules enable you to return different config values based on context properties like user email, subscription tier, country, or any custom data you provide.

## What Are Override Rules?

Instead of managing separate configs for different scenarios, you can define **conditional overrides** on a single config:

```javascript
// Single config with overrides handles all scenarios
const maxItems = await client.getConfigValue('max-items', {
  context: {
    userEmail: 'vip@example.com',
    tier: 'premium',
    country: 'US'
  }
})
// Returns different values based on which override rules match
```

## How It Works

1. **Define a base value** - The default value returned when no override matches
2. **Add value override rules** - Define conditions that must match
3. **Specify override value** - The value to return when conditions match
4. **Provide context** - Pass context when fetching the config

### Evaluation Flow

```
For each override (in order):
  Check if all conditions match
  If yes → return override value
  If no → try next override

If no override matched → return base value
```

**First matching override wins!** Order matters.

## Creating Overrides in the UI

1. Navigate to your config
2. Click **"Add Value Override Rule"**
3. Set the **override value** (what to return)
4. Define **conditions** (when to return it)
5. Add multiple conditions - all must match (implicit AND)

### Example: VIP Users

**Base value:**

```json
{ "maxItems": 10 }
```

**Override: "VIP Users"**

- Conditions:
  - Property: `userEmail` | Operator: `equals` | Value: `vip@example.com`
- Override Value: `{"maxItems": 1000}`

When you fetch with context `{userEmail: "vip@example.com"}`, you get `{"maxItems": 1000}`.

## Available Operators

### Comparison Operators

| Operator                  | Description           | Example                                   |
| ------------------------- | --------------------- | ----------------------------------------- |
| **Equals**                | Exact match           | Property `tier` equals `"premium"`        |
| **Not In**                | Value is not in array | Property `country` not in `["CN","RU"]`   |
| **Less Than**             | Numeric comparison    | Property `accountAge` less than `30`      |
| **Less Than or Equal**    | Numeric comparison    | Property `count` less than or equal `100` |
| **Greater Than**          | Numeric comparison    | Property `creditScore` greater than `700` |
| **Greater Than or Equal** | Numeric comparison    | Property `age` greater than or equal `18` |

### Composite Operators

| Operator | Description                              |
| -------- | ---------------------------------------- |
| **AND**  | All nested conditions must match         |
| **OR**   | At least one nested condition must match |
| **NOT**  | Inverts/negates the nested condition     |

## Common Use Cases

### User-Specific Configuration

```javascript
// Override for specific user
{
  name: "Admin User",
  conditions: [
    { operator: "equals", property: "userEmail", value: "admin@company.com" }
  ],
  value: { adminMode: true, maxItems: 1000 }
}
```

### Tier-Based Limits

```javascript
// Higher limits for premium users (using NOT to exclude specific tiers)
{
  name: "Premium Tier",
  conditions: [
    {
      operator: "not",
      condition: {
        operator: "not_in",
        property: "tier",
        value: ["free", "trial"]
      }
    }
  ],
  value: { maxItems: 100, rateLimit: 1000 }
}
```

### Age-Based Access

```javascript
// Adult content - age >= 18
{
  name: "Adult Users",
  conditions: [
    { operator: "greater_than_or_equal", property: "age", value: 18 }
  ],
  value: { accessLevel: "full" }
}
```

### Complex Conditions (Multiple Conditions)

```javascript
// All conditions must match (implicit AND)
{
  name: "High-Value Users",
  conditions: [
    { operator: "equals", property: "tier", value: "premium" },
    { operator: "greater_than", property: "accountAge", value: 365 },
    { operator: "equals", property: "country", value: "US" }
  ],
  value: { specialOffer: true }
}
```

## Using AND/OR Logic

### AND Operator

All nested conditions must match:

```javascript
{
  name: "Internal Engineering",
  conditions: [
    {
      operator: "and",
      conditions: [
        { operator: "equals", property: "department", value: "engineering" },
        { operator: "greater_than", property: "yearsExperience", value: 2 }
      ]
    }
  ],
  value: { debugMode: true }
}
```

### OR Operator

At least one nested condition must match:

```javascript
{
  name: "Premium Access",
  conditions: [
    {
      operator: "or",
      conditions: [
        { operator: "equals", property: "tier", value: "premium" },
        { operator: "equals", property: "isVip", value: true }
      ]
    }
  ],
  value: { premiumFeatures: true }
}
```

### NOT Operator

Inverts a condition:

```javascript
{
  name: "Not Banned",
  conditions: [
    {
      operator: "not",
      condition: {
        operator: "equals",
        property: "status",
        value: "banned"
      }
    }
  ],
  value: { access: "granted" }
}
```

### Nested Logic

Combine AND/OR/NOT for complex scenarios:

```javascript
{
  name: "Special Access",
  conditions: [
    {
      operator: "or",
      conditions: [
        // US Premium users
        {
          operator: "and",
          conditions: [
            { operator: "equals", property: "country", value: "US" },
            { operator: "equals", property: "tier", value: "premium" }
          ]
        },
        // OR any VIP user
        { operator: "equals", property: "isVip", value: true }
      ]
    }
  ],
  value: { limit: 1000 }
}
```

## Fetching with Context

### JavaScript/TypeScript SDK

```javascript
import { createReplaneClient } from 'replane-sdk'

const client = createReplaneClient({
  sdkKey: process.env.REPLANE_SDK_KEY,
  baseUrl: process.env.REPLANE_URL
})

// Provide context to evaluate overrides
const config = await client.getConfigValue('max-items', {
  context: {
    userEmail: user.email,
    tier: user.subscription.tier,
    country: user.location.country,
    accountAge: user.accountAgeDays
    // Any custom properties you need
  }
})
```

### Direct API Call

```bash
GET /v1/configs/max-items/value?context={"userEmail":"user@example.com","tier":"premium"}
Authorization: Bearer YOUR_API_KEY
```

The context is a JSON object with any properties you want to use in your override rules.

## Best Practices

### 1. Order Matters

Overrides are evaluated in order. Put more specific rules first:

```javascript
// ✅ Good - specific first
Override 1: userEmail equals "admin@company.com" → admin value
Override 2: tier equals "premium" → premium value
Override 3: default (no override matches) → base value

// ❌ Bad - general first (admin never gets special value)
Override 1: tier equals "premium" → premium value
Override 2: userEmail equals "admin@company.com" → admin value
```

### 2. Use Descriptive Names

Name your overrides clearly:

```javascript
// ✅ Good
'VIP Users'
'Premium Tier - US'
'Internal Employees'

// ❌ Bad
'Override 1'
'Test'
'Temp'
```

### 3. Keep It Simple

- Start with simple equals/in operators
- Use AND/OR only when needed
- Avoid deep nesting (2-3 levels max)

### 4. Validate Override Values

Enable JSON Schema to ensure all override values match the expected structure:

```json
{
  "type": "object",
  "properties": {
    "maxItems": { "type": "number", "minimum": 1 }
  }
}
```

This validates both the base value and all override values.

### 5. Test Your Rules

Before deploying:

1. Add the override in the UI
2. Test with actual context values
3. Verify the correct value is returned

## Context Properties

Common context properties to use:

| Property     | Type    | Example                | Notes                  |
| ------------ | ------- | ---------------------- | ---------------------- |
| `userEmail`  | string  | `"user@example.com"`   | User's email address   |
| `userId`     | string  | `"user-123"`           | Unique user identifier |
| `tier`       | string  | `"free"`, `"premium"`  | Subscription tier      |
| `country`    | string  | `"US"`, `"UK"`, `"DE"` | ISO country code       |
| `role`       | string  | `"admin"`, `"user"`    | User role              |
| `accountAge` | number  | `365`                  | Days since signup      |
| `age`        | number  | `25`                   | User's age             |
| `isVip`      | boolean | `true`                 | VIP status flag        |
| `betaOptIn`  | boolean | `true`                 | Beta features opt-in   |

**You can use any property** - the system automatically casts types to match your context values.

## Limitations

- Maximum 100 overrides per config
- Maximum 10 conditions per override
- Context must be a JSON object
- Infinite nesting depth allowed (but keep it reasonable)

## Type Casting

The override system automatically casts rule values to match your context types:

**Example:** If your context has `age: 25` (number) and your rule has `value: "18"` (string), the system casts `"18"` → `18` for comparison.

**Supported casts:**

- String ↔ Number: `"100"` ↔ `100`
- String ↔ Boolean: `"true"` ↔ `true`
- Number → Boolean: `0` ↔ `false`, `1` ↔ `true`

This makes it easier to define rules in the UI without worrying about exact type matching.

## Examples

### Feature Flag with Gradual Rollout

**Config:** `new-ui-enabled`

**Base value:** `false`

**Override:** "Beta Users"

- Conditions: Property `betaOptIn` equals `true`
- Value: `true`

```javascript
// Beta user sees new UI
await client.getConfigValue('new-ui-enabled', {
  context: { betaOptIn: user.preferences.betaOptIn }
})
```

### Regional Settings

**Config:** `data-retention-days`

**Base value:** `30`

**Override:** "EU Users (GDPR)"

- Conditions: Property `country` in `["DE","FR","UK","IT","ES"]`
- Value: `90`

```javascript
await client.getConfigValue('data-retention-days', {
  context: { country: user.country }
})
```

### Multi-Condition Override

**Config:** `api-rate-limit`

**Base value:** `100`

**Override:** "Established Premium Users"

- Conditions:
  - Property `tier` equals `"premium"`
  - Property `accountAge` greater than `30`
- Value: `1000`

```javascript
await client.getConfigValue('api-rate-limit', {
  context: {
    tier: user.subscription.tier,
    accountAge: user.accountAgeDays
  }
})
```

## Simulating Removed Operators

### Not Equals

**Use NOT + Equals:**

```javascript
{
  operator: "not",
  condition: {
    operator: "equals",
    property: "status",
    value: "banned"
  }
}
```

### In (array membership)

**Use OR with multiple Equals:**

```javascript
{
  operator: "or",
  conditions: [
    { operator: "equals", property: "tier", value: "premium" },
    { operator: "equals", property: "tier", value: "enterprise" },
    { operator: "equals", property: "tier", value: "gold" }
  ]
}
```

### Regex Matching

**Not supported** - Use exact matches or multiple conditions with OR instead.

## Troubleshooting

### Override Not Matching

**Problem:** Expected override to apply but got base value

**Solutions:**

1. Check context properties match exactly (case-sensitive)
2. Verify all conditions in the override (AND logic)
3. Check override order (earlier override might match first)
4. Look at audit log to confirm override was saved

### Condition Value Syntax

**Problem:** Not sure how to format the value field

**Solutions:**

- **Strings:** Just type the string: `premium`
- **Numbers:** Type the number: `100`
- **Arrays:** Use JSON format: `["us","uk","ca"]`
- **Booleans:** Type `true` or `false`

The system auto-parses JSON and casts types to match your context.

### Context Not Being Passed

**Problem:** Always getting base value

**Solution:** Make sure you're passing the `context` parameter:

```javascript
// ❌ No context - always returns base value
await client.getConfigValue('config-name')

// ✅ With context - evaluates overrides
await client.getConfigValue('config-name', {
  context: { userEmail: 'user@example.com' }
})
```

## Next Steps

- [**Feature Flags**](./feature-flags) - Use overrides for advanced feature flags
- [**A/B Testing**](./ab-testing) - Run experiments with overrides
- [**JavaScript SDK**](../sdk/javascript) - Full SDK documentation
