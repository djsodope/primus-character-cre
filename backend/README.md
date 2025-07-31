# Primus Character Creator - Backend API

A Node.js/Express backend API with Firebase Authentication and MongoDB for the Primus Character Creator full-stack application.

## 🛠️ Tech Stack

- **Node.js** + **Express** - Server framework
- **MongoDB** + **Mongoose** - Database and ODM
- **Firebase Admin SDK** - Authentication and user management
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

## 📁 Project Structure

```
backend/
├── config/
│   └── firebase.js          # Firebase Admin SDK configuration
├── controllers/
│   └── characterController.js  # Character CRUD operations
├── middleware/
│   └── authMiddleware.js     # Firebase token verification
├── models/
│   └── Character.js          # Mongoose schema for characters
├── routes/
│   └── characterRoutes.js    # Express routes for characters
├── .env.example              # Environment variables template
├── package.json              # Dependencies and scripts
├── server.js                 # Main application entry point
└── README.md                 # This file
```

## 🚀 Quick Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Environment Configuration

Copy the example environment file and fill in your values:

```bash
cp .env.example .env
```

Edit `.env` with your actual configuration:

```env
# MongoDB Connection (MongoDB Atlas recommended)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/primus-characters

# Server Configuration
PORT=3001
NODE_ENV=development

# Firebase Admin SDK Configuration
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY_ID=your-private-key-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
# ... (see .env.example for complete list)

# CORS Configuration
CORS_ORIGIN=http://localhost:5173
```

### 3. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing one
3. Enable Authentication > Sign-in method > Email/Password
4. Go to Project Settings > Service Accounts
5. Click "Generate new private key"
6. Copy the values to your `.env` file

### 4. MongoDB Setup

**Option A: MongoDB Atlas (Recommended)**
1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get connection string and add to `MONGODB_URI`

**Option B: Local MongoDB**
```bash
# Install MongoDB locally and start service
MONGODB_URI=mongodb://localhost:27017/primus-characters
```

### 5. Start the Server

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

Server will start on `http://localhost:3001`

## 📡 API Endpoints

All endpoints require Firebase Authentication via `Authorization: Bearer <id_token>` header.

### Characters

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/characters` | Get all user's characters |
| `GET` | `/api/characters/:id` | Get specific character |
| `POST` | `/api/characters` | Create new character |
| `PUT` | `/api/characters/:id` | Update existing character |
| `DELETE` | `/api/characters/:id` | Delete character |

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Server health status |

## 📝 API Usage Examples

### Create Character

```bash
curl -X POST http://localhost:3001/api/characters \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_FIREBASE_ID_TOKEN" \
  -d '{
    "name": "Aragorn",
    "level": 5,
    "role": "DPS",
    "archetype": "Ranger",
    "stats": {
      "strength": 16,
      "dexterity": 18,
      "constitution": 14,
      "intelligence": 12,
      "wisdom": 15,
      "charisma": 13
    },
    "skills": ["Archery", "Tracking", "Survival"]
  }'
```

### Get All Characters

```bash
curl -X GET http://localhost:3001/api/characters \
  -H "Authorization: Bearer YOUR_FIREBASE_ID_TOKEN"
```

## 🔒 Security Features

- **Firebase Authentication**: All routes protected by Firebase ID token verification
- **User Isolation**: Characters are scoped to authenticated user via `ownerId`
- **Input Validation**: Mongoose schema validation for all character data
- **CORS Protection**: Configured for specific frontend origins
- **Error Handling**: Comprehensive error responses without exposing internals

## 🏗️ Data Models

### Character Schema

```javascript
{
  name: String,           // Character name (required)
  level: Number,          // Character level (1-50)
  role: String,           // DPS, Support, or Tank
  archetype: String,      // Class/archetype name
  stats: {
    strength: Number,     // 1-30
    dexterity: Number,    // 1-30
    constitution: Number, // 1-30
    intelligence: Number, // 1-30
    wisdom: Number,       // 1-30
    charisma: Number      // 1-30
  },
  skills: [String],       // Array of skill names
  ownerId: String,        // Firebase UID (auto-populated)
  createdAt: Date,        // Auto-generated
  updatedAt: Date         // Auto-generated
}
```

## 🚀 Deployment

### Railway

1. Create account at [Railway](https://railway.app/)
2. Connect your GitHub repository
3. Add environment variables in Railway dashboard
4. Deploy automatically on git push

### Render

1. Create account at [Render](https://render.com/)
2. Create new Web Service from GitHub
3. Set build command: `npm install`
4. Set start command: `npm start`
5. Add environment variables

### Heroku

```bash
# Install Heroku CLI and login
heroku create your-app-name
heroku config:set MONGODB_URI=your-mongodb-uri
heroku config:set FIREBASE_PROJECT_ID=your-project-id
# ... add all environment variables
git push heroku main
```

## 🐛 Troubleshooting

### Common Issues

**1. Firebase Authentication Errors**
- Verify Firebase project ID and private key
- Check that Firebase Auth is enabled
- Ensure ID token is not expired

**2. MongoDB Connection Issues**
- Verify connection string format
- Check network access in MongoDB Atlas
- Ensure database user has proper permissions

**3. CORS Errors**
- Update `CORS_ORIGIN` in environment variables
- Verify frontend URL matches exactly

### Development Tips

```bash
# View logs in development
npm run dev

# Test API endpoints
curl -X GET http://localhost:3001/health

# Check MongoDB connection
# Look for "✅ Connected to MongoDB" in console
```

## 📚 Additional Resources

- [Firebase Admin SDK Documentation](https://firebase.google.com/docs/admin/setup)
- [MongoDB Atlas Getting Started](https://docs.atlas.mongodb.com/getting-started/)
- [Express.js Documentation](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/docs/)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit pull request

## 📄 License

This project is licensed under the MIT License.