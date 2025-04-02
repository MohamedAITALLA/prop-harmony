
import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext, AuthContextType, RegisterData } from "./AuthContext";
import { useAuthState } from "./useAuthState";
import { useAuthMethods } from "./useAuthMethods";

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user, setUser, isLoading } = useAuthState();
  const navigate = useNavigate();
  const { login, register, logout } = useAuthMethods(setUser, navigate);

  const contextValue: AuthContextType = {
    user,
    isLoading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export { useAuthContext as useAuth } from "./AuthContext";
export type { RegisterData } from "./AuthContext";
