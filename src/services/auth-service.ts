
import api from "@/lib/base-api";
import { 
  AuthResponse, 
  RegisterResponse, 
  EmailConfirmationResponse, 
  ResendConfirmationResponse,
  ForgotPasswordResponse,
  ResetPasswordResponse,
  ValidateResetTokenResponse
} from "@/types/api-responses/auth-types";

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

  forgotPassword: async (email: string) => {
    try {
      console.log("Auth service forgot password attempt for:", email);
      const response = await api.post<ForgotPasswordResponse>("/auth/forgot-password", { email });
      console.log("Auth service forgot password response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Forgot password service error:", error);
      throw error;
    }
  },

  validateResetToken: async (token: string) => {
    try {
      console.log("Auth service validate reset token attempt");
      const response = await api.get<ValidateResetTokenResponse>(`/auth/validate-reset-token/${token}`);
      console.log("Auth service validate reset token response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Validate reset token service error:", error);
      throw error;
    }
  },

  resetPassword: async (token: string, newPassword: string) => {
    try {
      console.log("Auth service reset password attempt with token");
      const response = await api.post<ResetPasswordResponse>("/auth/reset-password", { token, newPassword });
      console.log("Auth service reset password response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Reset password service error:", error);
      throw error;
    }
  },
};

export default authService;
