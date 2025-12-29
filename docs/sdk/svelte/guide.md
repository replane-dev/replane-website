---
title: Guide
description: Svelte SDK configuration, SvelteKit SSR, and best practices
sidebar_label: Guide
---

# Guide

Configuration, SvelteKit SSR, and best practices for the Svelte SDK.

## Typed stores

For better type safety, create typed store functions:

```ts
// $lib/replane/index.ts
import { createTypedConfig, createTypedReplane } from '@replanejs/svelte'

interface AppConfigs {
  theme: { darkMode: boolean; primaryColor: string }
  features: { betaEnabled: boolean }
}

export const appConfig = createTypedConfig<AppConfigs>()
export const getAppReplane = createTypedReplane<AppConfigs>()
```

```svelte
<script lang="ts">
  import { appConfig } from '$lib/replane'

  // Config names autocomplete, values are fully typed
  const theme = appConfig('theme')
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
import { getReplaneSnapshot } from '@replanejs/svelte'

export async function load() {
  const snapshot = await getReplaneSnapshot({
    connection: {
      baseUrl: import.meta.env.REPLANE_BASE_URL,
      sdkKey: import.meta.env.REPLANE_SDK_KEY
    }
  })

  return { replaneSnapshot: snapshot }
}
```

```svelte
<!-- src/routes/+layout.svelte -->
<script lang="ts">
  import { ReplaneContext } from '@replanejs/svelte'

  let { data, children } = $props()

  const connection = {
    baseUrl: import.meta.env.VITE_REPLANE_BASE_URL,
    sdkKey: import.meta.env.VITE_REPLANE_SDK_KEY
  }
</script>

<ReplaneContext {connection} snapshot={data.replaneSnapshot}>
  {@render children()}
</ReplaneContext>
```

## Realtime updates

All stores automatically subscribe to realtime updates via SSE. When a config changes on the server, the store updates automatically.

```svelte
<script>
  import { config } from '@replanejs/svelte'

  const maintenanceMode = config<boolean>('maintenance-mode')
</script>

<!-- Automatically updates when config changes -->
{#if $maintenanceMode}
  <MaintenanceBanner />
{/if}
```

## Context and overrides

Pass evaluation context for override rules:

```svelte
<script>
  import { config } from '@replanejs/svelte'

  const premiumFeature = config<boolean>('premium-feature', {
    context: {
      userId: 'user-123',
      plan: 'premium'
    }
  })
</script>

{#if $premiumFeature}
  <PremiumContent />
{/if}
```

## Best practices

### Create typed stores

```ts
// $lib/replane.ts
import { createTypedConfig } from '@replanejs/svelte'

export const appConfig = createTypedConfig<AppConfigs>()
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

```svelte
<svelte:boundary onerror={(e) => reportError(e)}>
  <ReplaneContext {connection}>
    <App />
  </ReplaneContext>

  {#snippet failed(error)}
    <FallbackUI />
  {/snippet}
</svelte:boundary>
```

### Use async mode for faster initial render

```svelte
<ReplaneContext {connection} {defaults} async>
  <App />
</ReplaneContext>
```

