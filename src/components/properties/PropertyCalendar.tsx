
import React, { useRef } from 'react';
import { Button } from "@/components/ui/button";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { Download, ChevronDown, Plus } from "lucide-react";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

interface PropertyCalendarProps {
  events: any[];
  eventsLoading: boolean;
  onAddEvent: () => void;
  onExport: (format: string) => void;
}

export const PropertyCalendar: React.FC<PropertyCalendarProps> = ({ 
  events, 
  eventsLoading, 
  onAddEvent, 
  onExport 
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Property Calendar</h2>
        <div className="flex space-x-2">
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
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <div className="border rounded-lg p-6 bg-background">
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => handleCalendarNavigation('prev')}>
              Previous
            </Button>
            <Button size="sm" variant="outline" onClick={() => handleCalendarNavigation('today')}>
              Today
            </Button>
            <Button size="sm" variant="outline" onClick={() => handleCalendarNavigation('next')}>
              Next
            </Button>
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
              plugins={[dayGridPlugin]}
              initialView="dayGridMonth"
              headerToolbar={false} // We're using our own header
              events={events}
              height="100%"
              eventTimeFormat={{
                hour: '2-digit',
                minute: '2-digit',
                meridiem: 'short'
              }}
              eventDisplay="block"
              dayMaxEvents={true}
            />
          </div>
        )}
      </div>
    </div>
  );
};
