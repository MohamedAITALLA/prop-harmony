
import React from 'react';

interface CalendarViewProps {
  events: Array<{
    id: string;
    title: string;
    start: string;
    end: string;
    allDay: boolean;
    resourceId: string;
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
}

export function CalendarView({ events, isLoading, view, onViewChange }: CalendarViewProps) {
  return (
    <div className="h-[600px] w-full">
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Calendar view implementation placeholder</p>
      </div>
    </div>
  );
}
