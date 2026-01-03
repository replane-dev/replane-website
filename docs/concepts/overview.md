---
title: Core Concepts
description: Understand Replane's key concepts including workspaces, projects, environments, configs with JSON values, overrides for conditional logic, SDK keys, and version history.
---

# Core concepts

This page explains the key concepts in Replane and how they relate to each other.

## Hierarchy

```
Workspace
└── Project
    ├── Environment (production, staging, dev)
    │   └── SDK Key
    └── Config
        ├── Value (JSON)
        ├── Overrides (conditional rules)
        ├── Per-environment values
        └── Version history
```

## Workspaces

A **workspace** is the top-level organizational unit. It typically represents a company or team.

- Contains multiple projects
- Has members with roles (admin, member)
- Admin can manage members and all projects
- Members can access assigned projects

**Example**: "Acme Corp" workspace containing "Backend API", "Web App", and "Mobile App" projects.

## Projects

A **project** is a container for related configurations. Each project:

- Belongs to one workspace
- Has multiple environments
- Has its own SDK keys
- Has role-based access (admin, maintainer)

**Example**: Your "Backend API" project might have configs for rate limits, feature flags, and API keys.

## Environments

An **environment** represents a deployment target like production, staging, or development.

- Each project has one or more environments
- Configs can have different values per environment (environment overrides)
- SDK keys are scoped to a single environment

### Environment overrides

Every config has a base value, but you can override it per environment:

| Config | Base | Production | Staging | Development |
|--------|------|------------|---------|-------------|
| `rate-limit` | `100` | `100` | `1000` | `10000` |
| `debug-mode` | `false` | `false` | `true` | `true` |
| `api-url` | `"https://api.example.com"` | — | `"https://staging-api.example.com"` | `"http://localhost:3000"` |

When an environment doesn't have an override, it uses the base value.

## Configs

A **config** is a named JSON value that your application reads.

### Structure

| Field | Description |
|-------|-------------|
| **Name** | Unique identifier within the project (e.g., `feature-new-checkout`) |
| **Value** | Any valid JSON (boolean, number, string, object, array) |
| **Schema** | Optional JSON Schema for validation |
| **Overrides** | Conditional rules that return different values based on context |
| **Description** | Optional documentation |

### Naming conventions

Config names must:
- Be 1-100 characters
- Contain only letters, numbers, hyphens, and underscores
- Be unique within a project

Recommended patterns:
- Feature flags: `feature-{name}` (e.g., `feature-dark-mode`)
- Settings: `{domain}-{name}` (e.g., `api-rate-limit`)
- Experiments: `experiment-{name}` (e.g., `experiment-checkout-flow`)

### Value types

Configs support any JSON value:

```json
// Boolean (feature flag)
true

// Number (operational setting)
100

// String (API key or URL)
"https://api.example.com"

// Object (complex configuration)
{
  "enabled": true,
  "maxRetries": 3,
  "timeout": 5000
}

// Array (list of values)
["us-east", "eu-west", "ap-south"]
```

## Overrides

**Overrides** let you return different values based on context. They're essential for:

- Feature flags (enable for specific users)
- A/B testing (different values for different segments)
- Gradual rollouts (percentage-based)
- Regional configuration (different values per region)

### How overrides work

1. SDK receives all configs and override rules from Replane
2. You call `replane.get()` with context (e.g., `{ userId: "123", plan: "premium" }`)
3. SDK evaluates overrides locally — **context never leaves your application**
4. First matching override's value is returned
5. If no override matches, base value is returned

This client-side evaluation ensures privacy (no user data sent to Replane) and speed (no network round-trip for reads).

### Example

Config: `premium-features`
- Base value: `false`
- Override: If `plan === "premium"`, return `true`

```typescript
// Free user - returns base value
replane.get('premium-features', { context: { plan: 'free' } }); // false

// Premium user - override matches
replane.get('premium-features', { context: { plan: 'premium' } }); // true
```

Learn more in the [Override Rules guide](/docs/guides/override-rules).

## SDK Keys

**SDK keys** authenticate your application with Replane.

- Scoped to one project and environment
- Read-only access to project's configs
- Can be revoked without affecting other keys

**Best practice**: Create separate SDK keys for each service or deployment.

## Versions

Every config change creates an immutable **version**. Versions enable:

- **Audit trail**: See who changed what and when
- **Rollback**: Instantly revert to any previous version
- **History**: Compare changes over time

Versions are append-only — nothing is ever deleted.

## Context

**Context** is runtime information about the request or user. It's used to evaluate overrides.

Common context properties:
- `userId` — User identifier
- `plan` — Subscription tier
- `region` — Geographic region
- `version` — Application version
- `deviceType` — Mobile, desktop, etc.

Context is passed when calling `replane.get()`:

```typescript
const value = replane.get('feature-flag', {
  context: {
    userId: user.id,
    plan: user.subscription.plan,
    region: request.headers['x-region']
  }
});
```

## Next steps

- [Architecture](/docs/concepts/architecture) — How Replane works internally
- [Override Rules](/docs/guides/override-rules) — Create conditional logic
- [JavaScript SDK](/docs/sdk/javascript) — Integrate with your application
