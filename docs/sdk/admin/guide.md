---
title: Admin SDK Guide
description: Learn how to use the Replane Admin SDK for CI/CD automation, infrastructure-as-code, migration scripts, error handling, and testing patterns.
sidebar_label: Guide
---

# Admin SDK Guide

Use cases, error handling, and best practices for the Admin SDK.

## Use cases

### CI/CD pipeline automation

Create configs and SDK keys as part of your deployment pipeline:

```typescript
import { ReplaneAdmin } from '@replanejs/admin'

const admin = new ReplaneAdmin({
  baseUrl: process.env.REPLANE_BASE_URL,
  apiKey: process.env.REPLANE_ADMIN_API_KEY,
})

// Ensure the config exists with the right value
const { environments } = await admin.environments.list({
  projectId: PROJECT_ID,
})

const staging = environments.find(e => e.name === 'staging')

await admin.configs.create({
  projectId: PROJECT_ID,
  name: 'maintenance-mode',
  description: 'Toggle maintenance mode for the application',
  editors: [],
  base: { value: false, schema: null, overrides: [] },
  variants: [
    {
      environmentId: staging.id,
      value: true,
      schema: null,
      overrides: [],
      useBaseSchema: true,
    },
  ],
})
```

### Infrastructure-as-code

Define configs in code and sync them:

```typescript
import { ReplaneAdmin, ReplaneAdminError } from '@replanejs/admin'

const admin = new ReplaneAdmin({
  baseUrl: process.env.REPLANE_BASE_URL,
  apiKey: process.env.REPLANE_ADMIN_API_KEY,
})

const projectId = 'your-project-id'

const desiredConfigs = [
  {
    name: 'api-rate-limit',
    description: 'Max requests per minute',
    value: 1000,
  },
  {
    name: 'feature-new-checkout',
    description: 'Enable new checkout flow',
    value: false,
  },
]

for (const config of desiredConfigs) {
  try {
    await admin.configs.get({ projectId, configName: config.name })
    // Config exists — update it
    await admin.configs.update({
      projectId,
      configName: config.name,
      description: config.description,
      editors: [],
      base: { value: config.value, schema: null, overrides: [] },
      variants: [],
    })
  } catch (error) {
    if (error instanceof ReplaneAdminError && error.status === 404) {
      // Config doesn't exist — create it
      await admin.configs.create({
        projectId,
        name: config.name,
        description: config.description,
        editors: [],
        base: { value: config.value, schema: null, overrides: [] },
        variants: [],
      })
    } else {
      throw error
    }
  }
}
```

### SDK key provisioning

Automate SDK key creation for new environments or services:

```typescript
const { environments } = await admin.environments.list({ projectId })
const production = environments.find(e => e.name === 'production')

const sdkKey = await admin.sdkKeys.create({
  projectId,
  name: 'backend-service-v2',
  description: 'SDK key for backend service v2',
  environmentId: production.id,
})

// Store the key securely — it's only returned once
console.log('SDK Key:', sdkKey.key)
```

### Migration scripts

Migrate configs between projects or bulk-update values:

```typescript
const sourceProjectId = 'project-source'
const targetProjectId = 'project-target'

// Copy all configs from source to target
const { configs } = await admin.configs.list({ projectId: sourceProjectId })

for (const item of configs) {
  const config = await admin.configs.get({
    projectId: sourceProjectId,
    configName: item.name,
  })

  await admin.configs.create({
    projectId: targetProjectId,
    name: config.name,
    description: config.description ?? '',
    editors: config.editors,
    base: config.base,
    variants: config.variants,
  })
}
```

## Configs with overrides

Create configs with conditional override rules:

```typescript
await admin.configs.create({
  projectId,
  name: 'request-limit',
  description: 'Per-user request limit',
  editors: [],
  base: {
    value: 100,
    schema: null,
    overrides: [
      {
        name: 'Premium users',
        conditions: [
          {
            operator: 'equals',
            property: 'plan',
            value: { type: 'literal', value: 'premium' },
          },
        ],
        value: 10000,
      },
      {
        name: 'Beta testers (10%)',
        conditions: [
          {
            operator: 'segmentation',
            property: 'userId',
            fromPercentage: 0,
            toPercentage: 10,
            seed: 'beta-test-2024',
          },
        ],
        value: 5000,
      },
    ],
  },
  variants: [],
})
```

### Compound conditions

Combine conditions with `and`, `or`, and `not` operators:

```typescript
const overrides = [
  {
    name: 'Enterprise US users',
    conditions: [
      {
        operator: 'and' as const,
        conditions: [
          {
            operator: 'equals' as const,
            property: 'plan',
            value: { type: 'literal' as const, value: 'enterprise' },
          },
          {
            operator: 'in' as const,
            property: 'region',
            value: {
              type: 'literal' as const,
              value: ['us-east', 'us-west'],
            },
          },
        ],
      },
    ],
    value: 50000,
  },
]
```

## Per-environment values

Set different values per environment using variants:

```typescript
const { environments } = await admin.environments.list({ projectId })

const staging = environments.find(e => e.name === 'staging')
const production = environments.find(e => e.name === 'production')

await admin.configs.create({
  projectId,
  name: 'log-level',
  description: 'Application log level',
  editors: [],
  base: {
    value: 'debug',
    schema: null,
    overrides: [],
  },
  variants: [
    {
      environmentId: staging.id,
      value: 'info',
      schema: null,
      overrides: [],
      useBaseSchema: true,
    },
    {
      environmentId: production.id,
      value: 'warn',
      schema: null,
      overrides: [],
      useBaseSchema: true,
    },
  ],
})
```

## Error handling

All API errors throw `ReplaneAdminError` with the HTTP status code and response body:

```typescript
import { ReplaneAdmin, ReplaneAdminError } from '@replanejs/admin'

try {
  await admin.configs.get({ projectId, configName: 'missing' })
} catch (error) {
  if (error instanceof ReplaneAdminError) {
    switch (error.status) {
      case 401:
        console.error('Invalid API key')
        break
      case 403:
        console.error('Insufficient permissions')
        break
      case 404:
        console.error('Resource not found')
        break
      case 409:
        console.error('Conflict — resource already exists')
        break
      default:
        console.error(`API error ${error.status}: ${error.message}`)
    }
    // Raw error response from the server
    console.error(error.response)
  }
}
```

## Testing

### Custom fetch

Inject a mock fetch function for unit tests:

```typescript
import { ReplaneAdmin } from '@replanejs/admin'

const mockFetch = vi.fn().mockResolvedValue({
  ok: true,
  status: 200,
  json: () =>
    Promise.resolve({
      projects: [{ id: 'proj-1', name: 'Test', description: '', createdAt: '', updatedAt: '' }],
    }),
})

const admin = new ReplaneAdmin({
  baseUrl: 'https://test.replane.example.com',
  apiKey: 'rpa_test',
  fetchFn: mockFetch,
})

const { projects } = await admin.projects.list()
expect(projects).toHaveLength(1)
expect(mockFetch).toHaveBeenCalledWith(
  'https://test.replane.example.com/api/admin/v1/projects',
  expect.objectContaining({
    method: 'GET',
    headers: expect.objectContaining({
      Authorization: 'Bearer rpa_test',
    }),
  })
)
```

## Best practices

### Store admin API keys securely

Admin API keys (`rpa_...`) are different from SDK keys (`rp_...`). Admin API keys grant management access to your workspace — they can create, modify, and delete any resource. SDK keys only allow reading config values for a specific project and environment.

You can create admin API keys in the Replane dashboard under **Workspace Settings > API Keys**.

Never hard-code admin API keys. Use environment variables or a secrets manager:

```typescript
const admin = new ReplaneAdmin({
  baseUrl: process.env.REPLANE_BASE_URL,
  apiKey: process.env.REPLANE_ADMIN_API_KEY,
})
```

### Save SDK keys immediately

SDK key tokens are returned only once when created. Store them in your secrets manager right away:

```typescript
const sdkKey = await admin.sdkKeys.create({
  projectId,
  name: 'production-backend',
  environmentId: productionEnvId,
})

// sdkKey.key is only available now — save it immediately
await secretsManager.set('REPLANE_SDK_KEY', sdkKey.key)
```

### Use idempotent operations

When writing automation scripts, handle the case where resources already exist:

```typescript
try {
  await admin.configs.create({ ... })
} catch (error) {
  if (error instanceof ReplaneAdminError && error.status === 409) {
    // Already exists — update instead
    await admin.configs.update({ ... })
  } else {
    throw error
  }
}
```
