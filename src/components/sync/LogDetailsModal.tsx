
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { StatusBadge } from "@/components/ui/status-badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlatformIcon } from "@/components/ui/platform-icon";
import { format, parseISO } from "date-fns";
import { SyncLog } from "@/types/api-responses";

interface LogDetailsModalProps {
  log: SyncLog | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LogDetailsModal({ log, open, onOpenChange }: LogDetailsModalProps) {
  if (!log) return null;

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), "PPpp");
    } catch (e) {
      return dateString;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>Log Details</span>
            <StatusBadge status={log.status} size="sm" />
          </DialogTitle>
          <DialogDescription>
            {log.property?.name || "Unknown Property"} • {formatDate(log.timestamp)}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Platform</p>
              <div className="flex items-center gap-2 mt-1">
                <PlatformIcon platform={log.platform} size={20} />
                <span>{log.platform}</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Action</p>
              <p>{log.action}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Duration</p>
              <p>{log.duration}ms</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">ID</p>
              <p className="font-mono text-xs">{log.id}</p>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground">Message</p>
            <p className="mt-1">{log.message}</p>
          </div>

          {log.details && Object.keys(log.details).length > 0 && (
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Details</p>
              <ScrollArea className="h-60 rounded-md border p-4">
                <pre className="text-xs font-mono whitespace-pre-wrap">
                  {JSON.stringify(log.details, null, 2)}
                </pre>
              </ScrollArea>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
