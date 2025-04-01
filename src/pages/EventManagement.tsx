import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CalendarEvent, Property } from "@/types/api-responses";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarRange } from "@/components/ui/calendar-range";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Plus, MoreVertical, Download, Filter, X } from "lucide-react";
import { propertyService, eventService } from "@/services/api-service";
import { EventTypeBadge } from "@/components/ui/event-type-badge";
import { format, parseISO } from "date-fns";
import { DateRange as DateRangeType } from "react-day-picker";
import { convertToMongoIdFormat } from "@/lib/id-conversion";

export default function EventManagement() {
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [selectedProperties, setSelectedProperties] = useState<string[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [selectedEventTypes, setSelectedEventTypes] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<DateRangeType | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  
  const { data: properties = [] } = useQuery({
    queryKey: ["properties"],
    queryFn: async () => {
      try {
        const response = await propertyService.getAllProperties();
        return response.data.properties;
      } catch (error) {
        console.error("Error fetching properties:", error);
        return convertToMongoIdFormat(getMockProperties());
      }
    },
  });
  
  const { data: eventsData = [], isLoading } = useQuery({
    queryKey: ["events", selectedProperties, selectedPlatforms, selectedEventTypes, dateRange],
    queryFn: async () => {
      try {
        return { events: convertToMongoIdFormat(getMockEvents()) };
      } catch (error) {
        console.error("Error fetching events:", error);
        return { events: [] };
      }
    },
  });
  
  const events = Array.isArray(eventsData) ? eventsData : eventsData.events || [];
  
  const filteredEvents = events.filter(event => 
    event.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.property?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.platform.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Event Management</h1>
          <p className="text-muted-foreground">
            Create and manage events across properties
          </p>
        </div>
        
        <Button onClick={() => setIsAddEventOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Event
        </Button>
      </div>
      
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search events..."
              className="pl-8 w-full sm:w-[300px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
              <Filter className="mr-2 h-4 w-4" />
              Filters
              {(selectedProperties.length > 0 || selectedPlatforms.length > 0 || selectedEventTypes.length > 0) && (
                <span className="ml-1 rounded-full bg-primary w-5 h-5 text-xs flex items-center justify-center text-primary-foreground">
                  {selectedProperties.length + selectedPlatforms.length + selectedEventTypes.length}
                </span>
              )}
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Export as CSV</DropdownMenuItem>
                <DropdownMenuItem>Export as iCal</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
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
              <CardDescription>Filter events by property, platform, type, and date</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <Label htmlFor="properties">Properties</Label>
                <Select>
                  <SelectTrigger id="properties">
                    <SelectValue placeholder="All properties" />
                  </SelectTrigger>
                  <SelectContent>
                    {properties.map((property: Property) => (
                      <SelectItem key={property._id} value={property._id}>
                        {property.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="platforms">Platforms</Label>
                <Select>
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
                <Select>
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
            </CardContent>
          </Card>
        )}
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox aria-label="Select all" />
                </TableHead>
                <TableHead>Property</TableHead>
                <TableHead>Platform</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-10">Loading events...</TableCell>
                </TableRow>
              ) : filteredEvents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-10">No events found</TableCell>
                </TableRow>
              ) : (
                filteredEvents.map((event) => (
                  <TableRow key={event._id}>
                    <TableCell>
                      <Checkbox aria-label={`Select ${event.summary}`} />
                    </TableCell>
                    <TableCell>{event.property?.name}</TableCell>
                    <TableCell>{event.platform}</TableCell>
                    <TableCell>{event.summary}</TableCell>
                    <TableCell>{format(parseISO(event.start_date), 'MMM d, yyyy')}</TableCell>
                    <TableCell>{format(parseISO(event.end_date), 'MMM d, yyyy')}</TableCell>
                    <TableCell>
                      <EventTypeBadge eventType={event.event_type} />
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        event.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                        event.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {event.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View</DropdownMenuItem>
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      
      <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Event</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="property">Property</Label>
              <Select>
                <SelectTrigger id="property">
                  <SelectValue placeholder="Select property" />
                </SelectTrigger>
                <SelectContent>
                  {properties.map((property: Property) => (
                    <SelectItem key={property._id} value={property._id}>
                      {property.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="platform">Platform</Label>
              <Select defaultValue="manual">
                <SelectTrigger id="platform">
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Airbnb">Airbnb</SelectItem>
                  <SelectItem value="Booking">Booking.com</SelectItem>
                  <SelectItem value="Expedia">Expedia</SelectItem>
                  <SelectItem value="TripAdvisor">TripAdvisor</SelectItem>
                  <SelectItem value="Vrbo">Vrbo</SelectItem>
                  <SelectItem value="manual">Manual</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" placeholder="Event title" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="start_date">Start Date</Label>
                <Input id="start_date" type="date" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="end_date">End Date</Label>
                <Input id="end_date" type="date" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="event_type">Event Type</Label>
                <Select>
                  <SelectTrigger id="event_type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="booking">Booking</SelectItem>
                    <SelectItem value="blocked">Blocked</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select defaultValue="confirmed">
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="tentative">Tentative</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Input id="description" placeholder="Event description" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddEventOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Event</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function getMockProperties() {
  return [
    { _id: "1", name: "Oceanfront Villa" },
    { _id: "2", name: "Downtown Loft" },
    { _id: "3", name: "Mountain Cabin" },
    { _id: "4", name: "Beachside Condo" },
    { _id: "5", name: "Suburban House" },
  ];
}

function getMockEvents() {
  return [
    {
      _id: "1",
      property: { _id: "1", name: "Oceanfront Villa" },
      platform: "Airbnb",
      summary: "Summer Vacation Booking",
      start_date: "2025-06-15T14:00:00Z",
      end_date: "2025-06-22T11:00:00Z",
      event_type: "booking",
      status: "confirmed",
      description: "Guest from NYC, 4 people"
    },
    {
      _id: "2",
      property: { _id: "2", name: "Downtown Loft" },
      platform: "Booking",
      summary: "Business Trip Stay",
      start_date: "2025-05-03T15:00:00Z",
      end_date: "2025-05-07T12:00:00Z",
      event_type: "booking",
      status: "confirmed",
      description: "Business traveler from Chicago"
    },
    {
      _id: "3",
      property: { _id: "3", name: "Mountain Cabin" },
      platform: "manual",
      summary: "Bathroom Renovation",
      start_date: "2025-04-10T08:00:00Z",
      end_date: "2025-04-15T18:00:00Z",
      event_type: "maintenance",
      status: "confirmed",
      description: "Replacing shower and fixtures"
    },
    {
      _id: "4",
      property: { _id: "1", name: "Oceanfront Villa" },
      platform: "Vrbo",
      summary: "Family Reunion",
      start_date: "2025-07-01T15:00:00Z",
      end_date: "2025-07-08T11:00:00Z",
      event_type: "booking",
      status: "tentative",
      description: "Large family, 8 people"
    },
    {
      _id: "5",
      property: { _id: "4", name: "Beachside Condo" },
      platform: "TripAdvisor",
      summary: "Weekend Getaway",
      start_date: "2025-05-12T16:00:00Z",
      end_date: "2025-05-14T10:00:00Z",
      event_type: "booking",
      status: "cancelled",
      description: "Cancelled due to guest emergency"
    },
    {
      _id: "6",
      property: { _id: "5", name: "Suburban House" },
      platform: "manual",
      summary: "Owner Block",
      start_date: "2025-04-25T00:00:00Z",
      end_date: "2025-04-30T23:59:59Z",
      event_type: "blocked",
      status: "confirmed",
      description: "Owner using property"
    },
  ];
}
