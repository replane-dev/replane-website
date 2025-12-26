---
title: Quickstart
description: Deploy Replane and read your first config in under 5 minutes
---

# Quickstart

This guide walks you through deploying Replane, creating your first config, and reading it from your application.

## Prerequisites

- Docker and Docker Compose installed
- Node.js 18+ (for the SDK)

## Step 1: Deploy Replane

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

Start Replane:

```bash
docker compose up -d
```

Open [http://localhost:8080](http://localhost:8080) in your browser.

## Step 2: Create your account

1. Click **Sign up** and create an account with email/password
2. Create a new **workspace** (e.g., "My Company")
3. Create a new **project** (e.g., "Backend API")

## Step 3: Create a config

1. Navigate to your project
2. Click **New Config**
3. Enter the config details:
   - **Name**: `feature-new-checkout`
   - **Value**: `false`
4. Click **Create**

You've created your first feature flag.

## Step 4: Create an SDK key

1. Go to **SDK Keys** in the project sidebar
2. Click **Create SDK Key**
3. Select your environment (e.g., "Production")
4. Copy the generated key — you'll need it in the next step

:::caution
SDK keys are shown only once. Store them securely.
:::

## Step 5: Install the SDK

```bash
npm install @replanejs/sdk
```

## Step 6: Read the config

```typescript title="app.ts"
import { Replane } from '@replanejs/sdk';

const replane = new Replane();
await replane.connect({
  sdkKey: process.env.REPLANE_SDK_KEY,
  baseUrl: 'http://localhost:8080',
});

// Read the feature flag
const newCheckoutEnabled = replane.get('feature-new-checkout');
console.log('New checkout enabled:', newCheckoutEnabled); // false

// Subscribe to changes
replane.subscribe('feature-new-checkout', (config) => {
  console.log('Feature flag changed:', config.value);
});
```

## Step 7: Update the config

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
- [Configure authentication](/docs/self-hosting/environment-variables) for production deployments

## Using Replane Cloud

Don't want to self-host? [Replane Cloud](https://app.replane.dev) provides a managed service. Sign up and skip to Step 2.

```typescript
const replane = new Replane();
await replane.connect({
  sdkKey: process.env.REPLANE_SDK_KEY,
  baseUrl: 'https://app.replane.dev',
});
```
