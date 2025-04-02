
import axios, { AxiosInstance } from "axios";
import { toast } from "sonner";

const API_URL = "/api";

// Extend the AxiosInstance type to include our custom method
interface ExtendedAxiosInstance extends AxiosInstance {
  getICalFile: (url: string) => Promise<Blob>;
}

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
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
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    // For iCal file downloads, just return the response directly
    if (response.headers["content-type"]?.includes("text/calendar")) {
      return response;
    }
    
    // For successful responses, check if there's a success flag in our API format
    if (response.data && response.data.success === false) {
      // Even though HTTP status is 200, the API indicates an error
      toast.error(response.data.message || "Operation failed");
      return Promise.reject(response);
    }
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
