---
slug: introducing-replane
title: 'Introducing Replane: Dynamic Configuration for Apps and Services'
authors: dmitry
tags: [announcement, release, config-management, feature-flags]
description: Self-hosted config management with version history, instant rollback, and realtime updates via SSE. MIT licensed, Docker deployment.
---

Changing a rate limit, toggling a feature, or adjusting a timeout shouldn't require a deploy. Yet for most teams, it does: open a PR, wait for review, merge, wait for CI, deploy. For a one-line change.

**Replane** is a self-hosted configuration manager that decouples config changes from code deployments. Store feature flags, app settings, and operational parameters in one place—with version history, optional approvals, and realtime sync to your services via Server-Sent Events.

<!-- truncate -->

## What Replane does

- **Version history**: Every change creates an immutable snapshot. See who changed what, when, and why. Rollback to any previous state.
- **Realtime updates**: Changes propagate to connected SDKs via SSE—typically under 1 second.
- **JSON Schema validation**: Attach schemas to configs to prevent invalid values before they're saved.
- **Override rules**: Return different values based on context (user ID, subscription plan, region). Evaluated client-side for low latency.
- **Environments**: Different values for production, staging, development.
- **Change proposals**: Optionally require review before changes go live.
- **Role-based access**: Workspace admins, project maintainers, config editors.

## How it works

Replane uses a unified architecture where one Docker image serves the dashboard and SDK API. PostgreSQL is the source of truth. Each instance maintains a local SQLite cache for fast reads.

```mermaid
flowchart TB
    subgraph db["PostgreSQL (Source of Truth)"]
    end

    db --> r1
    db --> r2
    db --> r3

    subgraph r1["Replane Instance 1"]
        r1cache["SQLite cache"]
    end

    subgraph r2["Replane Instance 2"]
        r2cache["SQLite cache"]
    end

    subgraph r3["Replane Instance 3"]
        r3cache["SQLite cache"]
    end

    r1 -->|SSE| a1["Your Apps"]
    r2 -->|SSE| a2["Your Apps"]
    r3 -->|SSE| a3["Your Apps"]
```

SDKs connect via `POST /api/sdk/v1/replication/stream`, receive an initial payload with all configs, and then receive `config_change` events as they occur. The connection stays open; SDKs automatically reconnect on disconnect.

Override evaluation happens client-side in the SDK:

1. `replane.get('feature-flag', { context: { plan: 'premium' } })`
2. Find config in local cache
3. Iterate through overrides in order
4. First matching override returns its value
5. No match → return base value

## SDKs

| Technology | Package                                                                | Install                         |
| ---------- | ---------------------------------------------------------------------- | ------------------------------- |
| JavaScript | [`@replanejs/sdk`](https://www.npmjs.com/package/@replanejs/sdk)       | `npm install @replanejs/sdk`    |
| React      | [`@replanejs/react`](https://www.npmjs.com/package/@replanejs/react)   | `npm install @replanejs/react`  |
| Next.js    | [`@replanejs/next`](https://www.npmjs.com/package/@replanejs/next)     | `npm install @replanejs/next`   |
| Svelte     | [`@replanejs/svelte`](https://www.npmjs.com/package/@replanejs/svelte) | `npm install @replanejs/svelte` |
| Python     | [`replane`](https://pypi.org/project/replane/)                         | `pip install replane`           |
| .NET       | [`Replane`](https://www.nuget.org/packages/Replane)                    | `dotnet add package Replane`    |

All SDKs provide: type safety, realtime updates via SSE, local caching, and automatic reconnection.

## Code example

```typescript
import { Replane } from '@replanejs/sdk'

interface Configs {
  'api-rate-limit': number
  'feature-new-checkout': boolean
  'pricing': { free: { requests: number }; premium: { requests: number } }
}

const replane = new Replane<Configs>({
  defaults: {
    'api-rate-limit': 100,
    'feature-new-checkout': false,
    'pricing': { free: { requests: 100 }, premium: { requests: 10000 } }
  }
})

await replane.connect({
  baseUrl: 'https://replane.example.com',
  sdkKey: process.env.REPLANE_SDK_KEY!
})

// Read a value
const limit = replane.get('api-rate-limit')

// Read with context for override evaluation
const userLimit = replane.get('api-rate-limit', {
  context: { userId: user.id, plan: user.plan }
})

// Subscribe to changes
replane.subscribe('api-rate-limit', (config) => {
  rateLimiter.setLimit(config.value)
})
```

## Use cases

**Feature flags**: Toggle features without deploys. Enable for 1% of users, watch metrics, increase to 100%. Disable instantly if something breaks.

**Operational tuning**: Adjust cache TTLs, batch sizes, rate limits—all from the dashboard, all propagated in under a second.

**Kill switches**: That new payment integration throwing errors? Disable it instantly while you debug.

**Per-tenant configuration**: Enterprise customers get higher limits. Premium users get early access to features. Configure per-tenant without code branches.

## Deployment

### Replane Cloud

The fastest option. Sign up at [cloud.replane.dev](https://cloud.replane.dev), create a config, get an SDK key, connect your app.

### Self-hosted with Docker

```yaml
services:
  postgres:
    image: postgres:17
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: replane
    volumes:
      - replane-data:/var/lib/postgresql/data

  replane:
    image: replane/replane:latest
    depends_on:
      - postgres
    ports:
      - '8080:8080'
    environment:
      DATABASE_URL: postgresql://postgres:postgres@postgres:5432/replane
      BASE_URL: http://localhost:8080
      SECRET_KEY: change-me-to-a-long-random-string
      PASSWORD_AUTH_ENABLED: true

volumes:
  replane-data:
```

```bash
docker compose up -d
```

Open `http://localhost:8080`. For production, generate a secure `SECRET_KEY` with `openssl rand -base64 48`.

Replane can also run without an external database—it includes an integrated SQLite database. Mount `/data` to persist data.

### System requirements

| Component  | Minimum    | Recommended |
| ---------- | ---------- | ----------- |
| CPU        | 0.25 cores | 2 cores     |
| Memory     | 512 MB     | 4 GB        |
| Storage    | 1 GB       | 10+ GB      |
| PostgreSQL | 14+        | 16+         |

### Authentication options

- Password authentication (enabled by default)
- Email magic links (requires SMTP configuration)
- OAuth: GitHub, GitLab, Google, Okta

### Performance

Benchmarks on Apple M2 Pro (32 GB):

| Metric                   | Result        |
| ------------------------ | ------------- |
| Concurrent SSE clients   | 5,000+        |
| Config change throughput | ~4,500 msg/s  |
| Node.js CPU usage        | ~1.5 cores    |
| Node.js memory usage     | ~2.7 GB (RSS) |

Scales horizontally—add more instances behind a load balancer.

## When Replane isn't the right choice

- **Built-in A/B test analytics**: Replane provides override rules and percentage-based rollouts, but doesn't include built-in analytics or statistical significance calculations. Integrate with your existing analytics stack.
- **Complex experimentation workflows**: If you need multivariate testing with automatic winner selection, a dedicated experimentation platform may fit better.

## Get started

- **Replane Cloud**: [cloud.replane.dev](https://cloud.replane.dev)
- **Documentation**: [replane.dev/docs](/docs)
- **GitHub**: [github.com/replane-dev/replane](https://github.com/replane-dev/replane)

MIT licensed. Contributions welcome.

→ **[Quickstart Guide](/docs/getting-started/quickstart)** | **[View on GitHub](https://github.com/replane-dev/replane)**
