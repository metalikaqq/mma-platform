# MMA Platform - Quick Start Guide

## 🚀 Easy Application Startup

This guide shows you the easiest way to start your MMA Platform application for testing and development.

## Prerequisites

- Node.js (version 16 or higher)
- npm or yarn
- A database (PostgreSQL) - can be local or Docker

## 🎯 Recommended Quick Start

### 1. Clone and Setup

```bash
git clone <your-repo>
cd mma-platform
npm install
```

### 2. Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your settings (optional - defaults work with Docker)
# DATABASE_HOST=localhost
# DATABASE_PORT=5432
# DATABASE_USERNAME=postgres
# DATABASE_PASSWORD=admin
# DATABASE_NAME=mma_platform
```

### 3. Start Everything with One Command

Choose your preferred method:

#### Option A: Complete Application (Recommended)

```bash
# This will start backend + open frontend automatically
npm run app:start
```

**What this does:**
1. ✅ Checks if Node.js and dependencies are installed
2. ✅ Starts the NestJS backend on port 3000
3. ✅ Waits for the backend to be ready (health check)
4. ✅ Automatically opens `mma-platform-frontend.html` in your browser
5. ✅ Shows you all the important URLs

#### Option B: Docker with Database

```bash
# Start backend + PostgreSQL database
docker-compose up --build
```

Then open `mma-platform-frontend.html` manually in your browser.

## 📋 Available Commands

### Application Management

```bash
npm run app:start          # Start backend + open frontend
npm run app:stop           # Stop the backend
npm run app:restart        # Restart everything
npm run app:status         # Check if backend is running
npm run app:frontend       # Open frontend only (backend must be running)
```

### Traditional Development

```bash
npm run start:dev          # Start backend only (development mode)
npm run dev                # Start backend + serve frontend on port 8080
npm run start:prod         # Start backend (production mode)
```

### Database Operations

```bash
npm run migration:run      # Run database migrations
npm run db:seed           # Seed database with initial data
npm run db:clear          # Clear all data
```

### Docker Operations

```bash
npm run docker:up         # Start with Docker Compose
npm run docker:down       # Stop Docker services
npm run docker:logs       # View application logs
npm run docker:build      # Build Docker image
```

## 🖥️ Platform-Specific Scripts

### Windows Users

#### Command Prompt / PowerShell
```cmd
# Batch file
start-app.bat start

# PowerShell
.\start-app.ps1 start
```

#### Git Bash / WSL
```bash
./start-app.sh start
```

### macOS / Linux Users

```bash
./start-app.sh start
```

### Cross-Platform (Node.js)

```bash
node start-app.js start
```

## 🌐 Access Points

Once started, your application will be available at:

- **Frontend UI**: Opens automatically in your browser
- **Backend API**: http://localhost:3000
- **GraphQL Playground**: http://localhost:3000/graphql
- **Health Check**: http://localhost:3000/health
- **Database** (if using Docker): localhost:5432

## 🧪 Testing the Application

### 1. Quick Test

After starting with `npm run app:start`, the frontend should open automatically. You can:

1. **Create Weight Classes** - Start with "Lightweight", "Welterweight", etc.
2. **Add Fighters** - Create some fighters in different weight classes
3. **Create Events** - Add events like "UFC 300"
4. **Schedule Fights** - Create fights between fighters
5. **View Rankings** - Check the rankings after fights

### 2. GraphQL Testing

Visit http://localhost:3000/graphql and try these queries:

```graphql
# Get all weight classes
query {
  weightClasses {
    id
    name
  }
}

# Get all fighters
query {
  fighters {
    id
    name
    wins
    losses
    weightClass {
      name
    }
  }
}
```

### 3. API Testing

```bash
# Health check
curl http://localhost:3000/health

# GraphQL query
curl -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ weightClasses { id name } }"}'
```

## 🔧 Troubleshooting

### Backend Won't Start

1. **Check Node.js version**: `node --version` (should be 16+)
2. **Install dependencies**: `npm install`
3. **Check database**: Make sure PostgreSQL is running
4. **Check ports**: Ensure port 3000 is not in use

### Frontend Won't Open

1. **Check file exists**: Ensure `mma-platform-frontend.html` is in the project root
2. **Manual open**: Double-click the HTML file or drag to browser
3. **Check backend**: Ensure backend is running at http://localhost:3000

### Database Connection Issues

1. **Using Docker**: Run `docker-compose up` to start PostgreSQL
2. **Local database**: Check your `.env` file settings
3. **Run migrations**: `npm run migration:run`

### Common Error Solutions

```bash
# Port already in use
npm run app:stop
# Wait a few seconds, then
npm run app:start

# Dependencies issues
rm -rf node_modules package-lock.json
npm install

# Database issues
npm run migration:run
npm run db:seed
```

## 🚦 Quick Status Check

```bash
# Check what's running
npm run app:status

# View logs
npm run docker:logs  # For Docker
# or check terminal where you ran npm run app:start
```

## 📱 Development Workflow

### Typical Development Session

```bash
# 1. Start everything
npm run app:start

# 2. Make code changes (backend automatically reloads)

# 3. Test in browser (frontend automatically reflects backend changes)

# 4. When done
npm run app:stop
```

### Frontend Development

The `mma-platform-frontend.html` file is a single-page application that connects to your GraphQL API. You can:

- Edit the HTML file directly
- Refresh the browser to see changes
- Use browser dev tools for debugging
- Check the Network tab to see GraphQL requests

## 🐳 Docker Alternative

If you prefer Docker for everything:

```bash
# Start with Docker (includes database)
docker-compose up --build

# In another terminal, open frontend
npm run app:frontend

# Or open mma-platform-frontend.html manually
```

## 📚 Next Steps

1. **Learn GraphQL**: Visit http://localhost:3000/graphql to explore the API
2. **Add data**: Use the frontend to create fighters, events, and fights
3. **Check rankings**: See how the ranking system works
4. **Explore code**: Look at the NestJS backend structure
5. **Customize**: Modify the frontend HTML for your needs

## 🆘 Need Help?

- **Backend issues**: Check the terminal where you ran `npm run app:start`
- **Frontend issues**: Open browser dev tools (F12)
- **Database issues**: Check `docker-compose logs` if using Docker
- **API issues**: Test with GraphQL playground at http://localhost:3000/graphql

## ⚡ Pro Tips

- Use `npm run app:restart` to quickly restart everything
- The frontend file updates the API URL automatically
- Health check endpoint helps verify everything is working
- Use browser bookmarks for quick access to GraphQL playground
