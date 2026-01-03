---
title: Installation
description: Different ways to install and deploy Replane. Use Replane Cloud for instant setup, self-host with Docker Compose, or run from source for development.
---

# Installation

Replane can be deployed using our managed cloud or self-hosted with Docker.

## Replane Cloud (Recommended)

The fastest way to get started. No infrastructure to manage, automatic updates, and a free tier.

1. Sign up at [cloud.replane.dev](https://cloud.replane.dev)
2. Create a workspace and project
3. Generate an SDK key
4. Connect your application using `baseUrl: 'https://cloud.replane.dev'`

That's it! No Docker, no PostgreSQL, no maintenance.

---

## Self-Hosted with Docker

The easiest way to deploy Replane is with Docker Compose.

### Quick start

```bash
# Download the example docker-compose.yml
curl -O https://raw.githubusercontent.com/replane-dev/replane/refs/heads/main/examples/docker-compose/docker-compose.yml

# Start Replane
docker compose up -d
```

### Manual setup

Create a `docker-compose.yml`:

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
      SECRET_KEY: your-secret-key-here
      PASSWORD_AUTH_ENABLED: true

volumes:
  replane-data:
```

Generate a secure `SECRET_KEY`:

```bash
openssl rand -base64 48
```

Start the services:

```bash
docker compose up -d
```

## Docker (Standalone)

Run Replane with an external PostgreSQL database:

```bash
docker run -d \
  -p 8080:8080 \
  -e DATABASE_URL="postgresql://user:pass@host:5432/replane" \
  -e BASE_URL="https://replane.example.com" \
  -e SECRET_KEY="your-secret-key" \
  -e PASSWORD_AUTH_ENABLED="true" \
  replane/replane/replane:latest
```

Generate a secure `SECRET_KEY`:

```bash
openssl rand -base64 48
```

## From source (Development)

For local development or contributing:

```bash
# Clone the repository
git clone https://github.com/replane-dev/replane.git
cd replane

# Install dependencies
pnpm install

# Start PostgreSQL (if not running)
docker compose up -d postgres

# Copy .env.example to .env
cp .env.example .env

# Run migrations
pnpm migrate

# Start the development server
pnpm dev
```

The development server runs at [http://localhost:3000](http://localhost:3000).

## System requirements

| Component  | Minimum    | Recommended |
| ---------- | ---------- | ----------- |
| CPU        | 0.25 cores | 2 cores     |
| Memory     | 512 MB     | 4 GB        |
| Storage    | 1 GB       | 10+ GB      |
| PostgreSQL | 14+        | 16+         |

## Health check

Verify your deployment is running:

```bash
curl http://localhost:8080/api/health
```

Expected response:

```json
{ "status": "ok" }
```

## Next steps

- [Configure environment variables](/docs/self-hosting/environment-variables) for authentication and email
- [Create your first config](/docs/getting-started/quickstart#step-3-create-a-config)
- [Install the SDK](/docs/sdk/javascript) in your application
