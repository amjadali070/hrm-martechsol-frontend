import axios from 'axios';

// Create an Axios instance with default configurations
const axiosInstance = axios.create({
  baseURL:'https://pbw-backend-dashboard.onrender.com/api',
  withCredentials: true, // Send cookies with requests
});

// Optional: Add interceptors for request and response if needed
axiosInstance.interceptors.request.use(
  (config) => {
    // You can modify the request config here (e.g., add headers)
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle global errors here
    return Promise.reject(error);
  }
);

export default axiosInstance;
