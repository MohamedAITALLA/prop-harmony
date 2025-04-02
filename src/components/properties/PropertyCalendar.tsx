
import React, { useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from "@fullcalendar/interaction";
import { Download, ChevronDown, Plus, ChevronLeft, ChevronRight, Copy, AlertTriangle, FileText, Calendar as CalendarIcon } from "lucide-react";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Platform, EventType } from "@/types/enums";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { PropertyAvailabilityChecker } from './PropertyAvailabilityChecker';
import { CalendarEvent, EventResponse } from "@/types/api-responses";
import { format, parseISO } from "date-fns";
import { eventService } from "@/services/api-event-service";
import { PropertyEventDialog } from "./PropertyEventDialog";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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

  // Navigation methods for the calendar
  const handleCalendarNavigation = (action: 'prev' | 'next' | 'today') => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      if (action === 'prev') calendarApi.prev();
      if (action === 'next') calendarApi.next();
      if (action === 'today') calendarApi.today();
    }
  };
  
  // Get color based on platform and event type
  const getEventColor = (platform?: Platform, eventType?: EventType): string => {
    if (eventType === EventType.BLOCKED) return "#ef4444"; // Red for blocks
    if (eventType === EventType.MAINTENANCE) return "#f97316"; // Orange for maintenance
    
    // Different colors based on platform
    switch (platform) {
      case Platform.AIRBNB:
        return "#ff5a5f";
      case Platform.VRBO:
        return "#3b5998";
      case Platform.BOOKING:
        return "#003580";
      case Platform.MANUAL:
        return "#10b981";
      default:
        return "#6366f1";
    }
  };

  // Copy the iCal feed URL to clipboard
  const copyICalFeedUrl = () => {
    if (propertyId) {
      const baseUrl = window.location.origin;
      const url = `${baseUrl}/api/properties/${propertyId}/ical-feed`;
      navigator.clipboard.writeText(url);
      toast.success("iCal feed URL copied to clipboard");
    }
  };
  
  const handleInputChange = (field: string, value: string) => {
    setNewEvent(prev => ({ ...prev, [field]: value }));
  };

  const handleDateClick = (info: any) => {
    const clickedDate = info.dateStr;
    setNewEvent(prev => ({
      ...prev,
      property_id: propertyId,
      start_date: `${clickedDate}T14:00`,
      end_date: `${clickedDate}T11:00`
    }));
    setIsAddEventOpen(true);
  };

  const handleEventClick = (info: any) => {
    const eventId = info.event.id;
    const clickedEvent = events.find((e: any) => e.id === eventId);
    
    if (clickedEvent) {
      // Format the event data for viewing
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
      
      // Check if there are conflicts
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

  // Pre-process events to add color properties directly
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main calendar panel - takes up 2/3 of the space on large screens */}
      <div className="lg:col-span-2 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Property Calendar</h2>
          <div className="flex space-x-2">
            {hasConflicts && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="destructive" 
                      onClick={onViewConflicts}
                      className="flex items-center gap-1"
                    >
                      <AlertTriangle className="mr-1 h-4 w-4" />
                      View Conflicts
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>This property has booking conflicts that need attention</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            <Button onClick={() => setIsAddEventOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Event
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => onExport && onExport("PDF")}>
                  <FileText className="mr-2 h-4 w-4" />
                  Export as PDF
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onExport && onExport("iCal")}>
                  <Download className="mr-2 h-4 w-4" />
                  Export as iCal
                </DropdownMenuItem>
                {propertyId && (
                  <DropdownMenuItem onClick={copyICalFeedUrl}>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy iCal URL
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        <div className="border rounded-lg p-6 bg-background">
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => handleCalendarNavigation('prev')}>
                <ChevronLeft className="h-4 w-4 mr-1" /> Previous
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleCalendarNavigation('today')}>
                Today
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleCalendarNavigation('next')}>
                Next <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
            <div id="calendar-title" className="text-lg font-medium">
              {/* FullCalendar will update this with current month/year */}
            </div>
          </div>
          
          {eventsLoading ? (
            <div className="flex items-center justify-center h-80">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
              <p className="ml-3">Loading events...</p>
            </div>
          ) : (
            <div className="h-[600px]">
              <FullCalendar
                ref={calendarRef}
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                headerToolbar={false}
                events={eventsWithColors}
                height="100%"
                eventTimeFormat={{
                  hour: '2-digit',
                  minute: '2-digit',
                  meridiem: 'short'
                }}
                eventContent={(info) => {
                  return (
                    <div className="fc-event-main-frame p-1">
                      <div className="fc-event-title-container">
                        <div className="fc-event-title font-medium text-xs">
                          {info.event.title}
                        </div>
                        <div className="text-[10px] opacity-70">
                          {info.event.extendedProps.platform}
                        </div>
                      </div>
                    </div>
                  );
                }}
                dayMaxEvents={true}
                dateClick={handleDateClick}
                eventClick={handleEventClick}
                datesSet={(dateInfo) => {
                  // Update the calendar title
                  const titleEl = document.getElementById('calendar-title');
                  if (titleEl) {
                    titleEl.textContent = dateInfo.view.title;
                  }
                }}
              />
            </div>
          )}
        </div>
      </div>
      
      {/* Availability checker panel - takes 1/3 of the space on large screens */}
      <div className="lg:col-span-1 space-y-4">
        {propertyId && <PropertyAvailabilityChecker propertyId={propertyId} />}
      </div>

      {/* Add Event Dialog */}
      <PropertyEventDialog
        isOpen={isAddEventOpen}
        onOpenChange={setIsAddEventOpen}
        formData={newEvent}
        onInputChange={handleInputChange}
        onSubmit={handleSubmitEvent}
      />
      
      {/* View/Delete Event Dialog */}
      {viewedEvent && (
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
      )}
      
      {/* Conflict Dialog */}
      <Dialog open={isConflictDialogOpen} onOpenChange={setIsConflictDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle className="flex items-center text-red-600">
              <AlertTriangle className="mr-2 h-5 w-5" />
              Booking Conflict Detected
            </DialogTitle>
            <DialogDescription>
              Your new event conflicts with {conflictDetails?.conflicts_detected || 0} existing events.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <div className="p-3 bg-red-50 border border-red-100 rounded-md">
              <p>The event you're trying to create overlaps with existing bookings. Would you like to:</p>
              <ul className="mt-2 space-y-2 list-disc pl-4">
                <li>Proceed anyway (may cause double bookings)</li>
                <li>Cancel and edit the event dates</li>
                <li>View the conflicts in the property calendar</li>
              </ul>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsConflictDialogOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={() => {
                toast.success("Event created despite conflicts");
                setIsConflictDialogOpen(false);
                setIsAddEventOpen(false);
                refetchEvents();
                resetEventForm();
              }}
            >
              Create Anyway
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setIsConflictDialogOpen(false);
                if (onViewConflicts) onViewConflicts();
              }}
            >
              View Conflicts
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
