
import axios, { AxiosInstance } from "axios";
import { toast } from "sonner";

const API_URL = "https://channel-manager-api.vercel.app";

interface ExtendedAxiosInstance extends AxiosInstance {
  getICalFile: (url: string) => Promise<Blob>;
}

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 180000, // Increased timeout to 3 minutes for long-running sync operations
  // Add retry mechanism
  validateStatus: function (status) {
    return status >= 200 && status < 300; // default
  },
}) as ExtendedAxiosInstance;

// Request interceptor to add authorization token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    if (response.headers["content-type"]?.includes("text/calendar")) {
      return response;
    }
    
    return response;
  },
  (error) => {
    // Check for network errors and provide better user feedback
    if (error.code === "ERR_NETWORK" || !error.response || error.message.includes("Network Error")) {
      console.error("Network error:", error);
      toast.error("Network connection issue. Please check your internet connection and try again.");
      return Promise.reject(new Error("Network connection issue. Please check your internet connection and try again."));
    }
    
    const { response } = error;
    const isLoginPage = window.location.pathname.includes('/login');
    const isRegisterPage = window.location.pathname.includes('/register');
    const isAuthEndpoint = error.config?.url?.includes('/auth/');
    
    if (response?.status === 401) {
      // Don't redirect during authentication
      if (isLoginPage || isRegisterPage || isAuthEndpoint) {
        toast.error("Authentication failed. Please check your credentials.");
      } else {
        // Clear token and redirect for non-auth pages
        localStorage.removeItem("token");
        window.location.href = "/login";
        toast.error("Your session has expired. Please log in again.");
      }
    } else if (response?.status === 400 && isLoginPage) {
      toast.error("Login failed. Please check your credentials.");
    } else if (response?.data?.message) {
      toast.error(response.data.message);
    } else if (error.code === "ECONNABORTED") {
      toast.error("The request timed out. Please try again.");
    } else {
      toast.error("Something went wrong. Please try again later.");
    }
    
    return Promise.reject(error);
  }
);

// Special method for downloading iCal files
api.getICalFile = async (url: string): Promise<Blob> => {
  try {
    const response = await api.get(url, { 
      responseType: 'blob',
      headers: {
        'Accept': 'text/calendar'
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error downloading iCal file:", error);
    toast.error("Failed to download iCal file");
    throw error;
  }
};

export default api;
