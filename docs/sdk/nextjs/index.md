---
title: Next.js SDK
description: Integrate Replane into Next.js with App Router and Pages Router support. Features ReplaneRoot for server components, SSR hydration, and getReplaneSnapshot for SSG.
sidebar_label: Overview
slug: /sdk/nextjs
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
import { ReplaneRoot } from '@replanejs/next'

interface AppConfigs {
  theme: { darkMode: boolean; primaryColor: string }
  features: { betaEnabled: boolean }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body>
        <ReplaneRoot<AppConfigs>
          connection={{
            baseUrl: process.env.NEXT_PUBLIC_REPLANE_BASE_URL!,
            sdkKey: process.env.NEXT_PUBLIC_REPLANE_SDK_KEY!
          }}
        >
          {children}
        </ReplaneRoot>
      </body>
    </html>
  )
}
```

**2. Use configs in client components:**

```tsx
// components/ThemeToggle.tsx
'use client'

import { useConfig } from '@replanejs/next'

export function ThemeToggle() {
  const theme = useConfig<{ darkMode: boolean }>('theme')
  return <div>{theme.darkMode ? 'Dark Mode' : 'Light Mode'}</div>
}
```

### Pages Router

**1. Set up ReplaneProvider in \_app.tsx:**

```tsx
// pages/_app.tsx
import type { AppContext, AppProps } from 'next/app'
import App from 'next/app'
import { ReplaneProvider, getReplaneSnapshot, type ReplaneSnapshot } from '@replanejs/next'

interface AppConfigs {
  theme: { darkMode: boolean; primaryColor: string }
  features: { betaEnabled: boolean }
}

interface AppPropsWithReplane extends AppProps {
  replaneSnapshot: ReplaneSnapshot<AppConfigs>
}

export default function MyApp({ Component, pageProps, replaneSnapshot }: AppPropsWithReplane) {
  return (
    <ReplaneProvider
      snapshot={replaneSnapshot}
      connection={{
        baseUrl: process.env.NEXT_PUBLIC_REPLANE_BASE_URL!,
        sdkKey: process.env.NEXT_PUBLIC_REPLANE_SDK_KEY!
      }}
    >
      <Component {...pageProps} />
    </ReplaneProvider>
  )
}

MyApp.getInitialProps = async (appContext: AppContext) => {
  const appProps = await App.getInitialProps(appContext)

  const replaneSnapshot = await getReplaneSnapshot<AppConfigs>({
    connection: {
      baseUrl: process.env.REPLANE_BASE_URL!,
      sdkKey: process.env.REPLANE_SDK_KEY!
    }
  })

  return { ...appProps, replaneSnapshot }
}
```

**2. Use configs in components:**

```tsx
// components/FeatureFlag.tsx
import { useConfig } from '@replanejs/next'

export function FeatureFlag() {
  const features = useConfig<{ betaEnabled: boolean }>('features')
  return features.betaEnabled ? <BetaFeature /> : null
}
```

## Features

- **App Router support** — Server components with `ReplaneRoot`
- **Pages Router support** — `getInitialProps` and `getServerSideProps`
- **SSR hydration** — No layout shift on initial load
- **Real-time updates** — Live updates after hydration
- **Type-safe** — Full TypeScript support

## How SSR works

1. **Server**: `ReplaneRoot` or `getReplaneSnapshot` fetches configs
2. **Server**: Configs are serialized and sent to the client
3. **Client**: Provider hydrates with server data (no loading state)
4. **Client**: SSE connection opens for realtime updates

This ensures:

- No layout shift on initial load
- Configs available during server rendering
- Live updates after hydration

## Next steps

- [API Reference](/docs/sdk/nextjs/api) — Full API documentation
- [Guide](/docs/sdk/nextjs/guide) — Typed hooks, best practices
- [React SDK](/docs/sdk/react) — Core React integration
- [Feature Flags](/docs/guides/feature-flags) — Toggle features

