
import React, { useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { CalendarEvent } from "@/types/api-responses";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { EventFormFields } from "@/components/properties/calendar/EventFormFields";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

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
  
  return (
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
            onClick={handleDeleteEvent}
          >
            Delete Event
          </Button>
          <Button type="button" variant="outline" onClick={() => setIsViewEventOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
