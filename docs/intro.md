---
sidebar_position: 1
---

# Welcome to Replane

Replane is a self-hosted application for managing JSON configuration with **version history**, **instant rollback**, **realtime updates**, and **full audit trails**.

## What is Replane?

Replane helps you manage application configuration that changes frequently without requiring code deployments. It's perfect for:

- **Feature flags** - Toggle features on/off without deploying
- **Operational tuning** - Adjust cache TTLs, batch sizes, rate limits in realtime
- **Gradual rollouts** - Control percentages or cohorts for new features
- **Incident mitigation** - Quickly revert to a known-good configuration
- **Cross-service settings** - Share configuration across multiple applications

## Key Features

- **Version History** - Every change creates an append-only snapshot with full audit trail
- **Instant Rollback** - Revert to any previous version with one click
- **Realtime Updates** - Changes propagate via Server-Sent Events (SSE) with zero polling
- **JSON Schema Validation** - Prevent invalid configurations before they're saved
- **Role-Based Access** - Owner, editor, and viewer roles with API key support
- **Self-Hosted** - Run on your infrastructure with full data ownership

## Status

Replane is **early but usable**. Expect changes to schemas and endpoints before v1.0.

## Quick Links

- [**Quickstart Guide**](./getting-started/quickstart) - Get Replane running in 5 minutes
- [**Core Concepts**](./concepts/overview) - Understand how Replane works
- [**Self-Hosting Guide**](./self-hosting/docker) - Deploy with Docker
- [**JavaScript SDK**](./sdk/javascript) - Use Replane in Node.js or browsers

## Community

- **GitHub**: [replane-dev/replane](https://github.com/replane-dev/replane)
- **Issues**: [Report bugs or request features](https://github.com/replane-dev/replane/issues)
- **License**: MIT
