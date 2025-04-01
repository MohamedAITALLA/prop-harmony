
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Plus, Download, Filter, ChevronDown, Calendar as CalendarIcon 
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

const Calendar = () => {
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

  const properties = propertiesData?.data?.properties || [];

  // Handle form input changes
  const handleInputChange = (field: string, value: string) => {
    setNewEvent(prev => ({ ...prev, [field]: value }));
  };

  // Submit new event
  const handleSubmitEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // In a real implementation, we would call the API here
      // For now, we'll just simulate success
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

  // For now, we'll just render a placeholder for the calendar
  // In a real implementation, you would integrate a full-featured calendar library
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
      <Card className="min-h-[500px] flex items-center justify-center">
        <div className="text-center p-12">
          <CalendarIcon className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">Calendar View</h3>
          <p className="text-sm text-muted-foreground mt-2">
            This is a placeholder for the full calendar integration.<br />
            In a real application, you would integrate with a library like FullCalendar.
          </p>
        </div>
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
