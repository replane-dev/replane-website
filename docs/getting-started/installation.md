---
sidebar_position: 2
---

# Installation Methods

Replane can be deployed using Docker (recommended) or from source.

## Docker (Recommended)

The simplest way to run Replane is using the official Docker image.

### Prerequisites

- Docker 20.10+
- Docker Compose v2.0+ (optional but recommended)
- PostgreSQL 14+ (can run in Docker)

### Quick Start

See the [Quickstart Guide](./quickstart) for a step-by-step walkthrough.

### Using docker run

```bash
# Start PostgreSQL
docker run -d \
  --name replane-db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=replane \
  -v replane-db:/var/lib/postgresql/data \
  postgres:17

# Start Replane
docker run -d \
  --name replane \
  --link replane-db:db \
  -e DATABASE_URL=postgresql://postgres:postgres@db:5432/replane \
  -e BASE_URL=http://localhost:8080 \
  -e SECRET_KEY_BASE=your-secret-key-here \
  -e GITHUB_CLIENT_ID=your-github-client-id \
  -e GITHUB_CLIENT_SECRET=your-github-client-secret \
  -p 8080:8080 \
  ghcr.io/replane-dev/replane:latest
```

## From Source

For development or customization, you can run Replane from source.

### Prerequisites

- Node.js 22+
- pnpm 9+
- PostgreSQL 14+

### Steps

1. **Clone the repository**:

```bash
git clone https://github.com/replane-dev/replane.git
cd replane
```

2. **Install dependencies**:

```bash
pnpm install
```

3. **Set up environment variables**:

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env` with your settings:

```bash
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/replane
BASE_URL=http://localhost:8080
SECRET_KEY_BASE=generate-a-random-string-here

# GitHub OAuth
GITHUB_CLIENT_ID=your-client-id
GITHUB_CLIENT_SECRET=your-client-secret
```

4. **Run database migrations**:

```bash
pnpm db:migrate
```

5. **Start the development server**:

```bash
pnpm dev
```

Replane will be available at `http://localhost:8080`.

### Build for Production

```bash
pnpm build
pnpm start
```

## Environment Variables

See [Environment Variables](../self-hosting/environment-variables) for a complete reference.

## Next Steps

- [**Quickstart Guide**](./quickstart) - Get started with Docker
- [**Self-Hosting**](../self-hosting/docker) - Production deployment
- [**Configuration**](../self-hosting/environment-variables) - Environment variables reference
