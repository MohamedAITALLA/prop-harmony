
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { SyncLog, Property } from "@/types/api-responses";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { LogDetailsModal } from "@/components/sync/LogDetailsModal";
import { StatusBadge } from "@/components/ui/status-badge";
import { PlatformIcon } from "@/components/ui/platform-icon";
import { Search, ArrowUpDown, Filter, RefreshCw } from "lucide-react";
import { syncService, propertyService } from "@/services/api-service";
import { format, parseISO } from "date-fns";
import { convertToMongoIdFormat } from "@/lib/id-conversion";
import { Platform, SyncLogStatus, SyncAction } from "@/types/enums";

// Create a concrete log type that matches what our mock function returns
interface MockSyncLog {
  _id: string;
  property_id: string;
  property?: { _id: string; name: string };
  platform: string;
  action: string;
  status: string;
  timestamp: string;
  duration: number;
  message: string;
  details?: {
    events_processed: number;
    new_events: number;
    updated_events: number;
    deleted_events: number;
  };
  created_at: string;
}

export default function SyncLogs() {
  const [selectedProperty, setSelectedProperty] = useState<string>("");
  const [selectedPlatform, setSelectedPlatform] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLogDetailsOpen, setIsLogDetailsOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState<MockSyncLog | null>(null);

  const { data: syncLogs = [], isLoading: isLogsLoading } = useQuery({
    queryKey: ["sync-logs", selectedProperty, selectedPlatform, selectedStatus],
    queryFn: async () => {
      try {
        // In a real app we would filter based on the selected values
        // For the mock data, we're not applying filters
        return getMockLogs();
      } catch (error) {
        console.error("Error fetching sync logs:", error);
        return [];
      }
    },
  });

  const { data: properties = [], isLoading: isPropertiesLoading } = useQuery({
    queryKey: ["properties-simple"],
    queryFn: async () => {
      try {
        const response = await propertyService.getAllProperties();
        return response.data?.properties || [];
      } catch (error) {
        console.error("Error fetching properties:", error);
        return convertToMongoIdFormat(getMockProperties());
      }
    },
  });

  const filteredLogs = syncLogs.filter((log: MockSyncLog) => {
    const matchesSearch = 
      log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.platform.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.property?.name?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesProperty = selectedProperty ? log.property_id === selectedProperty : true;
    const matchesPlatform = selectedPlatform ? log.platform === selectedPlatform : true;
    const matchesStatus = selectedStatus ? log.status === selectedStatus : true;

    return matchesSearch && matchesProperty && matchesPlatform && matchesStatus;
  });

  const handleViewLog = (log: MockSyncLog) => {
    setSelectedLog(log);
    setIsLogDetailsOpen(true);
  };

  const clearFilters = () => {
    setSelectedProperty("");
    setSelectedPlatform("");
    setSelectedStatus("");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sync Logs</h1>
          <p className="text-muted-foreground">
            View and monitor calendar sync activity
          </p>
        </div>
        
        <Button>
          <RefreshCw className="mr-2 h-4 w-4" /> Sync All
        </Button>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search sync logs..."
              className="pl-8 max-w-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Select value={selectedProperty} onValueChange={setSelectedProperty}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Properties" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all_properties">All Properties</SelectItem>
                {properties.map((property: Property) => (
                  <SelectItem key={property._id} value={property._id}>
                    {property.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Platforms" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all_platforms">All Platforms</SelectItem>
                <SelectItem value="Airbnb">Airbnb</SelectItem>
                <SelectItem value="Booking">Booking.com</SelectItem>
                <SelectItem value="Expedia">Expedia</SelectItem>
                <SelectItem value="TripAdvisor">TripAdvisor</SelectItem>
                <SelectItem value="Vrbo">Vrbo</SelectItem>
                <SelectItem value="manual">Manual</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all_statuses">All Statuses</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="failure">Failure</SelectItem>
              </SelectContent>
            </Select>

            {(selectedProperty || selectedPlatform || selectedStatus) && (
              <Button variant="ghost" onClick={clearFilters}>
                Clear Filters
              </Button>
            )}
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px]">Timestamp</TableHead>
                <TableHead>Property</TableHead>
                <TableHead>Platform</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLogsLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10">
                    Loading logs...
                  </TableCell>
                </TableRow>
              ) : filteredLogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10">
                    No sync logs found
                  </TableCell>
                </TableRow>
              ) : (
                filteredLogs.map((log: MockSyncLog) => (
                  <TableRow 
                    key={log._id} 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleViewLog(log)}
                  >
                    <TableCell>{format(parseISO(log.timestamp), 'MMM d, h:mm a')}</TableCell>
                    <TableCell>{log.property?.name || 'Unknown'}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <PlatformIcon platform={log.platform} />
                        <span>{log.platform}</span>
                      </div>
                    </TableCell>
                    <TableCell>{log.action}</TableCell>
                    <TableCell>{log.duration}ms</TableCell>
                    <TableCell>
                      <StatusBadge status={log.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="ghost">View</Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <LogDetailsModal 
        log={selectedLog as any} 
        open={isLogDetailsOpen}
        onOpenChange={setIsLogDetailsOpen}
      />
    </div>
  );
}

function getMockProperties() {
  return [
    { _id: "prop-1", name: "Oceanfront Villa" },
    { _id: "prop-2", name: "Downtown Loft" },
    { _id: "prop-3", name: "Mountain Cabin" },
  ];
}

function getMockLogs() {
  return convertToMongoIdFormat([
    {
      _id: "log-1",
      property_id: "prop-1",
      property: { _id: "prop-1", name: "Oceanfront Villa" },
      platform: "Airbnb",
      action: "sync_complete",
      status: "success",
      timestamp: new Date().toISOString(),
      duration: 1253,
      message: "Successfully synchronized calendar from Airbnb",
      details: {
        events_processed: 12,
        new_events: 2,
        updated_events: 0,
        deleted_events: 1
      },
      created_at: new Date().toISOString()
    }
  ]);
}
