
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import { motion } from "framer-motion";
import { Building, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/30 p-4">
      <motion.div 
        className="max-w-md w-full bg-card border rounded-lg shadow-lg p-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex justify-between items-center mb-6">
          <Link 
            to="/login" 
            className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            <span>Back</span>
          </Link>
          <Building className="h-8 w-8 text-primary" />
        </div>
        
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">Forgot password?</h1>
          <p className="text-muted-foreground">No worries, we'll send you reset instructions</p>
        </div>
        
        <ForgotPasswordForm />
      </motion.div>
    </div>
  );
}
