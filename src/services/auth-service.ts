
import api from "@/lib/base-api";
import { AuthResponse, RegisterResponse } from "@/types/api-responses/auth-types";

export const authService = {
  login: async (email: string, password: string) => {
    try {
      console.log("Auth service login attempt for:", email);
      const response = await api.post<AuthResponse>("/auth/login", { email, password });
      console.log("Auth service login response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Authentication service error:", error);
      throw error;
    }
  },
  
  register: async (userData: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
  }) => {
    try {
      console.log("Auth service register attempt for:", userData.email);
      const response = await api.post<RegisterResponse>("/auth/register", userData);
      console.log("Auth service register response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Registration service error:", error);
      throw error;
    }
  },
};

export default authService;
