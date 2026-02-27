// src/utils/axiosConfig.ts

import axios from "axios";

// Determine backend URL
const backendUrl =
  process.env.REACT_APP_BACKEND_URL

const axiosInstance = axios.create({
  baseURL: backendUrl,
  withCredentials: true,
  timeout: 50000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    console.error("Request Error:", error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error(
      "Response Error:",
      error.response ? error.response.data : error
    );

    // Handle specific error scenarios
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Redirect to login or refresh token
          console.log("Unauthorized: Redirecting to login");
          if (!window.location.pathname.includes("/login")) {
             window.location.href = "/login";
          }
          break;
        case 403:
          console.log("Forbidden: Insufficient permissions");
          break;
        case 500:
          console.log("Server Error: Please try again later");
          break;
        default:
          console.log(`Unexpected Error: ${error.response.status}`);
          break;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
