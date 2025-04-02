
import RegisterForm from "@/components/auth/RegisterForm";
import { AuthProvider } from "@/hooks/auth/useAuth";

export default function Register() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <RegisterForm />
      </div>
    </AuthProvider>
  );
}
