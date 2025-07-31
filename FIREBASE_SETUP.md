# Primus Character Creator - Firebase Setup Guide

## 🔥 Firebase Integration Complete!

The Primus Character Creator now includes full Firebase Authentication integration with secure backend API. Users can:

- ✅ Register new accounts with email/password
- ✅ Sign in and out securely
- ✅ Have characters automatically associated with their Firebase UID
- ✅ Only view/edit/delete their own characters
- ✅ Store characters in MongoDB cloud database

## 🚀 Quick Start

### 1. Frontend Setup

1. **Copy environment template:**
   ```bash
   cp .env.example .env
   ```

2. **Configure Firebase (Frontend):**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project or select existing
   - Go to Project Settings > General
   - Copy Web App config values to `.env`:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key_here
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
   VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
   VITE_API_URL=http://localhost:3001
   ```

3. **Enable Authentication:**
   - Firebase Console > Authentication > Sign-in method
   - Enable "Email/Password" provider

4. **Start frontend:**
   ```bash
   npm run dev
   ```

### 2. Backend Setup

1. **Navigate to backend:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment:**
   ```bash
   cp .env.example .env
   ```

4. **Setup Firebase Admin SDK:**
   - Firebase Console > Project Settings > Service Accounts
   - Click "Generate new private key"
   - Copy values to backend `.env` file

5. **Setup MongoDB:**
   - Create [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account
   - Create cluster and get connection string
   - Add to `MONGODB_URI` in `.env`

6. **Start backend:**
   ```bash
   npm run dev
   ```

## 🔐 Authentication Flow

1. **New Users:** Registration form with email/password and validation
2. **Existing Users:** Login form with secure authentication
3. **Auto-Login:** Users stay logged in across browser sessions
4. **Secure API:** All character operations require valid Firebase ID token

## 📱 User Experience

### Registration Process
- Strong password requirements (length, upper/lower/numbers)
- Real-time validation feedback
- Instant account creation and login

### Character Management
- Characters automatically linked to user account
- Full CRUD operations (create, read, update, delete)
- Data persists across devices and sessions
- User can only access their own characters

### Security Features
- Firebase Authentication handles all security concerns
- JWT tokens verify user identity on every API call
- Backend validates ownership before any character operations
- No user data stored in local storage (except temporary auth state)

## 🛠️ Development Notes

### Frontend Architecture
- `AuthContext` manages user state and Firebase auth methods
- `useAuth` hook provides authentication status and methods
- `useCharacters` hook handles API calls with automatic token inclusion
- Protected routes prevent access without authentication

### Backend Architecture
- Express.js with Firebase Admin SDK token verification
- MongoDB with Mongoose for data modeling
- Character schema includes `ownerId` field for user association
- Auth middleware protects all character endpoints

### API Security
- All `/api/characters/*` routes require Firebase ID token
- Users can only perform operations on their own characters
- Comprehensive error handling and validation
- CORS properly configured for frontend domain

## 🚀 Deployment Ready

Both frontend and backend are configured for easy deployment:

**Frontend:** Vercel, Netlify, or any static hosting
**Backend:** Railway, Render, Heroku, or any Node.js hosting

See the backend README for detailed deployment instructions.

---

**Next Steps:** The character creator is now a full-stack application with secure user accounts and cloud storage! Users can register, create characters, and access them from anywhere.