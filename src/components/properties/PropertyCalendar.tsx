
import React, { useState, useRef } from 'react';
import { format, addMonths, addWeeks, addDays } from "date-fns";
import { toast } from "sonner";
import { CalendarEvent } from "@/types/api-responses";
import { Platform, EventType } from "@/types/enums";
import { createICalFeedUrl } from "@/components/properties/calendar/CalendarUtils";
import { EventDialogManager, EventDialogManagerRef } from '@/components/properties/calendar/EventDialogManager';
import { Card } from "@/components/ui/card";
import { DateRange } from "react-day-picker";
import { CalendarSidebar } from '@/components/properties/calendar/CalendarSidebar';
import { CalendarTabsContent } from '@/components/properties/calendar/CalendarTabsContent';
import { useCalendarEvents } from '@/components/properties/calendar/useCalendarEvents';

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
  propertyName?: string;
}

export const PropertyCalendar: React.FC<PropertyCalendarProps> = ({ 
  events, 
  eventsLoading, 
  propertyId,
  onExport,
  hasConflicts,
  onViewConflicts,
  refetchEvents,
  propertyName
}) => {
  const eventDialogRef = useRef<EventDialogManagerRef>(null);
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([]);
  const [selectedEventTypes, setSelectedEventTypes] = useState<EventType[]>([]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [activeTab, setActiveTab] = useState("calendar");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState("month");
  
  const handleCalendarNavigation = (action: 'prev' | 'next' | 'today') => {
    if (action === 'today') {
      setCurrentDate(new Date());
      return;
    }
    
    // Handle different navigation based on the current view
    switch(view) {
      case 'month':
        setCurrentDate(prev => action === 'prev' ? addMonths(prev, -1) : addMonths(prev, 1));
        break;
      case 'week':
        setCurrentDate(prev => action === 'prev' ? addWeeks(prev, -1) : addWeeks(prev, 1));
        break;
      case 'day':
        setCurrentDate(prev => action === 'prev' ? addDays(prev, -1) : addDays(prev, 1));
        break;
      default:
        setCurrentDate(prev => action === 'prev' ? addMonths(prev, -1) : addMonths(prev, 1));
    }
  };

  const { filteredEvents, formattedEvents } = useCalendarEvents({
    events,
    searchQuery,
    selectedPlatforms,
    selectedEventTypes,
    dateRange
  });

  const handleDateClick = (info: any) => {
    const clickedDate = info.dateStr;
    const nextDay = new Date(new Date(clickedDate).getTime() + 24 * 60 * 60 * 1000);
    
    // Open add event dialog with pre-filled dates
    const startDate = `${clickedDate}T14:00`;
    const endDate = `${format(nextDay, 'yyyy-MM-dd')}T11:00`;
    
    if (eventDialogRef.current) {
      eventDialogRef.current.openAddEventDialog(startDate, endDate);
    }
  };

  const handleEventClick = (info: any) => {
    const eventId = info.event.id;
    const clickedEvent = events.find((e: any) => e.id === eventId);
    
    if (clickedEvent && eventDialogRef.current) {
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
      
      eventDialogRef.current.openViewEventDialog(formattedEvent as CalendarEvent);
    }
  };

  const handleExport = (format: string) => {
    if (onExport) {
      onExport(format);
    } else {
      toast.info(`Exporting calendar as ${format}...`);
    }
  };

  const copyICalFeedUrl = () => {
    if (propertyId) {
      const url = createICalFeedUrl(propertyId);
      navigator.clipboard.writeText(url);
      toast.success("iCal feed URL copied to clipboard");
    }
  };
  
  const clearFilters = () => {
    setSelectedPlatforms([]);
    setSelectedEventTypes([]);
    setDateRange(undefined);
    setSearchQuery("");
    refetchEvents();
    toast.info("Filters cleared");
  };

  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar filters - collapsible on mobile */}
        <CalendarSidebar
          selectedPlatforms={selectedPlatforms}
          setSelectedPlatforms={setSelectedPlatforms}
          selectedEventTypes={selectedEventTypes}
          setSelectedEventTypes={setSelectedEventTypes}
          dateRange={dateRange}
          setDateRange={setDateRange}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onClearFilters={clearFilters}
        />
        
        {/* Main content area */}
        <div className="flex-1">
          <CalendarTabsContent
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            events={filteredEvents}
            formattedEvents={formattedEvents}
            eventsLoading={eventsLoading}
            propertyId={propertyId}
            handleDateClick={handleDateClick}
            handleEventClick={handleEventClick}
            currentDate={currentDate}
            handleCalendarNavigation={handleCalendarNavigation}
            searchQuery={searchQuery}
            hasConflicts={hasConflicts}
            onAddEvent={() => eventDialogRef.current?.openAddEventDialog()}
            onExport={handleExport}
            copyICalFeedUrl={copyICalFeedUrl}
            setCurrentDate={setCurrentDate}
            view={view}
            setView={setView}
          />
        </div>
      </div>
      
      <EventDialogManager 
        ref={eventDialogRef}
        propertyId={propertyId}
        refetchEvents={refetchEvents}
      />
    </div>
  );
}
