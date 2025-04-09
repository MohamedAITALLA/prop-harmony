
import RegisterForm from "@/components/auth/RegisterForm";
import { motion } from "framer-motion";

export default function Register() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/30 p-4">
      <motion.div 
        className="max-w-md w-full"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <RegisterForm />
      </motion.div>
    </div>
  );
}
