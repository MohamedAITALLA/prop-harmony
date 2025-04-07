
import React, { useState } from "react";
import { Database, Eye, EyeOff } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Property } from "@/types/api-responses";
import { Button } from "@/components/ui/button";

interface RawDataCardProps {
  property: Property;
}

export function RawDataCard({ property }: RawDataCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <Card className="shadow-sm border-border/40">
      <CardHeader className="bg-muted/30">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl flex items-center gap-2">
            <Database className="h-5 w-5 text-primary" />
            Raw Property Data
          </CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-8 px-2"
          >
            {isExpanded ? (
              <>
                <EyeOff className="h-4 w-4 mr-1" /> Hide
              </>
            ) : (
              <>
                <Eye className="h-4 w-4 mr-1" /> View
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      {isExpanded && (
        <CardContent className="pt-6">
          <div className="bg-muted/50 p-4 rounded-md overflow-x-auto">
            <pre className="text-xs whitespace-pre-wrap">
              {JSON.stringify(property, null, 2)}
            </pre>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
