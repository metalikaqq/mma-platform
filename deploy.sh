#!/bin/bash

# MMA Platform Deployment Script
# This script builds and deploys the MMA platform using Docker

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
IMAGE_NAME="mma-platform"
REGISTRY_URL="${REGISTRY_URL:-}"
VERSION="${VERSION:-latest}"

# Functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

check_requirements() {
    log_info "Checking requirements..."
    
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        log_error "Docker Compose is not installed"
        exit 1
    fi
    
    if [ ! -f ".env" ]; then
        log_warn ".env file not found, copying from .env.example"
        cp .env.example .env
    fi
    
    log_info "Requirements check passed"
}

build_image() {
    log_info "Building Docker image..."
    
    docker build -t ${IMAGE_NAME}:${VERSION} .
    
    if [ $? -eq 0 ]; then
        log_info "Docker image built successfully"
    else
        log_error "Failed to build Docker image"
        exit 1
    fi
}

run_tests() {
    log_info "Running tests..."
    
    # Run tests in a temporary container
    docker run --rm -v $(pwd):/app -w /app node:18-alpine sh -c "npm ci && npm test"
    
    if [ $? -eq 0 ]; then
        log_info "Tests passed"
    else
        log_error "Tests failed"
        exit 1
    fi
}

deploy_development() {
    log_info "Deploying to development environment..."
    
    docker-compose down
    docker-compose up --build -d
    
    # Wait for services to be healthy
    log_info "Waiting for services to be ready..."
    sleep 30
    
    # Check if services are running
    if docker-compose ps | grep -q "Up"; then
        log_info "Development deployment successful"
        log_info "Application available at: http://localhost:3000"
        log_info "GraphQL Playground: http://localhost:3000/graphql"
    else
        log_error "Development deployment failed"
        docker-compose logs
        exit 1
    fi
}

deploy_production() {
    log_info "Deploying to production environment..."
    
    if [ -z "$REGISTRY_URL" ]; then
        log_error "REGISTRY_URL environment variable is required for production deployment"
        exit 1
    fi
    
    # Tag and push image
    docker tag ${IMAGE_NAME}:${VERSION} ${REGISTRY_URL}/${IMAGE_NAME}:${VERSION}
    docker push ${REGISTRY_URL}/${IMAGE_NAME}:${VERSION}
    
    # Deploy with production compose file
    docker-compose -f docker-compose.prod.yml down
    docker-compose -f docker-compose.prod.yml up -d
    
    log_info "Production deployment successful"
}

run_migrations() {
    log_info "Running database migrations..."
    
    docker-compose exec app npm run migration:run
    
    if [ $? -eq 0 ]; then
        log_info "Migrations completed successfully"
    else
        log_error "Migration failed"
        exit 1
    fi
}

seed_database() {
    log_info "Seeding database..."
    
    docker-compose exec app npm run db:seed
    
    if [ $? -eq 0 ]; then
        log_info "Database seeded successfully"
    else
        log_warn "Database seeding failed or no seed data"
    fi
}

show_usage() {
    echo "Usage: $0 [OPTION]"
    echo ""
    echo "Options:"
    echo "  dev         Deploy to development environment"
    echo "  prod        Deploy to production environment"
    echo "  build       Build Docker image only"
    echo "  test        Run tests only"
    echo "  migrate     Run database migrations"
    echo "  seed        Seed database with initial data"
    echo "  logs        Show application logs"
    echo "  stop        Stop all services"
    echo "  clean       Clean up Docker resources"
    echo "  help        Show this help message"
}

show_logs() {
    docker-compose logs -f app
}

stop_services() {
    log_info "Stopping all services..."
    docker-compose down
    log_info "Services stopped"
}

clean_docker() {
    log_info "Cleaning up Docker resources..."
    
    # Stop and remove containers
    docker-compose down -v
    
    # Remove unused images
    docker image prune -f
    
    # Remove unused volumes
    docker volume prune -f
    
    log_info "Docker cleanup completed"
}

# Main script logic
case "$1" in
    "dev")
        check_requirements
        build_image
        deploy_development
        run_migrations
        seed_database
        ;;
    "prod")
        check_requirements
        run_tests
        build_image
        deploy_production
        run_migrations
        ;;
    "build")
        check_requirements
        build_image
        ;;
    "test")
        check_requirements
        run_tests
        ;;
    "migrate")
        run_migrations
        ;;
    "seed")
        seed_database
        ;;
    "logs")
        show_logs
        ;;
    "stop")
        stop_services
        ;;
    "clean")
        clean_docker
        ;;
    "help"|"--help"|"-h")
        show_usage
        ;;
    *)
        log_error "Invalid option: $1"
        show_usage
        exit 1
        ;;
esac
