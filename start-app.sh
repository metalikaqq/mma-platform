#!/bin/bash

# MMA Platform Startup Script
# This script starts the backend and opens the frontend when ready

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
BACKEND_URL="http://localhost:3000"
GRAPHQL_URL="http://localhost:3000/graphql"
HEALTH_URL="http://localhost:3000/health"
FRONTEND_FILE="mma-platform-frontend.html"
MAX_WAIT_TIME=60

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

log_debug() {
    echo -e "${BLUE}[DEBUG]${NC} $1"
}

check_backend_running() {
    if curl -s "$HEALTH_URL" > /dev/null 2>&1; then
        return 0
    else
        return 1
    fi
}

wait_for_backend() {
    log_info "Waiting for backend to be ready..."
    local wait_time=0
    
    while [ $wait_time -lt $MAX_WAIT_TIME ]; do
        if check_backend_running; then
            log_info "Backend is ready! ✅"
            return 0
        fi
        
        echo -n "."
        sleep 2
        wait_time=$((wait_time + 2))
    done
    
    log_error "Backend failed to start within $MAX_WAIT_TIME seconds"
    return 1
}

start_backend() {
    log_info "Starting NestJS backend..."
    
    # Check if Node.js is installed
    if ! command -v node &> /dev/null; then
        log_error "Node.js is not installed. Please install Node.js first."
        exit 1
    fi
    
    # Check if dependencies are installed
    if [ ! -d "node_modules" ]; then
        log_info "Installing dependencies..."
        npm install
    fi
    
    # Start the backend in development mode
    log_info "Starting backend in development mode..."
    npm run start:dev &
    BACKEND_PID=$!
    
    # Wait for backend to be ready
    if wait_for_backend; then
        log_info "Backend started successfully with PID: $BACKEND_PID"
        return 0
    else
        log_error "Failed to start backend"
        kill $BACKEND_PID 2>/dev/null || true
        return 1
    fi
}

open_frontend() {
    log_info "Opening frontend..."
    
    if [ ! -f "$FRONTEND_FILE" ]; then
        log_error "Frontend file '$FRONTEND_FILE' not found!"
        return 1
    fi
    
    # Detect OS and open appropriately
    case "$(uname -s)" in
        Darwin)  # macOS
            open "$FRONTEND_FILE"
            ;;
        Linux)   # Linux
            if command -v xdg-open &> /dev/null; then
                xdg-open "$FRONTEND_FILE"
            else
                log_warn "Cannot auto-open browser on Linux. Please open $FRONTEND_FILE manually."
            fi
            ;;
        CYGWIN*|MINGW*|MSYS*) # Windows
            start "$FRONTEND_FILE"
            ;;
        *)
            log_warn "Unknown OS. Please open $FRONTEND_FILE manually."
            ;;
    esac
    
    log_info "Frontend should now be open in your default browser"
    log_info "Backend API: $BACKEND_URL"
    log_info "GraphQL Playground: $GRAPHQL_URL"
}

cleanup() {
    log_info "Cleaning up..."
    if [ ! -z "$BACKEND_PID" ]; then
        log_info "Stopping backend (PID: $BACKEND_PID)"
        kill $BACKEND_PID 2>/dev/null || true
    fi
}

show_usage() {
    echo "Usage: $0 [OPTION]"
    echo ""
    echo "Options:"
    echo "  start       Start backend and open frontend (default)"
    echo "  stop        Stop the backend"
    echo "  restart     Restart backend and open frontend"
    echo "  status      Check backend status"
    echo "  frontend    Open frontend only (backend must be running)"
    echo "  help        Show this help message"
}

check_status() {
    if check_backend_running; then
        log_info "Backend is running ✅"
        curl -s "$HEALTH_URL" | python -m json.tool 2>/dev/null || echo "Health check response received"
    else
        log_warn "Backend is not running ❌"
    fi
}

stop_backend() {
    log_info "Stopping backend..."
    
    # Try to find and kill the process
    PIDS=$(pgrep -f "nest start" 2>/dev/null || echo "")
    
    if [ -z "$PIDS" ]; then
        log_warn "No backend process found"
    else
        for PID in $PIDS; do
            log_info "Killing process $PID"
            kill $PID 2>/dev/null || true
        done
        
        # Wait a bit and check if processes are gone
        sleep 2
        if pgrep -f "nest start" > /dev/null 2>&1; then
            log_warn "Some processes may still be running. You might need to kill them manually."
        else
            log_info "Backend stopped successfully"
        fi
    fi
}

# Set up signal handlers
trap cleanup EXIT INT TERM

# Main logic
case "${1:-start}" in
    "start")
        log_info "🚀 Starting MMA Platform..."
        
        if check_backend_running; then
            log_info "Backend is already running!"
        else
            start_backend || exit 1
        fi
        
        open_frontend
        
        log_info "✅ MMA Platform is ready!"
        log_info "Press Ctrl+C to stop the backend and exit"
        
        # Keep script running to maintain the backend
        wait
        ;;
        
    "stop")
        stop_backend
        ;;
        
    "restart")
        stop_backend
        sleep 2
        $0 start
        ;;
        
    "status")
        check_status
        ;;
        
    "frontend")
        if check_backend_running; then
            open_frontend
        else
            log_error "Backend is not running. Please start it first with: $0 start"
            exit 1
        fi
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
