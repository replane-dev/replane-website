---
title: React SDK API Reference
description: Complete API documentation for the Replane React SDK including ReplaneProvider, useConfig hook, useReplane hook, and factory functions for typed hooks.
sidebar_label: API Reference
---

# React SDK API Reference

Complete API documentation for the React SDK.

## ReplaneProvider

Provider component that makes the Replane client available to your component tree.

### Props

| Prop         | Type                        | Required | Description                                             |
| ------------ | --------------------------- | -------- | ------------------------------------------------------- |
| `connection` | `ConnectOptions \| null`    | Yes      | Connection options (see below), or `null` to skip connection |
| `defaults`   | `Record<string, unknown>`   | No       | Default values if server is unavailable                 |
| `context`    | `Record<string, unknown>`   | No       | Default context for override evaluations                |
| `snapshot`   | `ReplaneSnapshot`           | No       | Snapshot for SSR hydration                              |
| `logger`     | `ReplaneLogger`             | No       | Custom logger (default: console)                        |
| `loader`     | `ReactNode`                 | No       | Component to show while loading                         |
| `suspense`   | `boolean`                   | No       | Use React Suspense for loading state                    |
| `async`      | `boolean`                   | No       | Connect asynchronously (renders immediately with defaults) |

### Connection options

| Option               | Type                  | Required | Description                              |
| -------------------- | --------------------- | -------- | ---------------------------------------- |
| `baseUrl`            | `string`              | Yes      | Replane server URL                       |
| `sdkKey`             | `string`              | Yes      | SDK key for authentication               |
| `connectTimeoutMs`   | `number`              | No       | SDK connection timeout (default: 5000)   |
| `requestTimeoutMs`   | `number`              | No       | Timeout for SSE requests (default: 2000) |
| `retryDelayMs`       | `number`              | No       | Base delay between retries (default: 200)|
| `inactivityTimeoutMs`| `number`              | No       | SSE inactivity timeout (default: 30000)  |
| `fetchFn`            | `typeof fetch`        | No       | Custom fetch implementation              |

See the [JavaScript SDK documentation](/docs/sdk/javascript/api) for more details.

### With connection (recommended)

```tsx
import { ErrorBoundary } from 'react-error-boundary';

<ErrorBoundary fallback={<div>Failed to load configuration</div>}>
  <ReplaneProvider
    connection={{
      baseUrl: 'https://replane.example.com',
      sdkKey: process.env.REPLANE_SDK_KEY,
    }}
    loader={<LoadingSpinner />}
  >
    <App />
  </ReplaneProvider>
</ErrorBoundary>
```

### With pre-created client

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

### With Suspense

```tsx
<ErrorBoundary fallback={<div>Failed to load configuration</div>}>
  <Suspense fallback={<LoadingSpinner />}>
    <ReplaneProvider
      connection={{
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

### With async mode

Connect in the background while rendering immediately with defaults:

```tsx
<ReplaneProvider
  connection={{
    baseUrl: 'https://replane.example.com',
    sdkKey: process.env.REPLANE_SDK_KEY,
  }}
  defaults={{ featureEnabled: false }}
  async
>
  <App />
</ReplaneProvider>
```

### With snapshot (SSR/hydration)

```tsx
// On the server
const serverClient = new Replane();
await serverClient.connect({ baseUrl: '...', sdkKey: '...' });
const snapshot = serverClient.getSnapshot();

// On the client
<ReplaneProvider
  connection={{
    baseUrl: 'https://replane.example.com',
    sdkKey: process.env.REPLANE_SDK_KEY,
  }}
  snapshot={snapshot}
>
  <App />
</ReplaneProvider>
```

## useConfig

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

## useReplane

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

## createConfigHook

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

## createReplaneHook

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

## clearSuspenseCache

Clears the suspense cache. Useful for retrying after errors.

```tsx
import { clearSuspenseCache } from '@replanejs/react';

<ErrorBoundary
  fallbackRender={({ resetErrorBoundary }) => (
    <button onClick={resetErrorBoundary}>Retry</button>
  )}
  onReset={() => clearSuspenseCache()}
>
  <ReplaneProvider connection={connection} suspense>
    <App />
  </ReplaneProvider>
</ErrorBoundary>
```

