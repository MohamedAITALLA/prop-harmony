
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { User } from "@/types/api-responses";
import { authService, profileService } from "@/services/api-service";
import { ensureMongoId } from "@/lib/mongo-helpers";

const DEV_MODE = false; // Set to false to use actual API responses

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
      const token = localStorage.getItem("token");
      
      if (!token) {
        setIsLoading(false);
        return;
      }
      
      try {
        const response = await profileService.getProfile();
        const userData = response.data?.user || response.data;
        
        if (userData) {
          setUser(ensureMongoId(userData));
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        localStorage.removeItem("token");
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login(email, password);
      
      if (response?.data?.access_token) {
        const { access_token, user } = response.data;
        
        localStorage.setItem("token", access_token);
        
        if (user) {
          const processedUser = ensureMongoId(user);
          setUser(processedUser);
          navigate("/dashboard");
          toast.success("Login successful!");
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
      
      if (response?.data?.access_token && response.data.user) {
        const { access_token, user } = response.data;
        
        localStorage.setItem("token", access_token);
        
        const processedUser = ensureMongoId(user);
        setUser(processedUser);
        
        navigate("/dashboard");
        toast.success(response.message || "Registration successful!");
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
