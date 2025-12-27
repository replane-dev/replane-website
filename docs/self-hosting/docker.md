---
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
curl -O https://raw.githubusercontent.com/replane-dev/replane/refs/heads/main/examples/docker-compose/docker-compose.yml

# Start services
docker compose up -d
```

## Docker Compose setup

### Basic configuration

```bash title=".env"
BASE_URL=https://replane.example.com
SECRET_KEY=your-very-long-random-secret-key-here
PASSWORD_AUTH_ENABLED=true
```

Generate a secure `SECRET_KEY`:

```bash
openssl rand -base64 48
```

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
      test: ['CMD-SHELL', 'pg_isready -U replane']
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
      test: ['CMD', 'curl', '-f', 'http://localhost:8080/api/health']
      interval: 30s
      timeout: 10s
      retries: 3

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
      PASSWORD_AUTH_ENABLED: 'true'
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
      - 'traefik.enable=true'
      - 'traefik.http.routers.replane.rule=Host(`replane.example.com`)'
      - 'traefik.http.routers.replane.entrypoints=websecure'
      - 'traefik.http.routers.replane.tls.certresolver=letsencrypt'
      - 'traefik.http.services.replane.loadbalancer.server.port=8080'
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
{ "status": "ok" }
```

### Docker health check

The image includes a health check. Verify with:

```bash
docker inspect --format='{{.State.Health.Status}}' replane
```

## Prometheus metrics

Replane exposes Prometheus-compatible metrics at `/metrics`.

### Endpoint

```bash
curl http://localhost:8080/metrics
```

### Available metrics

Default Node.js metrics are collected automatically:

- `process_cpu_user_seconds_total` — CPU time spent in user mode
- `process_cpu_system_seconds_total` — CPU time spent in system mode
- `process_resident_memory_bytes` — Resident memory size
- `process_heap_bytes` — Process heap size
- `nodejs_eventloop_lag_seconds` — Event loop lag
- `nodejs_active_handles_total` — Active handles
- `nodejs_active_requests_total` — Active requests
- `nodejs_gc_duration_seconds` — Garbage collection duration

### Prometheus configuration

Add Replane as a scrape target in `prometheus.yml`:

```yaml title="prometheus.yml"
scrape_configs:
  - job_name: 'replane'
    static_configs:
      - targets: ['replane:8080']
    metrics_path: /metrics
    scrape_interval: 15s
```

### Docker Compose with Prometheus

```yaml title="docker-compose.yml"
services:
  replane:
    image: replane/replane:latest
    ports:
      - '8080:8080'
    environment:
      # ... your config

  prometheus:
    image: prom/prometheus:latest
    ports:
      - '9090:9090'
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
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
      SCHEDULE: '@daily'
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
    image: replane/replane:1.0.0
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
        max-size: '10m'
        max-file: '3'
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
