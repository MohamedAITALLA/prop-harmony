
import React from "react";
import { ICalConnection } from "@/types/api-responses";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertCircle } from "lucide-react";

interface ConnectionDetailsCardProps {
  connection: ICalConnection;
}

export const ConnectionDetailsCard: React.FC<ConnectionDetailsCardProps> = ({ connection }) => {
  return (
    <div className="bg-muted/30 p-4 rounded-lg border border-border/60 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Platform</span>
        <Badge variant="outline" className="capitalize">
          {connection.platform}
        </Badge>
      </div>
      
      <div className="space-y-1">
        <span className="text-sm font-medium">URL</span>
        <div className="p-2 bg-muted/50 rounded border border-border/50 break-all text-sm">
          {connection.ical_url}
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Status</span>
        <div className="flex items-center gap-1.5">
          {connection.status === "active" ? (
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          ) : (
            <AlertCircle className="h-4 w-4 text-amber-500" />
          )}
          <span className="capitalize">{connection.status}</span>
        </div>
      </div>
    </div>
  );
};
