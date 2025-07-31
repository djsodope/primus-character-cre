# 🎭 Primus Character Creator

A full-stack web application for creating and managing tabletop RPG characters, inspired by Dungeons & Dragons and custom TTRPG systems like Arcanum Primus.

## ✨ Features

- **Character Creation**: Comprehensive form with stats, skills, and customization
- **Cloud Storage**: MongoDB backend with offline support
- **Character Sheets**: Printable D&D-style character sheets
- **PDF Export**: Generate and download character sheets as PDFs
- **Responsive Design**: Beautiful fantasy-themed UI that works on all devices
- **Offline Mode**: Continue working even without internet connection

## 🚀 Quick Start

### Frontend Development
1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Open in browser:**
   Navigate to `http://localhost:5173`

### Backend Setup
For full functionality, you'll need to set up the backend API. See [BACKEND_SETUP.md](./BACKEND_SETUP.md) for detailed instructions.

**Quick backend setup:**
1. Create a MongoDB Atlas account and cluster
2. Set up the backend following the guide
3. Update `.env` with your backend URL:
   ```
   VITE_API_URL=http://localhost:5000
   ```

## 🛠️ Tech Stack

### Frontend
- **React** with TypeScript
- **Tailwind CSS** for styling
- **shadcn/ui** components
- **Phosphor Icons**
- **Sonner** for notifications
- **react-to-print** for PDF export

### Backend (Optional)
- **Node.js + Express**
- **MongoDB + Mongoose**
- **CORS** for cross-origin requests

## 📁 Project Structure

```
src/
├── components/           # React components
│   ├── ui/              # shadcn/ui components
│   ├── CharacterForm.tsx
│   ├── CharacterList.tsx
│   └── CharacterSheet.tsx
├── lib/                 # Utilities and types
│   ├── api.ts          # Backend API functions
│   ├── types.ts        # TypeScript interfaces
│   └── gameData.ts     # RPG game data
├── hooks/              # Custom React hooks
│   └── useCharacters.ts # Character management
└── styles/             # CSS files
```

## 🎮 How to Use

1. **Create Characters**: Fill out the character creation form with name, role, stats, and skills
2. **Manage Collection**: View all your characters in an organized list
3. **Edit & Update**: Modify character details anytime
4. **View Sheets**: See formatted character sheets with all details
5. **Export PDF**: Download printable character sheets for tabletop use

## 🌟 Key Features Details

### Character Creation
- **Point-buy System**: Distribute ability points with balanced constraints
- **Role Selection**: Choose from DPS, Support, or Tank roles
- **Archetype System**: Select specialized character builds
- **Skill Trees**: Pick from tiered skill progressions

### Data Management
- **Cloud Sync**: Automatic synchronization with backend when available
- **Offline Support**: Full functionality without internet connection
- **Local Backup**: Automatic local storage backup of all data
- **Error Recovery**: Graceful handling of network issues

### User Experience
- **Fantasy Theme**: Immersive parchment-style design
- **Responsive Layout**: Works on desktop, tablet, and mobile
- **Loading States**: Clear feedback during data operations
- **Error Handling**: User-friendly error messages and recovery options

## 🚀 Deployment

### Frontend (Vercel/Netlify)
1. Push code to GitHub
2. Connect to hosting platform
3. Set environment variable: `VITE_API_URL=https://your-backend-url.com`
4. Deploy

### Backend (Render/Railway/Heroku)
1. Follow backend setup guide
2. Deploy backend service
3. Update frontend environment with backend URL

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Environment Variables
```bash
# .env
VITE_API_URL=http://localhost:5000  # Backend API URL
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

Licensed under the MIT License. See LICENSE file for details.

## 🆘 Support

- Check [BACKEND_SETUP.md](./BACKEND_SETUP.md) for backend issues
- Review browser console for frontend errors
- Ensure MongoDB Atlas is properly configured
- Verify CORS settings for cross-origin requests

---

*Happy character creating! 🎲✨*