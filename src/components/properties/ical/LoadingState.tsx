
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { RefreshCw, Calendar } from "lucide-react";

export function LoadingState() {
  return (
    <Card className="mb-8 shadow-sm border-primary/10">
      <CardHeader className="bg-primary/5 border-b px-6">
        <div className="flex items-center gap-2 mb-1">
          <div className="bg-primary/10 p-1.5 rounded-md">
            <Calendar className="h-5 w-5 text-primary" />
          </div>
          <CardTitle className="text-lg">External iCal Connections</CardTitle>
        </div>
        <CardDescription>Connect external calendars via iCal</CardDescription>
      </CardHeader>
      <CardContent className="py-12">
        <div className="flex flex-col items-center justify-center">
          <RefreshCw className="h-8 w-8 animate-spin text-primary/60 mb-3" />
          <span className="text-muted-foreground">Loading iCal connections...</span>
        </div>
      </CardContent>
    </Card>
  );
}
