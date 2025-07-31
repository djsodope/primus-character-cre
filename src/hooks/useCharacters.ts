import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Character } from '../lib/types';
import { characterApi, ApiError } from '../lib/api';
import { toast } from 'sonner';

interface UseCharactersState {
  characters: Character[];
  loading: boolean;
  error: string | null;
  user: any;
  isAuthenticated: boolean;
}

interface UseCharactersActions {
  createCharacter: (character: Omit<Character, 'id' | 'createdAt' | 'updatedAt' | 'ownerId'>) => Promise<void>;
  updateCharacter: (id: string, character: Partial<Character>) => Promise<void>;
  deleteCharacter: (id: string) => Promise<void>;
  refreshCharacters: () => Promise<void>;
}

export function useCharacters(): UseCharactersState & UseCharactersActions {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentUser, getIdToken } = useAuth();

  const isAuthenticated = !!currentUser;

  // Load characters from API
  const loadCharacters = async () => {
    if (!currentUser) {
      setCharacters([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const idToken = await getIdToken();
      if (!idToken) {
        throw new Error('Failed to get authentication token');
      }

      const charactersData = await characterApi.getCharacters(idToken);
      setCharacters(charactersData);
    } catch (err) {
      const errorMessage = err instanceof ApiError 
        ? err.message 
        : err instanceof Error 
        ? err.message 
        : 'Failed to load characters';
      
      setError(errorMessage);
      
      // Only show error toast if it's not a connection issue
      if (!(err instanceof ApiError && err.status >= 500)) {
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  // Create new character
  const createCharacter = async (characterData: Omit<Character, 'id' | 'createdAt' | 'updatedAt' | 'ownerId'>) => {
    try {
      setError(null);
      
      if (!isAuthenticated) {
        toast.error('Please sign in to save characters');
        return;
      }
      
      const idToken = await getIdToken();
      if (!idToken) {
        throw new Error('Failed to get authentication token');
      }

      const newCharacter = await characterApi.createCharacter(characterData, idToken);
      setCharacters(prev => [...prev, newCharacter]);
      toast.success('Character created and saved!');
    } catch (err) {
      const errorMessage = err instanceof ApiError 
        ? err.message 
        : err instanceof Error 
        ? err.message 
        : 'Failed to create character';
      
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    }
  };

  // Update existing character
  const updateCharacter = async (id: string, updates: Partial<Character>) => {
    try {
      setError(null);
      
      if (!isAuthenticated) {
        toast.error('Please sign in to save changes');
        return;
      }
      
      const idToken = await getIdToken();
      if (!idToken) {
        throw new Error('Failed to get authentication token');
      }

      // Get the current character to merge updates
      const currentCharacter = characters.find(char => char.id === id);
      if (!currentCharacter) {
        throw new Error('Character not found');
      }

      const updatedCharacterData = {
        name: updates.name || currentCharacter.name,
        level: updates.level || currentCharacter.level,
        role: updates.role || currentCharacter.role,
        archetype: updates.archetype || currentCharacter.archetype,
        stats: updates.stats || currentCharacter.stats,
        skills: updates.skills || currentCharacter.skills,
      };

      const updatedCharacter = await characterApi.updateCharacter(id, updatedCharacterData, idToken);
      setCharacters(prev => prev.map(char => char.id === id ? updatedCharacter : char));
      toast.success('Character updated and saved!');
    } catch (err) {
      const errorMessage = err instanceof ApiError 
        ? err.message 
        : err instanceof Error 
        ? err.message 
        : 'Failed to update character';
      
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    }
  };

  // Delete character
  const deleteCharacter = async (id: string) => {
    try {
      setError(null);
      
      if (!isAuthenticated) {
        toast.error('Please sign in to delete characters');
        return;
      }
      
      const idToken = await getIdToken();
      if (!idToken) {
        throw new Error('Failed to get authentication token');
      }

      await characterApi.deleteCharacter(id, idToken);
      setCharacters(prev => prev.filter(char => char.id !== id));
      toast.success('Character deleted!');
    } catch (err) {
      const errorMessage = err instanceof ApiError 
        ? err.message 
        : err instanceof Error 
        ? err.message 
        : 'Failed to delete character';
      
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    }
  };

  // Refresh characters from API
  const refreshCharacters = async () => {
    await loadCharacters();
  };

  // Load characters when user authentication state changes
  useEffect(() => {
    loadCharacters();
  }, [currentUser]);

  return {
    characters,
    loading,
    error,
    user: currentUser,
    isAuthenticated,
    createCharacter,
    updateCharacter,
    deleteCharacter,
    refreshCharacters,
  };
}