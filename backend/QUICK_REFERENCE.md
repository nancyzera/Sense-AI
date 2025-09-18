# Sense AI API - Quick Reference Card

## 🚀 Server Info
- **Base URL**: `http://localhost:5000`
- **Health Check**: `GET /health`
- **API Docs**: `GET /api`

## 🔐 Authentication Flow

### 1. Register User
```bash
POST /api/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "phone": "+1234567890"
}
```

### 2. Login User
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

### 3. Use Access Token
```bash
Authorization: Bearer <access_token>
```

### 4. Refresh Token (when expired)
```bash
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "<refresh_token>"
}
```

## 📋 Common Endpoints

### Get User Profile
```bash
GET /api/auth/profile
Authorization: Bearer <access_token>
```

### Update Profile
```bash
PUT /api/auth/profile
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "John Smith",
  "phone": "+1987654321"
}
```

### Get Usage Metrics
```bash
GET /api/auth/usage
Authorization: Bearer <access_token>
```

### Change Password
```bash
PUT /api/auth/change-password
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "currentPassword": "SecurePass123!",
  "newPassword": "NewSecurePass456!",
  "confirmPassword": "NewSecurePass456!"
}
```

### Logout
```bash
POST /api/auth/logout
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "refreshToken": "<refresh_token>"
}
```

## 🔑 OAuth Endpoints

### Google OAuth
```bash
GET /api/auth/google
# Redirects to Google OAuth
```

### GitHub OAuth
```bash
GET /api/auth/github
# Redirects to GitHub OAuth
```

## 📊 Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "code": "ERROR_CODE",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

## 🚨 Common Status Codes

- **200**: Success
- **201**: Created (signup)
- **400**: Bad Request (validation error)
- **401**: Unauthorized (invalid/missing token)
- **403**: Forbidden (insufficient permissions)
- **404**: Not Found
- **429**: Too Many Requests (rate limited)
- **500**: Internal Server Error

## 🔒 Security Notes

- **Password Requirements**: 8+ chars, uppercase, lowercase, number, special char
- **Token Expiry**: Access tokens expire in 15 minutes
- **Rate Limits**: 5 auth attempts per 15 minutes
- **CORS**: Configured for `http://localhost:3000`

## 📱 Subscription Tiers

### Free Tier Limits
- Voice: 10 minutes/month
- Text: 1,000 characters/month
- API: 50 calls/month

### Premium Tier
- All features unlimited
- Advanced AI features
- Priority support

## 🛠️ Development Commands

```bash
# Start development server
npm run dev

# Install dependencies
npm install

# Run linter
npm run lint

# Fix linting issues
npm run lint:fix
```

## 🧪 Testing with cURL

### Test Signup
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"TestPass123!","phone":"+1234567890"}'
```

### Test Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"TestPass123!"}'
```

### Test Profile (with token)
```bash
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 📚 Full Documentation
- **Complete API Docs**: `API_DOCUMENTATION.md`
- **Setup Guide**: `README.md`
- **Postman Collection**: `Sense_AI_API.postman_collection.json`
