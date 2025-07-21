#!/usr/bin/env node

const { spawn, exec } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

// Configuration
const CONFIG = {
    BACKEND_URL: 'http://localhost:3000',
    HEALTH_URL: 'http://localhost:3000/health',
    GRAPHQL_URL: 'http://localhost:3000/graphql',
    FRONTEND_FILE: 'mma-platform-frontend.html',
    MAX_WAIT_TIME: 60000, // 60 seconds
    CHECK_INTERVAL: 2000   // 2 seconds
};

// Colors for console output
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m'
};

// Logging functions
function log(level, message, color = colors.reset) {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`${color}[${timestamp}] [${level}]${colors.reset} ${message}`);
}

const logger = {
    info: (msg) => log('INFO', msg, colors.green),
    warn: (msg) => log('WARN', msg, colors.yellow),
    error: (msg) => log('ERROR', msg, colors.red),
    debug: (msg) => log('DEBUG', msg, colors.blue)
};

// Check if backend is running
function checkBackendRunning() {
    return new Promise((resolve) => {
        const req = http.get(CONFIG.HEALTH_URL, (res) => {
            resolve(res.statusCode === 200);
        });
        
        req.on('error', () => {
            resolve(false);
        });
        
        req.setTimeout(5000, () => {
            req.destroy();
            resolve(false);
        });
    });
}

// Wait for backend to be ready
function waitForBackend() {
    return new Promise((resolve, reject) => {
        logger.info('Waiting for backend to be ready...');
        
        const startTime = Date.now();
        
        const checkInterval = setInterval(async () => {
            const isRunning = await checkBackendRunning();
            
            if (isRunning) {
                clearInterval(checkInterval);
                logger.info('Backend is ready! ✅');
                resolve(true);
                return;
            }
            
            if (Date.now() - startTime > CONFIG.MAX_WAIT_TIME) {
                clearInterval(checkInterval);
                logger.error(`Backend failed to start within ${CONFIG.MAX_WAIT_TIME / 1000} seconds`);
                reject(new Error('Backend startup timeout'));
                return;
            }
            
            process.stdout.write('.');
        }, CONFIG.CHECK_INTERVAL);
    });
}

// Start the backend
function startBackend() {
    return new Promise((resolve, reject) => {
        logger.info('Starting NestJS backend...');
        
        // Check if node_modules exists
        if (!fs.existsSync('node_modules')) {
            logger.info('Installing dependencies...');
            const npmInstall = spawn('npm', ['install'], { stdio: 'inherit' });
            
            npmInstall.on('close', (code) => {
                if (code !== 0) {
                    reject(new Error('Failed to install dependencies'));
                    return;
                }
                startNestApp();
            });
        } else {
            startNestApp();
        }
        
        function startNestApp() {
            logger.info('Starting backend in development mode...');
            
            const backend = spawn('npm', ['run', 'start:dev'], {
                stdio: 'pipe',
                detached: false
            });
            
            backend.stdout.on('data', (data) => {
                const output = data.toString();
                if (output.includes('started') || output.includes('listening')) {
                    logger.debug('Backend output: ' + output.trim());
                }
            });
            
            backend.stderr.on('data', (data) => {
                const error = data.toString();
                if (!error.includes('ExperimentalWarning')) {
                    logger.error('Backend error: ' + error.trim());
                }
            });
            
            backend.on('close', (code) => {
                if (code !== 0) {
                    logger.error(`Backend process exited with code ${code}`);
                }
            });
            
            // Store the process for cleanup
            process.backend = backend;
            
            // Wait for backend to be ready
            waitForBackend()
                .then(() => {
                    logger.info(`Backend started successfully with PID: ${backend.pid}`);
                    resolve(backend);
                })
                .catch(reject);
        }
    });
}

// Open frontend in browser
function openFrontend() {
    logger.info('Opening frontend...');
    
    if (!fs.existsSync(CONFIG.FRONTEND_FILE)) {
        logger.error(`Frontend file '${CONFIG.FRONTEND_FILE}' not found!`);
        return false;
    }
    
    const frontendPath = path.resolve(CONFIG.FRONTEND_FILE);
    let command;
    
    switch (os.platform()) {
        case 'darwin': // macOS
            command = `open "${frontendPath}"`;
            break;
        case 'win32': // Windows
            command = `start "" "${frontendPath}"`;
            break;
        default: // Linux and others
            command = `xdg-open "${frontendPath}"`;
            break;
    }
    
    exec(command, (error) => {
        if (error) {
            logger.warn(`Cannot auto-open browser. Please open ${CONFIG.FRONTEND_FILE} manually.`);
            logger.warn(`Error: ${error.message}`);
        } else {
            logger.info('Frontend should now be open in your default browser');
        }
    });
    
    logger.info(`Backend API: ${CONFIG.BACKEND_URL}`);
    logger.info(`GraphQL Playground: ${CONFIG.GRAPHQL_URL}`);
    
    return true;
}

// Check status
async function checkStatus() {
    const isRunning = await checkBackendRunning();
    
    if (isRunning) {
        logger.info('Backend is running ✅');
        
        // Try to get health info
        try {
            const req = http.get(CONFIG.HEALTH_URL, (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => {
                    try {
                        const health = JSON.parse(data);
                        console.log('Health info:', health);
                    } catch (e) {
                        console.log('Health check passed');
                    }
                });
            });
            req.on('error', () => {});
        } catch (e) {
            // Ignore errors
        }
    } else {
        logger.warn('Backend is not running ❌');
    }
}

// Stop backend
function stopBackend() {
    logger.info('Stopping backend...');
    
    if (process.backend) {
        process.backend.kill('SIGTERM');
        logger.info('Backend stopped');
    } else {
        logger.warn('No backend process found');
    }
}

// Cleanup function
function cleanup() {
    logger.info('Cleaning up...');
    stopBackend();
}

// Show usage
function showUsage() {
    console.log(`
Usage: node ${path.basename(__filename)} [OPTION]

Options:
  start       Start backend and open frontend (default)
  stop        Stop the backend
  restart     Restart backend and open frontend
  status      Check backend status
  frontend    Open frontend only (backend must be running)
  help        Show this help message
`);
}

// Main function
async function main() {
    const action = process.argv[2] || 'start';
    
    // Set up signal handlers
    process.on('SIGINT', cleanup);
    process.on('SIGTERM', cleanup);
    process.on('exit', cleanup);
    
    try {
        switch (action) {
            case 'start':
                logger.info('🚀 Starting MMA Platform...');
                
                const isAlreadyRunning = await checkBackendRunning();
                if (isAlreadyRunning) {
                    logger.info('Backend is already running!');
                } else {
                    await startBackend();
                }
                
                openFrontend();
                
                logger.info('✅ MMA Platform is ready!');
                logger.info('Press Ctrl+C to stop the backend and exit');
                
                // Keep process running
                process.stdin.resume();
                break;
                
            case 'stop':
                stopBackend();
                break;
                
            case 'restart':
                stopBackend();
                setTimeout(() => {
                    main();
                }, 2000);
                break;
                
            case 'status':
                await checkStatus();
                break;
                
            case 'frontend':
                const isRunning = await checkBackendRunning();
                if (isRunning) {
                    openFrontend();
                } else {
                    logger.error('Backend is not running. Please start it first with: node start-app.js start');
                    process.exit(1);
                }
                break;
                
            case 'help':
            case '--help':
            case '-h':
                showUsage();
                break;
                
            default:
                logger.error(`Invalid option: ${action}`);
                showUsage();
                process.exit(1);
        }
    } catch (error) {
        logger.error(`Error: ${error.message}`);
        process.exit(1);
    }
}

// Run the script
if (require.main === module) {
    main();
}

module.exports = {
    startBackend,
    checkBackendRunning,
    openFrontend,
    checkStatus,
    stopBackend
};
