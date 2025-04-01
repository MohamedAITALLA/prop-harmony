
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { User } from "@/types/api-responses";
import { authService, profileService } from "@/services/api-service";

// Enable development mode to bypass authentication
const DEV_MODE = false; // Set to false to use the actual API

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      // In development mode, create a mock user
      if (DEV_MODE) {
        const mockUser: User = {
          id: "dev-user-id",
          email: "dev@example.com",
          first_name: "Developer",
          last_name: "User",
          full_name: "Developer User", // Add missing property
          is_admin: true, // Add missing property
          role: "admin",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        
        setUser(mockUser);
        setIsLoading(false);
        return;
      }
      
      const token = localStorage.getItem("token");
      
      if (token) {
        try {
          const response = await profileService.getProfile();
          if (response && response.data) {
            setUser({
              ...response.data,
              full_name: `${response.data.first_name} ${response.data.last_name}`,
              is_admin: response.data.role === "admin"
            } as User);
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          localStorage.removeItem("token");
        }
      }
      
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // In development mode, create a mock user and bypass authentication
      if (DEV_MODE) {
        const mockUser: User = {
          id: "dev-user-id",
          email: email || "dev@example.com",
          first_name: "Developer",
          last_name: "User",
          full_name: "Developer User", // Add missing property
          is_admin: true, // Add missing property
          role: "admin",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        
        setUser(mockUser);
        navigate("/dashboard");
        toast.success("Development mode: Authentication bypassed");
        setIsLoading(false);
        return;
      }

      const response = await authService.login(email, password);
      
      // Store the JWT token from the response
      localStorage.setItem("token", response.data.access_token);
      
      // Get user data from the response or fetch profile
      if (response.data.user) {
        setUser(response.data.user);
      } else {
        const profileResponse = await profileService.getProfile();
        if (profileResponse && profileResponse.data) {
          setUser({
            ...profileResponse.data,
            full_name: `${profileResponse.data.first_name} ${profileResponse.data.last_name}`,
            is_admin: profileResponse.data.role === "admin"
          } as User);
        }
      }
      
      navigate("/dashboard");
      toast.success(response.message || "Login successful!");
    } catch (error) {
      console.error("Login error:", error);
      // The error toast is already handled by the API interceptor
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    setIsLoading(true);
    try {
      // In development mode, create a mock user and bypass registration
      if (DEV_MODE) {
        const mockUser: User = {
          id: "dev-user-id",
          email: userData.email,
          first_name: userData.firstName,
          last_name: userData.lastName,
          full_name: `${userData.firstName} ${userData.lastName}`, // Add missing property
          is_admin: false, // Add missing property
          role: "user",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        
        setUser(mockUser);
        navigate("/dashboard");
        toast.success("Development mode: Registration bypassed");
        setIsLoading(false);
        return;
      }

      const response = await authService.register(userData);
      
      // Store the JWT token
      localStorage.setItem("token", response.data.access_token);
      
      // Set user from the response
      if (response.data.user) {
        setUser(response.data.user);
      }
      
      navigate("/dashboard");
      toast.success(response.message || "Registration successful!");
    } catch (error) {
      console.error("Registration error:", error);
      // The error toast is already handled by the API interceptor
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
    toast.success("You have been logged out.");
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
