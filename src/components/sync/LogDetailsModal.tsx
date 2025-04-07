
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SyncStatusBadge } from "@/components/ui/sync-status-badge";
import { PlatformIcon } from "@/components/ui/platform-icon";
import { SyncLog } from '@/types/api-responses';
import { formatDistanceToNow } from 'date-fns';

export interface LogDetailsModalProps {
  log?: SyncLog;
  open: boolean;
  onClose?: () => void;
  onOpenChange?: (open: boolean) => void;
}

export function LogDetailsModal({ log, open, onClose, onOpenChange }: LogDetailsModalProps) {
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen && onClose) {
      onClose();
    }
    if (onOpenChange) {
      onOpenChange(isOpen);
    }
  };

  if (!log) {
    return null;
  }

  const timeAgo = log.created_at 
    ? formatDistanceToNow(new Date(log.created_at), { addSuffix: true })
    : 'Unknown time';

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <PlatformIcon platform={log.platform} className="h-5 w-5" />
            {log.property_name || 'Sync Log Details'}
          </DialogTitle>
          <DialogDescription className="flex items-center justify-between">
            <span>Log ID: {log.id?.substring(0, 8) || 'Unknown'}</span>
            <SyncStatusBadge status={log.status} />
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 gap-4 text-sm">
            <div className="font-medium">Platform:</div>
            <div className="col-span-3">{log.platform}</div>
            
            <div className="font-medium">Property:</div>
            <div className="col-span-3">{log.property_name || 'All Properties'}</div>
            
            <div className="font-medium">Sync Time:</div>
            <div className="col-span-3">{timeAgo}</div>
            
            <div className="font-medium">Execution Time:</div>
            <div className="col-span-3">{log.execution_time ? `${log.execution_time}ms` : 'Unknown'}</div>
          </div>

          {log.message && (
            <div className="space-y-2">
              <h4 className="font-medium">Message:</h4>
              <div className="text-sm text-muted-foreground">{log.message}</div>
            </div>
          )}
          
          {log.details && (
            <div className="space-y-2">
              <h4 className="font-medium">Details:</h4>
              <ScrollArea className="h-[200px] rounded-md border p-4">
                <pre className="text-xs">{typeof log.details === 'object' ? JSON.stringify(log.details, null, 2) : log.details}</pre>
              </ScrollArea>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button onClick={() => handleOpenChange(false)} variant="outline">Close</Button>
          {log.status === 'error' && (
            <Button variant="default">Retry Sync</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
