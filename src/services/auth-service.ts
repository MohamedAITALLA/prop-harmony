
import api from "@/lib/base-api";
import { AuthResponse, RegisterResponse, EmailConfirmationResponse, ResendConfirmationResponse } from "@/types/api-responses/auth-types";

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

  confirmEmail: async (token: string) => {
    try {
      console.log("Auth service email confirmation attempt with token");
      const response = await api.get<EmailConfirmationResponse>(`/auth/confirm-email?token=${token}`);
      console.log("Auth service email confirmation response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Email confirmation service error:", error);
      throw error;
    }
  },

  resendConfirmation: async (email: string) => {
    try {
      console.log("Auth service resend confirmation attempt for:", email);
      const response = await api.post<ResendConfirmationResponse>("/auth/resend-confirmation", { email });
      console.log("Auth service resend confirmation response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Resend confirmation service error:", error);
      throw error;
    }
  },
};

export default authService;
