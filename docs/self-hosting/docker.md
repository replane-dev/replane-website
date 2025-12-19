---
sidebar_position: 1
title: Docker Deployment
description: Deploy Replane with Docker and Docker Compose
---

# Docker deployment

This guide covers deploying Replane with Docker for production use.

## Prerequisites

- Docker 20.10+
- Docker Compose v2+
- PostgreSQL 14+ (or use included container)

## Quick start

```bash
# Download docker-compose.yml
curl -O https://raw.githubusercontent.com/replane-dev/replane/main/docker-compose.yml

# Create .env file
cat > .env << 'EOF'
BASE_URL=https://replane.example.com
SECRET_KEY=your-very-long-random-secret-key-here
PASSWORD_AUTH_ENABLED=true
EOF

# Start services
docker compose up -d
```

## Docker Compose setup

### Basic configuration

```yaml title="docker-compose.yml"
services:
  postgres:
    image: postgres:17
    restart: unless-stopped
    environment:
      POSTGRES_USER: replane
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-replane}
      POSTGRES_DB: replane
    volumes:
      - postgres-data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U replane"]
      interval: 5s
      timeout: 5s
      retries: 5

  replane:
    image: replane/replane:latest
    restart: unless-stopped
    depends_on:
      postgres:
        condition: service_healthy
    ports:
      - '8080:8080'
    environment:
      DATABASE_URL: postgresql://replane:${POSTGRES_PASSWORD:-replane}@postgres:5432/replane
      BASE_URL: ${BASE_URL}
      SECRET_KEY: ${SECRET_KEY}
      PASSWORD_AUTH_ENABLED: ${PASSWORD_AUTH_ENABLED:-true}
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3

volumes:
  postgres-data:
```

### Production configuration

```yaml title="docker-compose.prod.yml"
services:
  postgres:
    image: postgres:17
    restart: always
    environment:
      POSTGRES_USER: replane
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: replane
    volumes:
      - postgres-data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U replane"]
      interval: 5s
      timeout: 5s
      retries: 5
    deploy:
      resources:
        limits:
          memory: 1G

  replane:
    image: replane/replane:latest
    restart: always
    depends_on:
      postgres:
        condition: service_healthy
    ports:
      - '8080:8080'
    environment:
      # Required
      DATABASE_URL: postgresql://replane:${POSTGRES_PASSWORD}@postgres:5432/replane
      BASE_URL: ${BASE_URL}
      SECRET_KEY: ${SECRET_KEY}

      # Authentication (at least one required)
      PASSWORD_AUTH_ENABLED: "true"
      # MAGIC_LINK_ENABLED: "true"
      # GITHUB_CLIENT_ID: ${GITHUB_CLIENT_ID}
      # GITHUB_CLIENT_SECRET: ${GITHUB_CLIENT_SECRET}

      # Email (required for magic links and notifications)
      # EMAIL_SERVER: smtp://user:pass@smtp.example.com:587
      # EMAIL_FROM: noreply@example.com

      # Optional
      # ALLOWED_EMAIL_DOMAINS: example.com,company.com
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    deploy:
      resources:
        limits:
          memory: 1G

volumes:
  postgres-data:
```

## External PostgreSQL

Connect to an existing PostgreSQL database:

```yaml
services:
  replane:
    image: replane/replane:latest
    ports:
      - '8080:8080'
    environment:
      DATABASE_URL: postgresql://user:password@your-postgres-host:5432/replane
      # Or use individual variables:
      # DATABASE_USER: replane
      # DATABASE_PASSWORD: ${DB_PASSWORD}
      # DATABASE_HOST: your-postgres-host
      # DATABASE_PORT: 5432
      # DATABASE_NAME: replane
      BASE_URL: https://replane.example.com
      SECRET_KEY: ${SECRET_KEY}
      PASSWORD_AUTH_ENABLED: "true"
```

### SSL connection

For cloud databases (AWS RDS, Google Cloud SQL, etc.):

```yaml
environment:
  DATABASE_URL: postgresql://user:pass@host:5432/replane?sslmode=require
  # Or for custom CA certificate:
  DATABASE_SSL_CA: |
    -----BEGIN CERTIFICATE-----
    ...
    -----END CERTIFICATE-----
```

## Reverse proxy

### Nginx

```nginx title="nginx.conf"
server {
    listen 80;
    server_name replane.example.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name replane.example.com;

    ssl_certificate /etc/ssl/certs/replane.crt;
    ssl_certificate_key /etc/ssl/private/replane.key;

    location / {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        # SSE support
        proxy_buffering off;
        proxy_read_timeout 86400s;
    }
}
```

### Traefik

```yaml title="docker-compose.yml"
services:
  replane:
    image: replane/replane:latest
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.replane.rule=Host(`replane.example.com`)"
      - "traefik.http.routers.replane.entrypoints=websecure"
      - "traefik.http.routers.replane.tls.certresolver=letsencrypt"
      - "traefik.http.services.replane.loadbalancer.server.port=8080"
    environment:
      BASE_URL: https://replane.example.com
      # ...
```

### Caddy

```caddyfile title="Caddyfile"
replane.example.com {
    reverse_proxy localhost:8080
}
```

## Health checks

### Endpoint

```bash
curl http://localhost:8080/api/health
```

Response:
```json
{"status":"ok"}
```

### Docker health check

The image includes a health check. Verify with:

```bash
docker inspect --format='{{.State.Health.Status}}' replane
```

## Backups

### PostgreSQL backup

```bash
# Backup
docker compose exec postgres pg_dump -U replane replane > backup.sql

# Restore
docker compose exec -T postgres psql -U replane replane < backup.sql
```

### Automated backups

```yaml title="docker-compose.yml"
services:
  backup:
    image: prodrigestivill/postgres-backup-local
    restart: always
    volumes:
      - ./backups:/backups
    environment:
      POSTGRES_HOST: postgres
      POSTGRES_DB: replane
      POSTGRES_USER: replane
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      SCHEDULE: "@daily"
      BACKUP_KEEP_DAYS: 7
      BACKUP_KEEP_WEEKS: 4
      BACKUP_KEEP_MONTHS: 6
```

## Updates

### Pull latest image

```bash
docker compose pull replane
docker compose up -d
```

### Version pinning

Pin to a specific version for stability:

```yaml
services:
  replane:
    image: replane/replane:v1.0.0
```

## Logging

### View logs

```bash
# All services
docker compose logs -f

# Replane only
docker compose logs -f replane

# Last 100 lines
docker compose logs --tail 100 replane
```

### Log configuration

Replane uses JSON structured logging. Configure log drivers:

```yaml
services:
  replane:
    logging:
      driver: json-file
      options:
        max-size: "10m"
        max-file: "3"
```

## Troubleshooting

### Container won't start

Check logs:
```bash
docker compose logs replane
```

Common issues:
- Database not ready — wait for PostgreSQL health check
- Invalid environment variables — check required vars
- Port already in use — change `8080:8080` to another port

### Database connection errors

```bash
# Test database connectivity
docker compose exec replane curl -v postgres:5432

# Check PostgreSQL logs
docker compose logs postgres
```

### SSE connections dropping

Ensure reverse proxy supports long-lived connections:
- Nginx: `proxy_read_timeout 86400s;`
- Traefik: Default should work
- Cloudflare: Enable "HTTP/2 to Origin"

## Next steps

- [Environment Variables](/docs/self-hosting/environment-variables) — Full configuration reference
- [JavaScript SDK](/docs/sdk/javascript) — Connect your application
- [Feature Flags](/docs/guides/feature-flags) — Start using Replane
