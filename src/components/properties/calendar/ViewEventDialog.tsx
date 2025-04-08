
import React, { useMemo, useState } from 'react';
import { Button } from "@/components/ui/button";
import { CalendarEvent } from "@/types/api-responses";
import { Badge } from "@/components/ui/badge";
import { EventFormFields } from "@/components/properties/calendar/EventFormFields";
import { Trash2, Edit2, CheckCircle, AlertCircle, Calendar, Clock } from "lucide-react";
import { toast } from "sonner";
import { eventService } from "@/services/api-service";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
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

interface ViewEventDialogProps {
  isViewEventOpen: boolean;
  setIsViewEventOpen: (open: boolean) => void;
  viewedEvent: CalendarEvent | null;
  handleDeleteEvent: () => void;
}

export const ViewEventDialog: React.FC<ViewEventDialogProps> = ({
  isViewEventOpen,
  setIsViewEventOpen,
  viewedEvent,
  handleDeleteEvent
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updatedEventData, setUpdatedEventData] = useState<any>(null);
  
  if (!viewedEvent) return null;

  // Format the event data for the form fields
  const formattedEventData = useMemo(() => ({
    platform: viewedEvent.platform,
    summary: viewedEvent.summary,
    start_date: viewedEvent.start_date,
    end_date: viewedEvent.end_date,
    event_type: viewedEvent.event_type,
    status: viewedEvent.status || "confirmed",
    description: viewedEvent.description || "",
  }), [viewedEvent]);
  
  // Format dates for display
  const formatDateTime = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return format(date, "MMM dd, yyyy 'at' h:mm a");
    } catch (e) {
      return dateStr;
    }
  };
  
  const formattedStartDate = formatDateTime(viewedEvent.start_date);
  const formattedEndDate = formatDateTime(viewedEvent.end_date);
  
  // Initialize edit data when entering edit mode
  const handleEditClick = () => {
    setUpdatedEventData(formattedEventData);
    setIsEditMode(true);
  };
  
  // Handle form field changes
  const handleInputChange = (field: string, value: string) => {
    setUpdatedEventData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Save updated event
  const handleUpdateEvent = async () => {
    if (!viewedEvent || !updatedEventData) return;
    
    try {
      setIsUpdating(true);
      
      // Validate required fields
      if (!updatedEventData.summary) {
        toast.error("Event title is required");
        return;
      }
      
      if (!updatedEventData.start_date || !updatedEventData.end_date) {
        toast.error("Start and end dates are required");
        return;
      }
      
      const response = await eventService.updateEvent(
        viewedEvent.property_id,
        viewedEvent._id,
        updatedEventData
      );
      
      toast.success("Event updated successfully");
      
      // Exit edit mode and close dialog
      setIsEditMode(false);
      setIsViewEventOpen(false);
      
      // Force refresh
      window.location.reload();
    } catch (error) {
      console.error("Error updating event:", error);
      toast.error("Failed to update event");
    } finally {
      setIsUpdating(false);
    }
  };
  
  const onConfirmDelete = () => {
    handleDeleteEvent();
    setIsDeleteDialogOpen(false);
  };
  
  const handleCancelEdit = () => {
    setIsEditMode(false);
    setUpdatedEventData(null);
  };
  
  return (
    <>
      <Dialog open={isViewEventOpen} onOpenChange={setIsViewEventOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>{isEditMode ? "Edit Event" : "Event Details"}</DialogTitle>
            <DialogDescription>
              {isEditMode ? "Update this event's information" : "View details for this event"}
            </DialogDescription>
          </DialogHeader>
          
          {!isEditMode && (
            <>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">{viewedEvent.summary}</h3>
                <Badge>{viewedEvent.platform}</Badge>
              </div>
              
              <div className="space-y-3 mb-4 p-3 bg-muted/30 rounded-md border">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Start Date</p>
                    <p className="text-sm text-muted-foreground">{formattedStartDate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-sm font-medium">End Date</p>
                    <p className="text-sm text-muted-foreground">{formattedEndDate}</p>
                  </div>
                </div>
              </div>
            </>
          )}
          
          {/* Use the shared form fields component in read-only or edit mode */}
          <EventFormFields 
            formData={isEditMode ? updatedEventData : formattedEventData}
            onInputChange={handleInputChange}
            readOnly={!isEditMode}
          />
          
          {!isEditMode && viewedEvent.ical_uid && (
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">iCal UID</p>
              <p className="mt-1 text-xs text-muted-foreground break-all">{viewedEvent.ical_uid}</p>
            </div>
          )}
          
          <DialogFooter className="mt-6">
            {isEditMode ? (
              <>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleCancelEdit}
                >
                  Cancel
                </Button>
                <Button 
                  type="button" 
                  onClick={handleUpdateEvent}
                  disabled={isUpdating}
                  className="flex items-center gap-2"
                >
                  {isUpdating ? (
                    "Updating..."
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </>
            ) : (
              <>
                <Button 
                  type="button" 
                  variant="destructive" 
                  onClick={() => setIsDeleteDialogOpen(true)}
                  className="flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsViewEventOpen(false)}
                >
                  Close
                </Button>
                <Button 
                  type="button" 
                  onClick={handleEditClick}
                  className="flex items-center gap-2"
                >
                  <Edit2 className="h-4 w-4" />
                  Edit
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive flex items-center gap-2">
              <Trash2 className="h-5 w-5" />
              Delete Event
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this event? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="my-4 p-4 border rounded-md bg-muted/50">
            <p className="font-medium">{viewedEvent.summary}</p>
            <div className="text-sm text-muted-foreground mt-1 space-y-1">
              <p><span className="font-medium">Platform:</span> {viewedEvent.platform}</p>
              <p><span className="font-medium">Type:</span> {viewedEvent.event_type}</p>
              <p><span className="font-medium">Start:</span> {formattedStartDate}</p>
              <p><span className="font-medium">End:</span> {formattedEndDate}</p>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={onConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
