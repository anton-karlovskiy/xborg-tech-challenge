# Microservices Architecture

This project has been refactored to use a microservices architecture with NestJS microservices and Redis as the message broker.

## Architecture Overview

The application is split into three main components:

1. **API Gateway** (`main.ts`) - Receives HTTP requests and forwards them to microservices via Redis
2. **Auth Microservice** (`main-auth.ts`) - Handles authentication operations (Google OAuth login, logout)
3. **User Microservice** (`main-user.ts`) - Handles user profile operations (read, update)

## Components

### API Gateway

- **File**: `src/main.ts`
- **Module**: `src/gateway/gateway.module.ts`
- **Controller**: `src/gateway/gateway.controller.ts`
- **Purpose**: Acts as the entry point for all HTTP requests, proxies them to appropriate microservices via Redis message broker

### Auth Microservice

- **File**: `src/main-auth.ts`
- **Module**: `src/auth/auth-microservice.module.ts`
- **Controller**: `src/auth/auth.microservice.ts`
- **Message Patterns**:
  - `auth.login.google` - Handles Google OAuth login
  - `auth.logout` - Handles logout

### User Microservice

- **File**: `src/main-user.ts`
- **Module**: `src/user/user-microservice.module.ts`
- **Controller**: `src/user/user.microservice.ts`
- **Message Patterns**:
  - `user.readProfile` - Retrieves user profile
  - `user.updateProfile` - Updates user profile

## Prerequisites

1. **Redis Server**: You need Redis running locally or accessible via network
   - Default: `localhost:6379`
   - Can be configured via environment variables

## Environment Variables

Add these to your `.env` file:

```env
# Redis (for microservices)
REDIS_HOST="localhost"
REDIS_PORT=6379
```

## Running the Application

### Option 1: Run All Services Together (Recommended for Development)

```bash
npm run start:microservices
```

This will start:
- API Gateway on port 3001 (or PORT from .env)
- Auth Microservice (listening on Redis)
- User Microservice (listening on Redis)

### Option 2: Run Services Individually

In separate terminal windows:

**Terminal 1 - API Gateway:**
```bash
npm run start:gateway
```

**Terminal 2 - Auth Microservice:**
```bash
npm run start:auth
```

**Terminal 3 - User Microservice:**
```bash
npm run start:user
```

### Option 3: Run in Production Mode

Build first:
```bash
npm run build
```

Then run each service:
```bash
# Terminal 1
node dist/main.js

# Terminal 2
node dist/main-auth.js

# Terminal 3
node dist/main-user.js
```

## How It Works

1. **Client Request**: Frontend sends HTTP request to API Gateway (e.g., `POST /api/auth/login/google`)

2. **Gateway Processing**: Gateway receives the request, validates it, and sends a message to the appropriate microservice via Redis

3. **Microservice Processing**: The microservice receives the message, processes it, and returns a response

4. **Response**: Gateway receives the response from the microservice and sends it back to the client

## Message Flow Example

### Login Flow

1. Client → `POST /api/auth/login/google` → API Gateway
2. API Gateway → Redis message `auth.login.google` → Auth Microservice
3. Auth Microservice processes login, creates/updates user, generates JWT
4. Auth Microservice → Response → API Gateway
5. API Gateway sets cookie and returns user data → Client

### Profile Read Flow

1. Client → `GET /api/user/profile` (with JWT cookie) → API Gateway
2. API Gateway validates JWT (via JwtAuthGuard)
3. API Gateway → Redis message `user.readProfile` → User Microservice
4. User Microservice queries database and returns user data
5. User Microservice → Response → API Gateway
6. API Gateway → Client

## Benefits of This Architecture

1. **Separation of Concerns**: Each microservice handles a specific domain
2. **Scalability**: Each microservice can be scaled independently
3. **Technology Flexibility**: Different microservices can use different technologies if needed
4. **Fault Isolation**: If one microservice fails, others continue to work
5. **Independent Deployment**: Each microservice can be deployed independently

## Development Notes

- All microservices share the same database (SQLite file) - this is fine for this use case
- The API Gateway handles HTTP concerns (cookies, CORS, validation)
- Microservices focus on business logic
- Redis acts as the message broker between gateway and microservices
- JWT validation happens at the Gateway level before forwarding to User microservice

## Troubleshooting

### Redis Connection Issues

If you see connection errors, ensure Redis is running:

```bash
# Check if Redis is running
redis-cli ping
# Should return: PONG
```

### Port Conflicts

Make sure the PORT in your `.env` is not already in use, and Redis is accessible on the configured host/port.

### Microservice Not Responding

Ensure all three services are running:
- API Gateway
- Auth Microservice
- User Microservice

All services must be running for the application to work correctly.

