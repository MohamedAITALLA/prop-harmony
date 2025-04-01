
import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";
import { Plus, Filter, Search, Download, Trash2 } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { DateRange } from "react-day-picker";
import { CalendarRange } from "@/components/ui/calendar-range";
import { PlatformIcon } from "@/components/ui/platform-icon";
import { EventTypeBadge } from "@/components/ui/event-type-badge";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { propertyService, eventService } from "@/services/api-service";
import { Property, CalendarEvent } from "@/types/api-responses";
import { Platform, EventType, EventStatus } from "@/types/enums";

// Schema for event form validation
const eventSchema = z.object({
  property_id: z.string().min(1, "Property is required"),
  platform: z.string().min(1, "Platform is required"),
  summary: z.string().min(1, "Title is required"),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().min(1, "End date is required"),
  event_type: z.string().min(1, "Event type is required"),
  status: z.string().min(1, "Status is required"),
  description: z.string().optional(),
});

type EventFormValues = z.infer<typeof eventSchema>;

const EventManagement = () => {
  // State for event management
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<CalendarEvent | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProperties, setSelectedProperties] = useState<string[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [selectedEventTypes, setSelectedEventTypes] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [sortField, setSortField] = useState<string>("start_date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Form setup
  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      property_id: "",
      platform: Platform.MANUAL,
      summary: "",
      start_date: "",
      end_date: "",
      event_type: EventType.BOOKING,
      status: "confirmed",
      description: "",
    },
  });

  // Fetch properties
  const { data: propertiesData, isLoading: propertiesLoading } = useQuery({
    queryKey: ["properties"],
    queryFn: () => propertyService.getAllProperties(),
  });

  // Fetch events
  const { data: eventsData, isLoading: eventsLoading, refetch: refetchEvents } = useQuery({
    queryKey: ["events", selectedProperties, dateRange],
    queryFn: async () => {
      // If no properties selected, fetch all events
      if (selectedProperties.length === 0) {
        return { data: { events: [] } };
      }

      // Construct params
      const params: any = {};
      if (dateRange?.from) params.start_date = format(dateRange.from, "yyyy-MM-dd");
      if (dateRange?.to) params.end_date = format(dateRange.to, "yyyy-MM-dd");

      // For simplicity, we'll just fetch events for the first selected property
      // In a real app, you'd make multiple requests or have an endpoint that accepts multiple property IDs
      const propertyId = selectedProperties[0];
      const response = await eventService.getEvents(propertyId, params);
      return response;
    },
    enabled: selectedProperties.length > 0,
  });

  const properties = propertiesData?.data?.properties || [];
  const events = eventsData?.data?.events || [];

  // Apply filters and sorting to events
  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      // Apply search filter
      const matchesSearch = 
        !searchQuery || 
        event.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (event.property?.name && event.property.name.toLowerCase().includes(searchQuery.toLowerCase()));

      // Apply platform filter
      const matchesPlatform = 
        selectedPlatforms.length === 0 || 
        selectedPlatforms.includes(event.platform);

      // Apply event type filter
      const matchesEventType = 
        selectedEventTypes.length === 0 || 
        selectedEventTypes.includes(event.event_type);

      return matchesSearch && matchesPlatform && matchesEventType;
    }).sort((a, b) => {
      // Handle sorting
      let valueA, valueB;

      // Special case for property.name which is a nested property
      if (sortField === "property.name") {
        valueA = a.property?.name || "";
        valueB = b.property?.name || "";
      } else {
        valueA = a[sortField as keyof CalendarEvent];
        valueB = b[sortField as keyof CalendarEvent];
      }

      // Convert to lowercase if string
      if (typeof valueA === "string") valueA = valueA.toLowerCase();
      if (typeof valueB === "string") valueB = valueB.toLowerCase();

      if (sortDirection === "asc") {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });
  }, [events, searchQuery, selectedPlatforms, selectedEventTypes, sortField, sortDirection]);

  // Handle form submission
  const handleSubmit = async (data: EventFormValues) => {
    try {
      if (isEditMode && currentEvent) {
        // In a real app, we'd call an API to update the event
        console.log("Updating event:", data);
        toast.success("Event updated successfully");
      } else {
        // In a real app, we'd call an API to create the event
        console.log("Creating event:", data);
        toast.success("Event created successfully");
      }
      
      // Reset form and state
      setIsAddEventOpen(false);
      setIsEditMode(false);
      setCurrentEvent(null);
      form.reset();
      
      // Refetch events to get the latest data
      refetchEvents();
    } catch (error) {
      console.error("Error saving event:", error);
      toast.error("Failed to save event");
    }
  };

  // Handle edit event
  const handleEditEvent = (event: CalendarEvent) => {
    setIsEditMode(true);
    setCurrentEvent(event);
    
    // Convert dates to string format required by datetime-local input
    const startDate = event.start_date ? new Date(event.start_date) : new Date();
    const endDate = event.end_date ? new Date(event.end_date) : new Date();
    
    // Format for datetime-local input: YYYY-MM-DDThh:mm
    const formatDateForInput = (date: Date) => {
      return format(date, "yyyy-MM-dd'T'HH:mm");
    };
    
    // Set form values
    form.reset({
      property_id: event.property_id,
      platform: event.platform,
      summary: event.summary,
      start_date: formatDateForInput(startDate),
      end_date: formatDateForInput(endDate),
      event_type: event.event_type,
      status: event.status,
      description: event.description || "",
    });
    
    setIsAddEventOpen(true);
  };

  // Handle delete event
  const handleDeleteEvent = async (eventId: string) => {
    if (!window.confirm("Are you sure you want to delete this event?")) {
      return;
    }
    
    try {
      // In a real app, we'd call an API to delete the event
      console.log("Deleting event:", eventId);
      toast.success("Event deleted successfully");
      
      // Refetch events to get the latest data
      refetchEvents();
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("Failed to delete event");
    }
  };

  // Handle bulk delete
  const handleBulkDelete = async () => {
    if (selectedEvents.length === 0) {
      toast.error("No events selected");
      return;
    }
    
    if (!window.confirm(`Are you sure you want to delete ${selectedEvents.length} selected events?`)) {
      return;
    }
    
    try {
      // In a real app, we'd call an API to delete multiple events
      console.log("Deleting events:", selectedEvents);
      toast.success(`${selectedEvents.length} events deleted successfully`);
      
      // Clear selection and refetch events
      setSelectedEvents([]);
      refetchEvents();
    } catch (error) {
      console.error("Error deleting events:", error);
      toast.error("Failed to delete selected events");
    }
  };

  // Handle export
  const handleExport = (format: string) => {
    if (selectedEvents.length === 0) {
      toast.error("No events selected");
      return;
    }
    
    // In a real app, we'd generate and download the export file
    toast.success(`Exporting ${selectedEvents.length} events as ${format}`);
  };

  // Handle sorting
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Reset form when opening add event modal
  const handleOpenAddEvent = () => {
    setIsEditMode(false);
    setCurrentEvent(null);
    form.reset({
      property_id: "",
      platform: Platform.MANUAL,
      summary: "",
      start_date: "",
      end_date: "",
      event_type: EventType.BOOKING,
      status: "confirmed",
      description: "",
    });
    setIsAddEventOpen(true);
  };

  // Toggle event selection
  const toggleEventSelection = (eventId: string) => {
    setSelectedEvents(prev => 
      prev.includes(eventId) 
        ? prev.filter(id => id !== eventId) 
        : [...prev, eventId]
    );
  };

  // Toggle all events selection
  const toggleAllEvents = () => {
    if (selectedEvents.length === filteredEvents.length) {
      setSelectedEvents([]);
    } else {
      setSelectedEvents(filteredEvents.map(event => event.id));
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Event Management</h1>
        <Button onClick={handleOpenAddEvent}>
          <Plus className="mr-2 h-4 w-4" />
          Add Event
        </Button>
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
            <Select
              value={selectedProperties.length === 1 ? selectedProperties[0] : ""}
              onValueChange={(value) => setSelectedProperties([value])}
            >
              <SelectTrigger className="w-[180px]">
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
            
            <Select
              value={selectedPlatforms.length === 1 ? selectedPlatforms[0] : ""}
              onValueChange={(value) => setSelectedPlatforms(value ? [value] : [])}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Platforms</SelectItem>
                {Object.values(Platform).map((platform) => (
                  <SelectItem key={platform} value={platform}>
                    {platform}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select
              value={selectedEventTypes.length === 1 ? selectedEventTypes[0] : ""}
              onValueChange={(value) => setSelectedEventTypes(value ? [value] : [])}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Event Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Types</SelectItem>
                {Object.values(EventType).map((eventType) => (
                  <SelectItem key={eventType} value={eventType}>
                    {eventType}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <CalendarRange value={dateRange} onChange={setDateRange} />
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
                  <CalendarRange value={dateRange} onChange={setDateRange} />
                </div>
                
                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={() => {
                    setSelectedProperties([]);
                    setSelectedPlatforms([]);
                    setSelectedEventTypes([]);
                    setDateRange(undefined);
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
      
      {/* Search and Bulk Actions */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-grow max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-full"
          />
        </div>
        
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={handleBulkDelete} 
            disabled={selectedEvents.length === 0}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Selected
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                disabled={selectedEvents.length === 0}
              >
                <Download className="mr-2 h-4 w-4" />
                Export Selected
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleExport("CSV")}>
                Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("iCal")}>
                Export as iCal
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Events Table */}
      <Card>
        <div className="relative overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox 
                    checked={
                      filteredEvents.length > 0 && 
                      selectedEvents.length === filteredEvents.length
                    }
                    onCheckedChange={toggleAllEvents}
                    aria-label="Select all events"
                  />
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort("property.name")}
                >
                  Property
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort("platform")}
                >
                  Platform
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort("summary")}
                >
                  Title
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort("start_date")}
                >
                  Start Date
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort("end_date")}
                >
                  End Date
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort("event_type")}
                >
                  Type
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort("status")}
                >
                  Status
                </TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEvents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <Search className="h-8 w-8 text-muted-foreground" />
                      <p className="text-muted-foreground">No events found matching your filters</p>
                      <Button 
                        variant="link" 
                        onClick={() => {
                          setSearchQuery("");
                          setSelectedProperties([]);
                          setSelectedPlatforms([]);
                          setSelectedEventTypes([]);
                          setDateRange(undefined);
                        }}
                      >
                        Clear filters
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredEvents.map((event) => (
                  <TableRow key={event.id} className="hover:bg-muted/50">
                    <TableCell>
                      <Checkbox 
                        checked={selectedEvents.includes(event.id)} 
                        onCheckedChange={() => toggleEventSelection(event.id)}
                        aria-label="Select event"
                      />
                    </TableCell>
                    <TableCell>{event.property?.name || "Unknown Property"}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <PlatformIcon platform={event.platform} size={16} />
                        <span className="ml-1">{event.platform}</span>
                      </div>
                    </TableCell>
                    <TableCell>{event.summary}</TableCell>
                    <TableCell>
                      {event.start_date ? format(new Date(event.start_date), "MMM d, yyyy") : "N/A"}
                    </TableCell>
                    <TableCell>
                      {event.end_date ? format(new Date(event.end_date), "MMM d, yyyy") : "N/A"}
                    </TableCell>
                    <TableCell>
                      <EventTypeBadge eventType={event.event_type} />
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={event.status} />
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            ···
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditEvent(event)}>
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleDeleteEvent(event.id)}
                            className="text-destructive focus:text-destructive"
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
      
      {/* Add/Edit Event Dialog */}
      <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>{isEditMode ? "Edit Event" : "Add New Event"}</DialogTitle>
            <DialogDescription>
              {isEditMode 
                ? "Update the details for this event." 
                : "Create a new event for your property calendar."}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="property_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Property</FormLabel>
                    <Select 
                      value={field.value} 
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Property" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {properties.map((property) => (
                          <SelectItem key={property.id} value={property.id}>
                            {property.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="platform"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Platform</FormLabel>
                    <Select 
                      value={field.value} 
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Platform" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(Platform).map((platform) => (
                          <SelectItem key={platform} value={platform}>
                            {platform}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="summary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="start_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <FormControl>
                        <Input type="datetime-local" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="end_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date</FormLabel>
                      <FormControl>
                        <Input type="datetime-local" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="event_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Event Type</FormLabel>
                      <Select 
                        value={field.value} 
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Event Type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.values(EventType).map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select 
                        value={field.value} 
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.values(EventStatus).map((status) => (
                            <SelectItem key={status} value={status}>
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea rows={3} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddEventOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {isEditMode ? "Update Event" : "Create Event"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EventManagement;
