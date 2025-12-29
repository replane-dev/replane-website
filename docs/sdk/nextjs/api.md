---
title: API Reference
description: Next.js SDK API documentation
sidebar_label: API Reference
---

# API Reference

Complete API documentation for the Next.js SDK.

## Provider Props

| Prop         | Type                        | Required | Description                                             |
| ------------ | --------------------------- | -------- | ------------------------------------------------------- |
| `connection` | `ConnectOptions \| null`    | Yes      | Connection options (see below), or `null` to skip connection |
| `defaults`   | `Record<string, unknown>`   | No       | Default values if server is unavailable                 |
| `context`    | `Record<string, unknown>`   | No       | Default context for override evaluations                |
| `snapshot`   | `ReplaneSnapshot`           | No       | Snapshot for SSR hydration                              |
| `logger`     | `ReplaneLogger`             | No       | Custom logger (default: console)                        |

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

## Components

### ReplaneRoot

Server component for App Router. Fetches configs on the server and provides them to the app.

```tsx
<ReplaneRoot<AppConfigs>
  connection={{
    baseUrl: string;
    sdkKey: string;
  }}
>
  {children}
</ReplaneRoot>
```

### ReplaneProvider

Client-side provider for Pages Router or custom setups.

```tsx
<ReplaneProvider
  snapshot={replaneSnapshot}
  connection={{
    baseUrl: string;
    sdkKey: string;
  }}
>
  {children}
</ReplaneProvider>
```

## Hooks

### useConfig

Returns the value of a config. Re-renders when the config changes.

```tsx
const theme = useConfig<{ darkMode: boolean }>('theme')
```

### useReplane

Returns the Replane client instance.

```tsx
const client = useReplane<AppConfigs>()
const snapshot = client.getSnapshot()
const theme = client.get('theme')
```

### createConfigHook

Creates a typed version of `useConfig`.

```tsx
const useAppConfig = createConfigHook<AppConfigs>()
const theme = useAppConfig('theme') // Fully typed
```

### createReplaneHook

Creates a typed version of `useReplane`.

```tsx
const useAppReplane = createReplaneHook<AppConfigs>()
const client = useAppReplane()
```

## Functions

### getReplaneSnapshot

Fetches a snapshot of all configs. Use in `getServerSideProps`, `getStaticProps`, or `getInitialProps`.

```tsx
const snapshot = await getReplaneSnapshot<AppConfigs>({
  connection: {
    baseUrl: process.env.REPLANE_BASE_URL!,
    sdkKey: process.env.REPLANE_SDK_KEY!
  },
  // by default, getReplaneSnapshot will reuse the created client for 60 seconds
  // for fast subsequent calls, the client will be syncing with the server
  // in the background during this time
  keepAliveMs: 60_000
})
```

