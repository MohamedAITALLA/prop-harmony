
import api from "@/lib/base-api";

export const authService = {
  login: async (email: string, password: string) => {
    try {
      console.log("Auth service login attempt for:", email);
      const response = await api.post("/auth/login", { email, password });
      console.log("Auth service login response:", response);
      return response;
    } catch (error) {
      console.error("Authentication service error:", error);
      throw error;
    }
  },
  register: (userData: any) => {
    return api.post("/auth/register", userData);
  },
};

export default authService;
