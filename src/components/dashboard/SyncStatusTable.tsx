
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PlatformIcon } from "@/components/ui/platform-icon";
import { format } from "date-fns";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/ui/status-badge";
import React from "react";

interface SyncItem {
  id: string;
  platform: string;
  last_sync: string;
  status: "success" | "error" | "warning" | "in_progress";
}

interface SyncStatusTableProps {
  action?: string;
}

export function SyncStatusTable({ action }: SyncStatusTableProps) {
  const navigate = useNavigate();
  const [syncingPlatform, setSyncingPlatform] = React.useState<string | null>(null);
  const [isSyncingAll, setIsSyncingAll] = React.useState(false);
  
  const { data: syncItems = [], isLoading } = useQuery<SyncItem[]>({
    queryKey: ["sync", "status"],
    queryFn: async () => {
      // In a real app, we would fetch from the API
      return [
        {
          id: "sync-1",
          platform: "airbnb",
          last_sync: new Date(Date.now() - 1000 * 60 * 10).toISOString(), // 10 minutes ago
          status: "success"
        },
        {
          id: "sync-2",
          platform: "booking",
          last_sync: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
          status: "success"
        },
        {
          id: "sync-3",
          platform: "vrbo",
          last_sync: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
          status: "warning"
        },
        {
          id: "sync-4",
          platform: "tripadvisor",
          last_sync: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
          status: "error"
        }
      ] as SyncItem[];
    }
  });

  const handleSync = (platformId: string) => {
    // In a real app, we would make an API call to sync
    setSyncingPlatform(platformId);
    
    // Simulate sync process
    toast.info(`Starting sync for ${platformId}...`);
    
    setTimeout(() => {
      toast.success(`Successfully synced ${platformId}`);
      setSyncingPlatform(null);
    }, 3000);
  };

  const handleSyncAll = () => {
    // In a real app, we would make an API call to sync all platforms
    setIsSyncingAll(true);
    
    // Simulate sync process
    toast.info("Starting sync for all platforms...");
    
    setTimeout(() => {
      toast.success("Successfully synced all platforms");
      setIsSyncingAll(false);
    }, 5000);
  };

  const formatSyncDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "PPp");
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Platform</TableHead>
              <TableHead>Last Sync</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div className="h-6 w-32 bg-muted rounded animate-pulse" />
                  </TableCell>
                  <TableCell>
                    <div className="h-6 w-24 bg-muted rounded animate-pulse" />
                  </TableCell>
                  <TableCell>
                    <div className="h-6 w-20 bg-muted rounded animate-pulse" />
                  </TableCell>
                  <TableCell>
                    <div className="h-6 w-16 bg-muted rounded animate-pulse float-right" />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              syncItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <PlatformIcon platform={item.platform} size={24} />
                      <span className="capitalize">{item.platform}</span>
                    </div>
                  </TableCell>
                  <TableCell>{formatSyncDate(item.last_sync)}</TableCell>
                  <TableCell>
                    <StatusBadge status={item.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleSync(item.platform)}
                      disabled={syncingPlatform === item.platform}
                      className="gap-1"
                    >
                      {syncingPlatform === item.platform ? (
                        <>
                          <Loader2 className="h-3 w-3 animate-spin" />
                          Syncing...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="h-3 w-3" />
                          Sync
                        </>
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      <div className="flex justify-between mt-4">
        {action && (
          <Button 
            variant="default" 
            onClick={handleSyncAll}
            disabled={isSyncingAll}
            className="gap-2"
          >
            {isSyncingAll ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Syncing...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4" />
                {action}
              </>
            )}
          </Button>
        )}
        
        <Button 
          variant="outline" 
          onClick={() => navigate("/sync")}
          className="gap-2 ml-auto"
        >
          View All
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
