import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { eventService } from "@/services/api-event-service";
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
import { 
  MoreVertical,
  Eye, 
  Check, 
  X, 
  RefreshCw,
  AlertTriangle,
  ChevronRight,
  ArrowRight,
  MessageSquare,
  Calendar 
} from "lucide-react";
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
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ConflictType, ConflictSeverity, ConflictStatus, Platform } from "@/types/enums";
import { normalizeMongoObject } from "@/lib/mongo-helpers";
import { AdvancedPagination } from "@/components/ui/advanced-pagination";

interface PropertyConflictsListProps {
  propertyId: string;
}

export function PropertyConflictsList({ propertyId }: PropertyConflictsListProps) {
  const [status, setStatus] = useState<string>("all");
  const [selectedSeverity, setSelectedSeverity] = useState<ConflictSeverity | "all">("all");
  const [selectedConflict, setSelectedConflict] = useState<Conflict | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [resolverModalOpen, setResolverModalOpen] = useState(false);
  const [dismissDialogOpen, setDismissDialogOpen] = useState(false);
  const [dismissingConflictId, setDismissingConflictId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data: conflictsData, isLoading, error, refetch } = useQuery({
    queryKey: ["property-conflicts", propertyId, status, currentPage, pageSize],
    queryFn: async () => {
      try {
        const params = { 
          ...(status !== "all" ? { status } : {}),
          page: currentPage,
          limit: pageSize
        };
        const response = await eventService.getPropertyConflicts(propertyId, params);
        return response;
      } catch (error) {
        console.error("Error fetching conflicts:", error);
        toast.error("Failed to load conflicts");
        return { data: [], meta: { total: 0, property_id: propertyId, status_breakdown: {}, status_filter: status } };
      }
    }
  });

  const conflicts = conflictsData?.data || [];
  const totalConflicts = conflictsData?.meta?.total || 0;
  const totalPages = Math.ceil(totalConflicts / pageSize);

  const filteredConflicts = conflicts.filter((conflict: Conflict) => {
    const matchesSearch = 
      conflict.description?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
    
    const matchesSeverity = selectedSeverity === "all" ? true : conflict.severity === selectedSeverity;
    
    return matchesSearch && matchesSeverity;
  });
  
  const conflictsByStatus = {
    new: filteredConflicts.filter(conflict => conflict.status === ConflictStatus.NEW),
    acknowledged: filteredConflicts.filter(conflict => conflict.status === ConflictStatus.ACKNOWLEDGED),
    resolved: filteredConflicts.filter(conflict => conflict.status === ConflictStatus.RESOLVED)
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
      await eventService.resolveConflict(propertyId, dismissingConflictId, { resolution: 'dismiss' });
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

  const handleUpdateStatus = (conflict: Conflict, status: ConflictStatus) => {
    toast.success(`Conflict status updated to ${status}`);
    setTimeout(() => {
      refetch();
    }, 500);
  };

  const getSeverityColor = (severity: ConflictSeverity) => {
    switch (severity) {
      case ConflictSeverity.HIGH:
        return "bg-red-100 text-red-800 border-red-200";
      case ConflictSeverity.MEDIUM:
        return "bg-orange-100 text-orange-800 border-orange-200";
      case ConflictSeverity.LOW:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };
  
  const getTypeLabel = (type: ConflictType) => {
    switch (type) {
      case ConflictType.OVERLAP:
        return "Booking Overlap";
      case ConflictType.ADJACENT:
        return "Adjacent Bookings";
      case ConflictType.TURNOVER:
        return "Turnover Conflict";
      default:
        return type;
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative sm:max-w-xs flex-1">
          <input
            placeholder="Search conflicts..."
            className="pl-8 h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Eye className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Select 
            value={selectedSeverity} 
            onValueChange={(value) => setSelectedSeverity(value as ConflictSeverity | "all")}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Severities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Severities</SelectItem>
              <SelectItem value={ConflictSeverity.HIGH}>High</SelectItem>
              <SelectItem value={ConflictSeverity.MEDIUM}>Medium</SelectItem>
              <SelectItem value={ConflictSeverity.LOW}>Low</SelectItem>
            </SelectContent>
          </Select>
          
          <Button onClick={() => refetch()}>
            <RefreshCw className="mr-2 h-4 w-4" /> Refresh
          </Button>
          
          {(selectedSeverity !== "all" || searchQuery) && (
            <Button variant="ghost" onClick={() => {
              setSelectedSeverity("all");
              setSearchQuery("");
            }}>
              <X className="mr-2 h-4 w-4" /> Clear
            </Button>
          )}
        </div>
      </div>
      
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox aria-label="Select all" />
              </TableHead>
              <TableHead>Conflict</TableHead>
              <TableHead>Period</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>Platforms</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7}>
                  <div className="flex items-center justify-center py-6">
                    <RefreshCw className="h-5 w-5 animate-spin mr-2" />
                    <span>Loading conflicts...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : error || !filteredConflicts?.length ? (
              <TableRow>
                <TableCell colSpan={7}>
                  <div className="flex flex-col items-center justify-center py-8">
                    <AlertTriangle className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-lg font-medium">No conflicts found</p>
                    <p className="text-muted-foreground">
                      {error ? "Error loading conflicts" : "There are no calendar conflicts matching your filters"}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredConflicts.map((conflict: Conflict) => (
                <TableRow key={conflict._id}>
                  <TableCell>
                    <Checkbox aria-label={`Select conflict ${conflict._id}`} />
                  </TableCell>
                  <TableCell>
                    <div>{getTypeLabel(conflict.conflict_type)}</div>
                    <div className="text-xs text-muted-foreground truncate max-w-[200px]" title={conflict.description}>
                      {conflict.description}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="whitespace-nowrap">
                      <DateRange startDate={conflict.start_date} endDate={conflict.end_date} />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={`font-normal ${getSeverityColor(conflict.severity)}`}>
                      {conflict.severity}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <PlatformsList platforms={conflict.platforms || []} />
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={
                      conflict.status === ConflictStatus.NEW ? "bg-red-100 text-red-800 border-red-200" :
                      conflict.status === ConflictStatus.ACKNOWLEDGED ? "bg-yellow-100 text-yellow-800 border-yellow-200" :
                      "bg-green-100 text-green-800 border-green-200"
                    }>
                      {conflict.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewDetails(conflict)}>
                          <Eye className="mr-2 h-4 w-4" /> View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Calendar className="mr-2 h-4 w-4" /> View Calendar
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <MessageSquare className="mr-2 h-4 w-4" /> Add Note
                        </DropdownMenuItem>
                        
                        {conflict.status === ConflictStatus.NEW && (
                          <DropdownMenuItem onClick={() => handleUpdateStatus(conflict, ConflictStatus.ACKNOWLEDGED)}>
                            <ChevronRight className="mr-2 h-4 w-4" /> Acknowledge
                          </DropdownMenuItem>
                        )}
                        
                        {conflict.status !== ConflictStatus.RESOLVED && (
                          <DropdownMenuItem onClick={() => handleOpenResolverModal(conflict)}>
                            <ArrowRight className="mr-2 h-4 w-4" /> Resolve
                          </DropdownMenuItem>
                        )}

                        <DropdownMenuItem onClick={() => handleDismissConflict(conflict._id)}>
                          <X className="mr-2 h-4 w-4" /> Dismiss
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AdvancedPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

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
              conflictId={selectedConflict._id} 
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
      
      <div className="mt-4 p-4 border rounded-md bg-muted/20">
        <h3 className="font-medium mb-2">Conflict Resolution Tips</h3>
        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
          <li>For booking overlaps, contact the guest with the later booking first</li>
          <li>When bookings have no gap, ensure cleaning services are arranged for a quick turnaround</li>
          <li>For maintenance conflicts, prioritize based on severity and guest impact</li>
        </ul>
      </div>
    </div>
  );
}
