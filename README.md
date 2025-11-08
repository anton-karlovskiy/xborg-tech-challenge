# XBorg Tech Challenge

A full-stack application with Google OAuth authentication and user profile management.

## Tech Stack

### Backend
- **NestJS** - Progressive Node.js framework
- **TypeORM** - ORM for database interactions
- **SQLite** - Database engine
- **JWT** - Authentication tokens
- **Passport** - Authentication middleware

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **TailwindCSS** - Utility-first CSS framework

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
7. Your session will persist between visits (stored in localStorage)

## API Endpoints

### Public Endpoints

- `POST /auth/login/google` - Authenticate with Google OAuth
  - Body: `{ googleId, email, firstName?, lastName?, picture? }`
  - Returns: `{ access_token, user }`

### Protected Endpoints (require JWT token)

- `GET /user/profile` - Get current user profile
  - Headers: `Authorization: Bearer <token>`
  - Returns: User profile object

- `PUT /user/profile` - Update user profile
  - Headers: `Authorization: Bearer <token>`
  - Body: `{ firstName?, lastName? }`
  - Returns: Updated user profile object

## Project Structure

```
.
├── backend/
│   ├── src/
│   │   ├── auth/          # Authentication module
│   │   ├── user/          # User module
│   │   ├── app.module.ts  # Root module
│   │   └── main.ts        # Application entry point
│   ├── .env.example       # Environment variables template
│   └── package.json
├── frontend/
│   ├── app/
│   │   ├── signin/        # Sign in page
│   │   ├── profile/       # Profile page
│   │   ├── providers.tsx # Auth context provider
│   │   └── layout.tsx     # Root layout
│   ├── lib/
│   │   └── api.ts         # API client
│   ├── .env.local.example # Environment variables template
│   └── package.json
└── README.md
```

## Environment Variables

### Backend (.env)
- `DB_DATABASE` - SQLite database file path
- `JWT_SECRET` - Secret key for JWT tokens
- `JWT_EXPIRES_IN` - JWT token expiration time
- `GOOGLE_CLIENT_ID` - Google OAuth Client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth Client Secret
- `GOOGLE_CALLBACK_URL` - Google OAuth callback URL
- `PORT` - Backend server port
- `FRONTEND_URL` - Frontend URL for CORS

### Frontend (.env.local)
- `NEXT_PUBLIC_API_URL` - Backend API URL
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID` - Google OAuth Client ID

## Notes

- The SQLite database file (`database.sqlite`) will be created automatically on first run
- JWT tokens are stored in localStorage on the frontend
- Sessions persist between browser visits
- The database uses TypeORM's `synchronize: true` for development (disable in production)

## Development Commands

### Backend
- `npm run start:dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start:prod` - Start production server

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server

