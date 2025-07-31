import { Character } from './types';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/api`
  : 'http://localhost:5000/api';

// API Error Class
class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

// Generic API Request Handler
async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new ApiError(response.status, errorData.message || `HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    // Network or other errors
    throw new ApiError(0, `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Character API Functions
export const characterApi = {
  // Fetch all characters
  async getAll(): Promise<Character[]> {
    return apiRequest<Character[]>('/characters');
  },

  // Fetch single character by ID
  async getById(id: string): Promise<Character> {
    return apiRequest<Character>(`/characters/${id}`);
  },

  // Create new character
  async create(character: Omit<Character, 'id' | 'createdAt'>): Promise<Character> {
    return apiRequest<Character>('/characters', {
      method: 'POST',
      body: JSON.stringify(character),
    });
  },

  // Update existing character
  async update(id: string, character: Partial<Character>): Promise<Character> {
    return apiRequest<Character>(`/characters/${id}`, {
      method: 'PUT',
      body: JSON.stringify(character),
    });
  },

  // Delete character
  async delete(id: string): Promise<void> {
    return apiRequest<void>(`/characters/${id}`, {
      method: 'DELETE',
    });
  },
};

// Helper function to check if backend is available
export async function checkBackendHealth(): Promise<boolean> {
  try {
    await fetch(`${API_BASE_URL}/health`);
    return true;
  } catch {
    return false;
  }
}