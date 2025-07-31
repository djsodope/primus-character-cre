import { useState, useEffect } from 'react';
import { useKV } from '@github/spark/hooks';
import { Character } from '../lib/types';
import { toast } from 'sonner';

interface UseCharactersState {
  characters: Character[];
  loading: boolean;
  error: string | null;
  user: any;
  isAuthenticated: boolean;
}

interface UseCharactersActions {
  createCharacter: (character: Omit<Character, 'id' | 'createdAt'>) => Promise<void>;
  updateCharacter: (id: string, character: Partial<Character>) => Promise<void>;
  deleteCharacter: (id: string) => Promise<void>;
  refreshCharacters: () => Promise<void>;
}

export function useCharacters(): UseCharactersState & UseCharactersActions {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Use user-specific storage for characters
  const [characters, setCharacters] = useKV('user-characters', [] as Character[]);

  // Load user information and set up authentication
  const loadUserInfo = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const userInfo = await spark.user();
      setUser(userInfo);
      setIsAuthenticated(true);
      
      // Characters are automatically loaded via useKV hook
      setLoading(false);
    } catch (err) {
      // User not authenticated
      setIsAuthenticated(false);
      setUser(null);
      setLoading(false);
      
      // Show helpful message for unauthenticated users
      toast.info('Sign in with GitHub to save characters to your account', {
        duration: 5000,
      });
    }
  };

  // Create new character
  const createCharacter = async (characterData: Omit<Character, 'id' | 'createdAt'>) => {
    try {
      setError(null);
      
      if (!isAuthenticated) {
        toast.error('Please sign in to save characters');
        return;
      }
      
      const newCharacter: Character = {
        ...characterData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      
      // Use functional update to avoid stale closure issues
      setCharacters((currentCharacters) => [...currentCharacters, newCharacter]);
      toast.success('Character created and saved to your account!');
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
      
      if (!isAuthenticated) {
        toast.error('Please sign in to save changes');
        return;
      }
      
      // Use functional update to get current characters and avoid stale closure
      setCharacters((currentCharacters) => 
        currentCharacters.map(char => 
          char.id === id ? { ...char, ...updates } : char
        )
      );
      toast.success('Character updated and saved!');
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
      
      if (!isAuthenticated) {
        toast.error('Please sign in to delete characters');
        return;
      }
      
      // Use functional update to filter out the deleted character
      setCharacters((currentCharacters) => 
        currentCharacters.filter(char => char.id !== id)
      );
      toast.success('Character deleted from your account!');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete character';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    }
  };

  // Refresh characters from storage
  const refreshCharacters = async () => {
    await loadUserInfo();
  };

  // Load user info on mount
  useEffect(() => {
    loadUserInfo();
  }, []);

  return {
    characters,
    loading,
    error,
    user,
    isAuthenticated,
    createCharacter,
    updateCharacter,
    deleteCharacter,
    refreshCharacters,
  };
}