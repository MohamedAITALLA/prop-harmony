
import React, { useState, useRef, useEffect } from 'react';
import { format } from "date-fns";
import { toast } from "sonner";
import { CalendarEvent } from "@/types/api-responses";
import { Platform, EventType } from "@/types/enums";
import { getEventColor, createICalFeedUrl } from "@/components/properties/calendar/CalendarUtils";
import { CalendarContainer } from '@/components/properties/calendar/CalendarContainer';
import { PropertyAvailabilitySection } from '@/components/properties/calendar/PropertyAvailabilitySection';
import { EventDialogManager, EventDialogManagerRef } from '@/components/properties/calendar/EventDialogManager';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarRange } from "@/components/ui/calendar-range";
import { Button } from "@/components/ui/button";
import { Filter, X } from "lucide-react";
import { DateRange } from "react-day-picker";

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
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const eventDialogRef = useRef<EventDialogManagerRef>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [selectedEventTypes, setSelectedEventTypes] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  useEffect(() => {
    if (propertyId) {
      // Reset or initialize any property-specific state here if needed
    }
  }, [propertyId]);

  const handleCalendarNavigation = (action: 'prev' | 'next' | 'today') => {
    if (action === 'prev') {
      const newDate = new Date(currentDate);
      newDate.setMonth(newDate.getMonth() - 1);
      setCurrentDate(newDate);
    } else if (action === 'next') {
      const newDate = new Date(currentDate);
      newDate.setMonth(newDate.getMonth() + 1);
      setCurrentDate(newDate);
    } else if (action === 'today') {
      setCurrentDate(new Date());
    }
  };

  const copyICalFeedUrl = () => {
    if (propertyId) {
      const url = createICalFeedUrl(propertyId);
      navigator.clipboard.writeText(url);
      toast.success("iCal feed URL copied to clipboard");
    }
  };

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

  const applyFilters = () => {
    refetchEvents();
    // In a real implementation, we would pass the filters to the refetch function
    toast.info("Filters applied");
  };

  const clearFilters = () => {
    setSelectedPlatforms([]);
    setSelectedEventTypes([]);
    setDateRange(undefined);
    refetchEvents();
    toast.info("Filters cleared");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        {/* Filter section */}
        <div className="flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={() => setShowFilters(!showFilters)}
            className="shadow-sm"
          >
            <Filter className="mr-2 h-4 w-4" />
            Filters
            {(selectedPlatforms.length > 0 || selectedEventTypes.length > 0 || dateRange) && (
              <span className="ml-1 rounded-full bg-primary w-5 h-5 text-xs flex items-center justify-center text-primary-foreground">
                {(selectedPlatforms.length > 0 ? 1 : 0) + 
                 (selectedEventTypes.length > 0 ? 1 : 0) + 
                 (dateRange ? 1 : 0)}
              </span>
            )}
          </Button>
        </div>
        
        {showFilters && (
          <Card className="border">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>Filters</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <CardDescription>Filter events by platform, type, and date</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 grid-cols-1 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="platforms">Platforms</Label>
                <Select 
                  value={selectedPlatforms.length > 0 ? selectedPlatforms[0] : "all_platforms"}
                  onValueChange={(value) => {
                    setSelectedPlatforms(value === "all_platforms" ? [] : [value]);
                  }}
                >
                  <SelectTrigger id="platforms">
                    <SelectValue placeholder="All platforms" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all_platforms">All platforms</SelectItem>
                    <SelectItem value="Airbnb">Airbnb</SelectItem>
                    <SelectItem value="Booking">Booking.com</SelectItem>
                    <SelectItem value="Expedia">Expedia</SelectItem>
                    <SelectItem value="TripAdvisor">TripAdvisor</SelectItem>
                    <SelectItem value="Vrbo">Vrbo</SelectItem>
                    <SelectItem value="manual">Manual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="event-types">Event Types</Label>
                <Select
                  value={selectedEventTypes.length > 0 ? selectedEventTypes[0] : "all_types"}
                  onValueChange={(value) => {
                    setSelectedEventTypes(value === "all_types" ? [] : [value]);
                  }}
                >
                  <SelectTrigger id="event-types">
                    <SelectValue placeholder="All types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all_types">All types</SelectItem>
                    <SelectItem value="booking">Booking</SelectItem>
                    <SelectItem value="blocked">Blocked</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Date Range</Label>
                <CalendarRange 
                  value={dateRange} 
                  onChange={(value) => setDateRange(value)}
                />
              </div>
              
              <div className="col-span-1 sm:col-span-3 flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={clearFilters}>Clear Filters</Button>
                <Button onClick={applyFilters}>Apply Filters</Button>
              </div>
            </CardContent>
          </Card>
        )}
        
        <CalendarContainer 
          events={events}
          eventsLoading={eventsLoading}
          propertyId={propertyId}
          onDateClick={handleDateClick}
          onEventClick={handleEventClick}
          onDateChange={setCurrentDate}
          hasConflicts={hasConflicts}
          onViewConflicts={onViewConflicts}
          onAddEvent={() => eventDialogRef.current?.openAddEventDialog()}
          onExport={onExport}
          copyICalFeedUrl={copyICalFeedUrl}
          currentDate={currentDate}
          handleCalendarNavigation={handleCalendarNavigation}
        />
      </div>
      
      <PropertyAvailabilitySection 
        propertyId={propertyId}
        getEventColor={getEventColor}
      />

      <EventDialogManager 
        ref={eventDialogRef}
        propertyId={propertyId}
        refetchEvents={refetchEvents}
      />
    </div>
  );
}
