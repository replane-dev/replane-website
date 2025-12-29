---
title: SDK Overview
description: Official Replane SDKs for JavaScript, React, Next.js, Svelte, Python, and .NET
slug: /sdk
---

# SDK Overview

Replane provides official SDKs for all major languages and frameworks. Each SDK connects to your Replane server via Server-Sent Events (SSE) for real-time configuration updates.

## Available SDKs

| SDK | Package | Runtime |
|-----|---------|---------|
| [JavaScript/TypeScript](/docs/sdk/javascript) | `@replanejs/sdk` | Node.js 18+, Browsers, Deno, Bun |
| [React](/docs/sdk/react) | `@replanejs/react` | React 18+ |
| [Next.js](/docs/sdk/nextjs) | `@replanejs/next` | Next.js 13+ (App Router) |
| [Svelte](/docs/sdk/svelte) | `@replanejs/svelte` | Svelte 5+, SvelteKit |
| [Python](/docs/sdk/python) | `replane` | Python 3.9+ |
| [.NET](/docs/sdk/dotnet) | `Replane` | .NET 8+ |

## Core Concepts

All Replane SDKs share the same core concepts:

### Connection

Connect to your Replane server using an SDK key:

```typescript
await replane.connect({
  baseUrl: 'https://replane.example.com',
  sdkKey: process.env.REPLANE_SDK_KEY
})
```

### Getting Config Values

Retrieve configuration values by name:

```typescript
const value = replane.get('config-name')
```

### Real-time Updates

Subscribe to configuration changes for instant updates:

```typescript
replane.subscribe('config-name', (config) => {
  console.log('Config changed:', config.value)
})
```

### Context for Overrides

Pass context for override rule evaluation:

```typescript
const value = replane.get('config-name', {
  context: { userId: 'user-123', plan: 'premium' }
})
```

## Choosing an SDK

- **Backend services**: Use the [JavaScript](/docs/sdk/javascript), [Python](/docs/sdk/python), or [.NET](/docs/sdk/dotnet) SDK
- **React apps**: Use the [React SDK](/docs/sdk/react) for hooks and provider
- **Next.js apps**: Use the [Next.js SDK](/docs/sdk/nextjs) for server components and App Router support
- **Svelte/SvelteKit**: Use the [Svelte SDK](/docs/sdk/svelte) for stores and context
- **Other languages**: Check out our [Building an SDK](/docs/sdk/building-an-sdk) guide

## Features

All official SDKs include:

- ✅ **Type safety** - Full TypeScript/type hint support
- ✅ **Real-time updates** - Server-Sent Events for instant propagation
- ✅ **Local caching** - Configs cached locally for resilience
- ✅ **Override rules** - Context-based value resolution
- ✅ **Connection recovery** - Automatic reconnection on network issues

## Getting Started

1. Install the SDK for your platform
2. Get your SDK key from the Replane dashboard
3. Connect and start using config values

See the individual SDK pages for detailed installation and usage instructions.

