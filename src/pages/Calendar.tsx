
import React, { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Plus, Download, Filter, ChevronDown, Calendar as CalendarIcon, 
  ChevronLeft, ChevronRight 
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter 
} from "@/components/ui/dialog";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { toast } from "sonner";
import { CalendarRange } from "@/components/ui/calendar-range";
import { Property, CalendarEvent } from "@/types/api-responses";
import { PropertyType, Platform, EventType } from "@/types/enums";
import { propertyService, eventService } from "@/services/api-service";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

const Calendar = () => {
  const calendarRef = useRef(null);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [selectedProperties, setSelectedProperties] = useState<string[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([]);
  const [selectedEventTypes, setSelectedEventTypes] = useState<EventType[]>([]);
  const [dateRange, setDateRange] = useState<{ startDate: Date | null; endDate: Date | null }>({
    startDate: null,
    endDate: null,
  });
  
  const [newEvent, setNewEvent] = useState({
    property_id: "",
    platform: Platform.MANUAL,
    summary: "",
    start_date: "",
    end_date: "",
    event_type: EventType.BOOKING,
    status: "confirmed",
    description: ""
  });

  // Fetch properties
  const { data: propertiesData, isLoading: propertiesLoading } = useQuery({
    queryKey: ["properties"],
    queryFn: () => propertyService.getAllProperties(),
  });

  // Fetch all events across properties
  const { data: eventsData, isLoading: eventsLoading } = useQuery({
    queryKey: ["all-events", selectedProperties, selectedPlatforms, selectedEventTypes, dateRange],
    queryFn: async () => {
      try {
        // In a real implementation, we would call an API that fetches events
        // with filters applied. For demonstration purposes, we'll return mock data
        return [];
      } catch (error) {
        console.error("Error fetching events:", error);
        return [];
      }
    },
  });

  const properties = propertiesData?.data?.properties || [];

  // Format events for FullCalendar
  const formattedEvents = React.useMemo(() => {
    if (!eventsData) return [];
    
    return eventsData.map((event: CalendarEvent) => ({
      id: event.id,
      title: event.summary,
      start: event.start_date,
      end: event.end_date,
      backgroundColor: getEventColor(event.platform, event.event_type),
      borderColor: getEventColor(event.platform, event.event_type),
      extendedProps: {
        platform: event.platform,
        event_type: event.event_type,
        status: event.status,
        description: event.description
      }
    }));
  }, [eventsData]);

  // Get color based on platform and event type
  function getEventColor(platform: Platform, eventType: EventType): string {
    if (eventType === EventType.BLOCK) return "#ef4444"; // Red for blocks
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
  }

  // Handle form input changes
  const handleInputChange = (field: string, value: string) => {
    setNewEvent(prev => ({ ...prev, [field]: value }));
  };

  // Submit new event
  const handleSubmitEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      console.log("Creating event:", newEvent);
      toast.success("Event created successfully");
      setIsAddEventOpen(false);
      
      // Reset form
      setNewEvent({
        property_id: "",
        platform: Platform.MANUAL,
        summary: "",
        start_date: "",
        end_date: "",
        event_type: EventType.BOOKING,
        status: "confirmed",
        description: ""
      });
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error("Failed to create event");
    }
  };

  // Export functions
  const handleExport = (format: string) => {
    toast(`Exporting calendar as ${format}...`);
    // Implementation would depend on the export format
  };
  
  // Calendar navigation methods
  const handleCalendarNavigation = (action: 'prev' | 'next' | 'today') => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      if (action === 'prev') calendarApi.prev();
      if (action === 'next') calendarApi.next();
      if (action === 'today') calendarApi.today();
    }
  };
  
  // Handle date click
  const handleDateClick = (info: any) => {
    // Pre-fill the new event with the clicked date
    setNewEvent(prev => ({
      ...prev,
      start_date: info.dateStr,
      end_date: info.dateStr
    }));
    setIsAddEventOpen(true);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Unified Calendar</h1>
        <div className="flex space-x-2">
          <Button onClick={() => setIsAddEventOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Event
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleExport("PDF")}>
                Export as PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("iCal")}>
                Export as iCal
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Filters section */}
      <div className="flex justify-between items-center bg-background p-4 rounded-lg border">
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-muted-foreground" />
          <span className="font-medium">Filters</span>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Desktop filters */}
          <div className="hidden md:flex space-x-4">
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Properties" />
              </SelectTrigger>
              <SelectContent>
                {properties.map((property) => (
                  <SelectItem key={property.id} value={property.id}>
                    {property.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Platforms" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(Platform).map((platform) => (
                  <SelectItem key={platform} value={platform}>
                    {platform}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Event Types" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(EventType).map((eventType) => (
                  <SelectItem key={eventType} value={eventType}>
                    {eventType}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button variant="outline" className="flex items-center space-x-1">
              <CalendarIcon className="h-4 w-4" />
              <span>Date Range</span>
            </Button>
          </div>
          
          {/* Mobile filters button */}
          <Sheet open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="md:hidden">
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="py-4 space-y-6">
                <div className="space-y-2">
                  <Label>Properties</Label>
                  <div className="space-y-2">
                    {properties.map((property) => (
                      <div key={property.id} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`property-${property.id}`}
                          checked={selectedProperties.includes(property.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedProperties([...selectedProperties, property.id]);
                            } else {
                              setSelectedProperties(selectedProperties.filter(id => id !== property.id));
                            }
                          }}
                        />
                        <label 
                          htmlFor={`property-${property.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {property.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <Label>Platforms</Label>
                  <div className="space-y-2">
                    {Object.values(Platform).map((platform) => (
                      <div key={platform} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`platform-${platform}`}
                          checked={selectedPlatforms.includes(platform)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedPlatforms([...selectedPlatforms, platform]);
                            } else {
                              setSelectedPlatforms(selectedPlatforms.filter(p => p !== platform));
                            }
                          }}
                        />
                        <label 
                          htmlFor={`platform-${platform}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {platform}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <Label>Event Types</Label>
                  <div className="space-y-2">
                    {Object.values(EventType).map((eventType) => (
                      <div key={eventType} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`event-type-${eventType}`}
                          checked={selectedEventTypes.includes(eventType)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedEventTypes([...selectedEventTypes, eventType]);
                            } else {
                              setSelectedEventTypes(selectedEventTypes.filter(type => type !== eventType));
                            }
                          }}
                        />
                        <label 
                          htmlFor={`event-type-${eventType}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {eventType}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <Label>Date Range</Label>
                  <div className="p-2 border rounded-md">
                    {/* Simple date range picker placeholder */}
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs">Start</Label>
                        <Input type="date" />
                      </div>
                      <div>
                        <Label className="text-xs">End</Label>
                        <Input type="date" />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={() => {
                    setSelectedProperties([]);
                    setSelectedPlatforms([]);
                    setSelectedEventTypes([]);
                    setDateRange({ startDate: null, endDate: null });
                  }}>
                    Reset
                  </Button>
                  <Button onClick={() => setIsFiltersOpen(false)}>Apply Filters</Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      
      {/* Calendar view */}
      <Card className="p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => handleCalendarNavigation('prev')}>
              <ChevronLeft className="h-4 w-4 mr-2" /> Previous
            </Button>
            <Button size="sm" variant="outline" onClick={() => handleCalendarNavigation('today')}>
              Today
            </Button>
            <Button size="sm" variant="outline" onClick={() => handleCalendarNavigation('next')}>
              Next <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
          
          <div id="calendar-title" className="text-lg font-medium">
            {/* FullCalendar will update this with current month/year */}
          </div>
        </div>
        
        {eventsLoading ? (
          <div className="flex items-center justify-center h-80">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            <p className="ml-3">Loading events...</p>
          </div>
        ) : (
          <div className="h-[600px]">
            <FullCalendar
              ref={calendarRef}
              plugins={[dayGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              headerToolbar={false}
              events={formattedEvents}
              height="100%"
              eventTimeFormat={{
                hour: '2-digit',
                minute: '2-digit',
                meridiem: 'short'
              }}
              eventDisplay="block"
              dayMaxEvents={true}
              dateClick={handleDateClick}
              eventClick={(info) => {
                console.log("Event clicked:", info.event);
                // Could open an event details modal here
              }}
              datesSet={(dateInfo) => {
                // Update the calendar title
                const titleEl = document.getElementById('calendar-title');
                if (titleEl) {
                  titleEl.textContent = dateInfo.view.title;
                }
              }}
            />
          </div>
        )}
      </Card>
      
      {/* Add Event Dialog */}
      <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Add New Calendar Event</DialogTitle>
            <DialogDescription>
              Create a new event for your property calendar.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitEvent}>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="property">Property</Label>
                  <Select 
                    value={newEvent.property_id} 
                    onValueChange={(value) => handleInputChange("property_id", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Property" />
                    </SelectTrigger>
                    <SelectContent>
                      {properties.map((property) => (
                        <SelectItem key={property.id} value={property.id}>
                          {property.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="platform">Platform</Label>
                  <Select 
                    value={newEvent.platform} 
                    onValueChange={(value) => handleInputChange("platform", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Platform" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(Platform).map((platform) => (
                        <SelectItem key={platform} value={platform}>
                          {platform}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="summary">Title</Label>
                  <Input 
                    id="summary" 
                    value={newEvent.summary}
                    onChange={(e) => handleInputChange("summary", e.target.value)}
                    placeholder="Event title"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start_date">Start Date</Label>
                    <Input 
                      id="start_date" 
                      type="datetime-local"
                      value={newEvent.start_date}
                      onChange={(e) => handleInputChange("start_date", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end_date">End Date</Label>
                    <Input 
                      id="end_date" 
                      type="datetime-local"
                      value={newEvent.end_date}
                      onChange={(e) => handleInputChange("end_date", e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="event_type">Event Type</Label>
                    <Select 
                      value={newEvent.event_type} 
                      onValueChange={(value) => handleInputChange("event_type", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Event Type" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(EventType).map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select 
                      value={newEvent.status} 
                      onValueChange={(value) => handleInputChange("status", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                        <SelectItem value="tentative">Tentative</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    value={newEvent.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Add any additional details..."
                    rows={3}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddEventOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Create Event</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Calendar;
