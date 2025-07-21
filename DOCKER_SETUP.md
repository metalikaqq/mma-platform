# MMA Platform Docker Setup Guide

## 🐳 Docker Configuration

The MMA Platform includes a complete Docker setup for easy development and deployment. This guide covers building, running, and deploying the application using Docker and Docker Compose.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) (version 20.10 or higher)
- [Docker Compose](https://docs.docker.com/compose/install/) (version 2.0 or higher)

## Quick Start with Docker

### 1. Environment Configuration

Copy the example environment file and configure it:

```bash
cp .env.example .env
```

Edit `.env` file with your preferred settings:

```bash
# Database Configuration
DB_USERNAME=postgres
DB_PASSWORD=admin
DB_NAME=mma_platform

# Application Configuration
NODE_ENV=development
PORT=3000

# PgAdmin Configuration (optional)
PGADMIN_EMAIL=admin@mma-platform.com
PGADMIN_PASSWORD=admin
```

### 2. Quick Start Options

#### Option A: Complete Application Startup (Recommended)

Use our startup scripts to automatically start the backend and open the frontend:

```bash
# Cross-platform Node.js script (recommended)
npm run app:start
# or
node start-app.js start

# Windows Batch file
start-app.bat start

# Windows PowerShell
.\start-app.ps1 start

# Bash script (Linux/macOS/Git Bash)
./start-app.sh start
```

This will:
- Start the NestJS backend on port 3000
- Wait for the backend to be ready
- Automatically open the frontend HTML file in your browser
- Show all necessary URLs for testing

#### Option B: Docker with Database

```bash
# Build and start all services
docker-compose up --build

# Or run in detached mode
docker-compose up --build -d
```

The application will be available at:
- **API**: <http://localhost:3000>
- **GraphQL Playground**: <http://localhost:3000/graphql>

### 3. Available Startup Commands

```bash
# Start everything (backend + frontend)
npm run app:start           # Start and open frontend
npm run app:stop            # Stop backend
npm run app:restart         # Restart backend and open frontend
npm run app:status          # Check if backend is running
npm run app:frontend        # Open frontend only (if backend running)

# Traditional development
npm run start:dev           # Start backend only
npm run dev                 # Start backend + serve frontend on port 8080

# Docker commands
npm run docker:up           # Docker compose up
npm run docker:down         # Docker compose down
npm run docker:logs         # View logs
```

### 3. Optional Services

Start with additional tools (PgAdmin for database management):

```bash
# Start with PgAdmin
docker-compose --profile tools up --build

# Start with Redis caching
docker-compose --profile cache up --build
```

Access PgAdmin at http://localhost:8080 with credentials from your `.env` file.

## Docker Commands Reference

### Building and Running

```bash
# Build the Docker image
npm run docker:build
# or
docker build -t mma-platform .

# Run the container
npm run docker:run
# or
docker run -p 3000:3000 --env-file .env mma-platform

# Start with Docker Compose
npm run docker:up
# or
docker-compose up --build

# Stop all services
npm run docker:down
# or
docker-compose down
```

### Development Commands

```bash
# View logs
npm run docker:logs
# or
docker-compose logs -f app

# Execute commands in running container
docker-compose exec app npm run migration:run
docker-compose exec app npm run db:seed

# Access container shell
docker-compose exec app sh

# Restart services
docker-compose restart

# Remove all containers and volumes
docker-compose down -v
```

### Database Operations

```bash
# Run migrations
docker-compose exec app npm run migration:run

# Generate new migration
docker-compose exec app npm run migration:generate -- src/migrations/NewMigration

# Revert last migration
docker-compose exec app npm run migration:revert

# Clear and seed database
docker-compose exec app npm run db:clear
docker-compose exec app npm run db:seed
```

## Production Deployment

### 1. Build Production Image

```bash
# Build optimized production image
docker build -t yourusername/mma-platform:latest .

# Test the production image locally
docker run -p 3000:3000 --env-file .env yourusername/mma-platform:latest
```

### 2. Push to Registry

```bash
# Login to Docker Hub
docker login

# Push to registry
docker push yourusername/mma-platform:latest
```

### 3. Production Docker Compose

Create a `docker-compose.prod.yml` for production:

```yaml
version: '3.8'

services:
  app:
    image: yourusername/mma-platform:latest
    container_name: mma-platform-app
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_HOST=postgres
      - DATABASE_PORT=5432
      - DATABASE_USERNAME=${DB_USERNAME}
      - DATABASE_PASSWORD=${DB_PASSWORD}
      - DATABASE_NAME=${DB_NAME}
    depends_on:
      postgres:
        condition: service_healthy
    networks:
      - mma-network
    restart: unless-stopped

  postgres:
    image: postgres:14-alpine
    container_name: mma-platform-db
    environment:
      - POSTGRES_USER=${DB_USERNAME}
      - POSTGRES_PASSWORD=${DB_PASSWORD}
      - POSTGRES_DB=${DB_NAME}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - mma-network
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USERNAME} -d ${DB_NAME}"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:

networks:
  mma-network:
    driver: bridge
```

Deploy with:

```bash
docker-compose -f docker-compose.prod.yml up -d
```

## Architecture Overview

### Multi-Stage Build

The Dockerfile uses a multi-stage build for optimization:

1. **Builder Stage**: Installs all dependencies and builds the application
2. **Production Stage**: Creates a minimal runtime image with only production dependencies

### Services

- **app**: NestJS application container
- **postgres**: PostgreSQL database with persistent storage
- **redis** (optional): For caching and background jobs
- **pgadmin** (optional): Database administration tool

### Volumes

- **postgres_data**: Persistent PostgreSQL data
- **redis_data**: Redis data persistence (if using cache profile)
- **pgadmin_data**: PgAdmin configuration (if using tools profile)

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Application environment | `development` |
| `PORT` | Application port | `3000` |
| `DATABASE_HOST` | Database host | `postgres` |
| `DATABASE_PORT` | Database port | `5432` |
| `DATABASE_USERNAME` | Database username | `postgres` |
| `DATABASE_PASSWORD` | Database password | `admin` |
| `DATABASE_NAME` | Database name | `mma_platform` |

### Health Checks

The setup includes health checks for:
- **PostgreSQL**: Checks database connectivity
- **Application**: Basic node.js health check

## Troubleshooting

### Common Issues

1. **Port already in use**:
   ```bash
   # Change ports in docker-compose.yml or stop conflicting services
   docker-compose down
   ```

2. **Database connection refused**:
   ```bash
   # Check if postgres service is healthy
   docker-compose ps
   docker-compose logs postgres
   ```

3. **Permission denied**:
   ```bash
   # On Linux/macOS, ensure Docker daemon is running
   sudo systemctl start docker
   ```

4. **Out of disk space**:
   ```bash
   # Clean up Docker resources
   docker system prune -a
   docker volume prune
   ```

### Database Issues

1. **Reset database**:
   ```bash
   docker-compose down -v
   docker-compose up --build
   ```

2. **Access database directly**:
   ```bash
   docker-compose exec postgres psql -U postgres -d mma_platform
   ```

3. **Backup/Restore**:
   ```bash
   # Backup
   docker-compose exec postgres pg_dump -U postgres mma_platform > backup.sql
   
   # Restore
   docker-compose exec -T postgres psql -U postgres mma_platform < backup.sql
   ```

## Testing

### API Testing

Test the GraphQL API:

```bash
# Check if service is running
curl http://localhost:3000/health

# Test GraphQL endpoint
curl -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ __schema { types { name } } }"}'
```

### Load Testing

Use Docker for load testing:

```bash
# Run multiple instances
docker-compose up --scale app=3
```

## Security Considerations

### Production Security

1. **Use secrets management** for sensitive environment variables
2. **Enable SSL/TLS** with reverse proxy (nginx, traefik)
3. **Update base images** regularly for security patches
4. **Use non-root user** (already implemented in Dockerfile)
5. **Scan images** for vulnerabilities:

   ```bash
   docker scan yourusername/mma-platform:latest
   ```

### Network Security

The Docker setup includes:
- Isolated network for services communication
- No direct external access to database
- Health checks for service monitoring

## Monitoring and Logging

### Viewing Logs

```bash
# Application logs
docker-compose logs -f app

# Database logs
docker-compose logs -f postgres

# All services logs
docker-compose logs -f
```

### Log Aggregation

For production, consider using:
- ELK Stack (Elasticsearch, Logstash, Kibana)
- Fluentd
- Prometheus + Grafana

## Next Steps

1. **Set up CI/CD pipeline** with Docker
2. **Add monitoring** with health endpoints
3. **Implement caching** with Redis
4. **Add rate limiting** for API protection
5. **Set up backup strategy** for production data

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [NestJS Docker Guide](https://docs.nestjs.com/recipes/serve-static)
- [PostgreSQL Docker Hub](https://hub.docker.com/_/postgres)
