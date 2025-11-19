import { 
  fastAPIClient, 
  Article, 
  User, 
  Major, 
  Specialization, 
  ChatMessage, 
  ChatRequest,
  KnowledgeDocument,
  TrainingQuestion 
} from '../utils/fastapi-client';
import { API_CONFIG } from '../config/api.js';

// Articles API
export const articlesAPI = {
  getAll: () => fastAPIClient.get<Article[]>('/articles'),
  getById: (id: number) => fastAPIClient.get<Article>(`/articles/${id}`),
  create: (data: Partial<Article>) => fastAPIClient.post<Article>('/articles', data),
  update: (id: number, data: Partial<Article>) => fastAPIClient.put<Article>(`/articles/${id}`, data),
  delete: (id: number) => fastAPIClient.delete(`/articles/${id}`),
};

// Users API
export const usersAPI = {
  getAll: () => fastAPIClient.get<User[]>('/users'),
  getById: (id: number) => fastAPIClient.get<User>(`/users/${id}`),
  create: (data: Partial<User>) => fastAPIClient.post<User>('/users', data),
  update: (id: number, data: Partial<User>) => fastAPIClient.put<User>(`/users/${id}`, data),
  delete: (id: number) => fastAPIClient.delete(`/users/${id}`),
};

// Authentication API
export const authAPI = {
  login: (credentials: { username: string; password: string }) => 
    fastAPIClient.post('/auth/login', credentials),
  register: (userData: { username: string; email: string; password: string; full_name: string }) =>
    fastAPIClient.post('/auth/register', userData),
  logout: () => fastAPIClient.post('/auth/logout', {}),
  refreshToken: () => fastAPIClient.post('/auth/refresh', {}),
};

// Profile API
export const profileAPI = {
  getProfile: () => fastAPIClient.get('/profile'),
  updateProfile: (data: any) => fastAPIClient.put('/profile', data),
};

// Majors API
export const majorsAPI = {
  getAll: () => fastAPIClient.get<Major[]>('/majors'),
  getById: (id: number) => fastAPIClient.get<Major>(`/majors/${id}`),
  create: (data: Partial<Major>) => fastAPIClient.post<Major>('/majors', data),
  update: (id: number, data: Partial<Major>) => fastAPIClient.put<Major>(`/majors/${id}`, data),
  delete: (id: number) => fastAPIClient.delete(`/majors/${id}`),
};

// Specializations API
export const specializationsAPI = {
  getAll: () => fastAPIClient.get<Specialization[]>('/specializations'),
  getById: (id: number) => fastAPIClient.get<Specialization>(`/specializations/${id}`),
  getByMajor: (majorId: number) => fastAPIClient.get<Specialization[]>(`/specializations/major/${majorId}`),
  create: (data: Partial<Specialization>) => fastAPIClient.post<Specialization>('/specializations', data),
  update: (id: number, data: Partial<Specialization>) => fastAPIClient.put<Specialization>(`/specializations/${id}`, data),
  delete: (id: number) => fastAPIClient.delete(`/specializations/${id}`),
};

// Chat API
export const chatAPI = {
  sendMessage: (data: ChatRequest) => fastAPIClient.post<ChatMessage>('/chat', data),
  getHistory: () => fastAPIClient.get<ChatMessage[]>('/chat/history'),
  clearHistory: () => fastAPIClient.delete('/chat/history'),
};

// Knowledge Base API
export const knowledgeAPI = {
  uploadDocument: (formData: FormData) => {
    // For file uploads, we need to handle FormData differently
    return fetch(`${API_CONFIG.FASTAPI_BASE_URL}/knowledge/upload/document`, {
      method: 'POST',
      body: formData,
    }).then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    });
  },
  
  uploadTrainingQuestion: (data: { question: string; answer: string }) =>
    fastAPIClient.post<TrainingQuestion>('/knowledge/upload/training_question', data),
    
  getDocuments: () => fastAPIClient.get<KnowledgeDocument[]>('/knowledge/documents'),
  getTrainingQuestions: () => fastAPIClient.get<TrainingQuestion[]>('/knowledge/training_questions'),
  
  deleteDocument: (id: number) => fastAPIClient.delete(`/knowledge/documents/${id}`),
  deleteTrainingQuestion: (id: number) => fastAPIClient.delete(`/knowledge/training_questions/${id}`),
};

// RIASEC API (if needed)
export const riasecAPI = {
  // Add RIASEC-related endpoints when they are implemented in the backend
  getTest: () => fastAPIClient.get('/riasec/test'),
  submitAnswers: (answers: any) => fastAPIClient.post('/riasec/submit', answers),
  getResults: (id: number) => fastAPIClient.get(`/riasec/results/${id}`),
};

// Export all APIs
export {
  articlesAPI as fastAPIArticles,
  usersAPI as fastAPIUsers,
  authAPI as fastAPIAuth,
  profileAPI as fastAPIProfile,
  majorsAPI as fastAPIMajors,
  specializationsAPI as fastAPISpecializations,
  chatAPI as fastAPIChat,
  knowledgeAPI as fastAPIKnowledge,
  riasecAPI as fastAPIRiasec,
};