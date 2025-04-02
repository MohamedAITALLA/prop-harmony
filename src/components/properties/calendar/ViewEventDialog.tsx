
import React from 'react';
import { Button } from "@/components/ui/button";
import { CalendarEvent } from "@/types/api-responses";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
  
  return (
    <Dialog open={isViewEventOpen} onOpenChange={setIsViewEventOpen}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Event Details</DialogTitle>
          <DialogDescription>
            View details for this event
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="flex justify-between">
              <h3 className="text-lg font-semibold">{viewedEvent.summary}</h3>
              <Badge>{viewedEvent.platform}</Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Start Date</p>
                <p>{format(new Date(viewedEvent.start_date), 'MMM dd, yyyy HH:mm')}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">End Date</p>
                <p>{format(new Date(viewedEvent.end_date), 'MMM dd, yyyy HH:mm')}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Type</p>
                <Badge variant="outline">{viewedEvent.event_type}</Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge variant="outline">{viewedEvent.status}</Badge>
              </div>
            </div>
            
            {viewedEvent.description && (
              <div>
                <p className="text-sm text-muted-foreground">Description</p>
                <p className="mt-1">{viewedEvent.description}</p>
              </div>
            )}
            
            {viewedEvent.ical_uid && (
              <div>
                <p className="text-sm text-muted-foreground">iCal UID</p>
                <p className="mt-1 text-xs text-muted-foreground break-all">{viewedEvent.ical_uid}</p>
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter>
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
