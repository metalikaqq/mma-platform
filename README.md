# MMA Platform

A NestJS-based MMA management platform with GraphQL API and web frontend.

## Quick Start

### Option 1: Manual Docker Setup

```bash
docker compose up --build
```

This will build and start the application containers. Once running, manually open `mma-platform-frontend.html` in your browser.

### Option 2: Auto-Launch (Recommended)

```bash
./start-with-frontend.sh
```

This script will:

1. Build and start Docker containers (`docker compose up --build`)
2. Wait for the server to be ready
3. Automatically open `mma-platform-frontend.html` in your browser

## Access Points

- **GraphQL API**: <http://localhost:3000/graphql>
- **Frontend**: Open `mma-platform-frontend.html` file in browser

## Requirements

- Docker and Docker Compose
- For auto-launch script: `curl` command (usually pre-installed)

## Database

The application uses PostgreSQL running in a Docker container. Database is automatically initialized with seed data on first run.
