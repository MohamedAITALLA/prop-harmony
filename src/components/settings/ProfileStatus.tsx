
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";

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
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Status</CardTitle>
        <CardDescription>
          Complete your profile to access all features
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span>Profile Preferences</span>
          {preferencesSet ? (
            <CheckCircle className="h-5 w-5 text-green-500" />
          ) : (
            <XCircle className="h-5 w-5 text-red-500" />
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <span>Contact Information</span>
          {contactInfoSet ? (
            <CheckCircle className="h-5 w-5 text-green-500" />
          ) : (
            <XCircle className="h-5 w-5 text-red-500" />
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <span>Onboarding Complete</span>
          {onboardingCompleted ? (
            <CheckCircle className="h-5 w-5 text-green-500" />
          ) : (
            <AlertCircle className="h-5 w-5 text-amber-500" />
          )}
        </div>
      </CardContent>
      
      <CardFooter>
        <Button 
          variant="outline" 
          onClick={onReset}
          className="w-full"
        >
          Reset Profile
        </Button>
      </CardFooter>
    </Card>
  );
}
