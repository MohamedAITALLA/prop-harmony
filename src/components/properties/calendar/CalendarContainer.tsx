
import React from 'react';
import { CalendarHeader } from '@/components/properties/calendar/CalendarHeader';
import { CalendarNavigation } from '@/components/properties/calendar/CalendarNavigation';
import { FullCalendarWrapper } from '@/components/properties/calendar/FullCalendarWrapper';
import { getEventColor } from '@/components/properties/calendar/CalendarUtils';
import { Platform, EventType } from "@/types/enums";

interface CalendarContainerProps {
  events: any[];
  eventsLoading: boolean;
  propertyId: string;
  onDateClick: (info: any) => void;
  onEventClick: (info: any) => void;
  onDateChange: (date: Date) => void;
  hasConflicts?: boolean;
  onViewConflicts?: () => void;
  onAddEvent: () => void;
  onExport?: (format: string) => void;
  copyICalFeedUrl: () => void;
  currentDate: Date;
  handleCalendarNavigation: (action: 'prev' | 'next' | 'today') => void;
}

export const CalendarContainer: React.FC<CalendarContainerProps> = ({
  events,
  eventsLoading,
  propertyId,
  onDateClick,
  onEventClick,
  onDateChange,
  hasConflicts,
  onViewConflicts,
  onAddEvent,
  onExport,
  copyICalFeedUrl,
  currentDate,
  handleCalendarNavigation
}) => {
  return (
    <div className="lg:col-span-2 space-y-6">
      <CalendarHeader
        hasConflicts={hasConflicts}
        onViewConflicts={onViewConflicts}
        onAddEvent={onAddEvent}
        onExport={onExport}
        copyICalFeedUrl={copyICalFeedUrl}
        propertyId={propertyId}
      />
      
      <div className="border rounded-lg p-5 bg-card shadow-sm">
        <CalendarNavigation 
          currentDate={currentDate}
          handleCalendarNavigation={handleCalendarNavigation}
        />
        
        {eventsLoading ? (
          <div className="flex items-center justify-center h-80">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            <p className="ml-3 text-muted-foreground">Loading events...</p>
          </div>
        ) : (
          <FullCalendarWrapper
            events={events}
            eventsLoading={eventsLoading}
            handleDateClick={onDateClick}
            handleEventClick={onEventClick}
            getEventColor={getEventColor}
            onDateChange={onDateChange}
          />
        )}
      </div>
    </div>
  );
};
