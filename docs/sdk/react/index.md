---
title: React SDK
description: Integrate Replane into React applications with hooks and context. Features useConfig hook, ReplaneProvider, Suspense support, SSR hydration, and automatic re-renders.
sidebar_label: Overview
slug: /sdk/react
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
      connection={{
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

## Features

- **React hooks** — `useConfig` and `useReplane` for easy access
- **Automatic re-renders** — Components update when configs change
- **Suspense support** — Optional React Suspense integration
- **SSR ready** — Snapshot hydration for server-side rendering
- **Type-safe** — Full TypeScript support with typed hooks

## Next steps

- [API Reference](/docs/sdk/react/api) — Full API documentation
- [Guide](/docs/sdk/react/guide) — Type safety, error handling, best practices
- [Next.js SDK](/docs/sdk/nextjs) — Server-side rendering support
- [Feature Flags](/docs/guides/feature-flags) — Toggle features

