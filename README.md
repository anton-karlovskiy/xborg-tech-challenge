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

  - The frontend follows the "Authenticated vs Unauthenticated App" pattern described by Kent C. Dodds, where the root auth context decides whether to render the protected tree or the public screens. [Authentication in React Applications](https://kentcdodds.com/blog/authentication-in-react-applications)
  - **Security Best Practice**: localStorage is vulnerable to XSS attacks, and moving JWTs into HttpOnly cookies is the standard way to harden authentication in modern web apps. This application uses HttpOnly cookies for JWT storage, which prevents JavaScript access to tokens and significantly reduces the risk of XSS-based token theft.

### React + TypeScript

  - We follow the community-maintained React TypeScript Cheatsheet for patterns, type helpers, and example usage across the codebase.[^1]

[^1]: https://github.com/typescript-cheatsheets/react

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

- `npm run start:dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start:prod` - Start production server

### Frontend

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint to check code style (fails on warnings)
- `npm run lint:fix` - Run ESLint and automatically fix fixable issues
- `npm run lint:next` - Run Next.js's built-in lint command (may have compatibility issues with ESLint 9 flat config)

#### Code Style

The frontend follows **Google's JavaScript and TypeScript Style Guide** with ESLint enforcement. Key standards include:

- **Semicolons**: Required
- **Indentation**: 2 spaces
- **Quotes**: Double quotes for strings and JSX
- **Trailing commas**: Required in multiline arrays/objects, not allowed in function parameters
- **Line length**: Maximum 100 characters
- **Function style**: Function declarations for named functions, arrow functions for callbacks
- **TypeScript**: Prefer interfaces over type aliases, use type imports for types
- **React**: Function declarations for named components, arrow functions for unnamed components
- **JSDoc**: Required for exported functions (warnings only)

The ESLint configuration is located in `frontend/eslint.config.mjs` and includes:
- Google style guide rules
- TypeScript-specific rules with type-aware linting
- React and React Hooks rules
- JSDoc documentation requirements
- Next.js recommended rules

Run `npm run lint` to check your code, or `npm run lint:fix` to automatically fix many style issues.

**Note:** The `lint` script uses ESLint directly (`eslint .`) instead of Next.js's `next lint` command, as Next.js 16 may have compatibility issues with ESLint 9's flat config format (`eslint.config.mjs`). If you need to use Next.js's lint command, use `npm run lint:next`, but be aware it may not work correctly with the flat config.