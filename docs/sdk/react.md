---
title: React SDK
description: Integrate Replane into React applications with hooks and context
---

# React SDK

The official React SDK for Replane. Provides hooks and context for seamless React integration with realtime updates.

## Installation

```bash npm2yarn
npm install @replanejs/react
```

## Requirements

- React 18.0.0 or higher
- Node.js 18.0.0 or higher

## Quick start

```tsx
import { ReplaneProvider, useConfig } from '@replanejs/react';

function App() {
  return (
    <ReplaneProvider
      options={{
        baseUrl: 'https://replane.example.com',
        sdkKey: process.env.REPLANE_SDK_KEY,
      }}
      loader={<div>Loading...</div>}
    >
      <MyComponent />
    </ReplaneProvider>
  );
}

function MyComponent() {
  const isFeatureEnabled = useConfig<boolean>('feature-flag');

  return (
    <div>
      {isFeatureEnabled ? 'Feature is enabled!' : 'Feature is disabled'}
    </div>
  );
}
```

## API Reference

### ReplaneProvider

Provider component that makes the Replane client available to your component tree.

#### Client options

The `options` prop accepts the following options:

| Option               | Type                  | Required | Description                              |
| -------------------- | --------------------- | -------- | ---------------------------------------- |
| `baseUrl`            | `string`              | Yes      | Replane server URL                       |
| `sdkKey`             | `string`              | Yes      | SDK key for authentication               |
| `context`            | `Record<string, any>` | No       | Default context for override evaluations |
| `defaults`           | `Record<string, any>` | No       | Default values if server is unavailable  |
| `connectTimeoutMs`   | `number`              | No       | SDK connection timeout (default: 5000)   |
| `requestTimeoutMs`   | `number`              | No       | Timeout for SSE requests (default: 2000) |
| `retryDelayMs`       | `number`              | No       | Base delay between retries (default: 200)|
| `inactivityTimeoutMs`| `number`              | No       | SSE inactivity timeout (default: 30000)  |
| `fetchFn`            | `typeof fetch`        | No       | Custom fetch implementation              |
| `logger`             | `ReplaneLogger`       | No       | Custom logger (default: console)         |

See the [JavaScript SDK documentation](/docs/sdk/javascript#api-reference) for more details.

#### With options (recommended)

```tsx
import { ErrorBoundary } from 'react-error-boundary';

<ErrorBoundary fallback={<div>Failed to load configuration</div>}>
  <ReplaneProvider
    options={{
      baseUrl: 'https://replane.example.com',
      sdkKey: process.env.REPLANE_SDK_KEY,
    }}
    loader={<LoadingSpinner />}
  >
    <App />
  </ReplaneProvider>
</ErrorBoundary>
```

#### With pre-created client

```tsx
import { Replane } from '@replanejs/sdk';

const client = new Replane();
await client.connect({
  baseUrl: 'https://replane.example.com',
  sdkKey: process.env.REPLANE_SDK_KEY,
});

<ReplaneProvider client={client}>
  <App />
</ReplaneProvider>
```

#### With Suspense

```tsx
<ErrorBoundary fallback={<div>Failed to load configuration</div>}>
  <Suspense fallback={<LoadingSpinner />}>
    <ReplaneProvider
      options={{
        baseUrl: 'https://replane.example.com',
        sdkKey: process.env.REPLANE_SDK_KEY,
      }}
      suspense
    >
      <App />
    </ReplaneProvider>
  </Suspense>
</ErrorBoundary>
```

#### With snapshot (SSR/hydration)

```tsx
// On the server
const serverClient = new Replane();
await serverClient.connect({ baseUrl: '...', sdkKey: '...' });
const snapshot = serverClient.getSnapshot();

// On the client
<ReplaneProvider
  options={{
    baseUrl: 'https://replane.example.com',
    sdkKey: process.env.REPLANE_SDK_KEY,
  }}
  snapshot={snapshot}
>
  <App />
</ReplaneProvider>
```

### useConfig

Hook to retrieve a configuration value. Automatically subscribes to updates and re-renders when the value changes.

```tsx
function MyComponent() {
  // Basic usage
  const theme = useConfig<string>('theme');

  // With evaluation context
  const discount = useConfig<number>('discount-percentage', {
    context: {
      userId: '123',
      isPremium: true,
    },
  });

  return <div>Theme: {theme}, Discount: {discount}%</div>;
}
```

### useReplane

Hook to access the underlying Replane client directly.

```tsx
function MyComponent() {
  const replane = useReplane();

  const handleClick = () => {
    const value = replane.get('some-config');
    console.log(value);
  };

  return <button onClick={handleClick}>Get Config</button>;
}
```

### createConfigHook

Factory function to create a typed version of `useConfig` with autocomplete for config names.

```tsx
import { createConfigHook } from '@replanejs/react';

interface AppConfigs {
  theme: { darkMode: boolean; primaryColor: string };
  features: { beta: boolean; analytics: boolean };
  maxItems: number;
}

const useAppConfig = createConfigHook<AppConfigs>();

function MyComponent() {
  // Autocomplete for config names, automatic type inference
  const theme = useAppConfig('theme');
  //    ^? { darkMode: boolean; primaryColor: string }

  const maxItems = useAppConfig('maxItems');
  //    ^? number

  return (
    <div style={{ color: theme.primaryColor }}>
      Max items: {maxItems}
    </div>
  );
}
```

### createReplaneHook

Factory function to create a typed version of `useReplane`.

```tsx
import { createReplaneHook } from '@replanejs/react';

const useAppReplane = createReplaneHook<AppConfigs>();

function MyComponent() {
  const replane = useAppReplane();
  const theme = replane.get('theme'); // Fully typed

  return <div>Dark mode: {theme.darkMode ? 'on' : 'off'}</div>;
}
```

## Type safety

Define your config types for full TypeScript support:

```tsx
interface AppConfigs {
  'theme-config': {
    darkMode: boolean;
    primaryColor: string;
  };
  'feature-flags': {
    newUI: boolean;
    beta: boolean;
  };
  'max-items': number;
}

const useAppConfig = createConfigHook<AppConfigs>();
const useAppReplane = createReplaneHook<AppConfigs>();

function Settings() {
  const theme = useAppConfig('theme-config');
  //    ^? { darkMode: boolean; primaryColor: string }

  return (
    <div style={{ color: theme.primaryColor }}>
      Dark mode: {theme.darkMode ? 'enabled' : 'disabled'}
    </div>
  );
}
```

## Context and overrides

Pass context for override evaluation:

```tsx
function UserFeature({ userId, plan }: { userId: string; plan: string }) {
  const premiumFeature = useConfig<boolean>('premium-feature', {
    context: { userId, plan },
  });

  if (!premiumFeature) return null;

  return <PremiumContent />;
}
```

## Error handling

Use React Error Boundaries to handle initialization errors:

```tsx
import { ErrorBoundary } from 'react-error-boundary';
import { clearSuspenseCache } from '@replanejs/react';

<ErrorBoundary
  fallbackRender={({ error, resetErrorBoundary }) => (
    <div>
      <p>Error: {error.message}</p>
      <button onClick={resetErrorBoundary}>Retry</button>
    </div>
  )}
  onReset={() => clearSuspenseCache()}
>
  <ReplaneProvider options={options} loader={<Loading />}>
    <App />
  </ReplaneProvider>
</ErrorBoundary>
```

## Best practices

### Create typed hooks once

```tsx
// lib/replane.ts
import { createConfigHook, createReplaneHook } from '@replanejs/react';
import type { AppConfigs } from './types';

export const useAppConfig = createConfigHook<AppConfigs>();
export const useAppReplane = createReplaneHook<AppConfigs>();

// components/Feature.tsx
import { useAppConfig } from '@/lib/replane';

function Feature() {
  const flags = useAppConfig('feature-flags');
  // ...
}
```

### Wrap app at the root

```tsx
// App.tsx
import { ReplaneProvider } from '@replanejs/react';

function App() {
  return (
    <ReplaneProvider options={options} loader={<Splash />}>
      <Router />
    </ReplaneProvider>
  );
}
```

## Next steps

- [Next.js SDK](/docs/sdk/nextjs) — Server-side rendering support
- [Feature Flags](/docs/guides/feature-flags) — Toggle features
- [Override Rules](/docs/guides/override-rules) — Target specific users
