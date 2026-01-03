---
title: Quickstart
description: Get started with Replane in under 5 minutes. Deploy with Docker Compose or use Replane Cloud, create your first config, and read values from your application.
---

# Quickstart

This guide walks you through getting started with Replane, creating your first config, and reading it from your application.

## Choose your deployment

<div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose mb-8">
  <a href="https://cloud.replane.dev" className="block p-6 border rounded-lg hover:border-blue-500 transition-colors no-underline">
    <div className="text-2xl mb-2">☁️</div>
    <h3 className="text-lg font-semibold mb-2">Replane Cloud</h3>
    <p className="text-sm text-gray-600 dark:text-gray-400">Start instantly. No infrastructure to manage. Free tier available.</p>
  </a>
  <a href="#self-hosted" className="block p-6 border rounded-lg hover:border-blue-500 transition-colors no-underline">
    <div className="text-2xl mb-2">🏠</div>
    <h3 className="text-lg font-semibold mb-2">Self-Hosted</h3>
    <p className="text-sm text-gray-600 dark:text-gray-400">Run on your infrastructure with Docker. Full control over your data.</p>
  </a>
</div>

---

## Option A: Replane Cloud

1. **Sign up** at [cloud.replane.dev](https://cloud.replane.dev)
2. **Create your first config** (e.g., `feature-new-checkout` with value `false`)
3. **Create an SDK key** in the SDK Keys page
4. **Connect your app** — skip to [Step 4: Install the SDK](#step-4-install-the-sdk)

```typescript title="app.ts"
import { Replane } from '@replanejs/sdk'

const replane = new Replane()
await replane.connect({
  sdkKey: process.env.REPLANE_SDK_KEY,
  baseUrl: 'https://cloud.replane.dev'
})

const newCheckoutEnabled = replane.get('feature-new-checkout')
```

---

## Option B: Self-Hosted {#self-hosted}

### Prerequisites

- Docker and Docker Compose installed
- Node.js 18+ (for the SDK)

### Step 1: Deploy Replane

Create a `docker-compose.yml` file:

```yaml title="docker-compose.yml"
services:
  postgres:
    image: postgres:17
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: replane
    volumes:
      - replane-data:/var/lib/postgresql/data

  replane:
    image: replane/replane:latest
    depends_on:
      - postgres
    ports:
      - '8080:8080'
    environment:
      DATABASE_URL: postgresql://postgres:postgres@postgres:5432/replane
      BASE_URL: http://localhost:8080
      SECRET_KEY: change-me-to-a-long-random-string
      PASSWORD_AUTH_ENABLED: true

volumes:
  replane-data:
```

Generate a secure `SECRET_KEY`:

```bash
openssl rand -base64 48
```

Start Replane:

```bash
docker compose up -d
```

Open [http://localhost:8080](http://localhost:8080) in your browser.

## Step 2: Create a config

1. Navigate to configs page in your project
2. Click **New Config**
3. Enter the config details:
   - **Name**: `feature-new-checkout`
   - **Value**: `false`
4. Click **Create**

You've created your first feature flag.

## Step 3: Create an SDK key

1. Go to **SDK Keys** in the project sidebar
2. Click **Create SDK Key**
3. Select your environment (e.g., "Production")
4. Copy the generated key — you'll need it in the next step

:::caution
SDK keys are shown only once. Store them securely.
:::

## Step 4: Install the SDK

```bash
npm install @replanejs/sdk
```

## Step 5: Read the config

```typescript title="app.ts"
import { Replane } from '@replanejs/sdk'

const replane = new Replane()
await replane.connect({
  sdkKey: process.env.REPLANE_SDK_KEY,
  baseUrl: 'http://localhost:8080'
})

// Read the feature flag
const newCheckoutEnabled = replane.get('feature-new-checkout')
console.log('New checkout enabled:', newCheckoutEnabled) // false

// Subscribe to changes
replane.subscribe('feature-new-checkout', (config) => {
  console.log('Feature flag changed:', config.value)
})
```

## Step 6: Update the config

1. Go back to the Replane dashboard
2. Click on `feature-new-checkout`
3. Change the value to `true`
4. Click **Save**

Your application receives the update instantly via Server-Sent Events. Check your console — you should see:

```
Feature flag changed: true
```

## Next steps

- [Add override rules](/docs/guides/override-rules) to return different values based on user context
- [Learn about gradual rollouts](/docs/guides/gradual-rollouts) to release features to a percentage of users
- [Configure authentication](/docs/self-hosting/environment-variables) for self-hosted production deployments
