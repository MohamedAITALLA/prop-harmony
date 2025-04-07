
import React, { useRef, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from "@fullcalendar/interaction";
import { AlertTriangle } from "lucide-react";
import { Platform, EventType } from "@/types/enums";
import { cn } from "@/lib/utils";
import { PlatformIcon } from '@/components/ui/platform-icon';

interface FullCalendarWrapperProps {
  events: any[];
  eventsLoading: boolean;
  handleDateClick: (info: any) => void;
  handleEventClick: (info: any) => void;
  getEventColor: (platform?: Platform, eventType?: EventType) => string;
  onDateChange: (date: Date) => void;
  currentDate?: Date;
  view?: string;
}

export const FullCalendarWrapper: React.FC<FullCalendarWrapperProps> = ({
  events,
  eventsLoading,
  handleDateClick,
  handleEventClick,
  getEventColor,
  onDateChange,
  currentDate,
  view = 'month'
}) => {
  const calendarRef = useRef<any>(null);
  
  // Update calendar date when currentDate changes externally
  useEffect(() => {
    if (currentDate && calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.gotoDate(currentDate);
    }
  }, [currentDate]);
  
  // Update calendar view when view changes externally
  useEffect(() => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      const calendarView = view === 'month' ? 'dayGridMonth' : 
                          view === 'week' ? 'timeGridWeek' : 
                          view === 'day' ? 'timeGridDay' : 
                          'listWeek';
      calendarApi.changeView(calendarView);
    }
  }, [view]);

  // Pre-process events to add color properties
  const eventsWithColors = events.map(event => {
    const platform = event.extendedProps?.platform;
    const eventType = event.extendedProps?.event_type;
    const color = getEventColor(platform as Platform, eventType as EventType);
    
    return {
      ...event,
      backgroundColor: color,
      borderColor: color,
      textColor: "#ffffff",
      classNames: ['calendar-event', `platform-${platform?.toLowerCase() || 'default'}`]
    };
  });
  
  if (eventsLoading) {
    return (
      <div className="flex items-center justify-center h-80">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        <p className="ml-3 text-muted-foreground">Loading events...</p>
      </div>
    );
  }

  return (
    <div className="h-[600px] calendar-container">
      <style dangerouslySetInnerHTML={{ __html: `
        .fc .fc-daygrid-day {
          transition: background-color 0.2s;
        }
        
        .fc .fc-daygrid-day:hover {
          background-color: rgba(99, 102, 241, 0.05);
        }
        
        .fc .fc-daygrid-day.fc-day-today {
          background-color: rgba(99, 102, 241, 0.1);
          font-weight: bold;
        }
        
        .fc .fc-event {
          border-radius: 4px;
          border-width: 0;
          box-shadow: 0 1px 2px rgba(0,0,0,0.1);
          overflow: hidden;
          margin: 1px 0;
          cursor: pointer;
          transition: transform 0.1s, box-shadow 0.1s;
        }
        
        .fc .fc-event:hover {
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgba(0,0,0,0.15);
        }
        
        .fc-theme-standard .fc-scrollgrid {
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid hsl(var(--border));
        }
        
        .fc-theme-standard td, .fc-theme-standard th {
          border-color: hsl(var(--border));
        }
        
        .fc-daygrid-event-dot {
          display: none;
        }
        
        .fc-event-title {
          font-weight: 500;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          padding: 0 4px;
        }
        
        .fc .fc-daygrid-event {
          z-index: 2;
        }

        /* Platform-specific colors */
        .platform-airbnb {
          border-left: 3px solid #ff5a5f !important;
        }
        
        .platform-booking {
          border-left: 3px solid #003580 !important;
        }
        
        .platform-vrbo {
          border-left: 3px solid #3b5998 !important;
        }
        
        .platform-expedia {
          border-left: 3px solid #ffc439 !important;
        }
        
        .platform-tripadvisor {
          border-left: 3px solid #00aa6c !important;
        }
        
        .platform-manual {
          border-left: 3px solid #10b981 !important;
        }

        /* Responsive adjustments */
        @media (max-width: 640px) {
          .fc-toolbar-title {
            font-size: 1rem !important;
          }
          
          .fc-header-toolbar {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
          }
          
          .fc .fc-toolbar-title {
            margin: 0;
          }
        }
      `}} />
      
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
        initialView={view === 'month' ? 'dayGridMonth' : 
                    view === 'week' ? 'timeGridWeek' : 
                    view === 'day' ? 'timeGridDay' : 
                    'listWeek'}
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
          const platform = info.event.extendedProps.platform || '';
          
          return (
            <div className={cn(
              'fc-event-main-frame p-1',
              hasConflict && 'border-l-4 border-red-500'
            )}>
              <div className="fc-event-title-container">
                <div className="fc-event-title font-medium text-xs flex items-center gap-1">
                  {hasConflict && <AlertTriangle className="h-3 w-3 flex-shrink-0" />}
                  <span className="truncate">{info.event.title}</span>
                </div>
                <div className="text-[10px] opacity-90 truncate flex items-center gap-1">
                  <PlatformIcon platform={platform} size={10} />
                  <span>{platform}</span>
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
        displayEventTime={view !== 'month'}
        eventDisplay="block"
        firstDay={1}
        initialDate={currentDate}
        nowIndicator={true}
        slotMinTime="06:00:00"
        slotMaxTime="22:00:00"
        slotDuration="00:30:00"
        expandRows={true}
        allDaySlot={true}
      />
    </div>
  );
};
