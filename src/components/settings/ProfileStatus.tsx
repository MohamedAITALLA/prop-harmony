
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CircleDotDashed, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface ProfileStatusProps {
  onboardingCompleted: boolean;
  preferencesSet: boolean;
  contactInfoSet: boolean;
  onReset: () => void;
}

export function ProfileStatus({ 
  onboardingCompleted, 
  preferencesSet, 
  contactInfoSet,
  onReset
}: ProfileStatusProps) {
  const getCompletionPercentage = () => {
    let completed = 0;
    if (onboardingCompleted) completed++;
    if (preferencesSet) completed++;
    if (contactInfoSet) completed++;
    
    return Math.floor((completed / 3) * 100);
  };
  
  const completionPercentage = getCompletionPercentage();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Status</CardTitle>
        <CardDescription>
          Your profile completion status
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-lg font-medium">Completion</span>
          <span className="text-lg font-bold">{completionPercentage}%</span>
        </div>
        
        <div className="w-full bg-secondary rounded-full h-2.5">
          <div 
            className="bg-primary h-2.5 rounded-full" 
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
        
        <div className="space-y-3 pt-2">
          <div className="flex items-center">
            {onboardingCompleted ? (
              <CheckCircle2 className="h-5 w-5 text-primary mr-2" />
            ) : (
              <CircleDotDashed className="h-5 w-5 text-muted-foreground mr-2" />
            )}
            <span className={onboardingCompleted ? "font-medium" : "text-muted-foreground"}>
              Onboarding Completed
            </span>
          </div>
          
          <div className="flex items-center">
            {preferencesSet ? (
              <CheckCircle2 className="h-5 w-5 text-primary mr-2" />
            ) : (
              <CircleDotDashed className="h-5 w-5 text-muted-foreground mr-2" />
            )}
            <span className={preferencesSet ? "font-medium" : "text-muted-foreground"}>
              Preferences Set
            </span>
          </div>
          
          <div className="flex items-center">
            {contactInfoSet ? (
              <CheckCircle2 className="h-5 w-5 text-primary mr-2" />
            ) : (
              <CircleDotDashed className="h-5 w-5 text-muted-foreground mr-2" />
            )}
            <span className={contactInfoSet ? "font-medium" : "text-muted-foreground"}>
              Contact Information Set
            </span>
          </div>
        </div>
        
        {completionPercentage < 100 && (
          <Alert variant="default" className="bg-muted">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Complete your profile to get the most out of the platform.
            </AlertDescription>
          </Alert>
        )}
        
        <div className="pt-4">
          <Button variant="outline" size="sm" onClick={onReset} className="w-full">
            Reset Profile
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
