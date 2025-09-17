# Sense AI Backend

A comprehensive backend API for Sense AI - an accessible AI assistant with real-time voice-to-text, text-to-speech, subscriptions, and wearable integrations.

## 🚀 Features

- **Authentication System**: JWT-based auth with access & refresh tokens
- **OAuth Integration**: Google and GitHub login support
- **Subscription Management**: Free and premium tiers with usage tracking
- **User Management**: Complete CRUD operations for user profiles
- **Security**: Rate limiting, input validation, password hashing
- **Scalable Architecture**: Clean MVC pattern with middleware
- **MongoDB Integration**: Mongoose ODM with advanced schemas

## 🛠️ Tech Stack

- **Runtime**: Node.js (ES6 modules)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT, Passport.js (Google/GitHub OAuth)
- **Security**: bcrypt, helmet, cors, rate limiting
- **Validation**: express-validator
- **Development**: nodemon, eslint

## 📁 Project Structure

```
src/
├── config/
│   ├── dbConfig.js          # MongoDB connection
│   └── passportConfig.js    # OAuth strategies
├── controllers/
│   └── authController.js    # Authentication logic
├── middleware/
│   ├── authMiddleware.js    # JWT authentication
│   ├── roleMiddleware.js    # Role-based access control
│   └── validationMiddleware.js # Input validation
├── models/
│   └── userModel.js         # User schema
├── routes/
│   └── authRoutes.js        # Authentication routes
├── utils/
│   └── tokenUtils.js        # JWT utilities
├── app.js                   # Express app configuration
└── server.js               # Server startup
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- MongoDB Atlas account or local MongoDB
- Google OAuth credentials (optional)
- GitHub OAuth credentials (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd sense-ai-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   # Database Configuration
   MONGO_URI=mongodb+srv://senewtech:admin@senew-cluster.rg6pb.mongodb.net/sense_ai

   # JWT Configuration
   JWT_SECRET=your_super_secret_jwt_key_here_make_it_very_long_and_secure
   JWT_REFRESH_SECRET=your_super_secret_refresh_jwt_key_here_make_it_very_long_and_secure
   JWT_EXPIRE=15m
   JWT_REFRESH_EXPIRE=7d

   # OAuth Configuration (Optional)
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

4. **Start the server**
   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

The server will start on `http://localhost:5000`

## 📚 API Documentation

### Base URL
- Development: `http://localhost:5000`
- Production: `https://your-domain.com`

### Authentication
Include the JWT token in the Authorization header:
```
Authorization: Bearer <access_token>
```

### Key Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/signup` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| POST | `/api/auth/refresh` | Refresh access token | No |
| POST | `/api/auth/logout` | Logout user | Yes |
| GET | `/api/auth/profile` | Get user profile | Yes |
| PUT | `/api/auth/profile` | Update profile | Yes |
| PUT | `/api/auth/change-password` | Change password | Yes |
| DELETE | `/api/auth/account` | Delete account | Yes |
| GET | `/api/auth/usage` | Get usage metrics | Yes |
| GET | `/api/auth/google` | Google OAuth | No |
| GET | `/api/auth/github` | GitHub OAuth | No |

For detailed API documentation with request/response examples, see [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

## 🧪 Testing with Postman

### Import Collection
1. Open Postman
2. Import the collection from the repository
3. Set environment variables:
   - `baseUrl`: `http://localhost:5000`
   - `accessToken`: (will be set after login)

### Sample Test Flow
1. **Signup**: Create a new user account
2. **Login**: Get access and refresh tokens
3. **Get Profile**: Retrieve user information
4. **Update Profile**: Modify user details
5. **Get Usage**: Check usage metrics
6. **Logout**: Invalidate tokens

## 🔒 Security Features

### Password Security
- Minimum 8 characters
- Must contain uppercase, lowercase, number, and special character
- Bcrypt hashing with salt rounds of 12

### JWT Security
- Access tokens expire in 15 minutes
- Refresh tokens expire in 7 days
- Tokens include user ID, email, and subscription tier

### Rate Limiting
- Global: 100 requests per 15 minutes
- Auth endpoints: 5 attempts per 15 minutes
- Password change: 3 attempts per 15 minutes

### Input Validation
- Email format validation
- Phone number validation
- Strong password requirements
- XSS protection

## 📊 Subscription Tiers

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

## 🚀 Deployment

### Environment Variables for Production
```env
NODE_ENV=production
PORT=5000
MONGO_URI=your_production_mongodb_uri
JWT_SECRET=your_production_jwt_secret
JWT_REFRESH_SECRET=your_production_refresh_secret
FRONTEND_URL=https://your-frontend-domain.com
```

### Deployment Platforms
- **Render**: Easy deployment with automatic builds
- **Heroku**: Popular platform with add-ons
- **AWS**: EC2, ECS, or Lambda
- **DigitalOcean**: App Platform or Droplets

### Docker Support (Optional)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 🛠️ Development

### Available Scripts
```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
npm test           # Run tests
npm run lint       # Run ESLint
npm run lint:fix   # Fix ESLint errors
```

### Code Style
- ES6 modules (import/export)
- camelCase file naming
- Comprehensive error handling
- Input validation
- Security best practices

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the API documentation

## 🔮 Future Enhancements

- [ ] Email verification system
- [ ] Password reset functionality
- [ ] Admin panel
- [ ] Advanced analytics
- [ ] Webhook support
- [ ] API versioning
- [ ] GraphQL support
- [ ] Real-time features with Socket.io

---

**Built with ❤️ by the Sense AI Team**
