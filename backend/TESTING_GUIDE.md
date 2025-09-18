# 🧪 **Postman Testing Guide for Sense AI Backend**

## 🚀 **Quick Start Testing**

### **Step 1: Import Test Data**
1. Copy the contents of `POSTMAN_TEST_DATA.json`
2. Import into Postman as a new collection
3. Set environment variable: `baseUrl = http://localhost:5000`

### **Step 2: Test Current Endpoints**

## 📋 **Available Test Endpoints**

### **1. AI Services Status** ✅ **WORKING NOW**
```json
GET http://localhost:5000/api/ai/status
```
**Expected Response:**
```json
{
  "success": true,
  "message": "AI services status retrieved successfully",
  "data": {
    "status": {
      "chat": { "available": true },
      "speechToText": { "available": true },
      "textToSpeech": { "available": true }
    },
    "recommendations": [...],
    "setupGuide": "See AI_SERVICES_SETUP.md for detailed setup instructions"
  }
}
```

### **2. AI Setup Recommendations** ✅ **WORKING NOW**
```json
GET http://localhost:5000/api/ai/recommendations
```
**Expected Response:**
```json
{
  "success": true,
  "message": "AI setup recommendations retrieved successfully",
  "data": {
    "recommendations": [
      {
        "service": "Groq",
        "description": "Free tier with 14,400 requests/day",
        "url": "https://console.groq.com/",
        "priority": "high"
      }
    ],
    "configuredServices": ["Local Fallback Services"],
    "nextSteps": [...]
  }
}
```

### **3. Test AI Services** ✅ **WORKING NOW**
```json
POST http://localhost:5000/api/ai/test
Content-Type: application/json

{}
```
**Expected Response:**
```json
{
  "success": true,
  "message": "AI services test completed",
  "data": {
    "results": {
      "chat": {
        "success": true,
        "response": "Hello! I'm Sense AI, your accessible AI assistant...",
        "service": "local-fallback"
      },
      "speechToText": { "success": true, "service": "local-fallback" },
      "textToSpeech": { "success": true, "service": "local-fallback" }
    },
    "summary": {
      "chatWorking": true,
      "speechToTextWorking": true,
      "textToSpeechWorking": true
    }
  }
}
```

## 🔐 **Authentication Testing**

### **4. User Signup**
```json
POST http://localhost:5000/api/auth/signup
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com",
  "password": "TestPass123!",
  "phone": "+1234567890"
}
```

### **5. User Login**
```json
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "TestPass123!"
}
```

**Save the `accessToken` from login response for authenticated requests!**

## 🎯 **Testing Scenarios**

### **Scenario 1: Basic AI Services Test**
1. **GET** `/api/ai/status` - Check services status
2. **GET** `/api/ai/recommendations` - Get setup recommendations
3. **POST** `/api/ai/test` - Test all services

### **Scenario 2: Authentication Flow**
1. **POST** `/api/auth/signup` - Register new user
2. **POST** `/api/auth/login` - Login and get token
3. **Use token** for future authenticated requests

### **Scenario 3: Error Testing**
1. **POST** `/api/ai/test` with invalid JSON
2. **GET** `/api/ai/invalid` - Test 404 error
3. **POST** `/api/ai/chat` without auth token

## 🛠️ **PowerShell Testing Commands**

```powershell
# Test AI Status
Invoke-WebRequest -Uri http://localhost:5000/api/ai/status

# Test AI Recommendations
Invoke-WebRequest -Uri http://localhost:5000/api/ai/recommendations

# Test AI Services
Invoke-WebRequest -Uri http://localhost:5000/api/ai/test -Method POST -ContentType 'application/json' -Body '{}'

# User Signup
Invoke-WebRequest -Uri http://localhost:5000/api/auth/signup -Method POST -ContentType 'application/json' -Body '{"name":"Test User","email":"test@example.com","password":"TestPass123!","phone":"+1234567890"}'

# User Login
Invoke-WebRequest -Uri http://localhost:5000/api/auth/login -Method POST -ContentType 'application/json' -Body '{"email":"test@example.com","password":"TestPass123!"}'
```

## 🐛 **Error Testing**

### **Invalid JSON Test**
```json
POST http://localhost:5000/api/ai/test
Content-Type: application/json

{
  "invalid": "json",
  "missing": "closing bracket"
```
**Expected:** 400 Bad Request

### **Unauthorized Access Test**
```json
POST http://localhost:5000/api/ai/chat
Content-Type: application/json

{
  "message": "This should fail without auth"
}
```
**Expected:** 401 Unauthorized

### **Invalid Endpoint Test**
```json
GET http://localhost:5000/api/ai/invalid
```
**Expected:** 404 Not Found

## 📊 **Expected Response Codes**

| Endpoint | Method | Expected Code | Description |
|----------|--------|---------------|-------------|
| `/api/ai/status` | GET | 200 | Success |
| `/api/ai/recommendations` | GET | 200 | Success |
| `/api/ai/test` | POST | 200 | Success |
| `/api/auth/signup` | POST | 201 | Created |
| `/api/auth/login` | POST | 200 | Success |
| `/api/ai/invalid` | GET | 404 | Not Found |
| `/api/ai/chat` (no auth) | POST | 401 | Unauthorized |

## 🎉 **Success Indicators**

✅ **All tests passing means:**
- AI services are properly configured
- Authentication system is working
- Error handling is functioning
- API endpoints are responding correctly

## 🚀 **Next Steps After Testing**

1. **Get API Keys** - Follow recommendations from `/api/ai/recommendations`
2. **Add to .env** - Configure your free API keys
3. **Restart Server** - Apply new configuration
4. **Test Again** - Verify services are using real APIs
5. **Build AI Endpoints** - Create chat, voice-to-text, text-to-speech endpoints

---

**Happy Testing!** 🧪✨
