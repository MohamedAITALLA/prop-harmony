
import axios from "axios";
import { toast } from "sonner";

const API_URL = "/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add authorization token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { response } = error;
    
    if (response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
      toast.error("Your session has expired. Please log in again.");
    } else if (response?.data?.message) {
      toast.error(response.data.message);
    } else {
      toast.error("Something went wrong. Please try again later.");
    }
    
    return Promise.reject(error);
  }
);

export default api;
