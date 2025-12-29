import axios from 'axios';

const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  
  if (envUrl) {
    return envUrl;
  }
  
  if (import.meta.env.DEV) {
    return '';
  }
  
  throw new Error('VITE_API_BASE_URL environment variable is required in production');
};

const API_BASE_URL = getApiBaseUrl();

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

axiosInstance.interceptors.request.use(
  (config) => {
    if (!config.signal && !config.cancelToken) {
      const controller = new AbortController();
      config.signal = controller.signal;
      config.abortController = controller;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const config = error.config;
    
    if (
      !config ||
      config.__retryCount >= 2 ||
      !error.response &&
      (error.code === 'ECONNABORTED' || error.message.includes('timeout'))
    ) {
      return Promise.reject(error);
    }
    
    config.__retryCount = config.__retryCount || 0;
    config.__retryCount += 1;
    
    const delay = config.__retryCount * 1000;
    
    await new Promise(resolve => setTimeout(resolve, delay));
    
    return axiosInstance(config);
  }
);

export default axiosInstance;

