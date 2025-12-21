---
sidebar_position: 4
title: Next.js SDK
description: Integrate Replane into Next.js with SSR/SSG support
---

# Next.js SDK

The official Next.js SDK for Replane. Supports both App Router and Pages Router with server-side rendering.

## Installation

```bash npm2yarn
npm install @replanejs/next
```

## Quick start

### App Router (Recommended)

**1. Set up ReplaneRoot in your layout:**

```tsx
// app/layout.tsx
import { ReplaneRoot } from '@replanejs/next';

interface AppConfigs {
  theme: { darkMode: boolean; primaryColor: string };
  features: { betaEnabled: boolean };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ReplaneRoot<AppConfigs>
          options={{
            baseUrl: process.env.NEXT_PUBLIC_REPLANE_BASE_URL!,
            sdkKey: process.env.NEXT_PUBLIC_REPLANE_SDK_KEY!,
          }}
        >
          {children}
        </ReplaneRoot>
      </body>
    </html>
  );
}
```

**2. Use configs in client components:**

```tsx
// components/ThemeToggle.tsx
'use client';

import { useConfig } from '@replanejs/next';

export function ThemeToggle() {
  const theme = useConfig<{ darkMode: boolean }>('theme');
  return <div>{theme.darkMode ? 'Dark Mode' : 'Light Mode'}</div>;
}
```

### Pages Router

**1. Set up ReplaneProvider in _app.tsx:**

```tsx
// pages/_app.tsx
import type { AppContext, AppProps } from 'next/app';
import App from 'next/app';
import { ReplaneProvider, getReplaneSnapshot, type ReplaneSnapshot } from '@replanejs/next';

interface AppConfigs {
  theme: { darkMode: boolean; primaryColor: string };
  features: { betaEnabled: boolean };
}

interface AppPropsWithReplane extends AppProps {
  replaneSnapshot: ReplaneSnapshot<AppConfigs>;
}

export default function MyApp({ Component, pageProps, replaneSnapshot }: AppPropsWithReplane) {
  return (
    <ReplaneProvider
      snapshot={replaneSnapshot}
      options={{
        baseUrl: process.env.NEXT_PUBLIC_REPLANE_BASE_URL!,
        sdkKey: process.env.NEXT_PUBLIC_REPLANE_SDK_KEY!,
      }}
    >
      <Component {...pageProps} />
    </ReplaneProvider>
  );
}

MyApp.getInitialProps = async (appContext: AppContext) => {
  const appProps = await App.getInitialProps(appContext);

  const replaneSnapshot = await getReplaneSnapshot<AppConfigs>({
    baseUrl: process.env.REPLANE_BASE_URL!,
    sdkKey: process.env.REPLANE_SDK_KEY!,
  });

  return { ...appProps, replaneSnapshot };
};
```

**2. Use configs in components:**

```tsx
// components/FeatureFlag.tsx
import { useConfig } from '@replanejs/next';

export function FeatureFlag() {
  const features = useConfig<{ betaEnabled: boolean }>('features');
  return features.betaEnabled ? <BetaFeature /> : null;
}
```

## API Reference

### Components

#### ReplaneRoot

Server component for App Router. Fetches configs on the server and provides them to the app.

```tsx
<ReplaneRoot<AppConfigs>
  options={{
    baseUrl: string;
    sdkKey: string;
  }}
>
  {children}
</ReplaneRoot>
```

#### ReplaneProvider

Client-side provider for Pages Router or custom setups.

```tsx
<ReplaneProvider
  snapshot={replaneSnapshot}
  options={{
    baseUrl: string;
    sdkKey: string;
  }}
>
  {children}
</ReplaneProvider>
```

### Hooks

#### useConfig

Returns the value of a config. Re-renders when the config changes.

```tsx
const theme = useConfig<{ darkMode: boolean }>('theme');
```

#### useReplane

Returns the Replane client instance.

```tsx
const client = useReplane<AppConfigs>();
const snapshot = client.getSnapshot();
const theme = client.get('theme');
```

#### createConfigHook

Creates a typed version of `useConfig`.

```tsx
const useAppConfig = createConfigHook<AppConfigs>();
const theme = useAppConfig('theme'); // Fully typed
```

#### createReplaneHook

Creates a typed version of `useReplane`.

```tsx
const useAppReplane = createReplaneHook<AppConfigs>();
const client = useAppReplane();
```

### Functions

#### getReplaneSnapshot

Fetches a snapshot of all configs. Use in `getServerSideProps`, `getStaticProps`, or `getInitialProps`.

```tsx
const snapshot = await getReplaneSnapshot<AppConfigs>({
  baseUrl: process.env.REPLANE_BASE_URL!,
  sdkKey: process.env.REPLANE_SDK_KEY!,
  cacheTtlMs: 60_000, // optional, default 60 seconds
});
```

#### clearSnapshotCache

Clears the internal client cache.

```tsx
await clearSnapshotCache();
```

## Typed hooks (Recommended)

For better type safety, create typed hooks:

```ts
// lib/replane/types.ts
export interface AppConfigs {
  theme: {
    darkMode: boolean;
    primaryColor: string;
  };
  features: {
    betaEnabled: boolean;
    maxItems: number;
  };
}
```

```ts
// lib/replane/hooks.ts
import { createConfigHook, createReplaneHook } from '@replanejs/next';
import type { AppConfigs } from './types';

export const useAppConfig = createConfigHook<AppConfigs>();
export const useAppReplane = createReplaneHook<AppConfigs>();
```

```tsx
// components/ConfigDisplay.tsx
'use client';

import { useAppConfig } from '@/lib/replane/hooks';

export function ConfigDisplay() {
  const theme = useAppConfig('theme');
  // theme.darkMode is boolean, theme.primaryColor is string

  return <div style={{ color: theme.primaryColor }}>...</div>;
}
```

## Environment variables

```env
# Server-side only (for SSR/SSG)
REPLANE_BASE_URL=https://replane.example.com
REPLANE_SDK_KEY=your-sdk-key

# Client-side (for live updates)
NEXT_PUBLIC_REPLANE_BASE_URL=https://replane.example.com
NEXT_PUBLIC_REPLANE_SDK_KEY=your-sdk-key
```

## How SSR works

1. **Server**: `ReplaneRoot` or `getReplaneSnapshot` fetches configs
2. **Server**: Configs are serialized and sent to the client
3. **Client**: Provider hydrates with server data (no loading state)
4. **Client**: SSE connection opens for realtime updates

This ensures:
- No layout shift on initial load
- Configs available during server rendering
- Live updates after hydration

## Best practices

### Use App Router when possible

App Router provides better DX with `ReplaneRoot`:

```tsx
// app/layout.tsx
export default async function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ReplaneRoot options={options}>
          {children}
        </ReplaneRoot>
      </body>
    </html>
  );
}
```

### Create typed hooks

```ts
// lib/replane.ts
export const useAppConfig = createConfigHook<AppConfigs>();
export const useAppReplane = createReplaneHook<AppConfigs>();
```

### Keep SDK keys secure

Use server-only env vars for SSR fetching:

```env
# Server-side only
REPLANE_SDK_KEY=sk_live_xxx

# Client-side (can be exposed)
NEXT_PUBLIC_REPLANE_SDK_KEY=sk_live_xxx
```

## Next steps

- [React SDK](/docs/sdk/react) — Core React integration
- [Feature Flags](/docs/guides/feature-flags) — Toggle features
- [Gradual Rollouts](/docs/guides/gradual-rollouts) — Percentage-based releases
