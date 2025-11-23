---
sidebar_position: 1
---

# Core Concepts

Understanding these core concepts will help you use Replane effectively.

## Projects

A **project** is a container for related configurations. Each project has its own:

- Set of configs
- Team members with roles
- API keys
- Audit log

Projects provide isolation between different applications or environments.

<!-- Screenshot: Projects dashboard will be added here -->

## Configs

A **config** is a named JSON value that your application can fetch. Examples:

```json title="feature-flags"
{
  "new-onboarding": true,
  "dark-mode": false,
  "billing-enabled": true
}
```

```json title="rate-limits"
{
  "api-requests-per-minute": 100,
  "max-concurrent-connections": 50
}
```

### Config Names

- Must be 1-100 characters long
- Can contain letters, digits, underscores, and hyphens
- Are unique within a project

### Override Rules

Configs can have **override rules** that return different values based on context:

```javascript
// Same config returns different values for different users
const limit = await client.getConfigValue('api-limit', {
  context: { tier: 'premium' }
});
// Returns higher limit for premium users
```

Overrides enable:
- User-specific configurations
- Tier-based limits
- Regional settings
- A/B testing variants
- Feature flags with targeting

Learn more in the [**Override Rules Guide**](../guides/override-rules).

## Versions & Snapshots

Every time you update a config, Replane creates a new **snapshot** with:

- The new JSON value
- Who made the change
- When it was changed
- A unique version number

Snapshots are **append-only** — previous versions are never deleted. This enables:

- Full audit trail of all changes
- Instant rollback to any previous version
- Time-travel debugging

<!-- Screenshot: Version history will be added here -->

## Realtime Updates (SSE)

When you use the SDK's `watchConfigValue` method, your application receives updates via **Server-Sent Events (SSE)**:

```javascript
const flags = await client.watchConfigValue('feature-flags');

// Later, when someone changes the config in the UI:
flags.get(); // Returns the new value automatically
```

No polling required. Changes propagate instantly.

## JSON Schema Validation

Attach a [JSON Schema](https://json-schema.org/) to a config to enforce structure and prevent invalid values:

```json title="Example Schema"
{
  "type": "object",
  "properties": {
    "new-onboarding": { "type": "boolean" },
    "dark-mode": { "type": "boolean" }
  },
  "required": ["new-onboarding", "dark-mode"],
  "additionalProperties": false
}
```

When a schema is attached, Replane validates all changes before saving. Invalid configs are rejected.

<!-- Screenshot: Schema validation error will be added here -->

## Roles & Permissions

Replane uses a unified three-tier role system across projects and configs:

### Project Roles

| Role           | Permissions                                                                                 |
| -------------- | ------------------------------------------------------------------------------------------- |
| **Admin**      | Full project control: manage members, delete project, manage all configs and API keys       |
| **Maintainer** | Manage configs and API keys, edit project details (cannot manage members or delete project) |

### Config Roles

Config-level roles provide granular access control for individual configs:

| Role           | Permissions                                                                        |
| -------------- | ---------------------------------------------------------------------------------- |
| **Maintainer** | Full config access: edit value, schema, description, and manage config maintainers |
| **Editor**     | Edit config value and description (cannot modify schema or maintainers)            |

**Note:** Project admins and maintainers automatically have config maintainer permissions for all configs in their project.

## API Keys

**API keys** provide programmatic access to configs. Each key:

- Belongs to a specific project
- Can only access configs in that project
- Is shown once when created (store it securely)
- Can be revoked at any time

Use API keys in your SDKs:

```javascript
const client = createReplaneClient({
  apiKey: process.env.REPLANE_API_KEY,
  baseUrl: 'https://your-replane-host.com',
});
```

## Audit Log

The **audit log** tracks all activity:

- Config changes (who, when, what)
- Rollbacks
- Member invitations
- API key creation/revocation

<!-- Screenshot: Audit log will be added here -->

The audit log is append-only and cannot be modified.

## Next Steps

- [**Guides**](../guides/feature-flags) - Common use cases
- [**Self-Hosting**](../self-hosting/docker) - Deploy Replane
- [**JavaScript SDK**](../sdk/javascript) - SDK documentation
