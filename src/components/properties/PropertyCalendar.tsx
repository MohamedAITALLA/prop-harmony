
import React, { useState, useRef } from 'react';
import { format } from "date-fns";
import { toast } from "sonner";
import { CalendarEvent } from "@/types/api-responses";
import { Platform, EventType } from "@/types/enums";
import { getEventColor, createICalFeedUrl } from "@/components/properties/calendar/CalendarUtils";
import { EventDialogManager, EventDialogManagerRef } from '@/components/properties/calendar/EventDialogManager';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { CalendarView } from "@/components/calendar/CalendarView";
import {
  AlertCircle, CalendarDays, List, BedDouble, Home, Filter, Plus, Download, X
} from "lucide-react";
import { PlatformSelect } from "@/components/sync/PlatformSelect";
import { EventTypeSelect } from "@/components/events/EventTypeSelect";
import { DateRangeSelect } from "@/components/ui/date-range-select";
import { Badge } from "@/components/ui/badge";
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
  const eventDialogRef = useRef<EventDialogManagerRef>(null);
  const [view, setView] = useState("month");
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([]);
  const [selectedEventTypes, setSelectedEventTypes] = useState<EventType[]>([]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  
  const formattedEvents = events.map(event => ({
    id: event.id,
    title: event.title,
    start: event.start,
    end: event.end,
    allDay: true,
    resourceId: event.extendedProps?.property_id,
    extendedProps: {
      platform: event.extendedProps?.platform,
      event_type: event.extendedProps?.event_type,
      status: event.extendedProps?.status,
      description: event.extendedProps?.description
    }
  }));

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
    refetchEvents();
    toast.info("Filters cleared");
  };
  
  const applyFilters = () => {
    // In a real implementation, we would use the filters when fetching events
    refetchEvents();
    toast.info("Filters applied");
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="w-full lg:w-[260px] space-y-4">
        <Card>
          <CardHeader className="px-4 py-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Filter className="h-5 w-5" /> Filters
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 py-2 space-y-5">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Platforms</h3>
              <PlatformSelect
                selected={selectedPlatforms}
                onSelectionChange={setSelectedPlatforms}
              />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Event Types</h3>
              <EventTypeSelect
                selected={selectedEventTypes}
                onSelectionChange={setSelectedEventTypes}
              />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Date Range</h3>
              <DateRangeSelect
                dateRange={dateRange}
                onDateRangeChange={setDateRange}
              />
            </div>
            
            <div className="flex flex-col gap-2 mt-4">
              <Button 
                onClick={applyFilters}
                className="w-full"
              >
                Apply Filters
              </Button>
              
              {(selectedPlatforms.length > 0 || selectedEventTypes.length > 0 || dateRange?.from) && (
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={clearFilters}
                >
                  <X className="mr-2 h-4 w-4" /> Clear Filters
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="px-4 py-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Download className="h-5 w-5" /> Export
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 py-2 space-y-2">
            <Button variant="outline" className="w-full" onClick={() => handleExport('iCal')}>
              Export as iCal
            </Button>
            <Button variant="outline" className="w-full" onClick={() => handleExport('PDF')}>
              Export as PDF
            </Button>
            <Button variant="outline" className="w-full" onClick={copyICalFeedUrl}>
              Copy iCal Feed URL
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="px-4 py-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertCircle className="h-5 w-5" /> Legend
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 py-2 space-y-2">
            <div className="flex items-center gap-2">
              <Badge className="bg-[#ff5a5f]">
                <BedDouble className="h-3 w-3 mr-1" /> Airbnb
              </Badge>
              <span className="text-xs text-muted-foreground">Airbnb bookings</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge className="bg-[#003580]">
                <BedDouble className="h-3 w-3 mr-1" /> Booking
              </Badge>
              <span className="text-xs text-muted-foreground">Booking.com</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge className="bg-[#ef4444]">
                <Home className="h-3 w-3 mr-1" /> Blocked
              </Badge>
              <span className="text-xs text-muted-foreground">Property unavailable</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge className="bg-[#f97316]">
                <AlertCircle className="h-3 w-3 mr-1" /> Maintenance
              </Badge>
              <span className="text-xs text-muted-foreground">Repairs, cleaning</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex-1">
        <div className="mb-4 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-semibold">Property Calendar</h2>
            <p className="text-muted-foreground">Manage bookings and availability</p>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={() => eventDialogRef.current?.openAddEventDialog()}>
              <Plus className="mr-2 h-4 w-4" /> Add Event
            </Button>
            
            <Select value={view} onValueChange={setView}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Select view" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">Month</SelectItem>
                <SelectItem value="week">Week</SelectItem>
                <SelectItem value="day">Day</SelectItem>
                <SelectItem value="list">List</SelectItem>
              </SelectContent>
            </Select>
            
            {hasConflicts && (
              <Button variant="destructive" onClick={onViewConflicts}>
                <AlertCircle className="mr-2 h-4 w-4" /> View Conflicts
              </Button>
            )}
          </div>
        </div>
        
        <Tabs defaultValue="calendar" className="w-full">
          <TabsList>
            <TabsTrigger value="calendar">
              <CalendarDays className="mr-2 h-4 w-4" /> Calendar
            </TabsTrigger>
            <TabsTrigger value="list">
              <List className="mr-2 h-4 w-4" /> List View
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="calendar" className="mt-4">
            <Card>
              <CardContent className="p-0 sm:p-6">
                <CalendarView 
                  events={formattedEvents}
                  isLoading={eventsLoading}
                  view={view}
                  onViewChange={setView}
                  onEventClick={handleEventClick}
                  onDateClick={handleDateClick}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="list" className="mt-4">
            <Card>
              <CardContent className="p-6">
                <h3>List view coming soon...</h3>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      <EventDialogManager 
        ref={eventDialogRef}
        propertyId={propertyId}
        refetchEvents={refetchEvents}
      />
    </div>
  );
}
