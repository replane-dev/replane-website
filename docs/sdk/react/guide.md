---
title: React SDK Guide
description: Learn how to configure the Replane React SDK with TypeScript support, context-based overrides, error boundaries, loading states, and best practices for React apps.
sidebar_label: Guide
---

# React SDK Guide

Configuration, testing, and best practices for the React SDK.

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
  <ReplaneProvider connection={connection} loader={<Loading />}>
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
    <ReplaneProvider connection={connection} loader={<Splash />}>
      <Router />
    </ReplaneProvider>
  );
}
```

### Use defaults for resilience

```tsx
<ReplaneProvider
  connection={connection}
  defaults={{
    'feature-flag': false,
    'max-items': 100
  }}
>
  <App />
</ReplaneProvider>
```

### Handle loading states

```tsx
// Option 1: Use loader prop
<ReplaneProvider connection={connection} loader={<Skeleton />}>
  <App />
</ReplaneProvider>

// Option 2: Use Suspense
<Suspense fallback={<Skeleton />}>
  <ReplaneProvider connection={connection} suspense>
    <App />
  </ReplaneProvider>
</Suspense>

// Option 3: Async mode (renders immediately with defaults)
<ReplaneProvider connection={connection} defaults={defaults} async>
  <App />
</ReplaneProvider>
```

