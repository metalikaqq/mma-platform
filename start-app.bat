@echo off
setlocal enabledelayedexpansion

REM MMA Platform Startup Script for Windows
REM This script starts the backend and opens the frontend when ready

set BACKEND_URL=http://localhost:3000
set HEALTH_URL=http://localhost:3000/health
set GRAPHQL_URL=http://localhost:3000/graphql
set FRONTEND_FILE=mma-platform-frontend.html
set MAX_WAIT_TIME=60

REM Colors (if supported)
set GREEN=[32m
set RED=[31m
set YELLOW=[33m
set BLUE=[34m
set NC=[0m

goto :main

:log_info
echo [INFO] %~1
exit /b

:log_warn
echo [WARN] %~1
exit /b

:log_error
echo [ERROR] %~1
exit /b

:check_backend_running
curl -s %HEALTH_URL% >nul 2>&1
if %errorlevel% equ 0 (
    exit /b 0
) else (
    exit /b 1
)

:wait_for_backend
call :log_info "Waiting for backend to be ready..."
set wait_time=0

:wait_loop
call :check_backend_running
if %errorlevel% equ 0 (
    call :log_info "Backend is ready!"
    exit /b 0
)

if !wait_time! geq %MAX_WAIT_TIME% (
    call :log_error "Backend failed to start within %MAX_WAIT_TIME% seconds"
    exit /b 1
)

echo|set /p="."
timeout /t 2 /nobreak >nul
set /a wait_time+=2
goto :wait_loop

:start_backend
call :log_info "Starting NestJS backend..."

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    call :log_error "Node.js is not installed. Please install Node.js first."
    exit /b 1
)

REM Check if dependencies are installed
if not exist "node_modules" (
    call :log_info "Installing dependencies..."
    call npm install
)

REM Start the backend in development mode
call :log_info "Starting backend in development mode..."
start /b "" npm run start:dev

REM Wait for backend to be ready
call :wait_for_backend
if %errorlevel% equ 0 (
    call :log_info "Backend started successfully"
    exit /b 0
) else (
    call :log_error "Failed to start backend"
    exit /b 1
)

:open_frontend
call :log_info "Opening frontend..."

if not exist "%FRONTEND_FILE%" (
    call :log_error "Frontend file '%FRONTEND_FILE%' not found!"
    exit /b 1
)

REM Open the HTML file with default browser
start "" "%FRONTEND_FILE%"

call :log_info "Frontend should now be open in your default browser"
call :log_info "Backend API: %BACKEND_URL%"
call :log_info "GraphQL Playground: %GRAPHQL_URL%"
exit /b 0

:check_status
call :check_backend_running
if %errorlevel% equ 0 (
    call :log_info "Backend is running"
    curl -s %HEALTH_URL%
) else (
    call :log_warn "Backend is not running"
)
exit /b

:stop_backend
call :log_info "Stopping backend..."

REM Kill Node.js processes running NestJS
for /f "tokens=2" %%i in ('tasklist /fi "imagename eq node.exe" /fo table /nh 2^>nul ^| findstr /i "node.exe"') do (
    call :log_info "Killing process %%i"
    taskkill /pid %%i /f >nul 2>&1
)

call :log_info "Backend stopped"
exit /b

:show_usage
echo Usage: %~nx0 [OPTION]
echo.
echo Options:
echo   start       Start backend and open frontend (default)
echo   stop        Stop the backend
echo   restart     Restart backend and open frontend
echo   status      Check backend status
echo   frontend    Open frontend only (backend must be running)
echo   help        Show this help message
exit /b

:main
set action=%~1
if "%action%"=="" set action=start

if "%action%"=="start" goto :start_action
if "%action%"=="stop" goto :stop_action
if "%action%"=="restart" goto :restart_action
if "%action%"=="status" goto :status_action
if "%action%"=="frontend" goto :frontend_action
if "%action%"=="help" goto :help_action
if "%action%"=="-h" goto :help_action
if "%action%"=="--help" goto :help_action

call :log_error "Invalid option: %action%"
call :show_usage
exit /b 1

:start_action
call :log_info "Starting MMA Platform..."

call :check_backend_running
if %errorlevel% equ 0 (
    call :log_info "Backend is already running!"
) else (
    call :start_backend
    if %errorlevel% neq 0 exit /b 1
)

call :open_frontend

call :log_info "MMA Platform is ready!"
call :log_info "Press Ctrl+C to stop"

REM Keep window open
pause >nul
goto :EOF

:stop_action
call :stop_backend
goto :EOF

:restart_action
call :stop_backend
timeout /t 2 /nobreak >nul
call "%~f0" start
goto :EOF

:status_action
call :check_status
goto :EOF

:frontend_action
call :check_backend_running
if %errorlevel% equ 0 (
    call :open_frontend
) else (
    call :log_error "Backend is not running. Please start it first with: %~nx0 start"
    exit /b 1
)
goto :EOF

:help_action
call :show_usage
goto :EOF
