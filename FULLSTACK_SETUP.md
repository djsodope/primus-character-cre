# 🎲 Primus Character Creator - Full Stack Setup Guide

Complete guide for running the Primus Character Creator with both frontend (React) and backend (Node.js + MongoDB) components.

## 🏗️ Project Architecture

```
primus-character-creator/
├── frontend/ (Current directory - React + Vite)
│   ├── src/
│   │   ├── components/
│   │   ├── lib/
│   │   └── App.tsx
│   └── package.json
└── backend/ (Node.js + Express + MongoDB)
    ├── controllers/
    ├── models/
    ├── routes/
    └── server.js
```

## 🚀 Full Stack Quick Start

### 1. Backend Setup (First)

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your MongoDB Atlas credentials

# Start backend server
npm run dev
```

Backend runs on: `http://localhost:5000`

### 2. Frontend Setup (Second)

```bash
# Navigate back to frontend (main directory)
cd ..

# Install dependencies (if not already done)
npm install

# Start frontend development server
npm run dev
```

Frontend runs on: `http://localhost:5173`

## 🔗 Connecting Frontend to Backend

To integrate the React frontend with the Node.js backend, you'll need to update the frontend to make API calls instead of using local storage.

### Update Frontend Character Management

Replace the `useKV` storage with API calls in your React components:

```javascript
// Example API integration in App.tsx
const API_BASE_URL = 'http://localhost:5000/api';

// Replace useKV with API calls
const [characters, setCharacters] = useState([]);

// Fetch characters from backend
useEffect(() => {
  fetchCharacters();
}, []);

const fetchCharacters = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/characters`);
    const data = await response.json();
    if (data.success) {
      setCharacters(data.data);
    }
  } catch (error) {
    console.error('Error fetching characters:', error);
  }
};

// Save character to backend
const handleSaveCharacter = async (character) => {
  try {
    const method = character.id ? 'PUT' : 'POST';
    const url = character.id 
      ? `${API_BASE_URL}/characters/${character.id}`
      : `${API_BASE_URL}/characters`;
    
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(character),
    });
    
    const data = await response.json();
    if (data.success) {
      fetchCharacters(); // Refresh list
    }
  } catch (error) {
    console.error('Error saving character:', error);
  }
};
```

## 📋 Required Backend Environment Variables

Create `backend/.env` with these values:

```bash
# MongoDB Atlas (Required)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/primus-characters?retryWrites=true&w=majority

# Server Configuration
PORT=5000
NODE_ENV=development
```

### Getting MongoDB Atlas URI:
1. Sign up at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free cluster
3. Create a database user
4. Get connection string from "Connect" > "Connect your application"
5. Replace `<username>`, `<password>`, and `<cluster-url>` with your values

## 🔧 Development Workflow

### Start Both Servers
```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend  
cd ..
npm run dev
```

### Verify Connection
1. Backend health check: `http://localhost:5000/health`
2. Frontend app: `http://localhost:5173`
3. Test character creation in frontend
4. Verify data appears in MongoDB Atlas

## 🌐 Production Deployment

### Backend Deployment (Railway/Render)
1. Push code to GitHub
2. Connect repository to Railway or Render
3. Set environment variables in platform dashboard
4. Deploy backend first

### Frontend Deployment (Vercel/Netlify)
1. Update API_BASE_URL to production backend URL
2. Deploy frontend to Vercel or Netlify
3. Update CORS origins in backend to include frontend domain

### Environment Variables for Production

**Backend (.env):**
```bash
MONGODB_URI=mongodb+srv://...
PORT=5000
NODE_ENV=production
```

**Frontend (update in code):**
```javascript
const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://your-backend.railway.app/api'  
  : 'http://localhost:5000/api';
```

## 🧪 Testing the Full Stack

### 1. Test Backend API
```bash
# Create a character
curl -X POST http://localhost:5000/api/characters \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Hero",
    "role": "DPS", 
    "archetype": "Fighter",
    "stats": {"STR": 15, "DEX": 12, "CON": 14, "INT": 10, "WIS": 11, "CHA": 13}
  }'

# Get all characters
curl http://localhost:5000/api/characters
```

### 2. Test Frontend Integration
1. Open `http://localhost:5173`
2. Create a new character
3. Verify character appears in list
4. Check MongoDB Atlas for data persistence

## 🛠️ Troubleshooting

### CORS Issues
If frontend can't connect to backend:
```javascript
// Update backend/server.js corsOptions
const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
};
```

### MongoDB Connection Issues
- Verify username/password in connection string
- Check IP whitelist in Atlas (add 0.0.0.0/0 for development)
- Ensure cluster is active

### Port Conflicts
- Backend default: 5000
- Frontend default: 5173
- Change ports in package.json if needed

## 📚 API Documentation

Full API documentation available at: `http://localhost:5000/`

### Key Endpoints:
- `POST /api/characters` - Create character
- `GET /api/characters` - List all characters  
- `GET /api/characters/:id` - Get specific character
- `PUT /api/characters/:id` - Update character
- `DELETE /api/characters/:id` - Delete character

## 🎯 Next Steps

1. **Enhanced Features:**
   - User authentication
   - Character sharing
   - Export to PDF
   - Advanced filtering

2. **Performance:**
   - Add caching
   - Implement pagination
   - Optimize queries

3. **Production:**
   - Add monitoring
   - Implement logging
   - Set up CI/CD

## 📄 License

MIT License - Build amazing RPG tools! 🎲