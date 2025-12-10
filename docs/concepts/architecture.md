---
sidebar_position: 2
---

# Architecture

Replane's architecture is straightforward: a Next.js web app backed by PostgreSQL.

## System Components

```
┌─────────────────┐
│   Web Browser   │
│   (React UI)    │
└────────┬────────┘
         │
         │ HTTPS
         ↓
┌─────────────────┐
│   Next.js App   │
│   (API + UI)    │
└────────┬────────┘
         │
         │ PostgreSQL
         ↓
┌─────────────────┐
│   PostgreSQL    │
│   (Database)    │
└─────────────────┘
```

## Technology Stack

- **Frontend**: React with Next.js App Router
- **Backend**: Next.js API routes + custom server (for SSE)
- **Database**: PostgreSQL 14+
- **Authentication**: OAuth (GitHub or Okta)
- **Realtime**: Server-Sent Events (SSE)

## Data Model

### Projects

Each project is isolated and contains:

- Configs
- Snapshots (version history)
- Team members
- SDK keys
- Audit log entries

### Configs

A config has:

- Name (unique per project)
- Current value (JSON)
- Optional JSON schema
- List of snapshots (versions)

### Snapshots

Each snapshot stores:

- Config value at that point in time
- Who created it
- When it was created
- Version number (auto-incrementing)

Snapshots are **append-only**. Rollbacks create new snapshots pointing to old values.

### SDK Keys

Each SDK key:

- Belongs to one project
- Has a hashed token
- Can be revoked (soft delete)

## Authentication Flow

1. User clicks "Sign in with GitHub/Okta"
2. OAuth provider authenticates user
3. Replane receives user info and creates/updates account
4. Session cookie is set
5. User is redirected to dashboard

SDK keys use Bearer token authentication:

```http
Authorization: Bearer your-api-key-here
```

## Realtime Updates (SSE)

When a client calls `watchConfigValue`:

1. SDK opens an SSE connection to `/api/v1/configs/{name}/watch`
2. Server streams the current value immediately
3. On config updates, server pushes new values to all connected clients
4. Client SDK updates the in-memory value automatically

SSE is unidirectional (server → client) and works over HTTP/1.1. It's simpler than WebSockets for this use case.

## Security

- **HTTPS required** in production (use a reverse proxy like Nginx or Caddy)
- **Session cookies** are httpOnly and secure
- **SDK keys** are hashed with bcrypt before storage
- **SQL injection** prevented by parameterized queries
- **CSRF protection** via Next.js middleware

## Scalability

Replane is designed for **tens of thousands of configs** and **hundreds of users**:

- Database queries are optimized with indexes
- SSE connections are lightweight (one per watcher)
- No heavy background jobs or queues

For larger deployments:

- Use read replicas for API requests
- Load balance multiple app instances
- Keep SSE connections on dedicated instances

## Backups

All state is in PostgreSQL. Use standard backup tools:

```bash
# Backup
pg_dump -U postgres replane > backup.sql

# Restore
psql -U postgres replane < backup.sql
```

## Deployment

See the [Self-Hosting Guide](../self-hosting/docker) for deployment instructions.

## Next Steps

- [**Self-Hosting**](../self-hosting/docker) - Deploy Replane
- [**Environment Variables**](../self-hosting/environment-variables) - Configuration reference
- [**Guides**](../guides/feature-flags) - Common use cases
