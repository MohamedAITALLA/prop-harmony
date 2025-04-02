
import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { toast } from "sonner";
import { CalendarEvent } from "@/types/api-responses";
import { Platform, EventType } from "@/types/enums";
import { eventService } from "@/services/api-service";
import { PropertyEventDialog } from '@/components/properties/PropertyEventDialog';
import { ViewEventDialog } from '@/components/properties/calendar/ViewEventDialog';
import { ConflictDialogs } from '@/components/properties/calendar/ConflictDialogs';

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
    const [hasSubmitConflict, setHasSubmitConflict] = useState(false);
    const [conflictDetails, setConflictDetails] = useState<any>(null);
    const [isConflictDialogOpen, setIsConflictDialogOpen] = useState(false);
    const [isConflictResolverOpen, setIsConflictResolverOpen] = useState(false);

    const [newEvent, setNewEvent] = useState({
      property_id: propertyId,
      platform: Platform.MANUAL,
      summary: "",
      start_date: "",
      end_date: "",
      event_type: EventType.BOOKING,
      status: "confirmed",
      description: ""
    });

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

    const resetEventForm = () => {
      setNewEvent({
        property_id: propertyId,
        platform: Platform.MANUAL,
        summary: "",
        start_date: "",
        end_date: "",
        event_type: EventType.BOOKING,
        status: "confirmed",
        description: ""
      });
    };

    const handleInputChange = (field: string, value: string) => {
      setNewEvent(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmitEvent = async (e: React.FormEvent) => {
      e.preventDefault();
      
      if (!newEvent.summary) {
        toast.error("Please enter a title for the event");
        return;
      }
      
      if (!newEvent.start_date || !newEvent.end_date) {
        toast.error("Please set both start and end dates");
        return;
      }
      
      try {
        const response = await eventService.createEvent(propertyId, {
          platform: newEvent.platform,
          summary: newEvent.summary,
          start_date: newEvent.start_date,
          end_date: newEvent.end_date,
          event_type: newEvent.event_type,
          status: newEvent.status,
          description: newEvent.description
        });
        
        if (response.meta?.conflicts_detected && response.meta.conflicts_detected > 0) {
          setHasSubmitConflict(true);
          setConflictDetails(response.meta);
          setIsConflictDialogOpen(true);
        } else {
          toast.success("Event created successfully");
          setIsAddEventOpen(false);
          refetchEvents();
          
          resetEventForm();
        }
      } catch (error) {
        console.error("Error creating event:", error);
        toast.error("Failed to create event");
      }
    };

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

    const handleResolveConflicts = () => {
      setIsConflictResolverOpen(true);
      setIsConflictDialogOpen(false);
    };

    const handleConflictResolution = () => {
      setIsConflictResolverOpen(false);
      refetchEvents();
    };

    // Calculate conflicting events
    const conflictingEvents = hasSubmitConflict && conflictDetails?.conflict_events
      ? conflictDetails.conflict_events.map((event: any) => ({
          id: event.id,
          platform: event.platform || 'Unknown',
          summary: event.summary,
          startDate: event.start_date,
          endDate: event.end_date
        }))
      : [];

    return (
      <>
        <PropertyEventDialog
          isOpen={isAddEventOpen}
          onOpenChange={setIsAddEventOpen}
          formData={newEvent}
          onInputChange={handleInputChange}
          onSubmit={handleSubmitEvent}
          title="Add New Event"
          description="Create a new event for this property"
          submitLabel="Create Event"
        />
        
        {viewedEvent && (
          <ViewEventDialog
            isViewEventOpen={isViewEventOpen}
            setIsViewEventOpen={setIsViewEventOpen}
            viewedEvent={viewedEvent}
            handleDeleteEvent={handleDeleteEvent}
          />
        )}
        
        <ConflictDialogs
          isConflictDialogOpen={isConflictDialogOpen}
          setIsConflictDialogOpen={setIsConflictDialogOpen}
          isConflictResolverOpen={isConflictResolverOpen}
          setIsConflictResolverOpen={setIsConflictResolverOpen}
          conflictDetails={conflictDetails}
          conflictingEvents={conflictingEvents}
          propertyId={propertyId}
          onResolveConflicts={handleResolveConflicts}
          onConflictResolution={handleConflictResolution}
          refetchEvents={refetchEvents}
          resetEventForm={resetEventForm}
          setIsAddEventOpen={setIsAddEventOpen}
        />
      </>
    );
  }
);

EventDialogManager.displayName = 'EventDialogManager';
