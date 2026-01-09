---
slug: dynamic-configuration-react
title: 'Dynamic Configuration in React: Real-Time Feature Flags Without Prop Drilling'
authors: dmitry
tags: [react, config-management, feature-flags, best-practices]
description: Learn how to implement dynamic configuration in React with real-time updates, targeted rollouts, and zero prop drilling. Includes TypeScript support and SSR handling.
---

import TryReplaneCTA from '@site/src/components/TryReplaneCTA'

Feature flags in React typically follow one of three patterns: environment variables baked in at build time, props drilled through component trees, or third-party SDKs with their own opinions about state management. Each approach has friction—build-time flags can't change without deploys, prop drilling creates coupling, and vendor SDKs add cost and lock-in.

This guide covers a different approach: treating configuration as external state that React components subscribe to, with real-time updates and automatic re-renders when values change.

<!-- truncate -->

## The Prop Drilling Problem

Consider a feature flag that needs to reach a deeply nested component:

```tsx
function App() {
  const [flags, setFlags] = useState<Flags | null>(null)

  useEffect(() => {
    fetch('/api/flags')
      .then((r) => r.json())
      .then(setFlags)
  }, [])

  if (!flags) return <Loading />

  return (
    <Layout flags={flags}>
      <Dashboard flags={flags}>
        <Sidebar flags={flags}>
          <CheckoutButton newCheckoutEnabled={flags.newCheckout} />
        </Sidebar>
      </Dashboard>
    </Layout>
  )
}
```

Three components (`Layout`, `Dashboard`, `Sidebar`) receive props they don't use—they're just passing flags to their children. This creates coupling: changing the flag interface affects all intermediate components.

Context solves the prop drilling but creates a different problem: updating any value in the context triggers re-renders for all consumers. Toggle one boolean, and every component consuming the context re-renders.

## The Subscription Model

A better approach treats configuration as external state, similar to Redux or TanStack Query. Components subscribe to specific configuration keys, not the entire store. When a key changes, only components subscribed to that key re-render.

```tsx
function CheckoutButton() {
  // Only re-renders when 'new-checkout' changes
  const isNewCheckout = useConfig<boolean>('new-checkout')

  return isNewCheckout ? <NewCheckoutButton /> : <LegacyCheckoutButton />
}
```

This pattern requires three pieces:

1. A provider that establishes a connection to the config server
2. A local cache that holds config values
3. Hooks that subscribe to specific keys using React's `useSyncExternalStore`

## Setting Up the Provider

The provider wraps your application and manages the connection:

```tsx
import { ReplaneProvider } from '@replanejs/react'

function App() {
  return (
    <ReplaneProvider
      connection={{
        baseUrl: 'https://cloud.replane.dev',
        sdkKey: process.env.REACT_APP_REPLANE_KEY!
      }}
      defaults={{
        'new-checkout': false,
        'api-rate-limit': 100
      }}
      loader={<AppSkeleton />}
    >
      <Router />
    </ReplaneProvider>
  )
}
```

The `connection` object specifies how to reach the config server. The connection uses Server-Sent Events (SSE) for real-time updates—when you change a value on the server, all connected clients receive the update within milliseconds.

The `defaults` object provides fallback values. These are used immediately on mount (before the connection is established) and if the config server becomes unreachable. Your application should function with defaults alone.

## Reading Configuration Values

The `useConfig` hook retrieves values and subscribes to updates:

```tsx
import { useConfig } from '@replanejs/react'

function Checkout() {
  const isNewCheckout = useConfig<boolean>('new-checkout')
  const maxItems = useConfig<number>('cart-max-items')
  const bannerText = useConfig<string | null>('promo-banner')

  return (
    <div>
      {bannerText && <Banner>{bannerText}</Banner>}
      <Cart maxItems={maxItems} />
      {isNewCheckout ? <NewCheckout /> : <LegacyCheckout />}
    </div>
  )
}
```

Each call to `useConfig` creates a subscription. When `new-checkout` changes on the server, the `Checkout` component re-renders. Components that don't use `new-checkout` are unaffected.

## Context-Aware Configuration

Static key-value pairs are useful, but real applications often need different values for different users. Override rules solve this—you define rules on the server, and the SDK evaluates them based on context you provide.

```tsx
function Dashboard() {
  const { user } = useAuth()

  const rateLimit = useConfig<number>('api-rate-limit', {
    context: {
      userId: user.id,
      plan: user.subscription,
      country: user.country
    }
  })

  // rateLimit is evaluated based on the context
  // Premium users might get 10000, free users get 100
}
```

Override rules are defined in the Replane dashboard:

| Condition                  | Value |
| -------------------------- | ----- |
| If `plan` equals `premium` | 10000 |
| If `plan` equals `pro`     | 5000  |
| If `country` equals `DE`   | 500   |
| Default                    | 100   |

The evaluation happens locally in the SDK—no network round-trip per request. When rules change on the server, the SDK receives the update and re-evaluates.

This approach moves conditional logic out of code. Adding a new tier or region is a config change, not a code change.

## Type Safety with Factory Hooks

The generic `useConfig<T>('key')` pattern works but doesn't prevent typos in key names or mismatched types. Factory hooks provide full TypeScript integration:

```tsx
// config.ts
import { createConfigHook, createReplaneHook } from '@replanejs/react'

interface AppConfigs {
  'new-checkout': boolean
  'promo-banner': string | null
  'api-rate-limit': number
  'pricing-tiers': {
    free: { requests: number; features: string[] }
    pro: { requests: number; features: string[] }
  }
}

export const useAppConfig = createConfigHook<AppConfigs>()
export const useAppReplane = createReplaneHook<AppConfigs>()
```

```tsx
// Checkout.tsx
import { useAppConfig } from './config'

function Checkout() {
  // Autocomplete for config names
  const isNewCheckout = useAppConfig('new-checkout')
  //    ^? boolean

  const pricing = useAppConfig('pricing-tiers')
  //    ^? { free: { requests: number; features: string[] }; ... }

  // TypeScript error: Argument of type '"typo"' is not assignable
  const bad = useAppConfig('typo')
}
```

Define the interface once, get type safety everywhere.

## Loading Strategies

When the app starts, config needs to load before config-dependent UI can render. Three strategies address this:

### Blocking Loader

Show a loading state until config arrives:

```tsx
<ReplaneProvider connection={connection} loader={<FullPageSpinner />}>
  <App />
</ReplaneProvider>
```

The `loader` renders until the connection is established and initial config is received. Simple but blocks the entire app.

### Suspense Integration

Use React's Suspense for loading states:

```tsx
<Suspense fallback={<FullPageSpinner />}>
  <ReplaneProvider connection={connection} suspense>
    <App />
  </ReplaneProvider>
</Suspense>
```

The provider throws a promise during loading, which Suspense catches. This integrates with other data-fetching patterns that use Suspense.

### Async Mode

Render immediately with defaults, update when real values arrive:

```tsx
<ReplaneProvider
  connection={connection}
  defaults={{
    'new-checkout': false,
    'api-rate-limit': 100
  }}
  async
>
  <App />
</ReplaneProvider>
```

No loading state—the app renders immediately with defaults. When the connection establishes, values update and components re-render. This is appropriate when instant render matters more than avoiding value flicker.

## Server-Side Rendering

SSR requires special handling. You can't establish SSE connections during server rendering, and you need to hydrate the client with the server's config state.

The solution is snapshots:

```tsx
// On the server
import { Replane } from '@replanejs/react'

export async function getServerSideProps() {
  const replane = new Replane()
  await replane.connect({
    baseUrl: process.env.REPLANE_URL!,
    sdkKey: process.env.REPLANE_SDK_KEY!
  })

  const snapshot = replane.getSnapshot()

  return {
    props: { replaneSnapshot: snapshot }
  }
}
```

```tsx
// On the client
function App({ replaneSnapshot }) {
  return (
    <ReplaneProvider
      connection={{
        baseUrl: process.env.NEXT_PUBLIC_REPLANE_URL!,
        sdkKey: process.env.NEXT_PUBLIC_REPLANE_SDK_KEY!
      }}
      snapshot={replaneSnapshot}
    >
      <Main />
    </ReplaneProvider>
  )
}
```

The client hydrates instantly from the snapshot—no loading state. Then it establishes an SSE connection for real-time updates going forward.

## Error Handling

Connection failures throw errors during rendering. Use Error Boundaries to catch them:

```tsx
import { ErrorBoundary } from 'react-error-boundary'
import { clearSuspenseCache } from '@replanejs/react'

function ConfigErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div>
      <p>Failed to load configuration: {error.message}</p>
      <button onClick={resetErrorBoundary}>Retry</button>
    </div>
  )
}

;<ErrorBoundary FallbackComponent={ConfigErrorFallback} onReset={() => clearSuspenseCache()}>
  <ReplaneProvider connection={connection} loader={<Loading />}>
    <App />
  </ReplaneProvider>
</ErrorBoundary>
```

The `clearSuspenseCache()` call ensures a fresh connection attempt on retry.

## Common Patterns

### Stable Context References

When passing context to `useConfig`, ensure the object reference is stable:

```tsx
function Dashboard() {
  const { user } = useAuth()

  // Bad: creates new object every render
  const rateLimit = useConfig('limit', { context: { userId: user.id } })

  // Good: stable reference
  const context = useMemo(() => ({ userId: user.id }), [user.id])
  const rateLimit = useConfig('limit', { context })
}
```

Unstable context references can cause unnecessary re-renders and break memoization.

### Accessing the Client Directly

For imperative access (outside the React lifecycle), use `useReplane`:

```tsx
function ExportButton() {
  const replane = useReplane()

  const handleExport = () => {
    const config = replane.get('export-settings')
    exportData(config)
  }

  return <button onClick={handleExport}>Export</button>
}
```

### Conditional Provider

You might want to skip config loading in certain contexts (tests, error pages):

```tsx
<ReplaneProvider connection={shouldLoadConfig ? connection : null} defaults={defaults}>
  <App />
</ReplaneProvider>
```

Passing `null` for `connection` uses defaults only—no connection attempt.

## When to Use Dynamic Configuration

Use dynamic configuration for values that need to change faster than you can deploy:

| Use Case               | Example                  | Why Dynamic                        |
| ---------------------- | ------------------------ | ---------------------------------- |
| Feature flags          | `new-checkout`           | Gradual rollouts, instant rollback |
| Rate limits            | `api-rate-limit`         | Respond to traffic patterns        |
| Kill switches          | `payments-enabled`       | Disable broken features instantly  |
| A/B variants           | `checkout-button-text`   | Test without deploys               |
| User-specific settings | Per-tenant configuration | No code changes for new customers  |

Keep as static configuration:

- API endpoints and URLs
- Build-time feature detection
- Values that require code changes anyway

## Getting Started

Install the React SDK:

```bash
npm install @replanejs/react
```

Set up the provider and start using hooks:

```tsx
import { ReplaneProvider, useConfig } from '@replanejs/react'

function App() {
  return (
    <ReplaneProvider
      connection={{
        baseUrl: 'https://cloud.replane.dev',
        sdkKey: 'your-sdk-key'
      }}
      defaults={{ 'feature-enabled': false }}
      loader={<div>Loading...</div>}
    >
      <Main />
    </ReplaneProvider>
  )
}

function Main() {
  const isEnabled = useConfig<boolean>('feature-enabled')
  return <div>Feature is {isEnabled ? 'on' : 'off'}</div>
}
```

<TryReplaneCTA
description="Replane's React SDK provides real-time configuration with automatic re-renders, TypeScript support, and SSR compatibility. Changes propagate in under 100ms."
links={['cloud', 'quickstart', 'sdk']}
/>
