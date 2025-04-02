
import LoginForm from "@/components/auth/LoginForm";
import { AuthProvider } from "@/hooks/useAuth";

export default function Login() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <LoginForm />
      </div>
    </AuthProvider>
  );
}
