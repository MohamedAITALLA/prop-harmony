
import React, { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Plus, Download, Filter, ChevronDown, X,
  ChevronLeft, ChevronRight 
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter 
} from "@/components/ui/dialog";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Popover, PopoverContent, PopoverTrigger 
} from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { DateRange } from "@/components/ui/date-range";
import { Property, CalendarEvent } from "@/types/api-responses";
import { PropertyType, Platform, EventType } from "@/types/enums";
import { propertyService, eventService } from "@/services/api-service";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

const Calendar = () => {
  const calendarRef = useRef(null);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [selectedProperties, setSelectedProperties] = useState<string[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([]);
  const [selectedEventTypes, setSelectedEventTypes] = useState<EventType[]>([]);
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined
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
    
    return eventsData.map((event: CalendarEvent) => {
      const color = getEventColor(event.platform, event.event_type);
      
      return {
        id: event.id,
        title: event.summary,
        start: event.start_date,
        end: event.end_date,
        backgroundColor: color,
        borderColor: color,
        extendedProps: {
          platform: event.platform,
          event_type: event.event_type,
          status: event.status,
          description: event.description
        }
      };
    });
  }, [eventsData]);

  // Get color based on platform and event type
  function getEventColor(platform: Platform, eventType: EventType): string {
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

  const handlePropertySelect = (propertyId: string) => {
    setSelectedProperties(prev => 
      prev.includes(propertyId) 
        ? prev.filter(p => p !== propertyId) 
        : [...prev, propertyId]
    );
  };

  const handlePlatformSelect = (platform: Platform) => {
    setSelectedPlatforms(prev => 
      prev.includes(platform) 
        ? prev.filter(p => p !== platform) 
        : [...prev, platform]
    );
  };

  const handleEventTypeSelect = (eventType: EventType) => {
    setSelectedEventTypes(prev => 
      prev.includes(eventType) 
        ? prev.filter(t => t !== eventType) 
        : [...prev, eventType]
    );
  };

  const clearFilters = () => {
    setSelectedProperties([]);
    setSelectedPlatforms([]);
    setSelectedEventTypes([]);
    setDateRange({ from: undefined, to: undefined });
  };

  const handleDateRangeChange = (range: { from: Date | undefined; to: Date | undefined }) => {
    setDateRange(range);
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
      <div className="flex flex-wrap gap-2 p-4 border rounded-md bg-background mb-4">
        <div className="flex items-center mr-4">
          <Filter className="h-5 w-5 text-muted-foreground mr-2" />
          <span className="font-medium">Filters:</span>
        </div>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-8">
              Properties
              {selectedProperties.length > 0 && (
                <Badge className="ml-2" variant="secondary">{selectedProperties.length}</Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[250px] p-0">
            <div className="p-2 space-y-1 max-h-[250px] overflow-y-auto">
              {properties.map((property) => (
                <div key={property.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`property-${property.id}`}
                    checked={selectedProperties.includes(property.id)}
                    onChange={() => handlePropertySelect(property.id)}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor={`property-${property.id}`} className="text-sm">
                    {property.name}
                  </label>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-8">
              Platforms
              {selectedPlatforms.length > 0 && (
                <Badge className="ml-2" variant="secondary">{selectedPlatforms.length}</Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <div className="p-2 space-y-1">
              {Object.values(Platform).map((platform) => (
                <div key={platform} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`platform-${platform}`}
                    checked={selectedPlatforms.includes(platform)}
                    onChange={() => handlePlatformSelect(platform)}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor={`platform-${platform}`} className="text-sm">
                    {platform}
                  </label>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-8">
              Event Types
              {selectedEventTypes.length > 0 && (
                <Badge className="ml-2" variant="secondary">{selectedEventTypes.length}</Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <div className="p-2 space-y-1">
              {Object.values(EventType).map((eventType) => (
                <div key={eventType} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`eventType-${eventType}`}
                    checked={selectedEventTypes.includes(eventType)}
                    onChange={() => handleEventTypeSelect(eventType)}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor={`eventType-${eventType}`} className="text-sm">
                    {eventType}
                  </label>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>
        
        <DateRange
          className="h-8"
          value={dateRange}
          onChange={handleDateRangeChange}
        />
        
        {(selectedProperties.length > 0 || selectedPlatforms.length > 0 || selectedEventTypes.length > 0 || dateRange.from) && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8" 
            onClick={clearFilters}
          >
            <X className="mr-1 h-4 w-4" />
            Clear
          </Button>
        )}
      </div>
      
      {/* Active Filters */}
      {(selectedProperties.length > 0 || selectedPlatforms.length > 0 || selectedEventTypes.length > 0 || dateRange.from) && (
        <div className="flex flex-wrap gap-2 mb-4">
          {selectedProperties.map(propertyId => {
            const property = properties.find(p => p.id === propertyId);
            return (
              <Badge key={propertyId} variant="secondary" className="flex items-center gap-1">
                {property?.name || propertyId}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => setSelectedProperties(prev => prev.filter(p => p !== propertyId))}
                />
              </Badge>
            );
          })}
          
          {selectedPlatforms.map(platform => (
            <Badge key={platform} variant="secondary" className="flex items-center gap-1">
              {platform}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => setSelectedPlatforms(prev => prev.filter(p => p !== platform))}
              />
            </Badge>
          ))}
          
          {selectedEventTypes.map(eventType => (
            <Badge key={eventType} variant="secondary" className="flex items-center gap-1">
              {eventType}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => setSelectedEventTypes(prev => prev.filter(t => t !== eventType))}
              />
            </Badge>
          ))}
          
          {dateRange.from && dateRange.to && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {dateRange.from.toLocaleDateString()} - {dateRange.to.toLocaleDateString()}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => setDateRange({ from: undefined, to: undefined })}
              />
            </Badge>
          )}
        </div>
      )}
      
      {/* Calendar view */}
      <Card className="p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => handleCalendarNavigation('prev')}>
              <ChevronLeft className="h-4 w-4 mr-1" /> Previous
            </Button>
            <Button size="sm" variant="outline" onClick={() => handleCalendarNavigation('today')}>
              Today
            </Button>
            <Button size="sm" variant="outline" onClick={() => handleCalendarNavigation('next')}>
              Next <ChevronRight className="h-4 w-4 ml-1" />
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
              eventContent={(info) => {
                return (
                  <div className="fc-event-main-frame p-1">
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
