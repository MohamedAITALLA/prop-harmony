
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { conflictService } from "@/services/api-service";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format, parseISO } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Conflict } from "@/types/api-responses";
import { DateRange } from "@/components/ui/date-range";
import { ConflictTypeBadge } from "@/components/ui/conflict-type-badge";
import { SeverityBadge } from "@/components/ui/severity-badge";
import { PlatformsList } from "@/components/sync/PlatformsList";
import { Button } from "@/components/ui/button";
import { Eye, Check, X } from "lucide-react";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ConflictResolver } from "@/components/ui/conflict-resolver";
import { ConflictDetailsView } from "@/components/conflicts/ConflictDetailsView";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ConflictType, ConflictSeverity, ConflictStatus } from "@/types/enums";

interface MockConflict {
  id: string;
  property_id: string;
  property?: {
    id: string;
    name: string;
  };
  event_ids: string[];
  conflict_type: string;
  start_date: string;
  end_date: string;
  severity: string;
  status: string;
  description: string;
  created_at: string;
  updated_at: string;
  platforms: string[];
}

interface PropertyConflictsViewProps {
  propertyId: string;
}

export function PropertyConflictsView({ propertyId }: PropertyConflictsViewProps) {
  const [status, setStatus] = useState<string>("unresolved");
  
  const [selectedConflict, setSelectedConflict] = useState<Conflict | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [resolverModalOpen, setResolverModalOpen] = useState(false);
  const [dismissDialogOpen, setDismissDialogOpen] = useState(false);
  const [dismissingConflictId, setDismissingConflictId] = useState<string | null>(null);

  const { data: conflictsData, isLoading, error, refetch } = useQuery({
    queryKey: ["conflicts", propertyId, status],
    queryFn: async () => {
      try {
        const response = await conflictService.getConflicts(propertyId, {
          status: status !== "all" ? status : undefined
        });
        return response.data;
      } catch (error) {
        console.error("Error fetching conflicts:", error);
        toast.error("Failed to load conflicts");
        return mockFetchConflictsForProperty(propertyId, status);
      }
    }
  });

  const isMockConflictArray = (data: any[]): data is MockConflict[] => {
    return data.length === 0 || 'platforms' in data[0];
  };

  const formatRelativeTime = (timestamp: string) => {
    const date = parseISO(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} days ago`;
  };

  const handleViewDetails = (conflict: Conflict) => {
    setSelectedConflict(conflict);
    setDetailsModalOpen(true);
  };

  const handleOpenResolverModal = (conflict: Conflict) => {
    setSelectedConflict(conflict);
    setResolverModalOpen(true);
  };

  const handleDismissConflict = (conflictId: string) => {
    setDismissingConflictId(conflictId);
    setDismissDialogOpen(true);
  };

  const confirmDismissConflict = async () => {
    if (!dismissingConflictId) return;
    
    try {
      await conflictService.deleteConflict(propertyId, dismissingConflictId);
      toast.success("Conflict dismissed successfully");
      refetch();
    } catch (error) {
      console.error("Error dismissing conflict:", error);
      toast.error("Failed to dismiss conflict");
    } finally {
      setDismissDialogOpen(false);
      setDismissingConflictId(null);
    }
  };

  const handleResolveConflict = async () => {
    if (selectedConflict) {
      toast.success("Conflict resolved successfully");
      setResolverModalOpen(false);
      refetch();
    }
  };

  const mockFetchConflictsForProperty = async (propertyId: string, status: string): Promise<MockConflict[]> => {
    // Mock conflicts for the specific property
    return [
      {
        id: "conf-1",
        property_id: propertyId,
        property: { id: propertyId, name: "Beach House" },
        event_ids: ["evt-1", "evt-2"],
        conflict_type: "overlap",
        start_date: "2023-09-15T00:00:00Z",
        end_date: "2023-09-20T00:00:00Z",
        severity: "high",
        status: "new",
        description: "Double booking detected",
        created_at: "2023-09-01T10:00:00Z",
        updated_at: "2023-09-01T10:00:00Z",
        platforms: ["Airbnb", "Booking"]
      },
      {
        id: "conf-2",
        property_id: propertyId,
        property: { id: propertyId, name: "Beach House" },
        event_ids: ["evt-3", "evt-4"],
        conflict_type: "adjacent",
        start_date: "2023-10-01T00:00:00Z",
        end_date: "2023-10-07T00:00:00Z",
        severity: "medium",
        status: "acknowledged",
        description: "Insufficient turnover time",
        created_at: "2023-09-15T14:30:00Z",
        updated_at: "2023-09-15T14:30:00Z",
        platforms: ["Vrbo", "TripAdvisor"]
      }
    ].filter(conflict => status === "all" || conflict.status === status);
  };

  const convertMockToConflict = (mockConflict: MockConflict): Conflict => {
    return {
      ...mockConflict,
      conflict_type: mockConflict.conflict_type as ConflictType,
      severity: mockConflict.severity as ConflictSeverity,
      status: mockConflict.status as ConflictStatus,
      platforms: mockConflict.platforms
    };
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <div className="w-64">
          <label htmlFor="status-filter" className="text-sm font-medium block mb-1">
            Status
          </label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger id="status-filter">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="unresolved">Unresolved</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="all">All</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="border rounded-md">
        {isLoading ? (
          <div className="py-8 text-center">
            <div className="inline-block animate-spin h-6 w-6 border-2 border-current border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-2 text-sm text-muted-foreground">Loading conflicts...</p>
          </div>
        ) : error ? (
          <div className="py-8 text-center">
            <p className="text-destructive">Failed to load conflicts</p>
          </div>
        ) : !conflictsData?.length ? (
          <div className="py-8 text-center">
            <p className="text-muted-foreground">No conflicts found with the current filters</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Platforms</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Detected</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isMockConflictArray(conflictsData) ? (
                conflictsData.map((mockConflict: MockConflict) => {
                  const conflict = convertMockToConflict(mockConflict);
                  
                  return (
                    <TableRow key={conflict.id}>
                      <TableCell>
                        <ConflictTypeBadge type={conflict.conflict_type} />
                      </TableCell>
                      <TableCell>
                        <PlatformsList platforms={mockConflict.platforms} />
                      </TableCell>
                      <TableCell>
                        <DateRange startDate={conflict.start_date} endDate={conflict.end_date} />
                      </TableCell>
                      <TableCell>
                        <SeverityBadge severity={conflict.severity} />
                      </TableCell>
                      <TableCell>{formatRelativeTime(conflict.created_at)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleViewDetails(conflict)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleOpenResolverModal(conflict)}>
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleDismissConflict(conflict.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                conflictsData.map((conflict: Conflict) => (
                  <TableRow key={conflict.id}>
                    <TableCell>
                      <ConflictTypeBadge type={conflict.conflict_type} />
                    </TableCell>
                    <TableCell>
                      <PlatformsList platforms={conflict.platforms || []} />
                    </TableCell>
                    <TableCell>
                      <DateRange startDate={conflict.start_date} endDate={conflict.end_date} />
                    </TableCell>
                    <TableCell>
                      <SeverityBadge severity={conflict.severity} />
                    </TableCell>
                    <TableCell>{formatRelativeTime(conflict.created_at)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleViewDetails(conflict)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleOpenResolverModal(conflict)}>
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDismissConflict(conflict.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>

      <AlertDialog open={dismissDialogOpen} onOpenChange={setDismissDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Dismiss Conflict</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to dismiss this conflict without resolving it?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDismissConflict}>
              Dismiss
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={detailsModalOpen} onOpenChange={setDetailsModalOpen}>
        <DialogContent className="max-w-3xl">
          {selectedConflict && <ConflictDetailsView conflict={selectedConflict} />}
        </DialogContent>
      </Dialog>

      <Dialog open={resolverModalOpen} onOpenChange={setResolverModalOpen}>
        <DialogContent className="max-w-3xl">
          {selectedConflict && (
            <ConflictResolver 
              conflictId={selectedConflict.id} 
              propertyId={propertyId}
              onResolve={handleResolveConflict}
              events={[
                { id: "evt-1", platform: "Airbnb", summary: "John Smith", startDate: selectedConflict.start_date, endDate: selectedConflict.end_date },
                { id: "evt-2", platform: "Booking", summary: "Sarah Johnson", startDate: selectedConflict.start_date, endDate: selectedConflict.end_date }
              ]}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
