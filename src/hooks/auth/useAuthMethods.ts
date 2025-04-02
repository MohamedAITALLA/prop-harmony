
import { useState } from "react";
import { toast } from "sonner";
import { authService } from "@/services/api-service";
import { ensureMongoId } from "@/lib/mongo-helpers";
import { User } from "@/types/api-responses";
import { RegisterData } from "./AuthContext";
import { useTokenManagement } from "./useTokenManagement";

/**
 * Hook for authentication methods (login, register, logout)
 */
export function useAuthMethods(
  setUser: (user: User | null) => void,
  navigate: (path: string) => void
) {
  const { setToken, removeToken } = useTokenManagement();

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login(email, password);
      
      // Handle the nested response structure
      const responseData = response.data?.data || response.data;
      
      if (responseData?.access_token) {
        const { access_token, user } = responseData;
        
        setToken(access_token);
        
        if (user) {
          // Convert _id to id if needed
          const processedUser = ensureMongoId(user);
          setUser(processedUser);
          navigate("/dashboard");
          toast.success(response.data?.message || "Login successful!");
        } else {
          console.warn("No user data in login response");
          toast.error("Login was incomplete. Please try again.");
        }
      } else {
        console.error("Invalid login response structure:", response);
        toast.error("Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Unable to log in. Please check your credentials.");
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      const response = await authService.register({
        email: userData.email,
        password: userData.password,
        first_name: userData.firstName,
        last_name: userData.lastName,
      });
      
      // Handle the nested response structure
      const responseData = response.data?.data || response.data;
      
      if (responseData?.access_token && responseData.user) {
        const { access_token, user } = responseData;
        
        setToken(access_token);
        
        const processedUser = ensureMongoId(user);
        setUser(processedUser);
        
        navigate("/dashboard");
        const successMessage = response.data?.message || "Registration successful!";
        toast.success(successMessage);
      } else {
        console.error("Invalid registration response:", response);
        toast.error("Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Unable to register. Please try again.");
    }
  };

  const logout = () => {
    removeToken();
    setUser(null);
    navigate("/login");
    toast.success("You have been logged out.");
  };

  return {
    login,
    register,
    logout
  };
}
