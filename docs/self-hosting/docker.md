---
sidebar_position: 1
---

# Docker Deployment

Deploy Replane using Docker and Docker Compose for production.

## Prerequisites

- Docker 20.10+
- Docker Compose v2.0+
- A domain name (optional, but recommended for HTTPS)
- OAuth provider (GitHub or Okta)

## Production docker-compose.yml

```yaml
services:
  db:
    image: postgres:17
    restart: unless-stopped
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: replane
    volumes:
      - replane-db:/var/lib/postgresql/data
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U postgres']
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - replane-network

  app:
    image: ghcr.io/replane-dev/replane:latest
    restart: unless-stopped
    depends_on:
      db:
        condition: service_healthy
    environment:
      DATABASE_URL: postgresql://postgres:${DB_PASSWORD}@db:5432/replane
      BASE_URL: ${BASE_URL}
      SECRET_KEY: ${SECRET_KEY}

      # Authentication (choose one)
      GITHUB_CLIENT_ID: ${GITHUB_CLIENT_ID}
      GITHUB_CLIENT_SECRET: ${GITHUB_CLIENT_SECRET}
    ports:
      - '8080:8080'
    networks:
      - replane-network
    healthcheck:
      test: ['CMD', 'curl', '-f', 'http://localhost:8080/api/health']
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

volumes:
  replane-db:

networks:
  replane-network:
```

## Environment Variables

Create a `.env` file:

```bash
# Database
DB_PASSWORD=your-secure-password-here

# Application
BASE_URL=https://replane.yourdomain.com
SECRET_KEY=generate-a-long-random-string-here

# GitHub OAuth
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

### Generating SECRET_KEY

```bash
openssl rand -hex 64
```

## Deploy

```bash
# Start services
docker-compose up -d

# Check logs
docker-compose logs -f app

# Check health
curl http://localhost:8080/api/health
```

Expected response:

```json
{
  "status": "ok"
}
```

## HTTPS with Caddy

Use Caddy as a reverse proxy for automatic HTTPS:

```yaml title="docker-compose.yml (add Caddy service)"
  caddy:
    image: caddy:2
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile
      - caddy-data:/data
      - caddy-config:/config
    networks:
      - replane-network

volumes:
  caddy-data:
  caddy-config:
```

Create `Caddyfile`:

```caddyfile
replane.yourdomain.com {
    reverse_proxy app:8080
}
```

Update `.env`:

```bash
BASE_URL=https://replane.yourdomain.com
```

Remove port mapping from app service (Caddy handles it):

```yaml
app:
  # Remove: ports: - "8080:8080"
  # Caddy will proxy to app:8080
```

Restart:

```bash
docker-compose down
docker-compose up -d
```

Caddy automatically obtains and renews Let's Encrypt certificates.

## HTTPS with Nginx

Alternatively, use Nginx:

```nginx title="nginx.conf"
server {
    listen 80;
    server_name replane.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name replane.yourdomain.com;

    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;

    location / {
        proxy_pass http://app:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## Backups

### Database Backups

Create a backup script `backup.sh`:

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
docker-compose exec -T db pg_dump -U postgres replane > backup_$DATE.sql
gzip backup_$DATE.sql
```

Run daily via cron:

```bash
0 2 * * * /path/to/backup.sh
```

### Restore from Backup

```bash
gunzip backup_20250116_020000.sql.gz
docker-compose exec -T db psql -U postgres replane < backup_20250116_020000.sql
```

## Updates

Update to the latest version:

```bash
# Pull latest image
docker-compose pull app

# Restart (migrations run automatically)
docker-compose up -d app

# Check logs
docker-compose logs -f app
```

## Monitoring

### Health Check

```bash
curl https://replane.yourdomain.com/api/health
```

### Logs

```bash
# Follow logs
docker-compose logs -f app

# Last 100 lines
docker-compose logs --tail=100 app
```

### Metrics

Monitor:

- CPU and memory usage
- Database connections
- Response times
- SSE connection count

Use tools like Prometheus, Grafana, or your cloud provider's monitoring.

## Scaling

### Multiple App Instances

Use Docker Swarm or Kubernetes to run multiple app instances behind a load balancer.

### Database Read Replicas

For read-heavy workloads, configure PostgreSQL read replicas:

```yaml
app:
  environment:
    DATABASE_URL: postgresql://postgres:pass@db-primary:5432/replane
    DATABASE_READ_URL: postgresql://postgres:pass@db-replica:5432/replane
```

## Troubleshooting

### Container won't start

Check logs:

```bash
docker-compose logs app
```

Common issues:

- Missing environment variables
- Database connection errors
- Invalid OAuth configuration

### Database connection failed

Ensure PostgreSQL is healthy:

```bash
docker-compose ps db
```

Check connectivity:

```bash
docker-compose exec app sh -c 'psql $DATABASE_URL -c "SELECT 1"'
```

### OAuth callback errors

Verify:

- Callback URL matches OAuth provider settings exactly
- BASE_URL environment variable is correct
- OAuth credentials are valid

## Next Steps

- [**Environment Variables**](./environment-variables) - Full configuration reference
