
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { syncService } from "@/services/sync-service";
import { toast } from "sonner";

interface GlobalSyncButtonProps {
  variant?: "default" | "outline" | "secondary" | "destructive" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  fullWidth?: boolean;
  onSyncStart?: () => void;
  onSyncComplete?: () => void;
}

export function GlobalSyncButton({ 
  variant = "default", 
  size = "default", 
  fullWidth = false,
  onSyncStart,
  onSyncComplete
}: GlobalSyncButtonProps) {
  const queryClient = useQueryClient();
  
  const syncMutation = useMutation({
    mutationFn: async () => {
      return await syncService.syncAll();
    },
    onSuccess: (response) => {
      // Extract data from the response
      if (response.data?.success && response.data?.data) {
        const result = response.data.data;
        toast.success(
          response.data.message || "Synchronization completed successfully", 
          { description: `Synced ${result.summary.successful_syncs} of ${result.summary.total_connections} connections` }
        );
      } else {
        toast.success("Synchronization of all properties completed");
      }
      
      // Invalidate queries to refresh UI
      queryClient.invalidateQueries({ queryKey: ["sync", "status"] });
      
      if (onSyncComplete) {
        onSyncComplete();
      }
    },
    onError: (error) => {
      toast.error("Failed to complete synchronization", {
        description: (error as Error)?.message || "An unknown error occurred"
      });
    }
  });

  const handleSync = () => {
    if (onSyncStart) {
      onSyncStart();
    }
    syncMutation.mutate();
  };

  return (
    <Button 
      variant={variant} 
      size={size} 
      onClick={handleSync} 
      disabled={syncMutation.isPending}
      className={`gap-2 ${fullWidth ? 'w-full' : ''}`}
    >
      {syncMutation.isPending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Syncing...
        </>
      ) : (
        <>
          <RefreshCw className="h-4 w-4" />
          Sync All Properties
        </>
      )}
    </Button>
  );
}
