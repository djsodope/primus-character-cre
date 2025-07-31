import { useState, useEffect } from 'react';
import { Character } from '../lib/types';
import { characterApi } from '../lib/api';
import { toast } from 'sonner';

interface UseCharactersState {
  characters: Character[];
  loading: boolean;
  error: string | null;
  isOffline: boolean;
}

interface UseCharactersActions {
  createCharacter: (character: Omit<Character, 'id' | 'createdAt'>) => Promise<void>;
  updateCharacter: (id: string, character: Partial<Character>) => Promise<void>;
  deleteCharacter: (id: string) => Promise<void>;
  refreshCharacters: () => Promise<void>;
}

export function useCharacters(): UseCharactersState & UseCharactersActions {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState(false);

  // Load characters from API
  const loadCharacters = async () => {
    try {
      setLoading(true);
      setError(null);
      setIsOffline(false);
      
      const data = await characterApi.getAll();
      setCharacters(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load characters';
      setError(errorMessage);
      setIsOffline(true);
      
      // Fallback to local storage if API fails
      try {
        const localData = localStorage.getItem('primus-characters');
        if (localData) {
          setCharacters(JSON.parse(localData));
          toast.warning('Using offline data - some features may be limited');
        }
      } catch {
        // Local storage also failed
        setCharacters([]);
      }
    } finally {
      setLoading(false);
    }
  };

  // Create new character
  const createCharacter = async (characterData: Omit<Character, 'id' | 'createdAt'>) => {
    try {
      setError(null);
      
      if (isOffline) {
        // Offline mode - use local storage
        const newCharacter: Character = {
          ...characterData,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
        };
        
        const updatedCharacters = [...characters, newCharacter];
        setCharacters(updatedCharacters);
        localStorage.setItem('primus-characters', JSON.stringify(updatedCharacters));
        toast.success('Character created (offline mode)');
        return;
      }

      const newCharacter = await characterApi.create(characterData);
      setCharacters(prev => [...prev, newCharacter]);
      toast.success('Character created successfully!');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create character';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    }
  };

  // Update existing character
  const updateCharacter = async (id: string, updates: Partial<Character>) => {
    try {
      setError(null);
      
      if (isOffline) {
        // Offline mode
        const updatedCharacters = characters.map(char => 
          char.id === id ? { ...char, ...updates } : char
        );
        setCharacters(updatedCharacters);
        localStorage.setItem('primus-characters', JSON.stringify(updatedCharacters));
        toast.success('Character updated (offline mode)');
        return;
      }

      const updatedCharacter = await characterApi.update(id, updates);
      setCharacters(prev => prev.map(char => 
        char.id === id ? updatedCharacter : char
      ));
      toast.success('Character updated successfully!');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update character';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    }
  };

  // Delete character
  const deleteCharacter = async (id: string) => {
    try {
      setError(null);
      
      if (isOffline) {
        // Offline mode
        const updatedCharacters = characters.filter(char => char.id !== id);
        setCharacters(updatedCharacters);
        localStorage.setItem('primus-characters', JSON.stringify(updatedCharacters));
        toast.success('Character deleted (offline mode)');
        return;
      }

      await characterApi.delete(id);
      setCharacters(prev => prev.filter(char => char.id !== id));
      toast.success('Character deleted successfully!');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete character';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    }
  };

  // Refresh characters from API
  const refreshCharacters = async () => {
    await loadCharacters();
  };

  // Load characters on mount
  useEffect(() => {
    loadCharacters();
  }, []);

  // Sync to local storage when online (backup)
  useEffect(() => {
    if (!isOffline && characters.length > 0) {
      localStorage.setItem('primus-characters-backup', JSON.stringify(characters));
    }
  }, [characters, isOffline]);

  return {
    characters,
    loading,
    error,
    isOffline,
    createCharacter,
    updateCharacter,
    deleteCharacter,
    refreshCharacters,
  };
}