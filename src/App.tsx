import { useState } from 'react';
import { Character } from './lib/types';
import { useCharacters } from './hooks/useCharacters';
import { useAuth } from './contexts/AuthContext';
import { CharacterList } from './components/CharacterList';
import { CharacterForm } from './components/CharacterForm';
import { CharacterSheet } from './components/CharacterSheet';
import { UserProfile } from './components/UserProfile';
import { LoginForm } from './components/LoginForm';
import { RegisterForm } from './components/RegisterForm';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Button } from './components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Scroll, Sparkles, SignIn, ArrowClockwise } from '@phosphor-icons/react';
import { Toaster } from 'sonner';

type ViewMode = 'list' | 'create' | 'edit' | 'sheet';
type AuthMode = 'login' | 'register';

function App() {
  const { loading: authLoading } = useAuth();
  const {
    characters,
    loading,
    error,
    user,
    isAuthenticated,
    createCharacter,
    updateCharacter,
    deleteCharacter,
    refreshCharacters
  } = useCharacters();
  
  const [currentView, setCurrentView] = useState<ViewMode>('list');
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);

  const handleCreateCharacter = () => {
    setSelectedCharacter(null);
    setCurrentView('create');
  };

  const handleEditCharacter = (character: Character) => {
    setSelectedCharacter(character);
    setCurrentView('edit');
  };

  const handleViewSheet = (character: Character) => {
    setSelectedCharacter(character);
    setCurrentView('sheet');
  };

  const handleSaveCharacter = async (character: Character) => {
    if (!isAuthenticated) {
      return; // Error handling is done in the hook
    }
    
    try {
      const { id, createdAt, updatedAt, ownerId, ...characterData } = character;
      
      if (selectedCharacter) {
        // Update existing character
        await updateCharacter(character.id, characterData);
      } else {
        // Create new character
        await createCharacter(characterData);
      }
      
      setCurrentView('list');
    } catch (error) {
      // Error handling is done in the hook
      console.error('Failed to save character:', error);
    }
  };

  const handleDeleteCharacter = async (characterId: string) => {
    if (!isAuthenticated) {
      return; // Error handling is done in the hook
    }
    
    try {
      await deleteCharacter(characterId);
    } catch (error) {
      // Error handling is done in the hook
      console.error('Failed to delete character:', error);
    }
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedCharacter(null);
  };

  // Loading state during auth check
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background font-sans flex items-center justify-center">
        <Card className="max-w-md mx-auto parchment-bg fantasy-border">
          <CardContent className="text-center py-8">
            <div className="w-12 h-12 mx-auto mb-4 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
            <p className="text-muted-foreground">Loading your account...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Authentication required state
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background font-sans flex items-center justify-center">
        <div className="w-full max-w-md mx-auto p-4">
          {authMode === 'login' ? (
            <LoginForm onShowRegister={() => setAuthMode('register')} />
          ) : (
            <RegisterForm onShowLogin={() => setAuthMode('login')} />
          )}
        </div>
      </div>
    );
  }

  // Protected content
  return (
    <ProtectedRoute>
      {/* Character form views */}
      {(currentView === 'create' || currentView === 'edit') && (
        <CharacterForm
          character={selectedCharacter}
          onSave={handleSaveCharacter}
          onCancel={handleBackToList}
          isAuthenticated={isAuthenticated}
          user={user}
        />
      )}

      {/* Character sheet view */}
      {currentView === 'sheet' && selectedCharacter && (
        <CharacterSheet
          character={selectedCharacter}
          onBack={handleBackToList}
          onEdit={() => handleEditCharacter(selectedCharacter)}
        />
      )}

      {/* Main list view */}
      {currentView === 'list' && (
        <div className="min-h-screen bg-background font-sans">
          <div className="container mx-auto py-8 px-4">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Sparkles className="w-8 h-8 text-accent" weight="fill" />
                <h1 className="font-serif text-4xl font-bold text-primary">
                  Primus Character Creator
                </h1>
                <Scroll className="w-8 h-8 text-accent" weight="fill" />
              </div>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Create and manage characters for your tabletop RPG adventures. 
                Build legendary heroes with detailed stats, skills, and backstories.
              </p>
              
              {/* User Profile */}
              {isAuthenticated && user && (
                <div className="mt-6">
                  <UserProfile />
                </div>
              )}
              
              {/* Error Display */}
              {error && (
                <div className="flex items-center justify-center gap-2 mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg max-w-md mx-auto">
                  <span className="text-sm text-destructive">
                    {error}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={refreshCharacters}
                    className="h-auto p-1 text-destructive hover:text-destructive"
                  >
                    <ArrowClockwise className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>

            {/* Loading state */}
            {loading && (
              <Card className="max-w-md mx-auto parchment-bg fantasy-border">
                <CardContent className="text-center py-8">
                  <div className="w-12 h-12 mx-auto mb-4 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-muted-foreground">Loading your characters...</p>
                </CardContent>
              </Card>
            )}

            {/* Empty state */}
            {!loading && characters.length === 0 && (
              <Card className="max-w-md mx-auto parchment-bg fantasy-border">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-accent/10 rounded-full flex items-center justify-center">
                    <Scroll className="w-8 h-8 text-accent" weight="fill" />
                  </div>
                  <CardTitle className="font-serif text-2xl text-primary">
                    Begin Your Adventure
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <p className="text-muted-foreground">
                    You haven't created any characters yet. Start by creating your first hero 
                    and embark on epic adventures!
                  </p>
                  <Button 
                    onClick={handleCreateCharacter}
                    className="w-full glow-hover"
                    size="lg"
                  >
                    <Sparkles className="w-5 h-5 mr-2" weight="fill" />
                    Create Your First Character
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Character List */}
            {!loading && characters.length > 0 && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="font-serif text-2xl font-semibold text-primary">
                    Your Characters ({characters.length})
                  </h2>
                  <div className="flex gap-2">
                    <Button onClick={handleCreateCharacter} className="glow-hover">
                      <Sparkles className="w-4 h-4 mr-2" weight="fill" />
                      Create New Character
                    </Button>
                  </div>
                </div>
                
                <CharacterList
                  characters={characters}
                  onEdit={handleEditCharacter}
                  onDelete={handleDeleteCharacter}
                  onViewSheet={handleViewSheet}
                />
              </div>
            )}
          </div>
          
          {/* Toast Container */}
          <Toaster 
            position="top-right"
            toastOptions={{
              style: {
                background: 'var(--card)',
                border: '1px solid var(--border)',
                color: 'var(--card-foreground)',
              },
            }}
          />
        </div>
      )}
    </ProtectedRoute>
  );
}

export default App;