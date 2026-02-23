---
title: Admin SDK
description: Programmatically manage Replane projects, configs, environments, SDK keys, and members with the JavaScript/TypeScript Admin SDK. Works in Node.js 18+, Deno, and Bun.
sidebar_label: Overview
slug: /sdk/admin
---

# Admin SDK

The official Admin SDK for Replane. Manage projects, configs, environments, SDK keys, and members programmatically.

While the [runtime SDK](/docs/sdk/javascript) reads config values in your application, the Admin SDK gives you full control over the Replane management API — ideal for CI/CD pipelines, infrastructure-as-code workflows, migration scripts, and custom tooling.

## Installation

```bash npm2yarn
npm install @replanejs/admin
```

## Quick start

```typescript
import { ReplaneAdmin } from '@replanejs/admin'

const admin = new ReplaneAdmin({
  baseUrl: 'https://app.replane.dev',
  apiKey: process.env.REPLANE_ADMIN_API_KEY, // starts with rpa_
})

// List all projects
const { projects } = await admin.projects.list()

// Create a config
await admin.configs.create({
  projectId: projects[0].id,
  name: 'api-rate-limit',
  description: 'Maximum API requests per minute',
  editors: [],
  base: { value: 100, schema: null, overrides: [] },
  variants: [],
})

// Read it back
const config = await admin.configs.get({
  projectId: projects[0].id,
  configName: 'api-rate-limit',
})
```

## Features

- **Full CRUD** — Create, read, update, and delete projects, configs, SDK keys, and more
- **Type safety** — Full TypeScript types for every request and response
- **Resource modules** — Organized API: `admin.projects`, `admin.configs`, `admin.sdkKeys`, etc.
- **Error handling** — Typed `ReplaneAdminError` with HTTP status and response body
- **Zero dependencies** — Pure JavaScript, works everywhere `fetch` is available

## API modules

| Module                 | Operations                          |
| ---------------------- | ----------------------------------- |
| `admin.projects`       | list, get, create, update, delete   |
| `admin.configs`        | list, get, create, update, delete   |
| `admin.environments`   | list                                |
| `admin.sdkKeys`        | list, create, delete                |
| `admin.members`        | list                                |
| `admin.workspaces`     | list, get, create, delete           |

## Authentication

The Admin SDK authenticates with **admin API keys**, which are different from SDK keys:

- **Admin API keys** (`rpa_...`) grant access to the management API — creating, updating, and deleting resources. Generate them in the Replane dashboard under **Workspace Settings > API Keys**.
- **SDK keys** (`rp_...`) are used by the [runtime SDKs](/docs/sdk) to read config values in your application. They are scoped to a single project and environment.

:::caution
Admin API keys have broad access to your workspace. Keep them secret and never expose them in client-side code.
:::

## Next steps

- [API Reference](/docs/sdk/admin/api) — Full API documentation for every module and type
- [Guide](/docs/sdk/admin/guide) — Use cases, error handling, and best practices
- [Core Concepts](/docs/concepts/overview) — Workspaces, projects, environments, configs
