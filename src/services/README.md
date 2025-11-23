# Authentication API Integration Guide

This guide explains how the authentication system works with your backend API.

## Configuration

### 1. Environment Variables

Create a `.env` file in the root of your project:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

Replace `http://localhost:8080/api` with your actual backend API URL.

### 2. Backend API Endpoints Required

Your backend should implement the following endpoints:

#### POST `/auth/login`
**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "token": "jwt-token-here",
  "user": {
    "id": 1,
    "username": "string",
    "name": "string",
    "email": "string",
    "phone": "string (optional)",
    "tag": "string (optional)",
    "role": "user" | "admin" | "superadmin",
    "createdAt": "ISO date string (optional)",
    "updatedAt": "ISO date string (optional)"
  }
}
```

#### POST `/auth/signup`
**Request Body:**
```json
{
  "username": "string",
  "name": "string",
  "email": "string",
  "password": "string",
  "phone": "string (optional)",
  "tag": "string (optional)"
}
```

**Response:** Same as login response

#### POST `/auth/logout`
**Headers:** `Authorization: Bearer <token>`

**Response:** 200 OK

#### GET `/auth/me`
**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "id": 1,
  "username": "string",
  "name": "string",
  "email": "string",
  "phone": "string (optional)",
  "tag": "string (optional)",
  "role": "user" | "admin" | "superadmin",
  "createdAt": "ISO date string (optional)",
  "updatedAt": "ISO date string (optional)"
}
```

#### POST `/auth/refresh` (Optional)
**Headers:** `Authorization: Bearer <token>`

**Response:** Same as login response

## How It Works

### 1. Authentication Flow

1. User submits login/signup form
2. Frontend calls `authService.login()` or `authService.signup()`
3. API returns JWT token and user data
4. Token and user data are stored in:
   - Pinia store (in-memory)
   - localStorage (persistent)
5. Token is automatically added to all subsequent API requests via axios interceptor

### 2. Route Protection

Routes are protected using navigation guards in `src/router/index.ts`:

- `requiresAuth: true` - User must be authenticated
- `requiresAdmin: true` - User must be admin or superadmin
- `requiresSuperAdmin: true` - User must be superadmin

If user doesn't meet requirements, they're redirected to login or home.

### 3. Token Management

- **Storage**: Token is stored in `localStorage` as `authToken`
- **Auto-attachment**: Axios interceptor automatically adds `Authorization: Bearer <token>` header to all requests
- **Expiration**: If API returns 401, token is cleared and user is redirected to login

### 4. Using Auth Store

```typescript
import { useAuthStore } from '@/store/auth'

const authStore = useAuthStore()

// Check if authenticated
if (authStore.isAuthenticated) {
  // User is logged in
}

// Get user data
const user = authStore.user

// Check user role
if (authStore.isAdmin) {
  // User is admin or superadmin
}

if (authStore.isSuperAdmin) {
  // User is superadmin
}

// Logout
await authStore.logout()
```

## Error Handling

Errors from the API are caught and stored in `authStore.error`. You can display them to users using:

- Alert (currently used in login/signup)
- Toast notification component
- Error message component

## Next Steps

1. Update `.env` file with your backend API URL
2. Ensure your backend implements the required endpoints
3. Test login/signup flow
4. Customize error handling UI (replace alerts with toast/notification component)
5. Add loading states to login/signup buttons (optional)

