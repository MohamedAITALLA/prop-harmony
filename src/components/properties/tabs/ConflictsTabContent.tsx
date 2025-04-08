import React, { useState } from "react";
import { usePropertyConflicts } from "@/hooks/properties/usePropertyConflicts";
import { Conflict } from "@/types/api-responses";
import { Button } from "@/components/ui/button";
import { 
  AlertCircle, 
  Check, 
  Clock, 
  AlertTriangle, 
  X, 
  ShieldCheck, 
  ShieldAlert,
  Wand2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format, parseISO, differenceInDays } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

interface ConflictsTabContentProps {
  propertyId: string;
}

export function ConflictsTabContent({ propertyId }: ConflictsTabContentProps) {
  const { 
    conflicts, 
    conflictsMeta, 
    conflictsLoading, 
    statusFilter, 
    setStatusFilter,
    deleteConflict,
    resolveConflict,
    autoResolveConflict,
    isDeletingConflict,
    isResolvingConflict,
    isAutoResolvingConflict
  } = usePropertyConflicts(propertyId);
  
  const [selectedConflict, setSelectedConflict] = useState<Conflict | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isResolveDialogOpen, setIsResolveDialogOpen] = useState(false);
  const [isAutoResolveDialogOpen, setIsAutoResolveDialogOpen] = useState(false);
  const [selectedEvents, setSelectedEvents] = useState<Record<string, boolean>>({});

  const handleDeleteConfirm = () => {
    if (selectedConflict) {
      deleteConflict(selectedConflict._id);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleDeleteClick = (conflict: Conflict) => {
    setSelectedConflict(conflict);
    setIsDeleteDialogOpen(true);
  };

  const handleResolveClick = (conflict: Conflict) => {
    setSelectedConflict(conflict);
    
    const initialSelection: Record<string, boolean> = {};
    if (conflict.events.length > 0) {
      initialSelection[conflict.events[0]._id] = true;
    }
    setSelectedEvents(initialSelection);
    
    setIsResolveDialogOpen(true);
  };

  const handleAutoResolveClick = (conflict: Conflict) => {
    setSelectedConflict(conflict);
    setIsAutoResolveDialogOpen(true);
  };

  const handleResolveConfirm = () => {
    if (selectedConflict) {
      const eventsToKeep = Object.entries(selectedEvents)
        .filter(([_, isSelected]) => isSelected)
        .map(([eventId]) => eventId);
      
      if (eventsToKeep.length === 0) {
        toast.error("You must select at least one event to keep");
        return;
      }

      resolveConflict(selectedConflict._id, eventsToKeep);
      setIsResolveDialogOpen(false);
    }
  };

  const handleAutoResolveConfirm = () => {
    if (selectedConflict) {
      autoResolveConflict(selectedConflict._id);
      setIsAutoResolveDialogOpen(false);
    }
  };

  const handleEventSelect = (eventId: string, checked: boolean) => {
    setSelectedEvents(prev => ({
      ...prev,
      [eventId]: checked
    }));
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-destructive text-destructive-foreground';
      case 'medium': return 'bg-warning text-warning-foreground';
      case 'low': return 'bg-yellow-500 text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <AlertCircle className="h-4 w-4" />;
      case 'resolved': return <Check className="h-4 w-4" />;
      case 'ignored': return <Clock className="h-4 w-4" />;
      default: return null;
    }
  };

  const calculateDurationDays = (startDate: string, endDate: string) => {
    return differenceInDays(parseISO(endDate), parseISO(startDate));
  };

  const renderConflictCard = (conflict: Conflict) => {
    return (
      <Card key={conflict._id} className="mb-4">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-base">
                Booking Conflict
              </CardTitle>
              <CardDescription>
                Detected {format(parseISO(conflict.detected_at), 'PPP')}
              </CardDescription>
            </div>
            <Badge className={`${getSeverityColor(conflict.severity)}`}>
              {conflict.severity.charAt(0).toUpperCase() + conflict.severity.slice(1)} Severity
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pb-3">
          <div className="space-y-3">
            <div className="border rounded-md p-3 space-y-2">
              <h3 className="text-sm font-medium">Conflicting Events:</h3>
              {conflict.events.map((event, idx) => (
                <div key={idx} className="text-sm p-2 bg-muted rounded-md">
                  <div className="flex justify-between">
                    <span className="font-medium">{event.summary}</span>
                    <Badge variant="outline">{event.platform}</Badge>
                  </div>
                  <div className="text-muted-foreground text-xs mt-1">
                    {format(parseISO(event.start_date), 'PPP')} - {format(parseISO(event.end_date), 'PPP')}
                    <span className="ml-2 text-xs">
                      ({calculateDurationDays(event.start_date, event.end_date)} days)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-0 justify-end gap-2">
          {conflict.status === 'active' && (
            <>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleAutoResolveClick(conflict)}
                disabled={isAutoResolvingConflict}
              >
                <Wand2 className="h-4 w-4 mr-1" />
                Auto-Resolve
              </Button>
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={() => handleResolveClick(conflict)}
                disabled={isResolvingConflict}
              >
                <ShieldCheck className="h-4 w-4 mr-1" />
                Resolve
              </Button>
            </>
          )}
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={() => handleDeleteClick(conflict)}
            disabled={isDeletingConflict}
          >
            <X className="h-4 w-4 mr-1" />
            Remove
          </Button>
        </CardFooter>
      </Card>
    );
  };

  const renderSkeletonConflictCards = () => {
    return Array(3).fill(0).map((_, index) => (
      <Card key={index} className="mb-4">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-32 mt-2" />
            </div>
            <Skeleton className="h-6 w-24" />
          </div>
        </CardHeader>
        <CardContent className="pb-3">
          <div className="border rounded-md p-3 space-y-2">
            <Skeleton className="h-4 w-36" />
            <div className="p-2 bg-muted rounded-md">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-5 w-20" />
              </div>
              <Skeleton className="h-3 w-48 mt-2" />
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-0 justify-end">
          <Skeleton className="h-8 w-24" />
        </CardFooter>
      </Card>
    ));
  };

  const renderEmptyState = () => (
    <div className="text-center py-12">
      <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-muted mb-4">
        <AlertTriangle className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium">No conflicts found</h3>
      <p className="text-muted-foreground mt-1">
        {statusFilter === 'active' 
          ? "There are no active conflicts for this property."
          : `No ${statusFilter} conflicts were found. Try changing the filter.`}
      </p>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Booking Conflicts</h2>
        <div className="flex items-center gap-2">
          <Select 
            value={statusFilter || 'active'} 
            onValueChange={(value) => setStatusFilter(value as 'active' | 'resolved' | 'ignored')}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="ignored">Ignored</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {conflictsLoading ? (
          renderSkeletonConflictCards()
        ) : conflicts.length > 0 ? (
          conflicts.map(renderConflictCard)
        ) : (
          renderEmptyState()
        )}
      </div>

      {/* Delete Conflict Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Conflict</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove this conflict? This will mark the conflict as resolved in the system.
            </DialogDescription>
          </DialogHeader>
          
          {selectedConflict && (
            <div className="my-2 p-3 border rounded-md bg-muted/50">
              <div className="flex items-center gap-2">
                <Badge className={`${getSeverityColor(selectedConflict.severity)}`}>
                  {selectedConflict.severity} Severity
                </Badge>
                <span className="text-sm">
                  Detected on {format(parseISO(selectedConflict.detected_at), 'PPP')}
                </span>
              </div>
              <p className="text-sm mt-2">
                This conflict involves {selectedConflict.events.length} events.
              </p>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteConfirm}
              disabled={isDeletingConflict}
            >
              {isDeletingConflict ? "Removing..." : "Remove Conflict"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Resolve Conflict Dialog */}
      <Dialog open={isResolveDialogOpen} onOpenChange={setIsResolveDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Resolve Booking Conflict</DialogTitle>
            <DialogDescription>
              Select which bookings to keep. The others will be deactivated to resolve the conflict.
            </DialogDescription>
          </DialogHeader>
          
          {selectedConflict && (
            <>
              <div className="my-2">
                <Alert>
                  <ShieldAlert className="h-4 w-4" />
                  <AlertTitle>Please review carefully</AlertTitle>
                  <AlertDescription>
                    This action will deactivate unselected bookings. Select at least one booking to keep.
                  </AlertDescription>
                </Alert>
              </div>
              
              <div className="space-y-4 my-2">
                <h3 className="text-sm font-medium">Choose which booking(s) to keep:</h3>
                
                {selectedConflict.events.map((event, idx) => {
                  const durationDays = calculateDurationDays(event.start_date, event.end_date);
                  return (
                    <div key={idx} className="flex items-start space-x-3 p-3 border rounded-md">
                      <Checkbox 
                        id={`event-${event._id}`}
                        checked={!!selectedEvents[event._id]} 
                        onCheckedChange={(checked) => handleEventSelect(event._id, !!checked)}
                      />
                      <div className="grid gap-1.5">
                        <div className="flex items-center space-x-2">
                          <label htmlFor={`event-${event._id}`} className="font-medium text-base">
                            {event.summary}
                          </label>
                          <Badge variant="outline">{event.platform}</Badge>
                          {durationDays > 0 && (
                            <Badge variant="secondary">{durationDays} days</Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {format(parseISO(event.start_date), 'PPP')} - {format(parseISO(event.end_date), 'PPP')}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsResolveDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleResolveConfirm}
              disabled={isResolvingConflict || Object.values(selectedEvents).filter(Boolean).length === 0}
            >
              {isResolvingConflict ? "Resolving..." : "Resolve Conflict"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Auto-Resolve Conflict Dialog */}
      <Dialog open={isAutoResolveDialogOpen} onOpenChange={setIsAutoResolveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Auto-Resolve Conflict</DialogTitle>
            <DialogDescription>
              This will automatically resolve the conflict by keeping the longest booking and removing others.
            </DialogDescription>
          </DialogHeader>
          
          {selectedConflict && (
            <>
              <div className="my-2">
                <Alert>
                  <Wand2 className="h-4 w-4" />
                  <AlertTitle>Automatic resolution</AlertTitle>
                  <AlertDescription>
                    The system will keep the booking with the longest duration and deactivate the others.
                  </AlertDescription>
                </Alert>
              </div>
              
              <div className="space-y-2 my-2">
                <h3 className="text-sm font-medium">Conflicting bookings:</h3>
                
                {selectedConflict.events.map((event, idx) => {
                  const durationDays = calculateDurationDays(event.start_date, event.end_date);
                  return (
                    <div key={idx} className="flex justify-between items-center text-sm p-2 border rounded-md">
                      <div>
                        <span className="font-medium">{event.summary}</span>
                        <div className="text-xs text-muted-foreground">
                          {format(parseISO(event.start_date), 'PPP')} - {format(parseISO(event.end_date), 'PPP')}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{event.platform}</Badge>
                        <Badge variant="secondary">{durationDays} days</Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAutoResolveDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleAutoResolveConfirm}
              disabled={isAutoResolvingConflict}
            >
              {isAutoResolvingConflict ? "Processing..." : "Auto-Resolve"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
