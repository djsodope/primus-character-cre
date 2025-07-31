# Primus Character Creator - Product Requirements Document

## Core Purpose & Success

**Mission Statement**: Primus Character Creator is a web application that enables tabletop RPG players to create, customize, and manage character sheets for Dungeons & Dragons-style campaigns with secure personal account storage.

**Success Indicators**: 
- Users can successfully create and save characters to their personal GitHub accounts
- Characters persist across sessions and devices
- Intuitive character creation process with D&D-inspired mechanics
- Seamless authentication flow using GitHub

**Experience Qualities**: Mystical, Organized, Trustworthy

## Project Classification & Approach

**Complexity Level**: Light Application (multiple features with basic state and user authentication)

**Primary User Activity**: Creating - Users spend most time building and customizing characters

## Core Features

### User Authentication System
- **Functionality**: Secure GitHub-based authentication using Spark's built-in auth system
- **Purpose**: Enable personal character storage and account-based data persistence
- **Success Criteria**: Users can sign in seamlessly and have their characters saved to their account

### Character Creation & Management
- **Functionality**: Multi-step character creator with stats, roles, archetypes, and skills
- **Purpose**: Provide a comprehensive tool for RPG character building
- **Success Criteria**: Users can create complete characters with all necessary RPG elements

### Personal Character Library
- **Functionality**: View, edit, and delete saved characters from personal collection
- **Purpose**: Maintain a persistent library of user's characters
- **Success Criteria**: Characters are reliably stored and retrievable across sessions

### Character Sheet Display & Export
- **Functionality**: View formatted character sheets and export as PDF
- **Purpose**: Provide usable character sheets for gameplay
- **Success Criteria**: Character sheets display all relevant information clearly

## Design Direction

### Visual Tone & Identity
**Emotional Response**: The design should evoke a sense of mystical adventure, organized simplicity, and trustworthy security. Users should feel they're entering a magical realm while having confidence their data is safe.

**Design Personality**: Fantasy-inspired yet clean and modern, balancing magical aesthetics with professional functionality.

**Visual Metaphors**: Parchment scrolls, medieval manuscripts, glowing mystical elements, and classic D&D aesthetic cues.

**Simplicity Spectrum**: Moderately rich interface that embraces fantasy theming without compromising usability.

### Color Strategy
**Color Scheme Type**: Custom fantasy palette with warm, earthy tones

**Primary Colors**:
- Deep Burgundy (`oklch(0.35 0.15 15)`) - Primary actions and headers
- Forest Green (`oklch(0.45 0.12 155)`) - Secondary actions
- Golden Amber (`oklch(0.75 0.15 65)`) - Accent highlights and magical elements

**Color Psychology**: Warm, inviting colors that suggest ancient knowledge and mystical power while maintaining readability and trust.

**Foreground/Background Pairings**:
- Warm Parchment background with Dark Brown text (4.7:1 contrast)
- Deep Burgundy primary with Warm White text (5.2:1 contrast)
- Golden Amber accent with Dark Brown text (4.8:1 contrast)

### Typography System
**Font Pairing Strategy**: Crimson Text serif for headings (fantasy feel) paired with Inter sans-serif for body text (modern readability)

**Which fonts**: 
- Crimson Text - Elegant serif with medieval character for headings and titles
- Inter - Clean, modern sans-serif for body text and UI elements

**Legibility Check**: Both fonts are highly legible with good x-heights and character distinction

### Authentication Experience
**Visual Integration**: Authentication flows seamlessly integrate with the fantasy theme while clearly indicating the secure GitHub connection.

**Trust Signals**: Clear indication of GitHub authentication, user profile display, and secure data storage messaging.

## Implementation Considerations

### Authentication Architecture
- Leverage Spark's built-in GitHub authentication system
- Use `spark.user()` API for user information
- Implement `useKV` hooks for user-specific character storage

### Data Persistence Strategy
- Characters stored using Spark's key-value system with user-specific keys
- Automatic synchronization across devices through user accounts
- Graceful handling of unauthenticated users

### Progressive Enhancement
- Core character creation functionality available immediately after authentication
- Advanced features like PDF export and detailed character sheets as secondary capabilities

## Security & Privacy

### Data Protection
- No sensitive data stored beyond character information
- User authentication handled entirely by GitHub/Spark infrastructure
- Character data encrypted and secured through Spark's KV system

### Access Control
- Characters are private to each user account
- No sharing or collaboration features to maintain data privacy
- Clear ownership and access patterns

## Success Metrics

- Authentication completion rate > 95%
- Character creation completion rate > 80%
- Data persistence reliability > 99%
- User session continuity across devices > 95%

## Technical Architecture

### Frontend Components
- React-based UI with TypeScript
- Shadcn UI components for consistent design system
- Tailwind CSS for styling with custom fantasy theme
- Framer Motion for subtle animations

### Data Management
- Spark's `useKV` hooks for reactive character storage
- User-specific data keys for privacy and organization
- Optimistic UI updates with error handling

### Authentication Flow
- Seamless GitHub integration through Spark platform
- User profile display with avatar and account information
- Clear authentication state management throughout the application