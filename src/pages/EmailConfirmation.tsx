
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { authService } from "@/services/api-service";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Check, Loader2, Home } from "lucide-react";
import { Link } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function EmailConfirmation() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  useEffect(() => {
    const confirmEmail = async () => {
      const token = searchParams.get("token");
      
      if (!token) {
        setIsLoading(false);
        setErrorMessage("Confirmation token is missing. Please check your email for the correct link or request a new confirmation email.");
        return;
      }
      
      try {
        setIsLoading(true);
        const response = await authService.confirmEmail(token);
        
        if (response.success) {
          setIsSuccess(true);
          toast.success(response.message || "Email confirmed successfully");
        } else {
          setErrorMessage(response.message || "Failed to confirm email");
          toast.error(response.message || "Failed to confirm email");
        }
      } catch (error) {
        console.error("Error confirming email:", error);
        setErrorMessage("An error occurred while confirming your email. The token may be invalid or expired.");
        toast.error("Failed to confirm email. The token may be invalid or expired.");
      } finally {
        setIsLoading(false);
      }
    };
    
    confirmEmail();
  }, [searchParams, navigate]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 flex flex-col items-center text-center">
          <div className="flex items-center gap-2 mb-2">
            <Home className="h-6 w-6 text-primary" />
            <span className="font-semibold text-xl">PropertySync</span>
          </div>
          <CardTitle className="text-2xl">
            {isLoading ? "Confirming Email" : isSuccess ? "Email Confirmed" : "Confirmation Failed"}
          </CardTitle>
          <CardDescription>
            {isLoading 
              ? "Please wait while we confirm your email address" 
              : isSuccess 
                ? "Your email has been successfully confirmed" 
                : "We encountered an issue confirming your email"}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : isSuccess ? (
            <div className="flex flex-col items-center justify-center py-6">
              <div className="rounded-full bg-green-100 p-3 mb-4">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <p className="text-center text-muted-foreground">
                Your email has been confirmed. You can now log in to your account.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
              <p className="text-center text-muted-foreground">
                If you need a new confirmation email, you can request one below.
              </p>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex flex-col gap-4">
          {isSuccess ? (
            <Button asChild className="w-full">
              <Link to="/login">Continue to Login</Link>
            </Button>
          ) : !isLoading && (
            <>
              <Button asChild variant="outline" className="w-full">
                <Link to="/login">Back to Login</Link>
              </Button>
              {errorMessage && (
                <Button asChild className="w-full">
                  <Link to="/resend-confirmation">Resend Confirmation Email</Link>
                </Button>
              )}
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
