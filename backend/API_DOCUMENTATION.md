# Sense AI Backend API Documentation

## Overview
This is the backend API for Sense AI - an accessible AI assistant with real-time voice-to-text, text-to-speech, subscriptions, and wearable integrations.

## Base URL
- Development: `http://localhost:5000`
- Production: `https://your-domain.com`

## Authentication
The API uses JWT (JSON Web Tokens) for authentication. Include the access token in the Authorization header:
```
Authorization: Bearer <access_token>
```

## API Endpoints

### 1. Authentication Endpoints

#### POST /api/auth/signup
Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "SecurePass123!",
  "phone": "+1234567890"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "64a1b2c3d4e5f6789012345",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "phone": "+1234567890",
      "subscriptionTier": "free",
      "subscriptionExpiry": null,
      "usageMetrics": {
        "voiceMinutesUsed": 0,
        "textCharactersUsed": 0,
        "apiCallsUsed": 0,
        "lastResetDate": "2024-01-15T10:30:00.000Z"
      },
      "provider": "local",
      "avatar": null,
      "isEmailVerified": false,
      "isActive": true,
      "lastLogin": null,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
}
```

#### POST /api/auth/login
Login with email and password.

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "SecurePass123!"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "64a1b2c3d4e5f6789012345",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "phone": "+1234567890",
      "subscriptionTier": "free",
      "subscriptionExpiry": null,
      "usageMetrics": {
        "voiceMinutesUsed": 5,
        "textCharactersUsed": 250,
        "apiCallsUsed": 12,
        "lastResetDate": "2024-01-15T10:30:00.000Z"
      },
      "provider": "local",
      "avatar": null,
      "isEmailVerified": false,
      "isActive": true,
      "lastLogin": "2024-01-15T12:45:00.000Z",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T12:45:00.000Z"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
}
```

#### POST /api/auth/refresh
Refresh access token using refresh token.

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
}
```

#### POST /api/auth/logout
Logout user and invalidate refresh token.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

### 2. OAuth Endpoints

#### GET /api/auth/google
Initiate Google OAuth login.

**Response:** Redirects to Google OAuth consent screen.

#### GET /api/auth/google/callback
Google OAuth callback (handled automatically).

#### GET /api/auth/github
Initiate GitHub OAuth login.

**Response:** Redirects to GitHub OAuth consent screen.

#### GET /api/auth/github/callback
GitHub OAuth callback (handled automatically).

### 3. Profile Management

#### GET /api/auth/profile
Get current user profile.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "user": {
      "_id": "64a1b2c3d4e5f6789012345",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "phone": "+1234567890",
      "subscriptionTier": "premium",
      "subscriptionExpiry": "2024-12-31T23:59:59.000Z",
      "usageMetrics": {
        "voiceMinutesUsed": 45,
        "textCharactersUsed": 5000,
        "apiCallsUsed": 200,
        "lastResetDate": "2024-01-15T10:30:00.000Z"
      },
      "provider": "local",
      "avatar": null,
      "isEmailVerified": true,
      "isActive": true,
      "lastLogin": "2024-01-15T12:45:00.000Z",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T12:45:00.000Z"
    }
  }
}
```

#### PUT /api/auth/profile
Update user profile.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "name": "John Smith",
  "phone": "+1987654321"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "user": {
      "_id": "64a1b2c3d4e5f6789012345",
      "name": "John Smith",
      "email": "john.doe@example.com",
      "phone": "+1987654321",
      "subscriptionTier": "premium",
      "subscriptionExpiry": "2024-12-31T23:59:59.000Z",
      "usageMetrics": {
        "voiceMinutesUsed": 45,
        "textCharactersUsed": 5000,
        "apiCallsUsed": 200,
        "lastResetDate": "2024-01-15T10:30:00.000Z"
      },
      "provider": "local",
      "avatar": null,
      "isEmailVerified": true,
      "isActive": true,
      "lastLogin": "2024-01-15T12:45:00.000Z",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T14:20:00.000Z"
    }
  }
}
```

#### PUT /api/auth/change-password
Change user password.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "currentPassword": "SecurePass123!",
  "newPassword": "NewSecurePass456!",
  "confirmPassword": "NewSecurePass456!"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password changed successfully. Please login again."
}
```

### 4. Usage and Subscription

#### GET /api/auth/usage
Get user usage metrics and limits.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Usage metrics retrieved successfully",
  "data": {
    "usage": {
      "voiceMinutesUsed": 45,
      "textCharactersUsed": 5000,
      "apiCallsUsed": 200,
      "lastResetDate": "2024-01-15T10:30:00.000Z"
    },
    "limits": {
      "voiceMinutes": 10,
      "textCharacters": 1000,
      "apiCalls": 50
    },
    "subscriptionTier": "free"
  }
}
```

### 5. Account Management

#### DELETE /api/auth/account
Delete user account (soft delete).

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Account deleted successfully"
}
```

### 6. Utility Endpoints

#### GET /api/auth/me
Get current user (optional authentication).

**Headers (Optional):**
```
Authorization: Bearer <access_token>
```

**Response (200) - Authenticated:**
```json
{
  "success": true,
  "message": "User authenticated",
  "data": {
    "user": {
      "_id": "64a1b2c3d4e5f6789012345",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "subscriptionTier": "premium",
      "isPremium": true
    }
  }
}
```

**Response (200) - Not Authenticated:**
```json
{
  "success": false,
  "message": "No user authenticated",
  "data": {
    "user": null
  }
}
```

#### GET /health
Health check endpoint.

**Response (200):**
```json
{
  "success": true,
  "message": "Sense AI Backend is running",
  "timestamp": "2024-01-15T14:30:00.000Z",
  "environment": "development",
  "version": "1.0.0"
}
```

#### GET /api
API documentation endpoint.

**Response (200):**
```json
{
  "success": true,
  "message": "Sense AI API",
  "version": "1.0.0",
  "endpoints": {
    "auth": {
      "signup": "POST /api/auth/signup",
      "login": "POST /api/auth/login",
      "refresh": "POST /api/auth/refresh",
      "logout": "POST /api/auth/logout",
      "profile": "GET /api/auth/profile",
      "updateProfile": "PUT /api/auth/profile",
      "changePassword": "PUT /api/auth/change-password",
      "deleteAccount": "DELETE /api/auth/account",
      "usage": "GET /api/auth/usage",
      "google": "GET /api/auth/google",
      "github": "GET /api/auth/github"
    }
  }
}
```

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email address",
      "value": "invalid-email"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Access token is required"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Premium subscription required",
  "code": "PREMIUM_REQUIRED",
  "subscriptionTier": "free"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Route not found",
  "path": "/api/invalid-route"
}
```

### 429 Too Many Requests
```json
{
  "success": false,
  "message": "Too many requests from this IP, please try again later"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error"
}
```

## Rate Limiting

- **Global Rate Limit**: 100 requests per 15 minutes per IP
- **Auth Rate Limit**: 5 authentication attempts per 15 minutes per IP
- **Strict Auth Rate Limit**: 3 password change attempts per 15 minutes per IP

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration
MONGO_URI=mongodb+srv://senewtech:admin@senew-cluster.rg6pb.mongodb.net/sense_ai

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_make_it_very_long_and_secure
JWT_REFRESH_SECRET=your_super_secret_refresh_jwt_key_here_make_it_very_long_and_secure
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

# OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GITHUB_CLIENT_ID=your_github_client_id_here
GITHUB_CLIENT_SECRET=your_github_client_secret_here

# Session Configuration
SESSION_SECRET=your_session_secret_here_make_it_very_long_and_secure

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS Configuration
FRONTEND_URL=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## Testing with Postman

### Collection Setup
1. Create a new Postman collection called "Sense AI API"
2. Set the base URL variable: `{{baseUrl}}` = `http://localhost:5000`
3. Create an environment variable for `accessToken`

### Sample Requests

#### 1. Signup Request
```
POST {{baseUrl}}/api/auth/signup
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com",
  "password": "TestPass123!",
  "phone": "+1234567890"
}
```

#### 2. Login Request
```
POST {{baseUrl}}/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "TestPass123!"
}
```

#### 3. Get Profile Request
```
GET {{baseUrl}}/api/auth/profile
Authorization: Bearer {{accessToken}}
```

#### 4. Update Profile Request
```
PUT {{baseUrl}}/api/auth/profile
Authorization: Bearer {{accessToken}}
Content-Type: application/json

{
  "name": "Updated Name",
  "phone": "+1987654321"
}
```

## Security Features

1. **Password Hashing**: Uses bcrypt with salt rounds of 12
2. **JWT Tokens**: Access tokens (15min) and refresh tokens (7 days)
3. **Rate Limiting**: Prevents brute force attacks
4. **CORS**: Configured for specific frontend origins
5. **Helmet**: Security headers
6. **Input Validation**: Comprehensive validation using express-validator
7. **Error Handling**: Secure error messages in production

## Subscription Tiers

### Free Tier
- Voice minutes: 10 per month
- Text characters: 1,000 per month
- API calls: 50 per month

### Premium Tier
- Voice minutes: Unlimited
- Text characters: Unlimited
- API calls: Unlimited
- Advanced AI features
- Priority support
