#!/bin/bash

echo "🚀 Starting MMA Platform with Docker Compose..."

# Function to check Docker connectivity
check_docker_connectivity() {
    docker info > /dev/null 2>&1
    return $?
}

# Check Docker service
if ! check_docker_connectivity; then
    echo "❌ Docker service is not running or not accessible"
    echo "💡 Please make sure Docker Desktop is running"
    exit 1
fi

# Check internet connectivity to Docker Hub
echo "🔍 Checking Docker registry connectivity..."
if ! curl -s --connect-timeout 5 https://registry-1.docker.io/v2/ > /dev/null; then
    echo "⚠️ Warning: Cannot reach Docker registry"
    echo "💡 You may have network connectivity issues"
    echo "   - Try using a VPN or different network connection"
    echo "   - Check your firewall settings"
    echo "   - Docker may use cached images if available"
fi

# Start docker-compose with retry
MAX_RETRIES=3
RETRY_COUNT=0

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    echo "🔄 Starting Docker containers (attempt $((RETRY_COUNT+1))/$MAX_RETRIES)..."
    docker-compose up --build -d
    
    if [ $? -eq 0 ]; then
        echo "✅ Docker containers started successfully"
        echo "🔍 Waiting for server to be ready..."
        break
    else
        RETRY_COUNT=$((RETRY_COUNT+1))
        if [ $RETRY_COUNT -ge $MAX_RETRIES ]; then
            echo "❌ Failed to start Docker containers after $MAX_RETRIES attempts"
            echo "💡 Troubleshooting tips:"
            echo "   - Check your internet connection"
            echo "   - Try running 'docker pull node:16-alpine' manually"
            echo "   - Check Docker Desktop status"
            echo "   - Look at logs with 'docker-compose logs'"
            exit 1
        fi
        echo "⏳ Waiting before retry..."
        sleep 5
    fi
done

# Function to check if server is responding
check_server() {
    curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/graphql 2>/dev/null
}

# Wait for server to be ready
max_attempts=60
attempt=0

while [ $attempt -lt $max_attempts ]; do
    attempt=$((attempt + 1))
    echo "⏳ Checking server status (attempt $attempt/$max_attempts)..."
    
    # Check if server responds with 200 (OK) or 400 (Bad Request - GraphQL without query)
    status_code=$(check_server)
    
    if [ "$status_code" = "200" ] || [ "$status_code" = "400" ]; then
        echo "✅ Server is ready!"
        echo "🌐 Opening MMA Platform Frontend..."
        
        # Get absolute path to HTML file
        html_file="$(pwd)/mma-platform-frontend.html"
        
        # Detect OS and open browser accordingly
        if [[ "$OSTYPE" == "darwin"* ]]; then
            # macOS
            open "$html_file"
        elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]] || [[ "$OSTYPE" == "win32" ]]; then
            # Windows (Git Bash, Cygwin, or native Windows)
            start "$html_file"
        else
            # Linux
            xdg-open "$html_file" 2>/dev/null || firefox "$html_file" 2>/dev/null || google-chrome "$html_file" 2>/dev/null
        fi
        
        echo ""
        echo "🎉 MMA Platform is now running!"
        echo "📊 Backend API: http://localhost:3000/graphql"
        echo "🖥️  Frontend UI: file://$html_file"
        echo ""
        echo "📋 Available commands:"
        echo "  docker-compose logs -f     - View logs"
        echo "  docker-compose down        - Stop containers"
        echo "  docker-compose ps          - Check container status"
        echo ""
        exit 0
    fi
    
    if [ $attempt -eq 1 ]; then
        echo "💡 Server starting up, this may take a moment..."
    fi
    
    sleep 2
done

echo "❌ Server failed to start within $((max_attempts * 2)) seconds"
echo "🔍 Check container logs with: docker-compose logs"
exit 1
