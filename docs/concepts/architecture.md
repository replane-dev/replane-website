---
title: Architecture
description: How Replane works - system design, realtime updates, and data flow
---

# Architecture

This page explains how Replane is designed and how data flows through the system.

## System overview

Replane uses a unified architecture where the same Docker image serves both the dashboard and SDK API. This enables flexible deployment — from a single instance for self-hosting to globally distributed edge servers for Replane Cloud.

```
                               ╭──────────────────╮
                               │    PostgreSQL    │
                               │  Source of Truth │
                               ╰────────┬─────────╯
                                        │
              ┌─────────────────────────┼─────────────────────────┐
              │                         │                         │
              ▼                         ▼                         ▼
     ╭─────────────────╮       ╭─────────────────╮       ╭─────────────────╮
     │     Replane     │       │     Replane     │       │     Replane     │
     │    Region A     │       │    Region B     │       │    Region C     │
     │  ·············  │       │  ·············  │       │  ·············  │
     │  Dashboard      │       │  Dashboard      │       │  Dashboard      │
     │  SDK API        │       │  SDK API        │       │  SDK API        │
     │  SQLite cache   │       │  SQLite cache   │       │  SQLite cache   │
     ╰────────┬────────╯       ╰────────┬────────╯       ╰────────┬────────╯
              │                         │                         │
              │ SSE                     │ SSE                     │ SSE
              ▼                         ▼                         ▼
     ╭─────────────────╮       ╭─────────────────╮       ╭─────────────────╮
     │    Your Apps    │       │    Your Apps    │       │    Your Apps    │
     │  ·············  │       │  ·············  │       │  ·············  │
     │   local cache   │       │   local cache   │       │   local cache   │
     ╰─────────────────╯       ╰─────────────────╯       ╰─────────────────╯
```

**Key characteristics:**

- **Single image**: One Docker image serves dashboard, SDK API, and edge functionality
- **Pull-based replication**: Each instance pulls changes from PostgreSQL and caches locally
- **Horizontal scaling**: Deploy multiple instances behind a load balancer
- **High availability**: Each node operates independently — as long as one node is running, clients receive configs
- **Low latency**: SDKs connect to the nearest instance for fast config reads

## Components

### Dashboard

The web UI for managing configs, users, and projects. Create and edit configs, set up override rules, view version history, and manage access control.

### SDK API

The API that SDK clients connect to:
- Bearer token authentication (SDK keys)
- Server-Sent Events (SSE) for realtime updates
- Serves configs from local cache for fast responses

### PostgreSQL

The source of truth for all data:
- Configs, versions, and audit logs
- User accounts and permissions
- Workspace and project settings

### Local SQLite cache

Each Replane instance replicates all configs to a local SQLite database:
- Enables fast reads without hitting PostgreSQL
- Keeps the instance operational if PostgreSQL is temporarily unavailable
- Syncs automatically when changes occur

## Realtime updates

Replane uses Server-Sent Events (SSE) for realtime config updates.

### How it works

```
SDK Client                    Replane Server                Database
    │                              │                           │
    │ POST /api/sdk/v1/            │                           │
    │   replication/stream         │                           │
    │ ─────────────────────────────▶                           │
    │                              │                           │
    │◀─────────────────────────────│                           │
    │   SSE: init                  │                           │
    │   (all current configs)      │                           │
    │                              │                           │
    │                              │                           │
    │   ... connection open ...    │                           │
    │                              │                           │
    │                              │  Config changed           │
    │                              │◀──────────────────────────│
    │◀─────────────────────────────│                           │
    │   SSE: config_change         │                           │
    │   (updated config)           │                           │
    │                              │                           │
```

### Event types

| Event | Description |
|-------|-------------|
| `init` | Initial payload with all configs for the project |
| `config_change` | Single config was created, updated, or deleted |

### Connection lifecycle

1. SDK connects via `POST /api/sdk/v1/replication/stream`
2. Server sends `init` event with all current configs
3. Connection stays open
4. Server pushes `config_change` events as they occur
5. SDK automatically reconnects on disconnect

## Override evaluation

Overrides are evaluated client-side in the SDK for low latency.

### Evaluation flow

```
1. replane.get('feature-flag', { context: { plan: 'premium' } })
                 │
                 ▼
2. Find config in local cache
                 │
                 ▼
3. Iterate through overrides in order
                 │
                 ▼
4. For each override:
   - Evaluate all conditions against context
   - If all conditions match → return override value
                 │
                 ▼
5. No override matched → return base value
```

## Data model

### Entity relationships

```
Workspace (1) ──────────────── (N) Project
                                      │
                                      │
              ┌───────────────────────┼───────────────────────┐
              │                       │                       │
              ▼                       ▼                       ▼
        Environment (N)          Config (N)            SDK Key (N)
              │                       │
              │                       │
              ▼                       ▼
     Config Variant (N)      Config Version (N)
     (env-specific values)   (immutable history)
```

### Key tables

| Table | Purpose |
|-------|---------|
| `workspaces` | Organizational units |
| `projects` | Config containers |
| `project_environments` | Deployment targets |
| `configs` | Configuration definitions |
| `config_versions` | Immutable change history |
| `config_variants` | Per-environment values |
| `sdk_keys` | API authentication tokens |
| `audit_logs` | Change audit trail |

## Security

### Authentication

- **Dashboard**: NextAuth.js with OAuth providers or email/password
- **SDK API**: Bearer token authentication with hashed SDK keys

### Authorization

- **Workspace level**: Admin and member roles
- **Project level**: Admin and maintainer roles
- SDK keys provide read-only access to their project

### Data protection

- SDK keys are hashed before storage
- Passwords use Argon2 hashing
- SSL/TLS support for database connections
- Audit logs are immutable

## Scalability

### Single instance

Suitable for most deployments:
- Handles thousands of SDK connections
- PostgreSQL connection pooling
- In-memory config cache

### High availability

For larger deployments, run multiple Replane instances behind a load balancer:

```
                              ╭─────────────────╮
                              │  Load Balancer  │
                              ╰────────┬────────╯
                                       │
              ┌────────────────────────┼────────────────────────┐
              │                        │                        │
              ▼                        ▼                        ▼
     ╭─────────────────╮      ╭─────────────────╮      ╭─────────────────╮
     │    Replane 1    │      │    Replane 2    │      │    Replane 3    │
     │  ·············  │      │  ·············  │      │  ·············  │
     │  SQLite cache   │      │  SQLite cache   │      │  SQLite cache   │
     ╰────────┬────────╯      ╰────────┬────────╯      ╰────────┬────────╯
              │                        │                        │
              └────────────────────────┼────────────────────────┘
                                       │
                              ╭────────┴────────╮
                              │   PostgreSQL    │
                              ╰─────────────────╯
```

- Each instance operates independently with its own SQLite cache
- All instances connect to shared PostgreSQL
- If one instance fails, others continue serving configs
- SSE connections are distributed across instances

## Next steps

- [Self-Hosting](/docs/self-hosting/docker) — Deploy Replane
- [Environment Variables](/docs/self-hosting/environment-variables) — Configuration reference
- [JavaScript SDK](/docs/sdk/javascript) — Client integration
