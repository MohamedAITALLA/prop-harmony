
import LoginForm from "@/components/auth/LoginForm";
import { AuthProvider } from "@/hooks/auth/useAuth";
import { BrowserRouter as Router } from 'react-router-dom';

export default function Login() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <LoginForm />
        </div>
      </AuthProvider>
    </Router>
  );
}
