import { Character } from './types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

interface CreateCharacterData {
  name: string;
  level: number;
  role: string;
  archetype: string;
  stats: {
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
  };
  skills: string[];
}

interface UpdateCharacterData extends CreateCharacterData {}

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(response.status, errorData.message || 'An error occurred');
  }
  return response.json();
};

export const characterApi = {
  // Get all characters for the authenticated user
  async getCharacters(idToken: string): Promise<Character[]> {
    const response = await fetch(`${API_BASE_URL}/api/characters`, {
      headers: {
        'Authorization': `Bearer ${idToken}`,
        'Content-Type': 'application/json',
      },
    });
    
    return handleResponse(response);
  },

  // Get a single character by ID
  async getCharacter(id: string, idToken: string): Promise<Character> {
    const response = await fetch(`${API_BASE_URL}/api/characters/${id}`, {
      headers: {
        'Authorization': `Bearer ${idToken}`,
        'Content-Type': 'application/json',
      },
    });
    
    return handleResponse(response);
  },

  // Create a new character
  async createCharacter(character: CreateCharacterData, idToken: string): Promise<Character> {
    const response = await fetch(`${API_BASE_URL}/api/characters`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${idToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(character),
    });
    
    return handleResponse(response);
  },

  // Update an existing character
  async updateCharacter(id: string, character: UpdateCharacterData, idToken: string): Promise<Character> {
    const response = await fetch(`${API_BASE_URL}/api/characters/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${idToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(character),
    });
    
    return handleResponse(response);
  },

  // Delete a character
  async deleteCharacter(id: string, idToken: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/characters/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${idToken}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(response.status, errorData.message || 'Failed to delete character');
    }
  },
};

export { ApiError };