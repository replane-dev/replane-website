---
sidebar_position: 5
title: Svelte SDK
description: Integrate Replane into Svelte applications with reactive stores
---

# Svelte SDK

The official Svelte SDK for Replane. Provides reactive stores and context for Svelte and SvelteKit applications.

## Installation

```bash npm2yarn
npm install @replanejs/svelte
```

## Quick start

```html
<script>
  import { ReplaneContext, config } from '@replanejs/svelte';
  import { createReplaneClient } from '@replanejs/svelte';

  const client = await createReplaneClient({
    baseUrl: 'https://replane.example.com',
    sdkKey: 'your-sdk-key',
  });
</script>

<ReplaneContext {client}>
  <MyComponent />
</ReplaneContext>
```

```html
<!-- MyComponent.svelte -->
<script>
  import { config } from '@replanejs/svelte';

  const feature = config<boolean>('feature-flag-name');
</script>

{#if $feature}
  <p>Feature is enabled!</p>
{:else}
  <p>Feature is disabled</p>
{/if}
```

## API Reference

### config

Creates a reactive store for a config value. Similar to `readable()` or `derived()`.

```html
<script>
  import { config } from '@replanejs/svelte';

  // Returns a Svelte readable store
  const featureEnabled = config<boolean>('featureEnabled');

  // With evaluation context
  const greeting = config<string>('greeting', {
    context: { userId: '123', isPremium: true }
  });
</script>

{#if $featureEnabled}
  <p>{$greeting}</p>
{/if}
```

### getReplane

Gets the Replane client from context.

```html
<script>
  import { getReplane } from '@replanejs/svelte';

  const { client } = getReplane();

  function handleClick() {
    const value = client.get('some-config');
    console.log(value);
  }
</script>

<button onclick={handleClick}>Get Config</button>
```

### configFrom

Creates a reactive store from a client directly (without context).

```html
<script>
  import { configFrom } from '@replanejs/svelte';
  import { client } from './replane-client';

  const featureEnabled = configFrom<boolean>(client, 'featureEnabled');
</script>

{#if $featureEnabled}
  <p>Feature is enabled!</p>
{/if}
```

### ReplaneContext

Context component that provides the Replane client to your component tree.

#### With a pre-created client

```html
<script>
  import { ReplaneContext, createReplaneClient } from '@replanejs/svelte';

  const client = await createReplaneClient({
    baseUrl: 'https://replane.example.com',
    sdkKey: 'your-sdk-key',
  });
</script>

<ReplaneContext {client}>
  <App />
</ReplaneContext>
```

#### With options (client managed internally)

```html
<script>
  import { ReplaneContext } from '@replanejs/svelte';

  const options = {
    baseUrl: 'https://replane.example.com',
    sdkKey: 'your-sdk-key',
  };
</script>

<svelte:boundary onerror={(e) => console.error(e)}>
  <ReplaneContext {options}>
    <App />

    {#snippet loader()}
      <p>Loading...</p>
    {/snippet}
  </ReplaneContext>

  {#snippet failed(error)}
    <p>Error: {error.message}</p>
  {/snippet}
</svelte:boundary>
```

#### With snapshot (SSR/hydration)

```html
<script>
  import { ReplaneContext } from '@replanejs/svelte';

  let { data, children } = $props();

  const options = {
    baseUrl: import.meta.env.VITE_REPLANE_BASE_URL,
    sdkKey: import.meta.env.VITE_REPLANE_SDK_KEY,
  };
</script>

<ReplaneContext {options} snapshot={data.replaneSnapshot}>
  {@render children()}
</ReplaneContext>
```

## Typed stores

For better type safety, create typed store functions:

```ts
// $lib/replane/index.ts
import { createTypedConfig, createTypedReplane } from '@replanejs/svelte';

interface AppConfigs {
  theme: { darkMode: boolean; primaryColor: string };
  features: { betaEnabled: boolean };
}

export const appConfig = createTypedConfig<AppConfigs>();
export const getAppReplane = createTypedReplane<AppConfigs>();
```

```html
<script lang="ts">
  import { appConfig } from '$lib/replane';

  // Config names autocomplete, values are fully typed
  const theme = appConfig('theme');
  // $theme is { darkMode: boolean; primaryColor: string }
</script>

<div style:color={$theme.primaryColor}>
  {$theme.darkMode ? 'Dark' : 'Light'}
</div>
```

## SvelteKit SSR

For server-side rendering, fetch configs on the server and restore on the client:

```ts
// src/routes/+layout.server.ts
import { getReplaneSnapshot } from '@replanejs/svelte';

export async function load() {
  const snapshot = await getReplaneSnapshot({
    baseUrl: import.meta.env.REPLANE_BASE_URL,
    sdkKey: import.meta.env.REPLANE_SDK_KEY,
  });

  return { replaneSnapshot: snapshot };
}
```

```html
<!-- src/routes/+layout.svelte -->
<script lang="ts">
  import { ReplaneContext } from '@replanejs/svelte';

  let { data, children } = $props();

  const options = {
    baseUrl: import.meta.env.VITE_REPLANE_BASE_URL,
    sdkKey: import.meta.env.VITE_REPLANE_SDK_KEY,
  };
</script>

<ReplaneContext {options} snapshot={data.replaneSnapshot}>
  {@render children()}
</ReplaneContext>
```

## Realtime updates

All stores automatically subscribe to realtime updates via SSE. When a config changes on the server, the store updates automatically.

```html
<script>
  import { config } from '@replanejs/svelte';

  const maintenanceMode = config<boolean>('maintenance-mode');
</script>

<!-- Automatically updates when config changes -->
{#if $maintenanceMode}
  <MaintenanceBanner />
{/if}
```

## Context and overrides

Pass evaluation context for override rules:

```html
<script>
  import { config } from '@replanejs/svelte';

  const premiumFeature = config<boolean>('premium-feature', {
    context: {
      userId: 'user-123',
      plan: 'premium',
    },
  });
</script>

{#if $premiumFeature}
  <PremiumContent />
{/if}
```

## Environment variables

```env
# Server-side only (for SSR)
REPLANE_BASE_URL=https://replane.example.com
REPLANE_SDK_KEY=your-sdk-key

# Client-side (for live updates)
VITE_REPLANE_BASE_URL=https://replane.example.com
VITE_REPLANE_SDK_KEY=your-sdk-key
```

## Best practices

### Create typed stores

```ts
// $lib/replane.ts
import { createTypedConfig } from '@replanejs/svelte';

export const appConfig = createTypedConfig<AppConfigs>();
```

### Use SSR for initial load

Fetch configs on the server to avoid loading states:

```ts
// +layout.server.ts
export async function load() {
  const snapshot = await getReplaneSnapshot({ ... });
  return { replaneSnapshot: snapshot };
}
```

### Handle errors gracefully

```html
<svelte:boundary onerror={(e) => reportError(e)}>
  <ReplaneContext {options}>
    <App />
  </ReplaneContext>

  {#snippet failed(error)}
    <FallbackUI />
  {/snippet}
</svelte:boundary>
```

## Next steps

- [JavaScript SDK](/docs/sdk/javascript) — Core SDK documentation
- [Feature Flags](/docs/guides/feature-flags) — Toggle features
- [Override Rules](/docs/guides/override-rules) — Target specific users
