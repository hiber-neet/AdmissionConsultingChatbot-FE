// FastAPI client configuration and utilities
import { API_CONFIG } from '../config/api.js';

const FASTAPI_BASE_URL = API_CONFIG.FASTAPI_BASE_URL;

// Generic API client with error handling
class FastAPIClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    //Add Bearer token 
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }


    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        // Try to get error details from response
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          if (errorData?.detail) {
            if (Array.isArray(errorData.detail)) {
              errorMessage = errorData.detail.map((err: any) => `${err.loc?.join('.')}: ${err.msg}`).join(', ');
            } else {
              errorMessage = errorData.detail;
            }
          }
        } catch {
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`API request failed: ${url}`, error);
      throw error;
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    console.log(`🌐 FastAPI GET request to: ${endpoint}`);
    const result = await this.request<T>(endpoint, { method: 'GET' });
    console.log(`✅ FastAPI GET response from ${endpoint}:`, result);
    return result;
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
      body: data ? JSON.stringify(data) : undefined,
    });
  }
}

// Create FastAPI client instance
export const fastAPIClient = new FastAPIClient(FASTAPI_BASE_URL);

export type LoginResponse = {
  access_token: string;
  token_type: string;
};
// Article types
export interface Article {
  article_id: number;
  title: string;
  description: string;
  url: string;
  status: string;
  create_at: string;
  created_by: number;
  major_id: number;
  specialization_id: number;
  author_name: string;
  major_name: string;
  specialization_name: string;
}

// User types
export interface User {
  user_id: number;
  username: string;
  email: string;
  full_name: string;
  role: string;
  is_active: boolean;
  created_at: string;
}

// Major types
export interface Major {
  major_id: number;
  major_name: string;
  articles?: Array<{
    article_id: number;
    title: string;
    description: string;
    url: string;
    create_at: string;
    specialization: {
      specialization_id: number;
      specialization_name: string;
    };
  }>;
  admission_forms?: any[];
}

// Specialization types
export interface Specialization {
  specialization_id: number;
  specialization_name: string;
  major_id: number;
  articles?: Array<{
    article_id: number;
    title: string;
    description: string;
    url: string;
    status: string;
    create_at: string;
    created_by: number;
    major_id: number;
    specialization_id: number;
    author_name: string | null;
    major_name: string | null;
    specialization_name: string | null;
  }>;
}

// Chat types
export interface ChatMessage {
  message_id: number;
  content: string;
  response: string;
  created_at: string;
}

export interface ChatSessionMessage {
  interaction_id: number;
  session_id: number;
  sender_id: number;
  message_text: string;
  timestamp: string;
  is_from_bot: boolean;
}

export interface ChatRequest {
  message: string;
}

// Knowledge base types
export interface KnowledgeDocument {
  document_id: number;
  title: string;
  content: string;
  file_path: string;
  uploaded_at: string;
}

export interface TrainingQuestion {
  question_id: number;
  question: string;
  answer: string;
  created_at: string;
}

// Intent types
export interface Intent {
  intent_id: number;
  intent_name: string;
  description?: string;
}