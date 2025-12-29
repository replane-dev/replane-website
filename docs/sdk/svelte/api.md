---
title: API Reference
description: Svelte SDK API documentation
sidebar_label: API Reference
---

# API Reference

Complete API documentation for the Svelte SDK.

## Provider Props

| Prop         | Type                        | Required | Description                                             |
| ------------ | --------------------------- | -------- | ------------------------------------------------------- |
| `client`     | `Replane`                   | No       | Pre-created client (alternative to connection)          |
| `connection` | `ConnectOptions \| null`    | Yes*     | Connection options (see below), or `null` to skip connection |
| `defaults`   | `Record<string, unknown>`   | No       | Default values if server is unavailable                 |
| `context`    | `Record<string, unknown>`   | No       | Default context for override evaluations                |
| `snapshot`   | `ReplaneSnapshot`           | No       | Snapshot for SSR hydration                              |
| `logger`     | `ReplaneLogger`             | No       | Custom logger (default: console)                        |
| `loader`     | `Snippet`                   | No       | Snippet to show while loading                           |
| `async`      | `boolean`                   | No       | Connect asynchronously (renders immediately with defaults) |

*Required when not using the `client` prop. Pass `null` to explicitly skip connection.

## Connection Options

| Option                | Type                  | Required | Description                              |
| --------------------- | --------------------- | -------- | ---------------------------------------- |
| `baseUrl`             | `string`              | Yes      | Replane server URL                       |
| `sdkKey`              | `string`              | Yes      | SDK key for authentication               |
| `connectTimeoutMs`    | `number`              | No       | SDK connection timeout (default: 5000)   |
| `requestTimeoutMs`    | `number`              | No       | Timeout for SSE requests (default: 2000) |
| `retryDelayMs`        | `number`              | No       | Base delay between retries (default: 200)|
| `inactivityTimeoutMs` | `number`              | No       | SSE inactivity timeout (default: 30000)  |
| `fetchFn`             | `typeof fetch`        | No       | Custom fetch implementation              |

See the [JavaScript SDK documentation](/docs/sdk/javascript/api) for more details.

## config

Creates a reactive store for a config value. Similar to `readable()` or `derived()`.

```svelte
<script>
  import { config } from '@replanejs/svelte'

  // Returns a Svelte readable store
  const featureEnabled = config<boolean>('featureEnabled')

  // With evaluation context
  const greeting = config<string>('greeting', {
    context: { userId: '123', isPremium: true }
  })
</script>

{#if $featureEnabled}
  <p>{$greeting}</p>
{/if}
```

## getReplane

Gets the Replane client from context.

```svelte
<script>
  import { getReplane } from '@replanejs/svelte'

  const replane = getReplane()

  function handleClick() {
    const value = replane.get('some-config')
    console.log(value)
  }
</script>

<button onclick={handleClick}>Get Config</button>
```

## configFrom

Creates a reactive store from a client directly (without context). Type-safe with full autocomplete for config names.

```svelte
<script>
  import { configFrom, getReplane } from '@replanejs/svelte'

  const replane = getReplane()

  const featureEnabled = configFrom(replane, 'featureEnabled')
</script>

{#if $featureEnabled}
  <p>Feature is enabled!</p>
{/if}
```

## ReplaneContext

Context component that provides the Replane client to your component tree.

### With a pre-created client

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
  <App />
</ReplaneContext>
```

### With connection (client managed internally)

```svelte
<script>
  import { ReplaneContext } from '@replanejs/svelte'

  const connection = {
    baseUrl: 'https://replane.example.com',
    sdkKey: 'your-sdk-key'
  }
</script>

<svelte:boundary onerror={(e) => console.error(e)}>
  <ReplaneContext {connection}>
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

### With async mode

```svelte
<script>
  import { ReplaneContext } from '@replanejs/svelte'

  const connection = {
    baseUrl: 'https://replane.example.com',
    sdkKey: 'your-sdk-key'
  }

  const defaults = {
    featureEnabled: false
  }
</script>

<ReplaneContext {connection} {defaults} async>
  <App />
</ReplaneContext>
```

## createTypedConfig

Creates a typed version of `config` with autocomplete for config names.

```ts
import { createTypedConfig } from '@replanejs/svelte'

interface AppConfigs {
  theme: { darkMode: boolean; primaryColor: string }
  features: { betaEnabled: boolean }
}

export const appConfig = createTypedConfig<AppConfigs>()
```

## createTypedReplane

Creates a typed version of `getReplane`.

```ts
import { createTypedReplane } from '@replanejs/svelte'

export const getAppReplane = createTypedReplane<AppConfigs>()
```

## getReplaneSnapshot

Fetches a snapshot for SSR. Use in `+layout.server.ts` or `+page.server.ts`.

```ts
import { getReplaneSnapshot } from '@replanejs/svelte'

const snapshot = await getReplaneSnapshot({
  connection: { baseUrl: '...', sdkKey: '...' }
})
```

