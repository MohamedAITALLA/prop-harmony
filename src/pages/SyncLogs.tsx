
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { syncService, propertyService } from "@/services/api-service";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateRange as DateRangeType } from "react-day-picker";
import { CalendarRange } from "@/components/ui/calendar-range";
import { addDays, format, startOfDay, endOfDay, parseISO } from "date-fns";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/ui/status-badge";
import { PlatformIcon } from "@/components/ui/platform-icon";
import { Property, SyncLog } from "@/types/api-responses";
import { LogActionButton } from "@/components/sync/LogActionButton";
import { LogDetailsModal } from "@/components/sync/LogDetailsModal";
import { Platform, SyncLogStatus } from "@/types/enums";

export default function SyncLogs() {
  // State for filters
  const [propertyId, setPropertyId] = useState<string>("");
  const [platform, setPlatform] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [dateRange, setDateRange] = useState<DateRangeType>({
    from: addDays(new Date(), -7),
    to: new Date(),
  });
  
  // State for log details modal
  const [selectedLog, setSelectedLog] = useState<SyncLog | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  // Fetch properties for the filter dropdown
  const { data: propertiesData } = useQuery({
    queryKey: ["properties"],
    queryFn: async () => {
      try {
        const response = await propertyService.getAllProperties();
        return Array.isArray(response.data.properties) ? response.data.properties : [];
      } catch (error) {
        console.error("Error fetching properties:", error);
        return [];
      }
    }
  });

  // Format date range for API
  const startDate = dateRange?.from ? format(startOfDay(dateRange.from), "yyyy-MM-dd'T'HH:mm:ss'Z'") : undefined;
  const endDate = dateRange?.to ? format(endOfDay(dateRange.to), "yyyy-MM-dd'T'HH:mm:ss'Z'") : undefined;
  
  // Fetch log data
  const { data: logsData, isLoading, error } = useQuery({
    queryKey: ["syncLogs", propertyId, platform, status, startDate, endDate],
    queryFn: async () => {
      try {
        const response = await syncService.getSyncLogs({
          property_id: propertyId || undefined,
          platform: platform || undefined,
          status: status || undefined,
          start_date: startDate,
          end_date: endDate,
          page: 1,
          limit: 50,
        });
        return response.data;
      } catch (error) {
        console.error("Error fetching sync logs:", error);
        toast.error("Failed to load sync logs");
        return { logs: [], pagination: { total: 0 } };
      }
    }
  });

  const handleViewLogDetails = (log: SyncLog) => {
    setSelectedLog(log);
    setDetailsModalOpen(true);
  };
  
  const formatTimestamp = (timestamp: string) => {
    try {
      return format(parseISO(timestamp), "MMM d, HH:mm:ss");
    } catch (e) {
      return timestamp;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Synchronization Logs</h1>
        <p className="text-muted-foreground">
          Detailed logs of synchronization activities across all properties
        </p>
      </div>
      
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-2">
          <label htmlFor="property-filter" className="text-sm font-medium">
            Property
          </label>
          <Select value={propertyId} onValueChange={setPropertyId}>
            <SelectTrigger id="property-filter">
              <SelectValue placeholder="All properties" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all_properties">All properties</SelectItem>
              {propertiesData?.map((property: Property) => (
                <SelectItem key={property.id} value={property.id}>
                  {property.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="platform-filter" className="text-sm font-medium">
            Platform
          </label>
          <Select value={platform} onValueChange={setPlatform}>
            <SelectTrigger id="platform-filter">
              <SelectValue placeholder="All platforms" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all_platforms">All platforms</SelectItem>
              <SelectItem value={Platform.AIRBNB}>Airbnb</SelectItem>
              <SelectItem value={Platform.BOOKING}>Booking</SelectItem>
              <SelectItem value={Platform.EXPEDIA}>Expedia</SelectItem>
              <SelectItem value={Platform.TRIPADVISOR}>TripAdvisor</SelectItem>
              <SelectItem value={Platform.VRBO}>Vrbo</SelectItem>
              <SelectItem value="manual">Manual</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="status-filter" className="text-sm font-medium">
            Status
          </label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger id="status-filter">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all_statuses">All statuses</SelectItem>
              <SelectItem value={SyncLogStatus.SUCCESS}>Success</SelectItem>
              <SelectItem value={SyncLogStatus.WARNING}>Warning</SelectItem>
              <SelectItem value={SyncLogStatus.FAILURE}>Failure</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Date Range</label>
          <CalendarRange 
            value={dateRange}
            onChange={setDateRange}
          />
        </div>
      </div>
      
      {/* Logs Table */}
      <div className="border rounded-md">
        {isLoading ? (
          <div className="py-8 text-center">
            <div className="inline-block animate-spin h-6 w-6 border-2 border-current border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-2 text-sm text-muted-foreground">Loading logs...</p>
          </div>
        ) : error ? (
          <div className="py-8 text-center">
            <p className="text-destructive">Failed to load logs</p>
          </div>
        ) : !logsData?.logs?.length ? (
          <div className="py-8 text-center">
            <p className="text-muted-foreground">No logs found with the current filters</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Property</TableHead>
                <TableHead>Platform</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logsData.logs.map((log: SyncLog) => (
                <TableRow key={log.id}>
                  <TableCell className="whitespace-nowrap">
                    {formatTimestamp(log.timestamp)}
                  </TableCell>
                  <TableCell>{log.property?.name || "—"}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <PlatformIcon platform={log.platform} size={16} />
                      <span>{log.platform}</span>
                    </div>
                  </TableCell>
                  <TableCell>{log.action}</TableCell>
                  <TableCell>
                    <StatusBadge status={log.status} />
                  </TableCell>
                  <TableCell>{log.duration}ms</TableCell>
                  <TableCell className="max-w-xs truncate">{log.message}</TableCell>
                  <TableCell>
                    <LogActionButton row={log} onViewDetails={handleViewLogDetails} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Details Modal */}
      <LogDetailsModal 
        log={selectedLog} 
        open={detailsModalOpen}
        onOpenChange={setDetailsModalOpen}
      />
    </div>
  );
}
