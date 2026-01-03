---
title: JavaScript SDK
description: Integrate Replane into Node.js, browsers, Deno, or Bun. Features type-safe configuration access, realtime SSE updates, context-based overrides, and zero dependencies.
sidebar_label: Overview
slug: /sdk/javascript
---

# JavaScript SDK

The official JavaScript/TypeScript SDK for Replane. Works in Node.js 18+, browsers, Deno, and Bun.

## Installation

```bash npm2yarn
npm install @replanejs/sdk
```

## Quick start

```typescript
import { Replane } from '@replanejs/sdk'

// Define your config types
interface Configs {
  'feature-dark-mode': boolean
  'api-rate-limit': number
  'pricing-tiers': { free: number; premium: number }
}

// Create the client
const replane = new Replane<Configs>()

// Connect to the server
await replane.connect({
  sdkKey: process.env.REPLANE_SDK_KEY,
  baseUrl: 'https://replane.example.com'
})

// Get a config value
const darkModeEnabled = replane.get('feature-dark-mode')

// Get with context for override evaluation
const rateLimit = replane.get('api-rate-limit', {
  context: { userId: user.id, plan: user.plan }
})

// Subscribe to realtime updates
replane.subscribe('feature-dark-mode', (config) => {
  console.log('Dark mode changed:', config.value)
})

// Cleanup when done
replane.disconnect()
```

## Features

- **Type safety** — Full TypeScript support with generics
- **Real-time updates** — SSE connection for instant config changes
- **Context-based overrides** — Target users, plans, regions, etc.
- **Zero dependencies** — Pure JavaScript, works everywhere
- **Resilient** — Automatic reconnection and local caching

## Environment compatibility

| Environment       | Support                   |
| ----------------- | ------------------------- |
| Node.js 18+       | Full                      |
| Node.js 16-17     | Requires fetch polyfill   |
| Browsers (modern) | Full                      |
| Deno              | Full                      |
| Bun               | Full                      |
| Edge Workers      | Full (Cloudflare, Vercel) |

## Next steps

- [API Reference](/docs/sdk/javascript/api) — Full API documentation
- [Guide](/docs/sdk/javascript/guide) — Configuration, testing, best practices
- [Feature Flags](/docs/guides/feature-flags) — Toggle features
- [Override Rules](/docs/guides/override-rules) — Target specific users
