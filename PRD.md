# Primus Character Creator - Product Requirements Document

Create a comprehensive D&D-inspired character creation and management tool for tabletop RPG players and game masters.

**Experience Qualities**:
1. **Intuitive** - Character creation should feel natural and guide users through logical progression
2. **Professional** - Interface should mirror the quality and attention to detail found in official D&D materials
3. **Efficient** - Users should be able to create and modify characters quickly without unnecessary friction

**Complexity Level**: Light Application (multiple features with basic state)
- Multiple interconnected forms and data management, character persistence, PDF export functionality, but focused on a single primary workflow

## Essential Features

### Character Creation Form
- **Functionality**: Multi-step form for creating new characters with name, level, role, archetype, and core stats (STR, DEX, CON, INT, WIS, CHA)
- **Purpose**: Primary entry point for new characters, establishes all fundamental character data
- **Trigger**: User clicks "Create New Character" button
- **Progression**: Basic Info → Stats Allocation → Role/Archetype Selection → Skill Selection → Review & Save
- **Success criteria**: Character saves successfully to backend/localStorage and appears in character list

### Backend API Integration
- **Functionality**: Full CRUD operations (Create, Read, Update, Delete) with MongoDB persistence and offline fallback
- **Purpose**: Reliable data persistence across sessions with seamless synchronization
- **Trigger**: All character operations automatically sync to backend when available
- **Progression**: User Action → API Call → Success/Error Handling → UI Update → Local Backup
- **Success criteria**: Characters persist across sessions, offline mode works seamlessly, sync restores when connection returns

### Skill System with Tier Filtering
- **Functionality**: Hierarchical skill selection with tier-based progression (Tier 1-3) and role-specific recommendations
- **Purpose**: Adds depth and customization while maintaining balance through tier restrictions
- **Trigger**: User reaches skill selection step in character creation or edits existing character
- **Progression**: Select Role → View Available Skills by Tier → Choose Skills within Limits → Confirm Selection
- **Success criteria**: Skills are properly associated with character and respect tier limitations

### Character Management Dashboard
- **Functionality**: Grid view of all created characters with quick actions (edit, duplicate, delete, export) plus connection status
- **Purpose**: Central hub for managing multiple characters across campaigns with real-time sync status
- **Trigger**: Application loads or user navigates to main view
- **Progression**: View Character Grid → Check Sync Status → Select Character → Choose Action (Edit/Export/Delete)
- **Success criteria**: All characters display correctly with accurate data, sync status is clear, actions work reliably

### Printable Character Sheet
- **Functionality**: Professional D&D-style character sheet layout optimized for printing and PDF export
- **Purpose**: Provides physical reference for gameplay and official documentation
- **Trigger**: User clicks "Export PDF" or "Print" from character view
- **Progression**: Open Character → Click Export → Generate PDF → Download/Print
- **Success criteria**: PDF generates with complete character data in readable, printable format

## Edge Case Handling

- **Backend Connection Loss**: Seamless fallback to offline mode with localStorage persistence and clear user notification
- **API Errors**: Graceful error handling with user-friendly messages and retry mechanisms
- **Data Sync Conflicts**: Automatic local backup prevents data loss during connection issues
- **Empty Character List**: Welcome screen with prominent "Create First Character" call-to-action
- **Invalid Stat Allocation**: Real-time validation prevents overspending points with clear error messages
- **Duplicate Character Names**: Automatic numbering system (e.g., "Gandalf", "Gandalf (2)")
- **PDF Generation Failure**: Graceful fallback to browser print dialog with error notification
- **Large Character Collections**: Pagination and search functionality for 20+ characters
- **Incomplete Character Data**: Auto-save drafts and validation warnings before final save
- **Network Timeouts**: Request timeout handling with automatic retry and offline fallback

## Design Direction

The design should evoke the classic elegance and gravitas of official D&D materials while feeling modern and accessible - think leather-bound tome meets contemporary web application, with rich textures and thoughtful typography that respects the fantasy genre's traditions.

## Color Selection

Triadic color scheme drawing from fantasy RPG aesthetics - deep parchment, rich burgundy, and forest green creating an authentic tabletop gaming atmosphere.

- **Primary Color**: Deep Burgundy (oklch(0.35 0.15 15)) - Conveys tradition, sophistication, and the classic D&D aesthetic
- **Secondary Colors**: Warm Parchment (oklch(0.93 0.05 85)) for backgrounds and Forest Green (oklch(0.45 0.12 155)) for accents
- **Accent Color**: Golden Amber (oklch(0.75 0.15 65)) for calls-to-action and highlighting important elements
- **Foreground/Background Pairings**: 
  - Background (Warm Parchment): Dark Brown text (oklch(0.25 0.05 45)) - Ratio 5.8:1 ✓
  - Primary (Deep Burgundy): Warm White text (oklch(0.95 0.02 85)) - Ratio 7.2:1 ✓
  - Accent (Golden Amber): Dark Brown text (oklch(0.25 0.05 45)) - Ratio 4.9:1 ✓
  - Card backgrounds: Light Parchment (oklch(0.97 0.03 85)) with Dark Brown text - Ratio 6.1:1 ✓

## Font Selection

Typography should balance the gravitas of fantasy literature with modern readability - a serif font for headings that evokes ancient tomes paired with a clean sans-serif for interface elements and data.

- **Typographic Hierarchy**: 
  - H1 (App Title): Crimson Text Bold/32px/tight letter spacing
  - H2 (Section Headers): Crimson Text Semibold/24px/normal spacing  
  - H3 (Subsections): Crimson Text Medium/18px/normal spacing
  - Body Text: Inter Regular/16px/relaxed line height
  - Labels/UI: Inter Medium/14px/normal spacing
  - Character Sheet: Crimson Text for flavor, Inter for stats/numbers

## Animations

Subtle, purposeful animations that enhance the feeling of interacting with magical tomes and character sheets - gentle page turns, soft glows on interactive elements, and smooth transitions that never interrupt the creative flow.

- **Purposeful Meaning**: Motion should reinforce the magical/mystical theme while maintaining professional functionality
- **Hierarchy of Movement**: Character creation steps get smooth slide transitions, stat changes use gentle number animations, hover states have soft glows

## Component Selection

- **Components**: 
  - Forms: shadcn Form, Input, Select, Slider components with custom D&D styling
  - Navigation: Tabs for character creation steps, Breadcrumb for progress tracking
  - Data Display: Card for character previews, Table for stat blocks, Badge for skill tiers
  - Actions: Button variants for primary/secondary actions, AlertDialog for deletions
  - Layout: Grid for character gallery, Separator for logical sections
  
- **Customizations**: 
  - Custom stat block component combining multiple shadcn inputs
  - Specialized skill selector with tier filtering logic
  - Character sheet layout component for print optimization
  
- **States**: 
  - Buttons: Hover glows, active press effects, disabled when invalid
  - Inputs: Focus rings with fantasy colors, validation states with contextual messaging
  - Character cards: Hover elevation, selection highlighting
  
- **Icon Selection**: Phosphor icons focused on RPG themes - dice, scrolls, swords, shields, plus standard UI icons
- **Spacing**: Generous padding (p-6, p-8) to create breathing room, consistent gaps (gap-4, gap-6) for related elements
- **Mobile**: Character creation becomes single-column with collapsible sections, character grid adapts to single column, PDF export prompts for landscape orientation