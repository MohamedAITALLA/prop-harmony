import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CalendarView } from "@/components/calendar/CalendarView";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import {
  AlertCircle, CalendarDays, List, BedDouble, Home, Filter, Plus, Download, X
} from "lucide-react";
import { PropertySelect } from "@/components/properties/PropertySelect";
import { PlatformSelect } from "@/components/sync/PlatformSelect";
import { EventTypeSelect } from "@/components/events/EventTypeSelect";
import { DateRangeSelect } from "@/components/ui/date-range-select";
import { eventService } from "@/services/api-service";
import { Platform, EventType } from "@/types/enums";
import { CalendarEvent } from "@/types/api-responses";
import { convertToMongoIdFormat } from "@/lib/id-conversion";
import { DateRange } from "react-day-picker";

export default function Calendar() {
  const [view, setView] = useState("month");
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null);
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([]);
  const [selectedEventTypes, setSelectedEventTypes] = useState<EventType[]>([]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  
  const { data: events = [], isLoading } = useQuery({
    queryKey: ["calendar-events", selectedProperty, selectedPlatforms, selectedEventTypes, dateRange],
    queryFn: async () => {
      try {
        // This would be a real API call in a production app
        // const response = await eventService.getEvents(selectedProperty!, {
        //   platforms: selectedPlatforms,
        //   event_types: selectedEventTypes,
        //   start_date: dateRange.from?.toISOString(),
        //   end_date: dateRange.to?.toISOString()
        // });
        // return response.data;
        
        // For demonstration, we'll use mock data
        return convertToMongoIdFormat(getMockEvents());
      } catch (error) {
        console.error("Error fetching events:", error);
        return [];
      }
    },
  });
  
  const formattedEvents = events.map((event: CalendarEvent) => ({
    id: event._id,
    title: event.summary,
    start: event.start_date,
    end: event.end_date,
    allDay: true,
    resourceId: event.property_id,
    extendedProps: {
      platform: event.platform,
      event_type: event.event_type,
      status: event.status,
      description: event.description
    }
  }));
  
  const handleExport = (format: string) => {
    // In a real app, this would trigger an export process
    console.log(`Exporting calendar as ${format}`);
  };
  
  const clearFilters = () => {
    setSelectedPlatforms([]);
    setSelectedEventTypes([]);
    setDateRange(undefined);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
          <p className="text-muted-foreground">
            View and manage your property bookings and events
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => {}}>
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
        </div>
      </div>
      
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
                <h3 className="text-sm font-medium">Property</h3>
                <PropertySelect 
                  value={selectedProperty} 
                  onValueChange={setSelectedProperty} 
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
              
              {(selectedPlatforms.length > 0 || selectedEventTypes.length > 0 || dateRange?.from) && (
                <Button 
                  variant="ghost" 
                  className="w-full mt-4"
                  onClick={clearFilters}
                >
                  <X className="mr-2 h-4 w-4" /> Clear Filters
                </Button>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="px-4 py-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Download className="h-5 w-5" /> Export
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 py-2 space-y-2">
              <Button variant="outline" className="w-full" onClick={() => handleExport('ical')}>
                Export as iCal
              </Button>
              <Button variant="outline" className="w-full" onClick={() => handleExport('csv')}>
                Export as CSV
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
                <Badge className="bg-blue-500">
                  <BedDouble className="h-3 w-3 mr-1" /> Booking
                </Badge>
                <span className="text-xs text-muted-foreground">Guest reservations</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Badge className="bg-yellow-500">
                  <Home className="h-3 w-3 mr-1" /> Blocked
                </Badge>
                <span className="text-xs text-muted-foreground">Property unavailable</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Badge className="bg-red-500">
                  <AlertCircle className="h-3 w-3 mr-1" /> Maintenance
                </Badge>
                <span className="text-xs text-muted-foreground">Repairs, cleaning</span>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="flex-1">
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
                    isLoading={isLoading}
                    view={view}
                    onViewChange={setView}
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
      </div>
    </div>
  );
}

function getMockEvents() {
  return [
    {
      _id: "event-1",
      property_id: "prop-1",
      platform: Platform.AIRBNB,
      summary: "Summer Vacation",
      description: "Family of 4 from New York",
      start_date: "2023-07-10",
      end_date: "2023-07-17",
      event_type: EventType.BOOKING,
      status: "confirmed",
      ical_uid: "abc123",
      created_at: "2023-06-01T10:00:00Z",
      updated_at: "2023-06-01T10:00:00Z"
    },
    // ... keep existing code (other mock events)
  ];
}
