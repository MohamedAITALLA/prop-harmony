
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { RefreshCw } from "lucide-react";

export function LoadingState() {
  return (
    <Card className="mb-8 shadow-sm border-primary/10">
      <CardHeader className="bg-muted/30">
        <CardTitle>External iCal Connections</CardTitle>
        <CardDescription>Connect external calendars via iCal</CardDescription>
      </CardHeader>
      <CardContent className="py-8">
        <div className="flex items-center justify-center">
          <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
          <span className="ml-2 text-muted-foreground">Loading iCal connections...</span>
        </div>
      </CardContent>
    </Card>
  );
}
