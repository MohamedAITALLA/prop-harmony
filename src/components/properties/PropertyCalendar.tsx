
import React, { useRef } from 'react';
import { Button } from "@/components/ui/button";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from "@fullcalendar/interaction";
import { Download, ChevronDown, Plus, ChevronLeft, ChevronRight, Copy, AlertTriangle } from "lucide-react";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Platform, EventType } from "@/types/enums";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface PropertyCalendarProps {
  events: any[];
  eventsLoading: boolean;
  onAddEvent: () => void;
  onExport: (format: string) => void;
  onEventClick?: (eventInfo: any) => void;
  onDateClick?: (dateInfo: any) => void;
  propertyId?: string;
  hasConflicts?: boolean;
  onViewConflicts?: () => void;
}

export const PropertyCalendar: React.FC<PropertyCalendarProps> = ({ 
  events, 
  eventsLoading, 
  onAddEvent, 
  onExport,
  onEventClick,
  onDateClick,
  propertyId,
  hasConflicts,
  onViewConflicts
}) => {
  const calendarRef = useRef(null);

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
    <div className="space-y-6">
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
          <Button onClick={onAddEvent}>
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
              <DropdownMenuItem onClick={() => onExport("PDF")}>
                Export as PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onExport("iCal")}>
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
              dateClick={(info) => {
                if (onDateClick) {
                  onDateClick(info);
                } else {
                  onAddEvent();
                }
              }}
              eventClick={(info) => {
                if (onEventClick) {
                  onEventClick(info);
                }
              }}
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
  );
};
