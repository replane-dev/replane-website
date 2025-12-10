---
sidebar_position: 1
---

# Quickstart

Get Replane running locally in under 5 minutes.

## Prerequisites

- Docker and Docker Compose
- A GitHub or Okta account (for OAuth authentication)

## 1. Create OAuth Application

### For GitHub

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in:
   - **Application name**: Replane Local
   - **Homepage URL**: `http://localhost:8080`
   - **Authorization callback URL**: `http://localhost:8080/api/auth/callback/github`
4. Click "Register application"
5. Note your **Client ID** and generate a **Client Secret**

### For Okta

1. Log in to your Okta admin console
2. Go to Applications → Create App Integration
3. Select "OIDC - OpenID Connect" and "Web Application"
4. Configure:
   - **Sign-in redirect URIs**: `http://localhost:8080/api/auth/callback/okta`
   - **Sign-out redirect URIs**: `http://localhost:8080`
5. Save and note your **Client ID**, **Client Secret**, and **Issuer URL**

## 2. Create docker-compose.yml

Create a new directory and add this `docker-compose.yml`:

```yaml
services:
  db:
    image: postgres:17
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: replane
    volumes:
      - replane-db:/var/lib/postgresql/data
    ports:
      - '5432:5432'

  app:
    image: ghcr.io/replane-dev/replane:latest
    depends_on:
      - db
    environment:
      DATABASE_URL: postgresql://postgres:postgres@db:5432/replane
      BASE_URL: http://localhost:8080
      SECRET_KEY_BASE: your-secret-key-change-me-in-production

      # GitHub OAuth (use one provider)
      GITHUB_CLIENT_ID: your-github-client-id
      GITHUB_CLIENT_SECRET: your-github-client-secret

      # OR Okta OAuth (comment out GitHub if using Okta)
      # OKTA_CLIENT_ID: your-okta-client-id
      # OKTA_CLIENT_SECRET: your-okta-client-secret
      # OKTA_ISSUER: https://your-domain.okta.com
    ports:
      - '8080:8080'

volumes:
  replane-db:
```

## 3. Start Replane

```bash
docker-compose up -d
```

The first startup will:

- Create the database schema automatically
- Start the web server on port 8080

## 4. Access Replane

Open your browser and navigate to:

```
http://localhost:8080
```

Click "Sign in with GitHub" (or Okta) to authenticate.

## 5. Create Your First Config

<!-- Screenshot: Creating a config will be added here -->

1. Click "New config"
2. Enter a name (e.g., `feature-flags`)
3. Add a JSON value:
   ```json
   {
     "new-onboarding": true,
     "dark-mode": false
   }
   ```
4. Click "Save"

## 6. Generate an SDK Key

<!-- Screenshot: SDK key generation will be added here -->

1. Go to Settings → SDK Keys
2. Click "Create SDK Key"
3. Name it (e.g., `dev-key`)
4. Copy the key immediately (it's shown only once)

## 7. Test with SDK

Install the JavaScript SDK:

```bash npm2yarn
npm install replane-sdk
```

Create a test file `test.js`:

```javascript
import { createReplaneClient } from 'replane-sdk'

const client = createReplaneClient({
  sdkKey: 'your-sdk-key-here',
  baseUrl: 'http://localhost:8080'
})

// Fetch a config value
const flags = await client.getConfigValue('feature-flags')
console.log(flags) // { "new-onboarding": true, "dark-mode": false }
```

Run it:

```bash
node test.js
```

## Next Steps

- [**Core Concepts**](../concepts/overview) - Learn how Replane works
- [**Self-Hosting Guide**](../self-hosting/docker) - Production deployment
- [**JavaScript SDK**](../sdk/javascript) - Full SDK documentation
- [**API Reference**](../api) - Explore the REST API

## Troubleshooting

### Port already in use

If port 8080 is already in use, change the port mapping in `docker-compose.yml`:

```yaml
ports:
  - '8081:8080' # Use port 8081 instead
```

### Database connection error

Ensure PostgreSQL is running:

```bash
docker-compose ps
```

Check logs:

```bash
docker-compose logs app
```

### OAuth callback mismatch

Verify your OAuth callback URL matches exactly:

- GitHub: `http://localhost:8080/api/auth/callback/github`
- Okta: `http://localhost:8080/api/auth/callback/okta`
