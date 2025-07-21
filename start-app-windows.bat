@echo off
setlocal

echo [INFO] Starting MMA Platform...

REM Check if Node.js is available
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if npm is available
where npm >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] npm is not available
    echo Please ensure Node.js is properly installed
    pause
    exit /b 1
)

REM Check if dependencies are installed
if not exist "node_modules" (
    echo [INFO] Installing dependencies...
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to install dependencies
        pause
        exit /b 1
    )
)

echo [INFO] Starting NestJS backend...
start /b "" cmd /c "npm run start:dev"

echo [INFO] Waiting for backend to be ready...
timeout /t 10 /nobreak >nul

REM Try to check if backend is running
curl -s http://localhost:3000/health >nul 2>&1
if %errorlevel% equ 0 (
    echo [INFO] Backend is ready!
) else (
    echo [WARN] Backend might still be starting...
)

echo [INFO] Opening frontend...
if exist "mma-platform-frontend.html" (
    start "" "mma-platform-frontend.html"
    echo [INFO] Frontend opened in browser
) else (
    echo [ERROR] Frontend file not found
)

echo.
echo [INFO] MMA Platform is starting!
echo [INFO] Backend API: http://localhost:3000
echo [INFO] GraphQL Playground: http://localhost:3000/graphql
echo [INFO] Health Check: http://localhost:3000/health
echo.
echo Press any key to stop the backend...
pause >nul

echo [INFO] Stopping backend...
taskkill /f /im node.exe >nul 2>&1
echo [INFO] Backend stopped
