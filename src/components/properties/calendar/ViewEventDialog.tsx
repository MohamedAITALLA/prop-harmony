
import React, { useMemo, useState } from 'react';
import { Button } from "@/components/ui/button";
import { CalendarEvent } from "@/types/api-responses";
import { Badge } from "@/components/ui/badge";
import { EventFormFields } from "@/components/properties/calendar/EventFormFields";
import { Trash2 } from "lucide-react";
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
  
  const onConfirmDelete = () => {
    handleDeleteEvent();
    setIsDeleteDialogOpen(false);
  };
  
  return (
    <>
      <Dialog open={isViewEventOpen} onOpenChange={setIsViewEventOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Event Details</DialogTitle>
            <DialogDescription>
              View details for this event
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">{viewedEvent.summary}</h3>
            <Badge>{viewedEvent.platform}</Badge>
          </div>
          
          {/* Use the shared form fields component in read-only mode */}
          <EventFormFields 
            formData={formattedEventData}
            readOnly={true}
          />
          
          {viewedEvent.ical_uid && (
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">iCal UID</p>
              <p className="mt-1 text-xs text-muted-foreground break-all">{viewedEvent.ical_uid}</p>
            </div>
          )}
          
          <DialogFooter className="mt-6">
            <Button 
              type="button" 
              variant="destructive" 
              onClick={() => setIsDeleteDialogOpen(true)}
              className="flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Delete Event
            </Button>
            <Button type="button" variant="outline" onClick={() => setIsViewEventOpen(false)}>
              Close
            </Button>
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
