
import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { toast } from "sonner";
import { CalendarEvent } from "@/types/api-responses";
import { eventService } from "@/services/api-service";
import { useEventDialog } from '@/hooks/properties/useEventDialog';
import { AddEventDialog } from '@/components/properties/calendar/AddEventDialog';
import { ViewEventDialog } from '@/components/properties/calendar/ViewEventDialog';

interface EventDialogManagerProps {
  propertyId: string;
  refetchEvents: () => void;
}

export interface EventDialogManagerRef {
  openAddEventDialog: (startDate?: string, endDate?: string) => void;
  openViewEventDialog: (event: CalendarEvent) => void;
}

export const EventDialogManager = forwardRef<EventDialogManagerRef, EventDialogManagerProps>(
  ({ propertyId, refetchEvents }, ref) => {
    const [isAddEventOpen, setIsAddEventOpen] = useState(false);
    const [isViewEventOpen, setIsViewEventOpen] = useState(false);
    const [viewedEvent, setViewedEvent] = useState<CalendarEvent | null>(null);
    
    const {
      newEvent,
      setNewEvent,
      resetEventForm,
      handleInputChange,
      handleSubmitEvent,
    } = useEventDialog(propertyId, refetchEvents);

    useImperativeHandle(ref, () => ({
      openAddEventDialog: (startDate?: string, endDate?: string) => {
        if (startDate) {
          setNewEvent(prev => ({
            ...prev,
            start_date: startDate,
            end_date: endDate || ""
          }));
        }
        setIsAddEventOpen(true);
      },
      openViewEventDialog: (event: CalendarEvent) => {
        setViewedEvent(event);
        setIsViewEventOpen(true);
      }
    }));

    const handleDeleteEvent = async () => {
      if (!viewedEvent) return;
      
      try {
        await eventService.deleteEvent(propertyId, viewedEvent._id);
        toast.success("Event deleted successfully");
        setIsViewEventOpen(false);
        refetchEvents();
      } catch (error) {
        console.error("Error deleting event:", error);
        toast.error("Failed to delete event");
      }
    };

    const handleSubmit = async (e: React.FormEvent) => {
      const result = await handleSubmitEvent(e);
      if (result?.success) {
        setIsAddEventOpen(false);
        refetchEvents();
        resetEventForm();
      }
    };

    return (
      <>
        <AddEventDialog
          isOpen={isAddEventOpen}
          onOpenChange={setIsAddEventOpen}
          formData={newEvent}
          onInputChange={handleInputChange}
          onSubmit={handleSubmit}
        />
        
        {viewedEvent && (
          <ViewEventDialog
            isViewEventOpen={isViewEventOpen}
            setIsViewEventOpen={setIsViewEventOpen}
            viewedEvent={viewedEvent}
            handleDeleteEvent={handleDeleteEvent}
          />
        )}
      </>
    );
  }
);

EventDialogManager.displayName = 'EventDialogManager';
