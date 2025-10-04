// API Configuration
export const API_CONFIG = {
  // Update this to match your backend URL
  BASE_URL: 'http://localhost:3001',
  
  // API endpoints
  ENDPOINTS: {
    RECIPES: 'recipes',
    RECIPES_CREATE: '/recipes/create',
    RECIPES_EDIT: (id) => `/recipes/edit/${id}`,
    RECIPES_DELETE: (id) => `/recipes/delete/${id}`,
  },
  
  // Request timeout in milliseconds
  TIMEOUT: 10000,
  
  // Retry configuration
  RETRY: {
    attempts: 3,
    delay: 1000,
  },
};
