---
slug: introducing-replane
title: 'Introducing Replane: Stop Deploying Code to Change Settings'
authors: replane
tags: [announcement, release, config-management, feature-flags]
description: Self-hosted config management with version history, instant rollback, and realtime updates. Deploy once, change behavior forever.
---

**Every developer knows the pain**: you need to change a rate limit, toggle a feature, or adjust a timeout. But it's hardcoded. So you open a PR, wait for review, merge, wait for CI, deploy, and pray nothing breaks.

For a one-line change. That takes 2 hours. Or worse—until tomorrow.

Today we're launching **Replane**, a self-hosted solution that eliminates this friction forever.

<!-- truncate -->

## The Problem We're Solving

Modern applications need runtime flexibility. Feature flags, operational parameters, rate limits, A/B test configurations—these aren't truly "code." They're **decisions** that should change faster than your deploy cycle allows.

Yet most teams handle this one of two ways:

1. **Environment variables**: Great until you need version history, validation, or permissions. Then you're managing secrets in spreadsheets and hoping nobody fat-fingers production.

2. **Full-featured platforms**: LaunchDarkly, Split, Optimizely. Powerful, but expensive, complex, and you're sending your config data to someone else's servers.

Replane is the third way: **focused, auditable, and entirely yours**.

## What Makes Replane Different

### Every Change is Versioned

No more "who changed this?" or "what was the old value?" Every config modification creates an immutable snapshot. See the full history. Compare versions. Rollback with one click.

When production breaks at 3 AM, you don't debug—you revert.

### Realtime Updates via SSE

Changes propagate to your applications instantly via Server-Sent Events. No polling. No cache invalidation. No "did it update yet?"

```typescript
import { Replane } from '@replanejs/sdk'

const replane = new Replane()
await replane.connect({
  baseUrl: 'https://replane.example.com',
  sdkKey: process.env.REPLANE_SDK_KEY
})

// Get current value - always fresh
const limit = replane.get('rate-limit')

// Subscribe to changes
replane.subscribe('rate-limit', (config) => {
  console.log('Rate limit changed:', config.value)
  rateLimiter.setLimit(config.value)
})
```

### Validate Before You Break

Attach JSON schemas to configs. Block invalid values before they're saved. No more "oops, I set the rate limit to -1."

```json
{
  "type": "integer",
  "minimum": 1,
  "maximum": 10000,
  "description": "API requests per minute per user"
}
```

### Override Rules for Targeting

Different values for different contexts. Beta users get new features. Enterprise customers get higher limits. All without code changes.

```typescript
// Pass context for rule evaluation
const limit = replane.get('rate-limit', {
  context: { userId: user.id, plan: user.plan }
})
// Returns 1000 for premium users, 100 for free users
```

### Self-Hosted, Full Ownership

Your data stays on your infrastructure. Simple Docker deployment with PostgreSQL. MIT licensed. No vendor lock-in. No usage-based pricing surprises.

## SDKs for Every Stack

We've built official SDKs for the technologies you actually use:

| SDK                   | Package             | Install                         |
| --------------------- | ------------------- | ------------------------------- |
| JavaScript/TypeScript | `@replanejs/sdk`    | `npm install @replanejs/sdk`    |
| React                 | `@replanejs/react`  | `npm install @replanejs/react`  |
| Next.js               | `@replanejs/next`   | `npm install @replanejs/next`   |
| Svelte                | `@replanejs/svelte` | `npm install @replanejs/svelte` |
| Python                | `replane`           | `pip install replane`           |
| .NET                  | `Replane`           | `dotnet add package Replane`    |

All SDKs share the same core features: type safety, realtime updates, local caching, and automatic reconnection.

## Real Use Cases

### Feature Flags Without the Complexity

Ship code with features off. Enable for 1% of users. Watch metrics. Increase to 10%, then 100%. If something breaks, disable instantly—no rollback needed.

```typescript
const newCheckout = replane.get<boolean>('new-checkout-enabled')

if (newCheckout) {
  return <NewCheckout />
}
return <LegacyCheckout />
```

### Operational Tuning Without Deploys

Database getting hammered? Increase cache TTL. Hitting rate limits on a third-party API? Lower your batch size. All from the dashboard, all in under a second.

```python
cache_ttl = replane.get("cache-ttl-seconds")
batch_size = replane.get("batch-size")
```

### Kill Switch for Emergencies

That new payment integration throwing 500s? Disable it instantly while you debug. Your users see the old flow. You fix the bug without panic.

### Multi-Tenant Customization

Enterprise customer needs higher limits? Premium users get early access to features? Configure per-tenant without code branches.

## Get Started in 5 Minutes

Deploy with Docker Compose:

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
    image: replane/replane:latest
    depends_on:
      - db
    environment:
      DATABASE_URL: postgresql://postgres:postgres@db:5432/replane
      BASE_URL: http://localhost:8080
      SECRET_KEY: your-secret-key-here
      GITHUB_CLIENT_ID: your-github-client-id
      GITHUB_CLIENT_SECRET: your-github-client-secret
    ports:
      - '8080:8080'

volumes:
  replane-db:
```

Then:

```bash
docker compose up -d
```

That's it. Open `http://localhost:8080`, sign in with GitHub, create your first config.

→ **[Full Quickstart Guide](/docs/getting-started/quickstart)**

## What's Next

Replane is early but production-ready. We're using it ourselves. Here's what's coming:

- **Config templates** for common patterns
- **Webhook notifications** for change events
- **More auth providers** (Google, Azure AD, OIDC)
- **Advanced RBAC** with custom roles
- **Approval workflows** for production changes

## Join Us

Replane is open source under the MIT license. We'd love your feedback, contributions, and ideas.

- **GitHub**: [github.com/replane-dev/replane](https://github.com/replane-dev/replane)
- **Documentation**: [replane.dev/docs](/docs)
- **Discord**: Coming soon

Star the repo if you find this useful. Open an issue if you hit a bug. And let us know what features you need most.

---

**Ready to stop deploying code to change settings?**

→ **[Start with the Quickstart](/docs/getting-started/quickstart)** | **[View on GitHub](https://github.com/replane-dev/replane)**
