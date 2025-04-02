
import RegisterForm from "@/components/auth/RegisterForm";
import { AuthProvider } from "@/hooks/auth/useAuth";
import { BrowserRouter as Router } from 'react-router-dom';

export default function Register() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <RegisterForm />
        </div>
      </AuthProvider>
    </Router>
  );
}
