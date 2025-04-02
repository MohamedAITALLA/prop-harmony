
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface ErrorStateProps {
  onRetry: () => void;
}

export function ErrorState({ onRetry }: ErrorStateProps) {
  return (
    <Card className="mb-8 shadow-sm border-destructive/30">
      <CardHeader className="bg-destructive/5">
        <CardTitle>External iCal Connections</CardTitle>
        <CardDescription>Connect external calendars via iCal</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center py-6 text-destructive/80">
          <AlertTriangle className="w-10 h-10 mb-3" />
          <p className="text-lg font-medium mb-1">Failed to load iCal connections</p>
          <p className="text-sm text-muted-foreground mb-4">We encountered a problem fetching your connections. Please try again.</p>
          <Button onClick={onRetry} variant="outline" className="border-destructive/30 hover:border-destructive/60">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
