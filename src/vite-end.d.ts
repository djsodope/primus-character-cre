/// <reference types="vite/client" />
declare const GITHUB_RUNTIME_PERMANENT_NAME: string
declare const BASE_KV_SERVICE_URL: string

// Spark global API types
declare global {
  interface Window {
    spark: {
      user: () => Promise<{
        login: string;
        avatarUrl: string;
        email?: string;
        id: string;
        isOwner: boolean;
      }>;
      kv: {
        keys: () => Promise<string[]>;
        get: <T>(key: string) => Promise<T | undefined>;
        set: <T>(key: string, value: T) => Promise<void>;
        delete: (key: string) => Promise<void>;
      };
      llm: (prompt: string, modelName?: string, jsonMode?: boolean) => Promise<string>;
      llmPrompt: (strings: TemplateStringsArray, ...values: any[]) => string;
    };
  }

  const spark: Window['spark'];
}