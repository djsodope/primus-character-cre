# Primus Character Creator - Backend API

A production-ready Node.js + Express backend for the Primus Character Creator, a D&D-inspired character management system.

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- MongoDB Atlas account (or local MongoDB)
- npm or yarn

### Installation

1. **Install dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Environment Setup**
   ```bash
   # Copy environment template
   cp .env.example .env
   
   # Edit .env with your MongoDB Atlas connection string
   nano .env
   ```

3. **MongoDB Atlas Setup**
   - Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Get your connection string
   - Replace `<username>`, `<password>`, and `<cluster-url>` in `.env`

4. **Start Development Server**
   ```bash
   # Using npm
   npm run dev
   
   # Or using node directly
   npm start
   ```

   Server will start on `http://localhost:5000`

## 📋 API Endpoints

### Characters

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/characters` | Create new character |
| `GET` | `/api/characters` | Get all characters |
| `GET` | `/api/characters/:id` | Get character by ID |
| `PUT` | `/api/characters/:id` | Update character |
| `DELETE` | `/api/characters/:id` | Delete character |
| `GET` | `/api/characters/stats` | Get character statistics |

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | API health status |
| `GET` | `/` | API documentation |

## 📊 Character Schema

```javascript
{
  name: String (required),
  role: "DPS" | "Support" | "Tank" (required),
  archetype: String (required),
  level: Number (1-20, default: 1),
  stats: {
    STR: Number (1-20, default: 10),
    DEX: Number (1-20, default: 10),
    CON: Number (1-20, default: 10),
    INT: Number (1-20, default: 10),
    WIS: Number (1-20, default: 10),
    CHA: Number (1-20, default: 10)
  },
  skills: [String],
  background: String (optional),
  equipment: [{
    name: String,
    quantity: Number
  }],
  createdAt: Date,
  updatedAt: Date
}
```

## 🔧 API Usage Examples

### Create Character
```bash
curl -X POST http://localhost:5000/api/characters \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Aragorn",
    "role": "DPS",
    "archetype": "Ranger",
    "level": 5,
    "stats": {
      "STR": 16,
      "DEX": 18,
      "CON": 14,
      "INT": 12,
      "WIS": 15,
      "CHA": 13
    },
    "skills": ["Archery", "Tracking", "Survival"]
  }'
```

### Get All Characters
```bash
curl http://localhost:5000/api/characters
```

### Get Character by ID
```bash
curl http://localhost:5000/api/characters/650a1b2c3d4e5f6789012345
```

### Update Character
```bash
curl -X PUT http://localhost:5000/api/characters/650a1b2c3d4e5f6789012345 \
  -H "Content-Type: application/json" \
  -d '{"level": 6}'
```

### Delete Character
```bash
curl -X DELETE http://localhost:5000/api/characters/650a1b2c3d4e5f6789012345
```

## 🌐 Deployment

### Railway
1. Connect your GitHub repository
2. Add environment variables in Railway dashboard
3. Deploy automatically on push

### Render
1. Create new Web Service
2. Connect repository
3. Set environment variables
4. Deploy

### Environment Variables for Production
```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/primus-characters
PORT=5000
NODE_ENV=production
```

## 🛠️ Project Structure

```
backend/
├── config/
│   └── database.js          # MongoDB connection
├── controllers/
│   └── characterController.js # Business logic
├── middleware/
│   └── errorHandler.js      # Error handling
├── models/
│   └── Character.js         # Mongoose schema
├── routes/
│   └── characterRoutes.js   # API routes
├── .env.example             # Environment template
├── package.json             # Dependencies
└── server.js               # App entry point
```

## 🧪 Testing

Test the API using the health endpoint:
```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "success": true,
  "message": "Primus Character Creator API is running",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "environment": "development"
}
```

## 🔐 Security Features

- ✅ CORS protection
- ✅ Input validation
- ✅ MongoDB injection protection
- ✅ Error handling
- ✅ Request logging
- ✅ Environment variable security

## 📝 Features

- 🎯 Full CRUD operations for characters
- 📊 Character statistics and analytics
- 🔍 Query filtering and sorting
- ✅ Data validation and error handling
- 🚀 Production-ready with proper error handling
- 📱 CORS enabled for frontend integration
- 🏗️ Scalable architecture with separated concerns

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## 📄 License

MIT License - see LICENSE file for details