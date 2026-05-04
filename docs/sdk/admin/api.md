---
title: Admin SDK API Reference
description: Complete API documentation for the Replane Admin SDK including ReplaneAdmin class, projects, configs, environments, SDK keys, members, override conditions, and error handling.
sidebar_label: API Reference
---

# Admin SDK API Reference

Complete API documentation for the Admin SDK.

## `new ReplaneAdmin(options)`

Creates a new Admin API client.

### Options

| Option    | Type           | Required | Description                                      |
| --------- | -------------- | -------- | ------------------------------------------------ |
| `apiKey`  | `string`       | Yes      | Admin API key (starts with `rpa_`)               |
| `baseUrl` | `string`       | Yes      | Replane instance URL                             |
| `agent`   | `string`       | No       | Custom User-Agent identifier                     |
| `fetchFn` | `typeof fetch` | No       | Custom fetch implementation (default: global)    |

:::info Admin API keys vs SDK keys
The `apiKey` option expects an **admin API key** (prefixed `rpa_`), not an SDK key (`rp_`). Admin API keys are created in **Workspace Settings > API Keys** in the Replane dashboard. They grant management access to your workspace — creating, updating, and deleting resources.

SDK keys are a different concept: they are used by the [runtime SDKs](/docs/sdk) to read config values in your application.
:::

### Example

```typescript
import { ReplaneAdmin } from '@replanejs/admin'

const admin = new ReplaneAdmin({
  baseUrl: 'https://replane.example.com',
  apiKey: process.env.REPLANE_ADMIN_API_KEY, // rpa_...
})
```

---

## Projects

### `admin.projects.list()`

Lists all projects accessible to the API key.

**Returns:** `Promise<{ projects: Project[] }>`

```typescript
const { projects } = await admin.projects.list()
```

### `admin.projects.get(request)`

Gets a project by ID.

| Parameter   | Type     | Required | Description |
| ----------- | -------- | -------- | ----------- |
| `projectId` | `string` | Yes      | Project ID  |

**Returns:** `Promise<Project>`

```typescript
const project = await admin.projects.get({ projectId: 'proj-123' })
```

### `admin.projects.create(request)`

Creates a new project in a workspace.

| Parameter     | Type     | Required | Description         |
| ------------- | -------- | -------- | ------------------- |
| `workspaceId` | `string` | Yes      | Parent workspace ID |
| `name`        | `string` | Yes      | Project name        |
| `description` | `string` | Yes      | Project description |

**Returns:** `Promise<{ id: string }>`

```typescript
const { id } = await admin.projects.create({
  workspaceId: 'ws-123',
  name: 'My Project',
  description: 'Production configs',
})
```

### `admin.projects.update(request)`

Updates a project's name or description.

| Parameter     | Type     | Required | Description         |
| ------------- | -------- | -------- | ------------------- |
| `projectId`   | `string` | Yes      | Project ID          |
| `name`        | `string` | No       | New name            |
| `description` | `string` | No       | New description     |

**Returns:** `Promise<{ id: string }>`

```typescript
await admin.projects.update({
  projectId: 'proj-123',
  description: 'Updated description',
})
```

### `admin.projects.delete(request)`

Deletes a project and all its resources.

| Parameter   | Type     | Required | Description |
| ----------- | -------- | -------- | ----------- |
| `projectId` | `string` | Yes      | Project ID  |

**Returns:** `Promise<void>`

```typescript
await admin.projects.delete({ projectId: 'proj-123' })
```

---

## Configs

### `admin.configs.list(request)`

Lists all configs in a project.

| Parameter   | Type     | Required | Description |
| ----------- | -------- | -------- | ----------- |
| `projectId` | `string` | Yes      | Project ID  |

**Returns:** `Promise<{ configs: ConfigListItem[] }>`

```typescript
const { configs } = await admin.configs.list({ projectId: 'proj-123' })
```

### `admin.configs.get(request)`

Gets a config by name, including its full definition with base value, variants, and overrides.

| Parameter    | Type     | Required | Description |
| ------------ | -------- | -------- | ----------- |
| `projectId`  | `string` | Yes      | Project ID  |
| `configName` | `string` | Yes      | Config name |

**Returns:** `Promise<Config>`

```typescript
const config = await admin.configs.get({
  projectId: 'proj-123',
  configName: 'api-rate-limit',
})
```

### `admin.configs.create(request)`

Creates a new config.

| Parameter     | Type             | Required | Description                            |
| ------------- | ---------------- | -------- | -------------------------------------- |
| `projectId`   | `string`         | Yes      | Project ID                             |
| `name`        | `string`         | Yes      | Config name                            |
| `description` | `string`         | Yes      | Config description                     |
| `editors`     | `string[]`       | Yes      | List of editor email addresses         |
| `base`        | `ConfigBase`     | Yes      | Base value, schema, and overrides      |
| `variants`    | `ConfigVariant[]`| Yes      | Per-environment values                 |

**Returns:** `Promise<{ id: string }>`

```typescript
await admin.configs.create({
  projectId: 'proj-123',
  name: 'feature-new-ui',
  description: 'Enable the new UI redesign',
  editors: ['alice@example.com'],
  base: {
    value: false,
    schema: null,
    overrides: [],
  },
  variants: [],
})
```

### `admin.configs.update(request)`

Updates a config's definition. Replaces the entire config — include all fields.

| Parameter     | Type             | Required | Description                            |
| ------------- | ---------------- | -------- | -------------------------------------- |
| `projectId`   | `string`         | Yes      | Project ID                             |
| `configName`  | `string`         | Yes      | Config name                            |
| `description` | `string`         | Yes      | Config description                     |
| `editors`     | `string[]`       | Yes      | List of editor email addresses         |
| `baseVersion` | `number`         | No       | Expected current version for optimistic locking |
| `base`        | `ConfigBase`     | Yes      | Base value, schema, and overrides      |
| `variants`    | `ConfigVariant[]`| Yes      | Per-environment values                 |

**Returns:** `Promise<{ id: string, version: number }>`

```typescript
const config = await admin.configs.get({
  projectId: 'proj-123',
  configName: 'feature-new-ui',
})

const { version } = await admin.configs.update({
  projectId: 'proj-123',
  configName: 'feature-new-ui',
  description: 'Enable the new UI redesign',
  editors: ['alice@example.com'],
  baseVersion: config.version,
  base: {
    value: true, // changed from false to true
    schema: null,
    overrides: [],
  },
  variants: [],
})
```

If `baseVersion` is provided and the config has been updated since that version, the request fails instead of overwriting newer changes.

### `admin.configs.delete(request)`

Deletes a config.

| Parameter    | Type     | Required | Description |
| ------------ | -------- | -------- | ----------- |
| `projectId`  | `string` | Yes      | Project ID  |
| `configName` | `string` | Yes      | Config name |

**Returns:** `Promise<void>`

```typescript
await admin.configs.delete({
  projectId: 'proj-123',
  configName: 'feature-new-ui',
})
```

---

## Environments

### `admin.environments.list(request)`

Lists all environments in a project.

| Parameter   | Type     | Required | Description |
| ----------- | -------- | -------- | ----------- |
| `projectId` | `string` | Yes      | Project ID  |

**Returns:** `Promise<{ environments: Environment[] }>`

```typescript
const { environments } = await admin.environments.list({
  projectId: 'proj-123',
})
// [{ id: 'env-1', name: 'production', order: 0 }, ...]
```

---

## SDK Keys

### `admin.sdkKeys.list(request)`

Lists all SDK keys in a project. Does not include the key token — tokens are only returned on creation.

| Parameter   | Type     | Required | Description |
| ----------- | -------- | -------- | ----------- |
| `projectId` | `string` | Yes      | Project ID  |

**Returns:** `Promise<{ sdkKeys: SdkKey[] }>`

```typescript
const { sdkKeys } = await admin.sdkKeys.list({ projectId: 'proj-123' })
```

### `admin.sdkKeys.create(request)`

Creates a new SDK key. The returned `key` field contains the token — **it is only returned once** and cannot be retrieved again.

| Parameter       | Type     | Required | Description              |
| --------------- | -------- | -------- | ------------------------ |
| `projectId`     | `string` | Yes      | Project ID               |
| `name`          | `string` | Yes      | Key name                 |
| `description`   | `string` | No       | Key description          |
| `environmentId` | `string` | Yes      | Environment to bind to   |

**Returns:** `Promise<SdkKeyWithToken>`

```typescript
const sdkKey = await admin.sdkKeys.create({
  projectId: 'proj-123',
  name: 'Production Backend',
  description: 'Main backend service',
  environmentId: 'env-prod',
})

// Save immediately — only returned once
console.log(sdkKey.key) // "rp_..."
```

### `admin.sdkKeys.delete(request)`

Deletes an SDK key. Any applications using this key will lose access.

| Parameter   | Type     | Required | Description |
| ----------- | -------- | -------- | ----------- |
| `projectId` | `string` | Yes      | Project ID  |
| `sdkKeyId`  | `string` | Yes      | SDK key ID  |

**Returns:** `Promise<void>`

```typescript
await admin.sdkKeys.delete({
  projectId: 'proj-123',
  sdkKeyId: 'key-456',
})
```

---

## Members

### `admin.members.list(request)`

Lists all members of a project.

| Parameter   | Type     | Required | Description |
| ----------- | -------- | -------- | ----------- |
| `projectId` | `string` | Yes      | Project ID  |

**Returns:** `Promise<{ members: Member[] }>`

```typescript
const { members } = await admin.members.list({ projectId: 'proj-123' })
// [{ email: 'alice@example.com', role: 'admin' }, ...]
```

---

## Workspaces

Workspace operations require superuser access.

### `admin.workspaces.list()`

Lists all workspaces.

**Returns:** `Promise<{ workspaces: Workspace[] }>`

### `admin.workspaces.get(request)`

Gets a workspace by ID.

| Parameter     | Type     | Required | Description  |
| ------------- | -------- | -------- | ------------ |
| `workspaceId` | `string` | Yes      | Workspace ID |

**Returns:** `Promise<Workspace>`

### `admin.workspaces.create(request)`

Creates a new workspace.

| Parameter | Type     | Required | Description    |
| --------- | -------- | -------- | -------------- |
| `name`    | `string` | Yes      | Workspace name |

**Returns:** `Promise<{ id: string }>`

### `admin.workspaces.delete(request)`

Deletes a workspace and all its projects.

| Parameter     | Type     | Required | Description  |
| ------------- | -------- | -------- | ------------ |
| `workspaceId` | `string` | Yes      | Workspace ID |

**Returns:** `Promise<void>`

---

## Types

### `Project`

```typescript
interface Project {
  id: string
  name: string
  description: string
  createdAt: string
  updatedAt: string
}
```

### `Config`

```typescript
interface Config {
  id: string
  name: string
  description?: string
  version: number
  base: ConfigBase
  variants: ConfigVariant[]
  editors: string[]
  createdAt: string
  updatedAt: string
}
```

### `ConfigBase`

```typescript
interface ConfigBase {
  value: unknown
  schema: unknown | null
  overrides: Override[]
}
```

### `ConfigVariant`

```typescript
interface ConfigVariant {
  environmentId: string
  value: unknown
  schema: unknown | null
  overrides: Override[]
  useBaseSchema: boolean
}
```

### `ConfigListItem`

Returned by `configs.list()` — a summary without the full config definition.

```typescript
interface ConfigListItem {
  id: string
  name: string
  description?: string
  version: number
  createdAt: string
  updatedAt: string
}
```

### `Override`

```typescript
interface Override {
  name: string
  conditions: OverrideCondition[]
  value: unknown
}
```

### `OverrideCondition`

A union of all condition types:

```typescript
type OverrideCondition =
  | EqualsCondition
  | InCondition
  | NotInCondition
  | LessThanCondition
  | LessThanOrEqualCondition
  | GreaterThanCondition
  | GreaterThanOrEqualCondition
  | SegmentationCondition
  | AndCondition
  | OrCondition
  | NotCondition
```

#### Comparison conditions

```typescript
interface EqualsCondition {
  operator: 'equals'
  property: string
  value: ConditionValue
}

interface InCondition {
  operator: 'in'
  property: string
  value: ConditionValue
}

interface NotInCondition {
  operator: 'not_in'
  property: string
  value: ConditionValue
}

interface LessThanCondition {
  operator: 'less_than'
  property: string
  value: ConditionValue
}

interface LessThanOrEqualCondition {
  operator: 'less_than_or_equal'
  property: string
  value: ConditionValue
}

interface GreaterThanCondition {
  operator: 'greater_than'
  property: string
  value: ConditionValue
}

interface GreaterThanOrEqualCondition {
  operator: 'greater_than_or_equal'
  property: string
  value: ConditionValue
}
```

#### Segmentation condition

```typescript
interface SegmentationCondition {
  operator: 'segmentation'
  property: string
  fromPercentage: number
  toPercentage: number
  seed: string
}
```

#### Logical conditions

```typescript
interface AndCondition {
  operator: 'and'
  conditions: OverrideCondition[]
}

interface OrCondition {
  operator: 'or'
  conditions: OverrideCondition[]
}

interface NotCondition {
  operator: 'not'
  condition: OverrideCondition
}
```

### `ConditionValue`

Values used in conditions can be literals or references to other configs:

```typescript
type ConditionValue = LiteralValue | ReferenceValue

interface LiteralValue {
  type: 'literal'
  value: unknown
}

interface ReferenceValue {
  type: 'reference'
  projectId: string
  configName: string
  path: (string | number)[]
}
```

### `Environment`

```typescript
interface Environment {
  id: string
  name: string
  order: number
}
```

### `Workspace`

```typescript
interface Workspace {
  id: string
  name: string
  createdAt: string
  updatedAt: string
}
```

### `SdkKey`

```typescript
interface SdkKey {
  id: string
  name: string
  description: string
  environmentId: string
  createdAt: string
}
```

### `SdkKeyWithToken`

Returned only by `sdkKeys.create()`. Extends `SdkKey` with the actual key token.

```typescript
interface SdkKeyWithToken extends SdkKey {
  key: string
}
```

### `Member`

```typescript
interface Member {
  email: string
  role: string
}
```

---

## `ReplaneAdminError`

Thrown when the API returns a non-2xx response.

### Properties

| Property   | Type        | Description                          |
| ---------- | ----------- | ------------------------------------ |
| `message`  | `string`    | Error message                        |
| `status`   | `number`    | HTTP status code                     |
| `response` | `ApiError?` | Parsed error body from the server    |

### Example

```typescript
import { ReplaneAdminError } from '@replanejs/admin'

try {
  await admin.configs.get({ projectId, configName: 'missing' })
} catch (error) {
  if (error instanceof ReplaneAdminError) {
    console.error(`${error.status}: ${error.message}`)
  }
}
```
