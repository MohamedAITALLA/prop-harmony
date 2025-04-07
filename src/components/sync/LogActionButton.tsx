
import React from 'react';
import { Button } from "@/components/ui/button";
import { Eye, RotateCw } from "lucide-react";
import { SyncLog } from '@/types/api-responses';

export interface LogActionButtonProps {
  log: SyncLog;
  onRetry?: (log: SyncLog) => void;
  onOpenDetails?: (log: SyncLog) => void;
}

export function LogActionButton({ log, onRetry, onOpenDetails }: LogActionButtonProps) {
  return (
    <div className="flex space-x-2">
      {onOpenDetails && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onOpenDetails(log)}
          title="View Details"
        >
          <Eye className="h-4 w-4" />
        </Button>
      )}
      
      {onRetry && log.status === 'error' && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onRetry(log)}
          title="Retry Sync"
        >
          <RotateCw className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
