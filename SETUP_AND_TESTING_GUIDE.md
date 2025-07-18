# MMA Platform Setup and Testing Guide

## Prerequisites
- Node.js (version 16 or higher)
- npm (included with Node.js)
- PostgreSQL database (version 12 or higher)
- Modern web browser (Chrome, Firefox, Safari, Edge)

## Project Setup

### 1. Clone and Install Dependencies

```bash
# Clone the repository (if not already done)
git clone <repository-url>
cd mma-platform

# Install all dependencies
npm install
```

### 2. Database Setup

#### Install PostgreSQL
- **Windows**: Download from [postgresql.org](https://www.postgresql.org/download/windows/)
- **macOS**: Use Homebrew: `brew install postgresql`
- **Linux**: Use package manager: `sudo apt-get install postgresql`

#### Create Database
```sql
-- Connect to PostgreSQL as superuser
psql -U postgres

-- Create database
CREATE DATABASE mma_platform;

-- Create user (optional, but recommended)
CREATE USER mma_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE mma_platform TO mma_user;

-- Exit psql
\q
```

### 3. Environment Configuration

Create a `.env` file in the project root:

```bash
# Database Configuration
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=admin
DATABASE_NAME=mma_platform

# Application Configuration
NODE_ENV=development
PORT=3000

# Optional: Logging
LOG_LEVEL=debug
```

**Note**: Replace the database credentials with your actual PostgreSQL setup.

### 4. Database Initialization

```bash
# The application will automatically create tables on first run
# due to TypeORM synchronize: true setting

# Optional: Clear database (if needed)
npm run db:clear

# Optional: Seed with sample data
npm run db:seed
```

## Running the Application

```bash
# Terminal 1: Start backend server
npm run start:dev

# Terminal 2: Start frontend (in separate terminal)
npm run frontend
```

### Method 3: Production Build

```bash
# Build the application
npm run build

# Run in production mode
npm run start:prod
```

## Verification Steps

### 1. Backend Verification

After starting the backend, verify it's working:

- **API Health**: Visit `http://localhost:3000`
- **GraphQL Playground**: Visit `http://localhost:3000/graphql`
- **Database Connection**: Check console logs for "Database connected successfully"

### 2. Frontend Verification

The frontend should automatically open in your browser. If not:

```bash
# Open frontend manually
npm run frontend:open
```

### 3. API Testing

Test basic GraphQL queries in the playground:

```graphql
# Test query - Get all weight classes
query {
  weightClasses {
    id
    name
  }
}

# Test mutation - Create weight class
mutation {
  createWeightClass(input: { name: "Lightweight" }) {
    id
    name
  }
}
```

## Available npm Scripts

- `npm run dev`: Start both backend and frontend
- `npm run start:dev`: Start backend in development mode with hot reload
- `npm run start:prod`: Start backend in production mode  
- `npm run build`: Build the application for production
- `npm run frontend`: Start frontend with HTTP server
- `npm run frontend:open`: Open frontend directly in browser

## Application Architecture

### Backend (NestJS + GraphQL)
- **API Endpoint**: `http://localhost:3000`
- **GraphQL Playground**: `http://localhost:3000/graphql`
- **Database**: PostgreSQL with TypeORM
- **Features**: CRUD operations for fighters, events, fights, rankings

### Frontend (HTML + JavaScript)
- **File**: `mma-platform-frontend.html`
- **Technology**: Vanilla JavaScript with GraphQL client
- **Features**: Complete admin interface for all backend operations

## Complete Testing Workflow

### 1. Initial Setup Verification

```bash
# Check if backend starts without errors
npm run start:dev

# Verify database connection in console logs
# Look for: "Database connected successfully"

# Test GraphQL endpoint
curl http://localhost:3000/graphql
```

### 2. Backend API Testing

#### Using GraphQL Playground (`http://localhost:3000/graphql`)

**Test Database Connection:**
```graphql
query {
  weightClasses {
    id
    name
  }
}
```

**Create Sample Data:**
```graphql
# Create weight classes
mutation {
  lightweight: createWeightClass(input: { name: "Lightweight" }) { id name }
  welterweight: createWeightClass(input: { name: "Welterweight" }) { id name }
  middleweight: createWeightClass(input: { name: "Middleweight" }) { id name }
}

# Create fighters
mutation {
  createFighter(input: { 
    name: "John Doe", 
    birthDate: "1990-01-01",
    weightClassId: "WEIGHT_CLASS_ID_HERE"
  }) {
    id
    name
    weightClass { name }
  }
}

# Create event
mutation {
  createEvent(input: {
    name: "UFC 300",
    location: "Las Vegas, NV",
    date: "2024-12-31"
  }) {
    id
    name
    location
  }
}
```

### 3. Frontend Testing

#### Access Methods
```bash
# Method 1: Complete platform
start-platform.bat

# Method 2: Frontend only (requires backend running)
npm run frontend:open

# Method 3: Development server
npm run frontend
```

#### Frontend Feature Testing

**Complete Workflow Test:**

1. **Weight Classes Setup**
   - Create: Lightweight, Welterweight, Middleweight, Light Heavyweight, Heavyweight
   - Verify: All classes appear in dropdowns
   - Test: Duplicate cleanup functionality

2. **Fighters Management**
   - Create 2-3 fighters per weight class
   - Include both required and optional fields
   - Verify: Statistics display correctly

3. **Events Creation**
   - Create multiple events with different dates
   - Test: Past and future event handling
   - Verify: Events appear in fight creation dropdown

4. **Fights Scheduling**
   - Create fights between fighters in same weight class
   - Test: Cross-weight class validation (should fail)
   - Verify: Rankings update after fight results

5. **Rankings Verification**
   - Check rankings for each weight class
   - Verify: Points calculation is correct
   - Test: Ranking updates after new fights

## Troubleshooting
