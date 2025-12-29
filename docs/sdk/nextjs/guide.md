---
title: Guide
description: Next.js SDK configuration, testing, and best practices
sidebar_label: Guide
---

# Guide

Configuration, testing, and best practices for the Next.js SDK.

## Typed hooks (Recommended)

For better type safety, create typed hooks:

```ts
// lib/replane/types.ts
export interface AppConfigs {
  theme: {
    darkMode: boolean
    primaryColor: string
  }
  features: {
    betaEnabled: boolean
    maxItems: number
  }
}
```

```ts
// lib/replane/hooks.ts
import { createConfigHook, createReplaneHook } from '@replanejs/next'
import type { AppConfigs } from './types'

export const useAppConfig = createConfigHook<AppConfigs>()
export const useAppReplane = createReplaneHook<AppConfigs>()
```

```tsx
// components/ConfigDisplay.tsx
'use client'

import { useAppConfig } from '@/lib/replane/hooks'

export function ConfigDisplay() {
  const theme = useAppConfig('theme')
  // theme.darkMode is boolean, theme.primaryColor is string

  return <div style={{ color: theme.primaryColor }}>...</div>
}
```

## Context and overrides

Pass context for override evaluation:

```tsx
'use client'

import { useConfig } from '@replanejs/next'

function PremiumFeature({ userId, plan }) {
  const enabled = useConfig<boolean>('premium-feature', {
    context: { userId, plan }
  })

  if (!enabled) return null
  return <PremiumContent />
}
```

## Best practices

### Use App Router when possible

App Router provides better DX with `ReplaneRoot`:

```tsx
// app/layout.tsx
export default async function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ReplaneRoot connection={connection}>{children}</ReplaneRoot>
      </body>
    </html>
  )
}
```

### Create typed hooks

```ts
// lib/replane.ts
export const useAppConfig = createConfigHook<AppConfigs>()
export const useAppReplane = createReplaneHook<AppConfigs>()
```

### Use environment variables correctly

```tsx
// For ReplaneRoot (server component)
connection={{
  baseUrl: process.env.NEXT_PUBLIC_REPLANE_BASE_URL!,
  sdkKey: process.env.NEXT_PUBLIC_REPLANE_SDK_KEY!
}}

// For getReplaneSnapshot (server-side)
connection: {
  baseUrl: process.env.REPLANE_BASE_URL!,  // No NEXT_PUBLIC_ needed
  sdkKey: process.env.REPLANE_SDK_KEY!
}
```

### Handle errors gracefully

```tsx
// app/layout.tsx
import { ErrorBoundary } from 'react-error-boundary'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ErrorBoundary fallback={<FallbackUI />}>
          <ReplaneRoot connection={connection}>
            {children}
          </ReplaneRoot>
        </ErrorBoundary>
      </body>
    </html>
  )
}
```

