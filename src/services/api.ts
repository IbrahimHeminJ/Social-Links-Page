import axios from "axios";

// Create axios instance with base configuration
// In development, use relative path to leverage Vite proxy
// In production, use full URL from environment variable
const baseURL = import.meta.env.PROD
  ? import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api"
  : "/api"; // Use proxy in development

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  timeout: 10000,
  withCredentials: true,
  withXSRFToken: true,
  headers: {
<<<<<<< HEAD
    'Content-Type': 'application/json',
    
=======
    "Content-Type": "application/json",
>>>>>>> 76cb6b0eb7957cdd58906d662e84133712b788f0
  },
});

// Request interceptor - Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // If sending FormData, remove Content-Type header to let browser set it with boundary
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle token expiration
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
