# 🔧 Sense AI API - Token Troubleshooting Guide

## 🚨 **Error: "Invalid access token" (TOKEN_INVALID)**

This error occurs when the JWT token verification fails. Here's how to fix it:

### **Step 1: Get a Fresh Token**

1. **First, try to login/signup to get a new token:**

```bash
# Login Request
POST {{baseUrl}}/api/auth/login
Content-Type: application/json

{
  "email": "john.doe@example.com",
  "password": "SecurePass123!"
}
```

2. **Copy the accessToken from the response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { ... },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
}
```

### **Step 2: Use the Token Correctly**

Make sure your Authorization header is formatted exactly like this:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Common mistakes:**
- ❌ `Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (missing "Bearer ")
- ❌ `Authorization: bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (lowercase "bearer")
- ❌ `Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... ` (extra spaces)

### **Step 3: Test the Profile Endpoint**

```bash
# Get Profile Request
GET {{baseUrl}}/api/auth/profile
Authorization: Bearer YOUR_ACCESS_TOKEN_HERE
```

### **Step 4: If Token is Expired**

If you get "TOKEN_EXPIRED" error, refresh your token:

```bash
# Refresh Token Request
POST {{baseUrl}}/api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "YOUR_REFRESH_TOKEN_HERE"
}
```

### **Step 5: Environment Variables Check**

Make sure your server has these environment variables set:
```env
JWT_SECRET=your-secret-key-here
JWT_REFRESH_SECRET=your-refresh-secret-key-here
JWT_EXPIRE=7d
JWT_REFRESH_EXPIRE=7d
```

### **Step 6: Common Issues & Solutions**

#### **Issue 1: Token Not Set in Postman**
- Go to your Postman collection
- Check the `accessToken` variable is set
- Make sure you're using `{{accessToken}}` in the Authorization header

#### **Issue 2: Server Not Running**
- Make sure your server is running on the correct port
- Check `http://localhost:5000/health` first

#### **Issue 3: Wrong Base URL**
- Verify your `baseUrl` variable is correct
- Default should be `http://localhost:5000`

#### **Issue 4: User Account Issues**
- Make sure the user account exists and is active
- Check if the user was deleted or deactivated

### **Step 7: Debug Token (Optional)**

You can decode your token to see its contents (without verification):

```javascript
// In browser console or Node.js
const token = "YOUR_TOKEN_HERE";
const payload = JSON.parse(atob(token.split('.')[1]));
console.log(payload);
```

This will show you:
- `userId`: The user ID
- `email`: User's email
- `exp`: Expiration timestamp
- `iat`: Issued at timestamp

### **Step 8: Complete Test Flow**

1. **Health Check:**
   ```
   GET {{baseUrl}}/health
   ```

2. **Signup (if new user):**
   ```
   POST {{baseUrl}}/api/auth/signup
   ```

3. **Login:**
   ```
   POST {{baseUrl}}/api/auth/login
   ```

4. **Get Profile:**
   ```
   GET {{baseUrl}}/api/auth/profile
   Authorization: Bearer {{accessToken}}
   ```

### **Step 9: Postman Collection Setup**

1. Import the `Sense_AI_Postman_Collection.json`
2. Set the `baseUrl` variable to `http://localhost:5000`
3. Run the "User Login" request first
4. The `accessToken` variable will be automatically set
5. Now run "Get Profile" request

### **Still Having Issues?**

If you're still getting "TOKEN_INVALID" error:

1. **Check server logs** for detailed error messages
2. **Verify JWT_SECRET** is set in your environment
3. **Make sure the token wasn't corrupted** during copy/paste
4. **Try generating a completely new token** by logging out and logging back in

### **Quick Fix Commands**

```bash
# Test server health
curl http://localhost:5000/health

# Test login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john.doe@example.com","password":"SecurePass123!"}'

# Test profile with token
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```
