import axios from "axios";

// Determine backend URL
const backendUrl =
  process.env.REACT_APP_BACKEND_URL ||
  "http://localhost:5000/api" ||
  "https://hrm-martechsol-backend.onrender.com/api";

const axiosInstance = axios.create({
  baseURL: backendUrl,
  withCredentials: true,
  timeout: 10000, // 10 seconds timeout
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request Interceptor for logging and potential token injection
axiosInstance.interceptors.request.use(
  (config) => {
    console.log(`Sending request to: ${config.url}`);
    return config;
  },
  (error) => {
    console.error("Request Error:", error);
    return Promise.reject(error);
  }
);

// Response Interceptor for global error handling
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
