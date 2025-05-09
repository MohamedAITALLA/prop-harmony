
import { useState } from "react";
import { Link } from "react-router-dom";
import { authService } from "@/services/api-service";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Home, Loader2, Mail, AlertCircle, ArrowLeft } from "lucide-react";
import { z } from "zod";

const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export default function ResendConfirmation() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validate email
      emailSchema.parse({ email });
      
      setIsLoading(true);
      setErrorMessage("");
      
      const response = await authService.resendConfirmation(email);
      
      if (response.success) {
        setIsSuccess(true);
        toast.success(response.message || "Confirmation email sent successfully");
      } else {
        setErrorMessage(response.message || "Failed to send confirmation email");
        toast.error(response.message || "Failed to send confirmation email");
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrorMessage(error.errors[0].message);
        toast.error(error.errors[0].message);
      } else {
        console.error("Error resending confirmation:", error);
        setErrorMessage("An error occurred while sending the confirmation email.");
        toast.error("Failed to send confirmation email");
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 flex flex-col items-center text-center">
          <div className="flex items-center gap-2 mb-2">
            <Home className="h-6 w-6 text-primary" />
            <span className="font-semibold text-xl">PropertySync</span>
          </div>
          <CardTitle className="text-2xl">Resend Confirmation Email</CardTitle>
          <CardDescription>
            {isSuccess 
              ? "Confirmation email has been sent"
              : "Enter your email to receive a new confirmation link"}
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {isSuccess ? (
              <Alert className="bg-green-50 border-green-200">
                <Mail className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-700">
                  A new confirmation email has been sent to <strong>{email}</strong>. 
                  Please check your inbox and follow the link to confirm your account.
                </AlertDescription>
              </Alert>
            ) : (
              <>
                {errorMessage && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{errorMessage}</AlertDescription>
                  </Alert>
                )}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      disabled={isLoading}
                      required
                    />
                  </div>
                </div>
              </>
            )}
          </CardContent>
          
          <CardFooter className="flex flex-col gap-4">
            {isSuccess ? (
              <Button asChild className="w-full">
                <Link to="/login">Return to Login</Link>
              </Button>
            ) : (
              <>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send Confirmation Email"
                  )}
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/login" className="flex items-center">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Login
                  </Link>
                </Button>
              </>
            )}
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
