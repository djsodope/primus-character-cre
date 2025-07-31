import { useState } from 'react';
import { useKV } from '@github/spark/hooks';
import { Character } from './lib/types';
import { CharacterList } from './components/CharacterList';
import { CharacterForm } from './components/CharacterForm';
import { CharacterSheet } from './components/CharacterSheet';
import { Button } from './components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Scroll, Sparkles } from '@phosphor-icons/react';

type ViewMode = 'list' | 'create' | 'edit' | 'sheet';

function App() {
  const [characters, setCharacters] = useKV<Character[]>("characters", []);
  const [currentView, setCurrentView] = useState<ViewMode>('list');
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

  const handleSaveCharacter = (character: Character) => {
    setCharacters(current => {
      const existing = current.find(c => c.id === character.id);
      if (existing) {
        return current.map(c => c.id === character.id ? character : c);
      } else {
        return [...current, character];
      }
    });
    setCurrentView('list');
  };

  const handleDeleteCharacter = (characterId: string) => {
    setCharacters(current => current.filter(c => c.id !== characterId));
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedCharacter(null);
  };

  if (currentView === 'create' || currentView === 'edit') {
    return (
      <CharacterForm
        character={selectedCharacter}
        onSave={handleSaveCharacter}
        onCancel={handleBackToList}
      />
    );
  }

  if (currentView === 'sheet' && selectedCharacter) {
    return (
      <CharacterSheet
        character={selectedCharacter}
        onBack={handleBackToList}
        onEdit={() => handleEditCharacter(selectedCharacter)}
      />
    );
  }

  return (
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
        </div>

        {characters.length === 0 ? (
          /* Empty State */
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
        ) : (
          /* Character List */
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="font-serif text-2xl font-semibold text-primary">
                Your Characters ({characters.length})
              </h2>
              <Button onClick={handleCreateCharacter} className="glow-hover">
                <Sparkles className="w-4 h-4 mr-2" weight="fill" />
                Create New Character
              </Button>
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
    </div>
  );
}

export default App;