# MMA Platform - Quick Start Guide

## 🚀 Getting Started

The fastest way to r## Troubleshooting

### Docker Issues

1. **Make sure Docker is running**
2. **Check if ports 3000 and 5432 are available**
3. **Try rebuilding**: `docker compose up --build --force-recreate`
4. **Network connectivity issues**:
   - If you see errors about Docker registry connectivity:
   - Check your internet connection
   - Try using a different network or VPN
   - Run `docker pull node:16-alpine` manually first
   - Add DNS entries: `8.8.8.8` and `8.8.4.4` to your Docker DNS settings

### Frontend Won't Open

1. **Check if `mma-platform-frontend.html` exists** in the project root
2. **Manual open**: Double-click the HTML file or drag to browser
3. **Check backend**: Ensure server is running at <http://localhost:3000/graphql>

### Script Permission Issues (Linux/macOS)

```bash
chmod +x start-with-frontend.sh
``` application.

## Prerequisites

- Docker and Docker Compose
- `curl` command (usually pre-installed)

## Quick Start Options

### Option 1: Auto-Launch (Recommended)

```bash
./start-with-frontend.sh
```

**What this does:**

1. ✅ Builds and starts Docker containers (`docker compose up --build`)
2. ✅ Waits for the server to be fully ready
3. ✅ Automatically opens `mma-platform-frontend.html` in your browser

### Option 2: Manual Docker

```bash
docker compose up --build
```

Then manually open `mma-platform-frontend.html` in your browser.

## 🌐 Access Points

Once started, your application will be available at:

- **GraphQL API**: <http://localhost:3000/graphql>
- **Frontend**: Open `mma-platform-frontend.html` file in browser

## 🧪 Testing the Application

### Quick Test

After starting, the frontend will open automatically. You can:

1. **Create Weight Classes** - Start with "Lightweight", "Welterweight", etc.
2. **Add Fighters** - Create fighters in different weight classes
3. **Create Events** - Add events like "UFC 300"
4. **Schedule Fights** - Create fights between fighters
5. **View Rankings** - Check rankings after fights

### GraphQL Testing

Visit <http://localhost:3000/graphql> and try these queries:

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

## 🔧 Troubleshooting

### Docker Issues

1. **Make sure Docker is running**
2. **Check if ports 3000 and 5432 are available**
3. **Try rebuilding**: `docker compose up --build --force-recreate`

### Frontend Won't Open

1. **Check if `mma-platform-frontend.html` exists** in the project root
2. **Manual open**: Double-click the HTML file or drag to browser
3. **Check backend**: Ensure server is running at <http://localhost:3000/graphql>

### Script Permission Issues (Linux/macOS)

```bash
chmod +x start-with-frontend.sh
```