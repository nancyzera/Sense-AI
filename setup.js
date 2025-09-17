#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

console.log('🚀 Setting up Sense AI Backend...\n');

// Generate secure random strings
const generateSecret = (length = 64) => {
  return crypto.randomBytes(length).toString('hex');
};

// Check if .env file exists
const envPath = '.env';
const envExamplePath = '.env.example';

if (fs.existsSync(envPath)) {
  console.log('✅ .env file already exists');
} else {
  console.log('📝 Creating .env file...');
  
  const envContent = `# Database Configuration
MONGO_URI=mongodb+srv://senewtech:admin@senew-cluster.rg6pb.mongodb.net/sense_ai

# JWT Configuration
JWT_SECRET=${generateSecret()}
JWT_REFRESH_SECRET=${generateSecret()}
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

# OAuth Configuration (Optional - Add your credentials)
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GITHUB_CLIENT_ID=your_github_client_id_here
GITHUB_CLIENT_SECRET=your_github_client_secret_here

# Session Configuration
SESSION_SECRET=${generateSecret()}

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS Configuration
FRONTEND_URL=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
`;

  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env file created with secure random secrets');
}

// Create .env.example if it doesn't exist
if (!fs.existsSync(envExamplePath)) {
  console.log('📝 Creating .env.example file...');
  
  const envExampleContent = `# Database Configuration
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
`;

  fs.writeFileSync(envExamplePath, envExampleContent);
  console.log('✅ .env.example file created');
}

// Check if node_modules exists
if (fs.existsSync('node_modules')) {
  console.log('✅ Dependencies already installed');
} else {
  console.log('📦 Installing dependencies...');
  console.log('   Run: npm install');
}

console.log('\n🎉 Setup complete!');
console.log('\n📋 Next steps:');
console.log('1. Install dependencies: npm install');
console.log('2. Start development server: npm run dev');
console.log('3. Test the API: http://localhost:5000/health');
console.log('4. Import Postman collection: Sense_AI_API.postman_collection.json');
console.log('\n📚 Documentation:');
console.log('- API Documentation: API_DOCUMENTATION.md');
console.log('- Setup Guide: README.md');
console.log('\n🔐 Security Notes:');
console.log('- JWT secrets have been generated automatically');
console.log('- Add your OAuth credentials to .env file');
console.log('- Never commit .env file to version control');
console.log('\n🚀 Happy coding!');
