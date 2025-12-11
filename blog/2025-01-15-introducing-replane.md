---
slug: introducing-replane
title: Introducing Replane - Self-Hosted Config Management
authors: replane
tags: [announcement, release, config-management]
description: A self-hosted solution for managing application configuration with version history, instant rollback, and realtime updates.
---

We're excited to announce **Replane**, a self-hosted solution for managing application configuration with version history, instant rollback, and realtime updates.

<!-- truncate -->

## Why Replane?

When building applications, you often need to change behavior without deploying new code:

- **Feature flags** to toggle features on/off
- **Operational tuning** to adjust rate limits, cache TTLs, or batch sizes
- **Gradual rollouts** to release features to a percentage of users
- **Incident response** to quickly revert problematic changes

Existing solutions are either too complex (full-featured feature flag platforms) or too simple (environment variables in spreadsheets).

Replane finds the sweet spot: **focused, auditable, and self-hosted**.

## Key Features

### Version History & Instant Rollback

Every config change creates an append-only snapshot. When something goes wrong, revert to any previous version with one click. No guessing, no manual edits.

<!-- Screenshot: Version history interface will be added here -->

### Realtime Updates via SSE

Changes propagate to your applications instantly via Server-Sent Events. No polling, no delays. Your apps stay synchronized automatically.

```javascript
const flags = await client.watchConfigValue('feature-flags')

// Later, when someone changes the config:
flags.get() // Returns the new value automatically
```

### JSON Schema Validation

Attach JSON schemas to prevent invalid configurations. Block out-of-range values and enforce structure before changes are saved.

```json
{
  "type": "object",
  "properties": {
    "rate-limit": {
      "type": "integer",
      "minimum": 1,
      "maximum": 10000
    }
  },
  "required": ["rate-limit"]
}
```

### Role-Based Access Control

Granular permissions with owner, editor, and viewer roles. Control who can modify configs and who can only view them. Create SDK keys for programmatic access.

### Self-Hosted

Run on your infrastructure with full data ownership. Simple Docker deployment with PostgreSQL. No external dependencies, no vendor lock-in.

## Getting Started

Deploy with Docker Compose in under 5 minutes:

```yaml
services:
  db:
    image: postgres:17
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: replane
    volumes:
      - replane-db:/var/lib/postgresql/data

  app:
    image: ghcr.io/replane-dev/replane:latest
    depends_on:
      - db
    environment:
      DATABASE_URL: postgresql://postgres:postgres@db:5432/replane
      BASE_URL: http://localhost:8080
      SECRET_KEY_BASE: your-secret-key
      GITHUB_CLIENT_ID: your-github-client-id
      GITHUB_CLIENT_SECRET: your-github-client-secret
    ports:
      - '8080:8080'

volumes:
  replane-db:
```

Check out the [Quickstart Guide](/docs/getting-started/quickstart) for detailed instructions.

## Use Cases

### Feature Flags

Toggle features without deploying:

```json
{
  "new-onboarding": true,
  "dark-mode": false,
  "billing-v2": false
}
```

### Operational Tuning

Adjust behavior in realtime:

```json
{
  "api-requests-per-minute": 100,
  "cache-ttl-seconds": 300,
  "max-concurrent-connections": 50
}
```

### Gradual Rollouts

Release features to a percentage of users:

```json
{
  "new-checkout-percentage": 25
}
```

Increase over time as you gain confidence.

## SDK

We provide a lightweight SDK for JavaScript/TypeScript:

```bash
npm install @replanejs/sdk
```

```javascript
import { createReplaneClient } from '@replanejs/sdk'

const client = createReplaneClient({
  sdkKey: process.env.REPLANE_SDK_KEY,
  baseUrl: 'https://config.company.com'
})

const flags = await client.getConfigValue('feature-flags')
```

## Status & Roadmap

Replane is **early but usable**. We're running it in production for our own projects. Expect changes to schemas and endpoints before v1.0.

Upcoming features:

- Config templates
- Webhook notifications
- More authentication providers (Google, Azure AD)
- Advanced RBAC with custom roles

## Get Involved

- **GitHub**: [github.com/replane-dev/replane](https://github.com/replane-dev/replane)
- **Docs**: [replane.dev/docs](https://replane.dev/docs)
- **License**: MIT

We'd love to hear your feedback! Open an issue or discussion on GitHub.

---

_Ready to give it a try? Start with the [Quickstart Guide](/docs/getting-started/quickstart)._
