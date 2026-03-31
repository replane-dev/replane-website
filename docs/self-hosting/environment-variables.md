---
title: Environment Variables
description: Complete reference for Replane configuration options including database connection, authentication providers (GitHub, Google, Okta OAuth), email settings, and access control.
---

# Environment variables

Complete reference for configuring Replane via environment variables.

## Required variables

### `BASE_URL`

The public URL where Replane is accessible.

```bash
BASE_URL=https://replane.example.com
```

Used for:

- OAuth callback URLs
- Magic link URLs
- Email notifications

### `SECRET_KEY`

Secret key for signing sessions and tokens. Should be at least 32 characters.

```bash
SECRET_KEY=your-very-long-random-secret-key-minimum-32-chars
```

Generate a secure key:

```bash
openssl rand -base64 48
```

:::caution
Keep this secret. Changing it invalidates all existing sessions.
:::

## Database

### `DATABASE_URL`

PostgreSQL connection string.

```bash
DATABASE_URL=postgresql://user:password@host:5432/database
```

With SSL:

```bash
DATABASE_URL=postgresql://user:password@host:5432/database?sslmode=require
```

### Individual database variables

Alternative to `DATABASE_URL`:

```bash
DATABASE_USER=replane
DATABASE_PASSWORD=secret
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=replane
```

### `DATABASE_SSL_CA`

Custom SSL certificate for database connection. Required for some cloud databases.

```bash
DATABASE_SSL_CA="-----BEGIN CERTIFICATE-----
...certificate content...
-----END CERTIFICATE-----"
```

### `DATABASE_MAX_CONNECTIONS`

Maximum database connections in the pool.

```bash
DATABASE_MAX_CONNECTIONS=10  # Default: 10
```

## Authentication

At least one authentication method must be enabled.

### Password authentication

```bash
PASSWORD_AUTH_ENABLED=true
```

Users can sign up and log in with email/password.

### Magic links

```bash
MAGIC_LINK_ENABLED=true
```

Requires email configuration. Users receive a login link via email.

### GitHub OAuth

```bash
GITHUB_CLIENT_ID=your-client-id
GITHUB_CLIENT_SECRET=your-client-secret
```

Create an OAuth app at [GitHub Developer Settings](https://github.com/settings/developers).

Callback URL: `{BASE_URL}/api/auth/callback/github`

### GitLab OAuth

```bash
GITLAB_CLIENT_ID=your-client-id
GITLAB_CLIENT_SECRET=your-client-secret
```

Callback URL: `{BASE_URL}/api/auth/callback/gitlab`

### Google OAuth

```bash
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
```

Create credentials at [Google Cloud Console](https://console.cloud.google.com/apis/credentials).

Callback URL: `{BASE_URL}/api/auth/callback/google`

### Okta OAuth

```bash
OKTA_CLIENT_ID=your-client-id
OKTA_CLIENT_SECRET=your-client-secret
OKTA_ISSUER=https://your-domain.okta.com
```

Callback URL: `{BASE_URL}/api/auth/callback/okta`

## Email

Required for magic links and notifications.

### `EMAIL_SERVER`

SMTP connection string.

```bash
EMAIL_SERVER=smtp://user:password@smtp.example.com:587
```

### Individual email variables

Alternative to `EMAIL_SERVER`:

```bash
EMAIL_SERVER_HOST=smtp.example.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=user
EMAIL_SERVER_PASSWORD=password
```

### `EMAIL_FROM`

From address for outgoing emails.

```bash
EMAIL_FROM=noreply@example.com
# Or with name:
EMAIL_FROM="Replane <noreply@example.com>"
```

## Access control

### `DISABLE_REGISTRATION`

Disable new user registration entirely.

```bash
DISABLE_REGISTRATION=true
```

When enabled:

- New users cannot sign up via any method (password, OAuth, magic link)
- Existing users can still sign in normally

Useful for private instances or when you want to manage users manually.

### `ALLOWED_EMAIL_DOMAINS`

Restrict registration to specific email domains.

```bash
ALLOWED_EMAIL_DOMAINS=example.com,company.com
```

Users with other email domains cannot sign up.

## Server

### `PORT`

HTTP server port.

```bash
PORT=8080  # Default: 8080
```

### `HEALTHCHECK_PATH`

Custom health check endpoint path.

```bash
HEALTHCHECK_PATH=/api/health  # Default: /api/health
```

## Monitoring

### `PROMETHEUS_METRICS_ENABLED`

Enables the Prometheus-compatible metrics endpoint at `/metrics`.

```bash
PROMETHEUS_METRICS_ENABLED=true
```

When enabled, Replane collects and exposes default Node.js metrics (CPU, memory, event loop, GC, etc.). Disabled by default.

### Sentry integration

```bash
SENTRY_DSN=https://key@sentry.io/project
SENTRY_ENVIRONMENT=production
SENTRY_TRACES_SAMPLE_RATE=0.1  # 10% of requests
```

## Example configurations

### Minimal (development)

```bash
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/replane
BASE_URL=http://localhost:8080
SECRET_KEY=development-secret-key-change-in-production
PASSWORD_AUTH_ENABLED=true
```

### Production with GitHub OAuth

```bash
# Database
DATABASE_URL=postgresql://replane:password@db.example.com:5432/replane

# Application
BASE_URL=https://replane.example.com
SECRET_KEY=your-production-secret-key-at-least-32-characters

# Authentication
PASSWORD_AUTH_ENABLED=true
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Email
EMAIL_SERVER=smtp://user:pass@smtp.sendgrid.net:587
EMAIL_FROM="Replane <noreply@example.com>"

# Access control
ALLOWED_EMAIL_DOMAINS=example.com

# Monitoring
SENTRY_DSN=https://key@sentry.io/project
SENTRY_ENVIRONMENT=production
```

### Production with Google OAuth and Magic Links

```bash
# Database
DATABASE_URL=postgresql://replane:password@db.example.com:5432/replane

# Application
BASE_URL=https://replane.example.com
SECRET_KEY=your-production-secret-key-at-least-32-characters

# Authentication
MAGIC_LINK_ENABLED=true
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Email (required for magic links)
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@gmail.com
EMAIL_SERVER_PASSWORD=your-app-password
EMAIL_FROM="Replane <your-email@gmail.com>"
```

### Docker Compose with .env file

```yaml title="docker-compose.yml"
services:
  replane:
    image: replane/replane:latest
    env_file: .env
    ports:
      - '8080:8080'
```

```bash title=".env"
DATABASE_URL=postgresql://replane:password@postgres:5432/replane
BASE_URL=https://replane.example.com
SECRET_KEY=your-secret-key
PASSWORD_AUTH_ENABLED=true
GITHUB_CLIENT_ID=xxx
GITHUB_CLIENT_SECRET=xxx
EMAIL_SERVER=smtp://user:pass@smtp.example.com:587
EMAIL_FROM=noreply@example.com
```

## Validation

Replane validates environment variables on startup. Missing required variables or invalid values cause the application to exit with an error message.

Check logs for configuration errors:

```bash
docker compose logs replane | grep -i "error\|config"
```

## Next steps

- [Docker Deployment](/docs/self-hosting/docker) — Deployment guide
- [JavaScript SDK](/docs/sdk/javascript) — Connect your application
- [Quickstart](/docs/getting-started/quickstart) — Get started
