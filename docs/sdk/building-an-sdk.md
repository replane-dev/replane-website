---
title: Building an SDK
description: How to build your own Replane SDK in any language
---

# Building an SDK

This guide explains how to build your own Replane SDK. Use this if you need to integrate Replane with a language we don't have an official SDK for.

## Overview

A Replane SDK needs to:

1. Connect to the replication stream endpoint
2. Receive and cache configs locally
3. Evaluate override rules client-side
4. Handle reconnection on failures

## API contract

### Authentication

All SDK API requests use Bearer token authentication:

```
Authorization: Bearer <sdk-key>
```

SDK keys are scoped to a single project and environment.

### Replication stream endpoint

```
POST /api/sdk/v1/replication/stream
Content-Type: application/json
Accept: text/event-stream
Authorization: Bearer <sdk-key>
```

#### Request body

```typescript
interface StartReplicationStreamBody {
  // Configs the client currently has (for delta sync)
  currentConfigs: ConfigDto[];
  // Configs that must exist (error if missing)
  requiredConfigs: string[];
}

interface ConfigDto {
  name: string;
  value: unknown;           // Any JSON value
  overrides: Override[];    // Override rules
}
```

On first connection, send empty `currentConfigs`:

```json
{
  "currentConfigs": [],
  "requiredConfigs": ["api-key", "feature-flag"]
}
```

If your SDK supports fallbacks, you can send them in the request body:

```json
{
  "currentConfigs": [
    {
      "name": "rate-limit",
      "value": 100,
      "overrides": []
    },
    {
      "name": "is-admin",
      "value": false,
      "overrides": []
    }
  ],
  "requiredConfigs": ["rate-limit", "is-admin"]
}
```

#### Response

The endpoint returns a Server-Sent Events (SSE) stream.

**Event types:**

```typescript
type ReplicationStreamRecord =
  | { type: "init"; configs: ConfigDto[] }
  | { type: "config_change"; config: ConfigDto };
```

**`init` event** — Sent immediately after connection with all configs:

```
data: {"type":"init","configs":[{"name":"feature-flag","value":true,"overrides":[]}]}
```

**`config_change` event** — Sent when a config is created or updated (deleted configs are not sent):

```
data: {"type":"config_change","config":{"name":"feature-flag","value":false,"overrides":[]}}
```

**Keep-alive comments** — Sent every 15 seconds to keep the connection alive (you can use them to detect if the connection is still alive):

```
:ping
```

## Override evaluation

Overrides are evaluated **client-side** in the SDK. This ensures:
- User context never leaves the application (privacy)
- No network round-trip for reads (speed)

### Override structure

```typescript
interface Override {
  name: string;                    // Human-readable name
  conditions: Condition[];         // All must match (implicit AND)
  value: unknown;                  // Value to return if matched
}
```

### Condition types

```typescript
type Condition =
  | PropertyCondition
  | SegmentationCondition
  | AndCondition
  | OrCondition
  | NotCondition;

// Property comparison
interface PropertyCondition {
  operator: "equals" | "in" | "not_in" | "less_than" |
            "less_than_or_equal" | "greater_than" | "greater_than_or_equal";
  property: string;     // Context property name
  value: unknown;       // Expected value
}

// Percentage-based segmentation
interface SegmentationCondition {
  operator: "segmentation";
  property: string;           // Context property to hash (e.g., "userId")
  fromPercentage: number;     // Lower bound [0-100)
  toPercentage: number;       // Upper bound (0-100]
  seed: string;               // Unique seed per override
}

// Logical operators
interface AndCondition {
  operator: "and";
  conditions: Condition[];
}

interface OrCondition {
  operator: "or";
  conditions: Condition[];
}

interface NotCondition {
  operator: "not";
  condition: Condition;
}
```

### Evaluation algorithm

```
function evaluateOverrides(baseValue, overrides, context):
    for each override in overrides:
        if all conditions in override match context:
            return override.value
    return baseValue
```

### Condition evaluation

Each condition returns one of three states:
- `matched` — Condition is satisfied
- `not_matched` — Condition is not satisfied
- `unknown` — Context property is missing

**Property conditions:**

```python
def evaluate_property_condition(condition, context):
    context_value = context.get(condition.property)

    if context_value is None:
        return "unknown"

    # coverts condition value to match context value type (e.g. string to number)
    expected = cast_to_context_type(condition.value, context_value)

    if condition.operator == "equals":
        return "matched" if context_value == expected else "not_matched"

    if condition.operator == "in":
        return "matched" if context_value in expected else "not_matched"

    if condition.operator == "not_in":
        return "matched" if context_value not in expected else "not_matched"

    if condition.operator == "less_than":
        return "matched" if context_value < expected else "not_matched"

    # ... similar for other comparison operators
```

**Segmentation (percentage bucketing):**

```python
def evaluate_segmentation(condition, context):
    context_value = context.get(condition.property)

    if context_value is None:
        return "unknown"

    # Hash the context value with seed
    hash_input = str(context_value) + condition.seed
    unit_value = fnv1a_to_unit(hash_input)  # Returns [0, 1)

    # Check if within percentage range
    from_pct = condition.from_percentage / 100
    to_pct = condition.to_percentage / 100

    if from_pct <= unit_value < to_pct:
        return "matched"
    return "not_matched"
```

**Logical operators:**

```python
def evaluate_and(condition, context):
    results = [evaluate(c, context) for c in condition.conditions]
    if "not_matched" in results:
        return "not_matched"
    if "unknown" in results:
        return "unknown"
    return "matched"

def evaluate_or(condition, context):
    results = [evaluate(c, context) for c in condition.conditions]
    if "matched" in results:
        return "matched"
    if "unknown" in results:
        return "unknown"
    return "not_matched"

def evaluate_not(condition, context):
    result = evaluate(condition.condition, context)
    if result == "matched":
        return "not_matched"
    if result == "not_matched":
        return "matched"
    return "unknown"
```

### FNV-1a hash function

For consistent percentage bucketing, use FNV-1a 32-bit hash:

```python
def fnv1a_32(data: bytes) -> int:
    """FNV-1a 32-bit hash"""
    hash = 0x811c9dc5  # FNV offset basis

    for byte in data:
        hash ^= byte
        hash = (hash * 0x01000193) & 0xFFFFFFFF  # FNV prime, mod 2^32

    return hash

def fnv1a_to_unit(input: str) -> float:
    """Convert string to [0, 1) range"""
    hash = fnv1a_32(input.encode('utf-8'))
    return hash / (2 ** 32)
```

### Type casting

Cast expected values to match context value types:

```python
def cast_to_context_type(expected, context_value):
    if isinstance(context_value, (int, float)):
        if isinstance(expected, str):
            try:
                return float(expected)
            except ValueError:
                return expected

    if isinstance(context_value, bool):
        if expected == "true":
            return True
        if expected == "false":
            return False

    if isinstance(context_value, str):
        if isinstance(expected, (int, float, bool)):
            return str(expected)

    return expected
```

## Implementation checklist

### Minimal SDK

- [ ] Connect to `/api/sdk/v1/replication/stream` with SSE
- [ ] Parse `init` and `config_change` events
- [ ] Store configs in memory
- [ ] Implement `get(configName)` to return cached value
- [ ] Implement basic override evaluation

### Production SDK

- [ ] Automatic reconnection with exponential backoff
- [ ] Inactivity timeout (reconnect if no events for 30s)
- [ ] Support for all condition operators
- [ ] FNV-1a hashing for segmentation
- [ ] Type casting for property comparisons
- [ ] Subscription callbacks for config changes
- [ ] Graceful shutdown (`close()` method)
- [ ] Required configs validation
- [ ] Fallback values support
- [ ] Configurable timeouts and retry delays

## Example: Minimal Python SDK

```python
import json
import requests
from typing import Any, Dict, Optional

# doesn't support live updates (only initial configs)
class ReplaneClient:
    def __init__(self, sdk_key: str, base_url: str):
        self.sdk_key = sdk_key
        self.base_url = base_url.rstrip('/')
        self.configs: Dict[str, Any] = {}
        self._connect()

    def _connect(self):
        """Connect to replication stream and load initial configs"""
        response = requests.post(
            f"{self.base_url}/api/sdk/v1/replication/stream",
            headers={
                "Authorization": f"Bearer {self.sdk_key}",
                "Accept": "text/event-stream",
                "Content-Type": "application/json",
            },
            json={"currentConfigs": [], "requiredConfigs": []},
            stream=True,
        )
        response.raise_for_status()

        # Read first event (init)
        for line in response.iter_lines():
            if line:
                line = line.decode('utf-8')
                if line.startswith('data:'):
                    data = json.loads(line[5:].strip())
                    if data['type'] == 'init':
                        for config in data['configs']:
                            self.configs[config['name']] = config
                        break

    def get(self, name: str, context: Optional[Dict] = None) -> Any:
        """Get config value with optional context for override evaluation"""
        config = self.configs.get(name)
        if config is None:
            raise KeyError(f"Config not found: {name}")

        if context and config.get('overrides'):
            return self._evaluate_overrides(
                config['value'],
                config['overrides'],
                context
            )

        return config['value']

    def _evaluate_overrides(self, base_value, overrides, context):
        """Evaluate overrides and return matching value"""
        for override in overrides:
            if self._all_conditions_match(override['conditions'], context):
                return override['value']
        return base_value

    def _all_conditions_match(self, conditions, context) -> bool:
        """Check if all conditions match (implicit AND)"""
        for condition in conditions:
            if not self._evaluate_condition(condition, context):
                return False
        return True

    def _evaluate_condition(self, condition, context) -> bool:
        """Evaluate a single condition"""
        op = condition['operator']

        if op == 'and':
            return all(self._evaluate_condition(c, context)
                      for c in condition['conditions'])

        if op == 'or':
            return any(self._evaluate_condition(c, context)
                      for c in condition['conditions'])

        if op == 'not':
            return not self._evaluate_condition(condition['condition'], context)

        prop = condition['property']
        ctx_value = context.get(prop)

        if ctx_value is None:
            return False  # Unknown = not matched for simplicity

        if op == 'segmentation':
            return self._evaluate_segmentation(condition, ctx_value)

        expected = condition['value']

        if op == 'equals':
            return ctx_value == expected
        if op == 'in':
            return ctx_value in expected
        if op == 'not_in':
            return ctx_value not in expected
        if op == 'less_than':
            return ctx_value < expected
        if op == 'greater_than':
            return ctx_value > expected

        return False

    def _evaluate_segmentation(self, condition, ctx_value) -> bool:
        """Evaluate percentage-based segmentation"""
        hash_input = f"{ctx_value}{condition['seed']}"
        unit = self._fnv1a_to_unit(hash_input)
        from_pct = condition['fromPercentage'] / 100
        to_pct = condition['toPercentage'] / 100
        return from_pct <= unit < to_pct

    def _fnv1a_to_unit(self, s: str) -> float:
        """FNV-1a hash to [0, 1) range"""
        h = 0x811c9dc5
        for byte in s.encode('utf-8'):
            h ^= byte
            h = (h * 0x01000193) & 0xFFFFFFFF
        return h / (2 ** 32)


# Usage
client = ReplaneClient(
    sdk_key="your-sdk-key",
    base_url="https://replane.example.com"
)

# Get a simple config
rate_limit = client.get("rate-limit")

# Get with context for override evaluation
feature_enabled = client.get("premium-features", context={
    "userId": "user-123",
    "plan": "premium"
})
```

## Next steps

- See the [JavaScript SDK source](https://github.com/replane-dev/replane-javascript) for a complete implementation
- Read [Override Rules](/docs/guides/override-rules) to understand targeting
- Check [Gradual Rollouts](/docs/guides/gradual-rollouts) for percentage-based releases
