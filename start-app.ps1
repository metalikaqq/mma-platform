# MMA Platform Startup Script for PowerShell
# This script starts the backend and opens the frontend when ready

param(
    [string]$Action = "start"
)

# Configuration
$BACKEND_URL = "http://localhost:3000"
$HEALTH_URL = "http://localhost:3000/health"
$GRAPHQL_URL = "http://localhost:3000/graphql"
$FRONTEND_FILE = "mma-platform-frontend.html"
$MAX_WAIT_TIME = 60

# Function to write colored output
function Write-ColorOutput($ForegroundColor) {
    $fc = $host.UI.RawUI.ForegroundColor
    $host.UI.RawUI.ForegroundColor = $ForegroundColor
    if ($args) {
        Write-Output $args
    } else {
        $input | Write-Output
    }
    $host.UI.RawUI.ForegroundColor = $fc
}

function Log-Info($message) {
    Write-ColorOutput Green "[INFO] $message"
}

function Log-Warn($message) {
    Write-ColorOutput Yellow "[WARN] $message"
}

function Log-Error($message) {
    Write-ColorOutput Red "[ERROR] $message"
}

# Check if backend is running
function Test-BackendRunning {
    try {
        $response = Invoke-WebRequest -Uri $HEALTH_URL -TimeoutSec 5 -UseBasicParsing
        return $response.StatusCode -eq 200
    }
    catch {
        return $false
    }
}

# Wait for backend to be ready
function Wait-ForBackend {
    Log-Info "Waiting for backend to be ready..."
    $waitTime = 0
    
    while ($waitTime -lt $MAX_WAIT_TIME) {
        if (Test-BackendRunning) {
            Log-Info "Backend is ready! ✅"
            return $true
        }
        
        Write-Host "." -NoNewline
        Start-Sleep -Seconds 2
        $waitTime += 2
    }
    
    Log-Error "Backend failed to start within $MAX_WAIT_TIME seconds"
    return $false
}

# Start the backend
function Start-Backend {
    Log-Info "Starting NestJS backend..."
    
    # Check if Node.js is installed
    try {
        node --version | Out-Null
    }
    catch {
        Log-Error "Node.js is not installed. Please install Node.js first."
        exit 1
    }
    
    # Check if dependencies are installed
    if (-not (Test-Path "node_modules")) {
        Log-Info "Installing dependencies..."
        npm install
    }
    
    # Start the backend in development mode
    Log-Info "Starting backend in development mode..."
    $backendProcess = Start-Process "npm" -ArgumentList "run", "start:dev" -PassThru -WindowStyle Hidden
    
    # Wait for backend to be ready
    if (Wait-ForBackend) {
        Log-Info "Backend started successfully with PID: $($backendProcess.Id)"
        return $backendProcess
    }
    else {
        Log-Error "Failed to start backend"
        Stop-Process -Id $backendProcess.Id -Force -ErrorAction SilentlyContinue
        return $null
    }
}

# Open frontend in browser
function Open-Frontend {
    Log-Info "Opening frontend..."
    
    if (-not (Test-Path $FRONTEND_FILE)) {
        Log-Error "Frontend file '$FRONTEND_FILE' not found!"
        return $false
    }
    
    # Open the HTML file with default browser
    Start-Process $FRONTEND_FILE
    
    Log-Info "Frontend should now be open in your default browser"
    Log-Info "Backend API: $BACKEND_URL"
    Log-Info "GraphQL Playground: $GRAPHQL_URL"
    return $true
}

# Check status
function Get-BackendStatus {
    if (Test-BackendRunning) {
        Log-Info "Backend is running ✅"
        try {
            $health = Invoke-RestMethod -Uri $HEALTH_URL -TimeoutSec 5
            Write-Output "Health info:"
            $health | ConvertTo-Json -Depth 3
        }
        catch {
            Write-Output "Health check passed"
        }
    }
    else {
        Log-Warn "Backend is not running ❌"
    }
}

# Stop backend
function Stop-Backend {
    Log-Info "Stopping backend..."
    
    # Find and kill Node.js processes running NestJS
    Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object {
        $_.CommandLine -like "*nest start*"
    } | ForEach-Object {
        Log-Info "Killing process $($_.Id)"
        Stop-Process -Id $_.Id -Force
    }
    
    Log-Info "Backend stopped"
}

# Show usage
function Show-Usage {
    Write-Output @"
Usage: .\start-app.ps1 [OPTION]

Options:
  start       Start backend and open frontend (default)
  stop        Stop the backend
  restart     Restart backend and open frontend
  status      Check backend status
  frontend    Open frontend only (backend must be running)
  help        Show this help message
"@
}

# Main logic
switch ($Action.ToLower()) {
    "start" {
        Log-Info "🚀 Starting MMA Platform..."
        
        if (Test-BackendRunning) {
            Log-Info "Backend is already running!"
            $backendProcess = $null
        }
        else {
            $backendProcess = Start-Backend
            if (-not $backendProcess) {
                exit 1
            }
        }
        
        Open-Frontend
        
        Log-Info "✅ MMA Platform is ready!"
        Log-Info "Press Ctrl+C to stop the backend and exit"
        
        # Keep script running and handle cleanup
        try {
            while ($true) {
                Start-Sleep -Seconds 1
            }
        }
        finally {
            if ($backendProcess) {
                Log-Info "Stopping backend process..."
                Stop-Process -Id $backendProcess.Id -Force -ErrorAction SilentlyContinue
            }
        }
    }
    
    "stop" {
        Stop-Backend
    }
    
    "restart" {
        Stop-Backend
        Start-Sleep -Seconds 2
        & $PSCommandPath "start"
    }
    
    "status" {
        Get-BackendStatus
    }
    
    "frontend" {
        if (Test-BackendRunning) {
            Open-Frontend
        }
        else {
            Log-Error "Backend is not running. Please start it first with: .\start-app.ps1 start"
            exit 1
        }
    }
    
    "help" {
        Show-Usage
    }
    
    default {
        Log-Error "Invalid option: $Action"
        Show-Usage
        exit 1
    }
}
