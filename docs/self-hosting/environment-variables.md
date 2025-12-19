---
sidebar_position: 2
---

# Environment Variables

Complete reference for configuring Replane.

## Required Variables

### DATABASE_URL

PostgreSQL connection string.

```bash
DATABASE_URL=postgresql://user:password@host:5432/database
```

**Example**:

```bash
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/replane
```

### DATABASE_SSL_CA

_(Optional)_ Custom SSL/TLS certificate authority (CA) for PostgreSQL connections.

```bash
DATABASE_SSL_CA="-----BEGIN CERTIFICATE-----
MIIDQTCCAimgAwIBAgITBmyfz5m/jAo54vB4ikPmljZbyjANBgkqhkiG9w0BAQsF
...
-----END CERTIFICATE-----"
```

Use this when connecting to PostgreSQL instances that require custom SSL certificates (e.g., self-signed certificates, private CAs, or cloud providers with custom certificates).

### BASE_URL

The public URL where Replane is accessible.

```bash
BASE_URL=https://replane.yourdomain.com
```

**Important**: Must match the OAuth callback URL configuration.

### SECRET_KEY

A long random string used to sign session cookies.

```bash
SECRET_KEY=your-very-long-random-string-here
```

**Generate**:

```bash
openssl rand -hex 64
```

## Authentication (Choose One)

### GitHub OAuth

```bash
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

**Setup**: Create an OAuth app at [GitHub Developer Settings](https://github.com/settings/developers)

**Callback URL**: `${BASE_URL}/api/auth/callback/github`

### Okta OAuth

```bash
OKTA_CLIENT_ID=your-okta-client-id
OKTA_CLIENT_SECRET=your-okta-client-secret
OKTA_ISSUER=https://your-domain.okta.com
```

**Setup**: Create an app integration in your Okta admin console

**Callback URL**: `${BASE_URL}/api/auth/callback/okta`

## Optional Variables

### NODE_ENV

Node.js environment.

```bash
NODE_ENV=production
```

**Values**:

- `production` (default in Docker)
- `development`

### PORT

Port the app listens on (inside container).

```bash
PORT=8080
```

**Default**: `8080`

## Example Configurations

### Local Development

```bash
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/replane
BASE_URL=http://localhost:8080
SECRET_KEY=dev-secret-key-not-for-production
GITHUB_CLIENT_ID=your-dev-client-id
GITHUB_CLIENT_SECRET=your-dev-client-secret
NODE_ENV=development
```

### Production (GitHub)

```bash
DATABASE_URL=postgresql://replane:secure-password@db.internal:5432/replane
BASE_URL=https://replane.company.com
SECRET_KEY=very-long-random-string-generated-with-openssl
GITHUB_CLIENT_ID=prod-github-client-id
GITHUB_CLIENT_SECRET=prod-github-client-secret
WORKSPACE_NAME=Company Name
ALLOW_SELF_APPROVALS=false
NODE_ENV=production
```

### Production (Okta)

```bash
DATABASE_URL=postgresql://replane:secure-password@db.internal:5432/replane
BASE_URL=https://config.company.com
SECRET_KEY=very-long-random-string-generated-with-openssl
OKTA_CLIENT_ID=okta-client-id
OKTA_CLIENT_SECRET=okta-client-secret
OKTA_ISSUER=https://company.okta.com
WORKSPACE_NAME=Company Name
ALLOW_SELF_APPROVALS=false
NODE_ENV=production
```

## Security Notes

### Protecting Secrets

**Never commit secrets to version control.**

Use:

- `.env` files (add to `.gitignore`)
- Docker secrets
- Cloud provider secret managers (AWS Secrets Manager, Azure Key Vault, etc.)

### Rotating Secrets

To rotate `SECRET_KEY`:

1. Generate a new key
2. Update environment variable
3. Restart app
4. All users will be signed out (they'll need to re-authenticate)

### Database Credentials

Use strong passwords for production databases. Rotate regularly.

## Validating Configuration

Start the app and check logs:

```bash
docker-compose logs app
```

Successful startup shows:

```
✓ Database connected
✓ Migrations applied
✓ Server listening on :8080
```

Test health endpoint:

```bash
curl http://localhost:8080/api/health
```

Expected:

```json
{
  "status": "ok"
}
```

## Next Steps

- [**Docker Deployment**](./docker) - Deploy with Docker Compose
