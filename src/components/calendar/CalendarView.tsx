
import React, { useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { Platform, EventType } from '@/types/enums';

interface CalendarViewProps {
  events: Array<{
    id: string;
    title: string;
    start: string;
    end: string;
    allDay?: boolean;
    resourceId?: string;
    extendedProps: {
      platform: string;
      event_type: string;
      status: string;
      description: string;
    };
  }>;
  isLoading: boolean;
  view: string;
  onViewChange: (view: string) => void;
  onEventClick?: (eventInfo: any) => void;
  onDateClick?: (dateInfo: any) => void;
}

export function CalendarView({ 
  events, 
  isLoading, 
  view, 
  onViewChange, 
  onEventClick,
  onDateClick 
}: CalendarViewProps) {
  const calendarRef = useRef<any>(null);

  // Get color based on platform and event type
  const getEventColor = (platform?: string, eventType?: string): string => {
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[600px] w-full">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        <p className="ml-3">Loading calendar events...</p>
      </div>
    );
  }

  return (
    <div className="h-[600px] w-full">
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
        initialView={view === 'month' ? 'dayGridMonth' : view === 'week' ? 'timeGridWeek' : view === 'day' ? 'timeGridDay' : 'listMonth'}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth'
        }}
        events={eventsWithColors}
        eventTimeFormat={{
          hour: '2-digit',
          minute: '2-digit',
          meridiem: 'short'
        }}
        eventClick={onEventClick}
        dateClick={onDateClick}
        dayMaxEvents={true}
        aspectRatio={1.8}
        height="100%"
        eventContent={(info) => {
          const hasConflict = info.event.extendedProps.status === 'conflict';
          
          return (
            <div className={`fc-event-main-frame p-1 ${hasConflict ? 'border-l-4 border-red-500' : ''}`}>
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
        viewDidMount={(info) => {
          // When view changes, update the parent component's view state
          const viewName = info.view.type === 'dayGridMonth' ? 'month' :
                          info.view.type === 'timeGridWeek' ? 'week' :
                          info.view.type === 'timeGridDay' ? 'day' : 'list';
          onViewChange(viewName);
        }}
      />
    </div>
  );
}
