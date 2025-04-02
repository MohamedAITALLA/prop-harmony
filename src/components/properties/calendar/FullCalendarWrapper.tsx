
import React, { useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from "@fullcalendar/interaction";
import { AlertTriangle } from "lucide-react";
import { Platform, EventType } from "@/types/enums";

interface FullCalendarWrapperProps {
  events: any[];
  eventsLoading: boolean;
  handleDateClick: (info: any) => void;
  handleEventClick: (info: any) => void;
  getEventColor: (platform?: Platform, eventType?: EventType) => string;
  onDateChange: (date: Date) => void;
}

export const FullCalendarWrapper: React.FC<FullCalendarWrapperProps> = ({
  events,
  eventsLoading,
  handleDateClick,
  handleEventClick,
  getEventColor,
  onDateChange
}) => {
  const calendarRef = useRef<any>(null);

  // Pre-process events to add color properties
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
  
  if (eventsLoading) {
    return (
      <div className="flex items-center justify-center h-80">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        <p className="ml-3">Loading events...</p>
      </div>
    );
  }

  return (
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
          const hasConflict = info.event.extendedProps.status === 'conflict';
          
          return (
            <div className={`fc-event-main-frame p-1 ${hasConflict ? 'border-l-4 border-red-500' : ''}`}>
              <div className="fc-event-title-container">
                <div className="fc-event-title font-medium text-xs flex items-center gap-1">
                  {hasConflict && <AlertTriangle className="h-3 w-3" />}
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
          onDateChange(dateInfo.view.currentStart);
        }}
      />
    </div>
  );
};
