# XBorg Tech Challenge

A full-stack application with Google OAuth authentication and user profile management.

> 📄 [View Challenge Details](./Full%20Stack%20Engineer%20Technical%20Challenge.pdf)

## Tech Stack

### Backend

- **NestJS** - Progressive Node.js framework
- **TypeORM** - ORM for database interactions
- **SQLite** - Database engine
- **JWT** - Authentication tokens
- **Passport** - Authentication middleware

### Frontend

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type safety
- **TailwindCSS** - Utility-first CSS framework
- **React Query** - Data fetching and state management
- **react-use** - Utility hooks collection

## Prerequisites

- Node.js 20 or higher
- npm or yarn

## Setup Instructions

### 1. Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the `backend` directory (copy from `env.example`):
```bash
# On Windows (PowerShell)
Copy-Item env.example .env

# On Linux/Mac
cp env.example .env
```

4. Update the `.env` file with your Google OAuth credentials:
   - Get your Google Client ID and Secret from [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new OAuth 2.0 Client ID
   - Add `http://localhost:3000` to authorized JavaScript origins
   - Add `http://localhost:3000` to authorized redirect URIs

5. Start the backend server:
```bash
npm run start:dev
```

The backend will run on `http://localhost:3001`

### 2. Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the `frontend` directory (copy from `env.local.example`):
```bash
# On Windows (PowerShell)
Copy-Item env.local.example .env.local

# On Linux/Mac
cp env.local.example .env.local
```

4. Update the `.env.local` file:
   - Set `NEXT_PUBLIC_GOOGLE_CLIENT_ID` to your Google Client ID (same as backend)
   - Ensure `NEXT_PUBLIC_API_URL` points to your backend URL

5. Start the frontend development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## Usage

1. Open your browser and navigate to `http://localhost:3000`
2. You will be redirected to the Sign In page
3. Click the "Sign in with Google" button
4. After successful authentication, you'll be redirected to the Profile page
5. Click "Edit Profile" to modify your first name and last name
6. Click "Save Changes" to update your profile
7. Your session will persist between visits (stored in HttpOnly cookies)

## Best Practices

### Authentication

- **HttpOnly Cookies**: JWTs are stored in HttpOnly cookies (not localStorage) to prevent XSS attacks
- **Frontend Pattern**: Uses "Authenticated vs Unauthenticated App" pattern with root auth context ([Kent C. Dodds](https://kentcdodds.com/blog/authentication-in-react-applications))
- **Backend Security**: JWT validation via Passport strategy, supports both cookie and Bearer token authentication

### Code Standards

- **Frontend**: Follows [React TypeScript Cheatsheet](https://github.com/typescript-cheatsheets/react) patterns
- **Backend**: NestJS best practices with dependency injection, TypeORM repositories, and JSDoc documentation
- **Both**: Google JavaScript/TypeScript Style Guide enforced via ESLint

## API Endpoints

### Public Endpoints

- `POST /auth/login/google` - Authenticate with Google OAuth
  - Body: `{ idToken }`
  - Returns: `{ user }` (JWT token is set as HttpOnly cookie)

- `POST /auth/logout` - Log out and clear authentication cookie
  - Returns: `{ message: "Logged out successfully" }`

### Protected Endpoints (require JWT token)

- `GET /user/profile` - Get current user profile
  - Headers: `Authorization: Bearer <token>`
  - Returns: User profile object

- `PUT /user/profile` - Update user profile
  - Headers: `Authorization: Bearer <token>`
  - Body: `{ firstName?, lastName? }`
  - Returns: Updated user profile object

## Environment Variables

### Backend (.env)

- `DB_DATABASE` - SQLite database file path
- `JWT_SECRET` - Secret key for JWT tokens
- `JWT_EXPIRES_IN` - JWT token expiration time
- `GOOGLE_CLIENT_ID` - Google OAuth Client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth Client Secret
- `PORT` - Backend server port
- `FRONTEND_URL` - Frontend URL for CORS

### Frontend (.env.local)

- `NEXT_PUBLIC_API_URL` - Backend API URL
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID` - Google OAuth Client ID

## Notes

- The SQLite database file (`database.sqlite`) will be created automatically on first run
- JWT tokens are stored in HttpOnly cookies (not localStorage) for enhanced security
- Sessions persist between browser visits

## Security Improvements TODO

### 🔴 Critical Priority

- [ ] **Add rate limiting** - Implement `@nestjs/throttler` or similar to prevent brute force attacks on login endpoints
- [x] **Disable database synchronization in production** - Set `synchronize: false` and use migrations instead
- [ ] **Enforce strong JWT secret validation** - Add minimum length/complexity requirements in environment validation schema

### 🟠 High Priority

- [ ] **Implement refresh token mechanism** - Add refresh tokens with shorter access token lifetime to reduce exposure window
- [ ] **Add token revocation** - Implement token blacklist or refresh token rotation to invalidate compromised tokens
- [ ] **Improve error handling** - Log detailed errors server-side while returning generic messages to clients to prevent information leakage

### 🟡 Medium Priority

- [ ] **Add request size limits** - Configure body parser limits to prevent DoS attacks via large payloads
- [ ] **Implement authentication logging/auditing** - Log authentication attempts (success/failure) with timestamps for security monitoring
- [ ] **Restrict CORS methods** - Limit allowed HTTP methods to only those actually needed per endpoint

## Development Commands

### Backend

- `npm run start:dev` - Development server with hot reload
- `npm run build` - Build for production
- `npm run start:prod` - Production server
- `npm run lint` - Run ESLint (fails on warnings)
- `npm run lint:fix` - Auto-fix ESLint issues
- `npm run test` - Run tests

### Frontend

- `npm run dev` - Development server
- `npm run build` - Build for production
- `npm run start` - Production server
- `npm run lint` - Run ESLint (fails on warnings)
- `npm run lint:fix` - Auto-fix ESLint issues

## Code Style

Both frontend and backend follow **Google's JavaScript/TypeScript Style Guide** enforced via ESLint 9 (flat config):

- **Semicolons**: Required
- **Quotes**: Double quotes
- **Line length**: Max 100 characters
- **TypeScript**: Interfaces over types, type imports for types
- **JSDoc**: Required for public APIs (warnings only)

**Backend**: NestJS patterns, TypeORM repositories, JSDoc documentation  
**Frontend**: React TypeScript patterns, function declarations for components

ESLint configs: `backend/eslint.config.mjs` and `frontend/eslint.config.mjs`

## Pre-commit Hooks

This repository uses **Husky** and **lint-staged** to automatically run linting and formatting checks before commits. This ensures code quality and consistency across the codebase.

### Setup

Pre-commit hooks are automatically set up when you install dependencies at the root:

```bash
npm install
```

### How It Works

- **Pre-commit hook**: Automatically runs on `git commit`
- **Linting**: ESLint checks staged files and auto-fixes issues where possible
- **Formatting**: Prettier formats staged files automatically
- **Blocking**: Commits are blocked if there are unfixable linting errors

### What Gets Checked

- **Backend files** (`backend/**/*.{ts,js,json}`): ESLint + Prettier
- **Frontend files** (`frontend/**/*.{ts,tsx,js,jsx,json,css}`): ESLint + Prettier

### Manual Testing

You can test the pre-commit hook manually:

```bash
# Stage some files
git add backend/src/some-file.ts

# Try to commit (will trigger lint-staged)
git commit -m "test commit"
```

If there are fixable issues, they'll be automatically fixed and you'll need to stage the changes again. If there are unfixable errors, the commit will be blocked.