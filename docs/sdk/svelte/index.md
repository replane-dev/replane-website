---
title: Svelte SDK
description: Integrate Replane into Svelte applications with reactive stores
sidebar_label: Overview
slug: /sdk/svelte
---

# Svelte SDK

The official Svelte SDK for Replane. Provides reactive stores and context for Svelte and SvelteKit applications.

## Installation

```bash npm2yarn
npm install @replanejs/svelte
```

## Quick start

```svelte
<script>
  import { ReplaneContext, Replane } from '@replanejs/svelte';

  const client = new Replane();
  await client.connect({
    baseUrl: 'https://replane.example.com',
    sdkKey: 'your-sdk-key',
  });
</script>

<ReplaneContext {client}>
  <MyComponent />
</ReplaneContext>
```

```svelte
<!-- MyComponent.svelte -->
<script>
  import { config } from '@replanejs/svelte'

  const feature = config<boolean>('feature-flag-name')
</script>

{#if $feature}
  <p>Feature is enabled!</p>
{:else}
  <p>Feature is disabled</p>
{/if}
```

## Features

- **Reactive stores** — Svelte-native reactivity with `$` syntax
- **Automatic updates** — Stores update when configs change
- **SvelteKit SSR** — Server-side rendering with snapshots
- **Type-safe** — Full TypeScript support with typed stores

## Next steps

- [API Reference](/docs/sdk/svelte/api) — Full API documentation
- [Guide](/docs/sdk/svelte/guide) — SvelteKit SSR, typed stores, best practices
- [JavaScript SDK](/docs/sdk/javascript) — Core SDK documentation
- [Feature Flags](/docs/guides/feature-flags) — Toggle features

