
import { useState } from 'react';
import { toast } from "sonner";
import { Platform, EventType } from "@/types/enums";
import { eventService } from "@/services/api-service";

export function useEventDialog(propertyId: string, refetchEvents: () => void) {
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

  const [hasSubmitConflict, setHasSubmitConflict] = useState(false);
  const [conflictDetails, setConflictDetails] = useState<any>(null);
  const [isConflictDialogOpen, setIsConflictDialogOpen] = useState(false);
  const [isConflictResolverOpen, setIsConflictResolverOpen] = useState(false);

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
        return;
      }
      
      toast.success("Event created successfully");
      return { success: true };
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error("Failed to create event");
      return { success: false, error };
    }
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

  return {
    newEvent,
    setNewEvent,
    hasSubmitConflict,
    conflictDetails,
    isConflictDialogOpen,
    setIsConflictDialogOpen,
    isConflictResolverOpen,
    setIsConflictResolverOpen,
    resetEventForm,
    handleInputChange,
    handleSubmitEvent,
    conflictingEvents
  };
}
