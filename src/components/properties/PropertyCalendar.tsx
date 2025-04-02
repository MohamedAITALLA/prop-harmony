
import React, { useState, useEffect, useRef } from 'react';
import { format } from "date-fns";
import { toast } from "sonner";
import { CalendarEvent } from "@/types/api-responses";
import { Platform, EventType } from "@/types/enums";
import { eventService } from "@/services/api-service";
import { PropertyAvailabilityChecker } from '@/components/properties/PropertyAvailabilityChecker';
import { Button } from "@/components/ui/button";
import { 
  AlertTriangle, Plus, Download, ChevronDown, 
  FileText, Calendar as CalendarIcon, Copy,
  ChevronLeft, ChevronRight
} from "lucide-react";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import { EventLegend } from "@/components/properties/calendar/EventLegend";
import { CalendarHeader } from "@/components/properties/calendar/CalendarHeader";
import { CalendarNavigation } from "@/components/properties/calendar/CalendarNavigation";
import { FullCalendarWrapper } from "@/components/properties/calendar/FullCalendarWrapper";
import { ViewEventDialog } from "@/components/properties/calendar/ViewEventDialog";
import { PropertyEventDialog } from "@/components/properties/PropertyEventDialog";
import { ConflictDialogs } from "@/components/properties/calendar/ConflictDialogs";
import { getEventColor, createICalFeedUrl } from "@/components/properties/calendar/CalendarUtils";
import { ConflictResolver } from "@/components/ui/conflict-resolver";

interface PropertyCalendarProps {
  events: any[];
  eventsLoading: boolean;
  propertyId: string;
  onAddEvent?: () => void;
  onExport?: (format: string) => void;
  onEventClick?: (eventInfo: any) => void;
  onDateClick?: (dateInfo: any) => void;
  hasConflicts?: boolean;
  onViewConflicts?: () => void;
  refetchEvents: () => void;
}

export const PropertyCalendar: React.FC<PropertyCalendarProps> = ({ 
  events, 
  eventsLoading, 
  propertyId,
  onExport,
  hasConflicts,
  onViewConflicts,
  refetchEvents
}) => {
  const calendarRef = useRef<any>(null);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [isViewEventOpen, setIsViewEventOpen] = useState(false);
  const [viewedEvent, setViewedEvent] = useState<CalendarEvent | null>(null);
  const [hasSubmitConflict, setHasSubmitConflict] = useState(false);
  const [conflictDetails, setConflictDetails] = useState<any>(null);
  const [isConflictDialogOpen, setIsConflictDialogOpen] = useState(false);
  const [isConflictResolverOpen, setIsConflictResolverOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  
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
  
  useEffect(() => {
    if (propertyId) {
      resetEventForm();
    }
  }, [propertyId]);

  const handleCalendarNavigation = (action: 'prev' | 'next' | 'today') => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      if (action === 'prev') calendarApi.prev();
      if (action === 'next') calendarApi.next();
      if (action === 'today') calendarApi.today();
      
      setCurrentDate(calendarApi.getDate());
    }
  };

  const copyICalFeedUrl = () => {
    if (propertyId) {
      const url = createICalFeedUrl(propertyId);
      navigator.clipboard.writeText(url);
      toast.success("iCal feed URL copied to clipboard");
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setNewEvent(prev => ({ ...prev, [field]: value }));
  };

  const handleDateClick = (info: any) => {
    const clickedDate = info.dateStr;
    const nextDay = new Date(new Date(clickedDate).getTime() + 24 * 60 * 60 * 1000);
    
    setNewEvent(prev => ({
      ...prev,
      property_id: propertyId,
      start_date: `${clickedDate}T14:00`,
      end_date: `${format(nextDay, 'yyyy-MM-dd')}T11:00`
    }));
    setIsAddEventOpen(true);
  };

  const handleEventClick = (info: any) => {
    const eventId = info.event.id;
    const clickedEvent = events.find((e: any) => e.id === eventId);
    
    if (clickedEvent) {
      const formattedEvent = {
        _id: clickedEvent.id,
        property_id: clickedEvent.extendedProps.property_id || propertyId,
        platform: clickedEvent.extendedProps.platform,
        summary: clickedEvent.title,
        description: clickedEvent.extendedProps.description || "",
        start_date: clickedEvent.start,
        end_date: clickedEvent.end,
        event_type: clickedEvent.extendedProps.event_type,
        status: clickedEvent.extendedProps.status || "confirmed",
        created_at: clickedEvent.extendedProps.created_at || "",
        updated_at: clickedEvent.extendedProps.updated_at || "",
        ical_uid: clickedEvent.extendedProps.ical_uid || ""
      };
      
      setViewedEvent(formattedEvent as CalendarEvent);
      setIsViewEventOpen(true);
    }
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

  const handleResolveConflicts = async () => {
    setIsConflictResolverOpen(true);
    setIsConflictDialogOpen(false);
  };

  const handleConflictResolution = async () => {
    setIsConflictResolverOpen(false);
    refetchEvents();
  };

  const eventsWithColors = events.map(event => {
    const platform = event.extendedProps?.platform;
    const eventType = event.extendedProps?.event_type;
    const color = getEventColor(platform, eventType);
    
    return {
      ...event,
      backgroundColor: color,
      borderColor: color
    };
  });

  const conflictingEvents = events
    .filter(event => event.extendedProps?.status === 'conflict' || 
           (hasSubmitConflict && conflictDetails?.conflict_events))
    .map(event => ({
      id: event.id,
      platform: event.extendedProps?.platform || 'Unknown',
      summary: event.title,
      startDate: event.start,
      endDate: event.end
    }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <CalendarHeader
          hasConflicts={hasConflicts}
          onViewConflicts={onViewConflicts}
          onAddEvent={() => setIsAddEventOpen(true)}
          onExport={onExport}
          copyICalFeedUrl={copyICalFeedUrl}
          propertyId={propertyId}
        />
        
        <div className="border rounded-lg p-6 bg-background">
          <CalendarNavigation 
            currentDate={currentDate}
            handleCalendarNavigation={handleCalendarNavigation}
          />
          
          {eventsLoading ? (
            <div className="flex items-center justify-center h-80">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
              <p className="ml-3">Loading events...</p>
            </div>
          ) : (
            <FullCalendarWrapper
              events={eventsWithColors}
              eventsLoading={eventsLoading}
              handleDateClick={handleDateClick}
              handleEventClick={handleEventClick}
              getEventColor={getEventColor}
              onDateChange={setCurrentDate}
            />
          )}
        </div>
      </div>
      
      <div className="lg:col-span-1 space-y-4">
        {propertyId && <PropertyAvailabilityChecker propertyId={propertyId} />}
        
        <EventLegend getEventColor={getEventColor} />
      </div>

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
      
      <Dialog open={isConflictResolverOpen} onOpenChange={setIsConflictResolverOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Resolve Booking Conflict</DialogTitle>
            <DialogDescription>
              Please choose how to resolve this booking conflict
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-2">
            <ConflictResolver
              conflictId="current-conflict"
              propertyId={propertyId}
              events={conflictingEvents}
              onResolve={handleConflictResolution}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
