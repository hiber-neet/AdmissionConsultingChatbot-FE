// API Configuration
export const API_CONFIG = {
  // Use environment variable or fallback to localhost
  FASTAPI_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  
  // Get current environment
  ENVIRONMENT: import.meta.env.VITE_ENVIRONMENT || import.meta.env.MODE || 'development',
  
  // Other API configurations
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
};

// Log current configuration (helpful for debugging)
console.log('🔧 API Configuration:', {
  baseUrl: API_CONFIG.FASTAPI_BASE_URL,
  environment: API_CONFIG.ENVIRONMENT,
  mode: import.meta.env.MODE
});

export default API_CONFIG;