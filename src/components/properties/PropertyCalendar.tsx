
import React, { useState, useRef, useEffect } from 'react';
import { format, addMonths } from "date-fns";
import { toast } from "sonner";
import { CalendarEvent } from "@/types/api-responses";
import { Platform, EventType } from "@/types/enums";
import { getEventColor, createICalFeedUrl } from "@/components/properties/calendar/CalendarUtils";
import { EventDialogManager, EventDialogManagerRef } from '@/components/properties/calendar/EventDialogManager';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  AlertCircle, CalendarDays, List, BedDouble, Home, Filter, Plus, Download, X, Search,
  Check, CheckCircle2, Calendar, Clock
} from "lucide-react";
import { PlatformSelect } from "@/components/sync/PlatformSelect";
import { EventTypeSelect } from "@/components/events/EventTypeSelect";
import { DateRangeSelect } from "@/components/ui/date-range-select";
import { Badge } from "@/components/ui/badge";
import { DateRange } from "react-day-picker";
import { DatePicker } from "@/components/ui/date-picker";
import { Separator } from "@/components/ui/separator";
import calendarService from "@/services/calendar-service";
import { PropertyListView } from "@/components/properties/calendar/PropertyListView";
import { PropertyValidityCheck } from "@/components/properties/calendar/PropertyValidityCheck";
import { CalendarContainer } from '@/components/properties/calendar/CalendarContainer';

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
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([]);
  const [selectedEventTypes, setSelectedEventTypes] = useState<EventType[]>([]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [activeTab, setActiveTab] = useState("calendar");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState("month");
  
  const handleCalendarNavigation = (action: 'prev' | 'next' | 'today') => {
    if (action === 'prev') {
      setCurrentDate(prev => addMonths(prev, -1));
    } else if (action === 'next') {
      setCurrentDate(prev => addMonths(prev, 1));
    } else if (action === 'today') {
      setCurrentDate(new Date());
    }
  };
  
  const filteredEvents = events.filter(event => {
    // Filter by search query
    if (searchQuery && !event.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Filter by platforms
    if (selectedPlatforms.length > 0 && 
        !selectedPlatforms.includes(event.extendedProps?.platform as Platform)) {
      return false;
    }
    
    // Filter by event types
    if (selectedEventTypes.length > 0 && 
        !selectedEventTypes.includes(event.extendedProps?.event_type as EventType)) {
      return false;
    }
    
    // Filter by date range
    if (dateRange?.from) {
      const eventStart = new Date(event.start);
      if (eventStart < dateRange.from) {
        return false;
      }
    }
    
    if (dateRange?.to) {
      const eventEnd = new Date(event.end);
      if (eventEnd > dateRange.to) {
        return false;
      }
    }
    
    // If all filters pass, include the event
    return true;
  });
  
  const formattedEvents = filteredEvents.map(event => ({
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
    setSearchQuery("");
    refetchEvents();
    toast.info("Filters cleared");
  };
  
  const applyFilters = () => {
    // Apply filters directly to the UI (already done via the filteredEvents)
    toast.success("Filters applied");
  };

  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar filters - collapsible on mobile */}
        <div className="w-full lg:w-[260px] space-y-4">
          <Card>
            <CardHeader className="px-4 py-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Filter className="h-5 w-5" /> Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 py-2 space-y-5">
              <div className="relative w-full mb-4">
                <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search events..."
                  className="pl-8 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
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
                  <Check className="mr-2 h-4 w-4" />
                  Apply Filters
                </Button>
                
                {(selectedPlatforms.length > 0 || selectedEventTypes.length > 0 || dateRange?.from || searchQuery) && (
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
        
        {/* Main content area */}
        <div className="flex-1">
          <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-semibold">Property Calendar</h2>
              <p className="text-muted-foreground">Manage bookings and availability</p>
            </div>
            <div className="flex items-center gap-2">
              {hasConflicts && (
                <Button variant="destructive" onClick={onViewConflicts}>
                  <AlertCircle className="mr-2 h-4 w-4" /> View Conflicts
                </Button>
              )}
            </div>
          </div>
          
          <div className="mb-4 flex flex-wrap gap-2">
            <Button 
              variant={view === "month" ? "secondary" : "outline"}
              onClick={() => setView("month")}
            >
              Month
            </Button>
            <Button 
              variant={view === "week" ? "secondary" : "outline"}
              onClick={() => setView("week")}
            >
              Week
            </Button>
            <Button 
              variant={view === "day" ? "secondary" : "outline"}
              onClick={() => setView("day")}
            >
              Day
            </Button>
            <Button 
              variant={view === "list" ? "secondary" : "outline"}
              onClick={() => setView("list")}
            >
              List
            </Button>
            <Button 
              variant="default"
              onClick={() => handleCalendarNavigation('today')}
              size="sm"
            >
              Today
            </Button>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="calendar">
                <CalendarDays className="mr-2 h-4 w-4" /> Calendar
              </TabsTrigger>
              <TabsTrigger value="list">
                <List className="mr-2 h-4 w-4" /> List View
              </TabsTrigger>
              <TabsTrigger value="check">
                <CheckCircle2 className="mr-2 h-4 w-4" /> Check Validity
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="calendar" className="mt-4">
              <Card>
                <CardContent className="p-0 sm:p-6">
                  <CalendarContainer
                    events={formattedEvents}
                    eventsLoading={eventsLoading}
                    propertyId={propertyId}
                    onDateClick={handleDateClick}
                    onEventClick={handleEventClick}
                    onDateChange={setCurrentDate}
                    hasConflicts={hasConflicts}
                    onViewConflicts={onViewConflicts}
                    onAddEvent={() => eventDialogRef.current?.openAddEventDialog()}
                    onExport={handleExport}
                    copyICalFeedUrl={copyICalFeedUrl}
                    currentDate={currentDate}
                    handleCalendarNavigation={handleCalendarNavigation}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="list" className="mt-4">
              <PropertyListView 
                events={filteredEvents} 
                isLoading={eventsLoading} 
                propertyId={propertyId}
                onEventClick={handleEventClick}
                searchQuery={searchQuery}
              />
            </TabsContent>
            
            <TabsContent value="check" className="mt-4">
              <PropertyValidityCheck propertyId={propertyId} />
            </TabsContent>
          </Tabs>
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
