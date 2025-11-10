// API Configuration
const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
console.log('🌐 API Base URL:', baseUrl, 'from env:', import.meta.env.VITE_API_URL);

const API_CONFIG = {
  // Use localhost for development, production URL for deployment
  BASE_URL: baseUrl,
  
  // API endpoints
  ENDPOINTS: {
    LOGIN: '/api/login',
    REGISTER: '/api/register',
    ME: '/api/me',
    RECEIPTS: '/api/receipts',
    UPLOAD: '/api/receipts/upload',
    PROCESS: (id) => `/api/receipts/${id}/process`,
    DELETE: (id) => `/api/receipts/${id}`,
    UPDATE: (id) => `/api/receipts/${id}`,
  }
};

// Helper function to get full URL
export const getApiUrl = (endpoint) => {
  const fullUrl = `${API_CONFIG.BASE_URL}${endpoint}`;
  console.log('🔗 API URL constructed:', fullUrl);
  return fullUrl;
};

export default API_CONFIG;