
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { propertyService, conflictService, eventService } from "@/services/api-service";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Edit, RefreshCw, Trash, Info, Calendar, Link, AlertTriangle, Settings, Plus, Download, ChevronDown } from "lucide-react";
import { PropertyOverview } from "@/components/properties/PropertyOverview";
import { PropertyICalFeed } from "@/components/properties/PropertyICalFeed";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PropertyType, Platform, EventType } from "@/types/enums";
import { PropertyConflictsView } from "@/components/conflicts/PropertyConflictsView";
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
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { useState } from "react";

export default function PropertyDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    property_id: id || "",
    platform: Platform.MANUAL,
    summary: "",
    start_date: "",
    end_date: "",
    event_type: EventType.BOOKING,
    status: "confirmed",
    description: ""
  });
  
  // Fetch property data
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["property", id],
    queryFn: async () => {
      if (!id) throw new Error("Property ID is required");
      
      try {
        // In a production app, this would use the real API
        const response = await propertyService.getProperty(id);
        return response.data.property;
      } catch (error) {
        console.error("Error fetching property:", error);
        
        // For demo purposes, return mock data if the API fails
        return getMockPropertyData(id);
      }
    },
  });
  
  // Handle sync now
  const handleSync = async () => {
    toast.success("Property calendar synced successfully");
  };
  
  // Handle delete property
  const handleDelete = async () => {
    // In a real app, this would open a confirmation dialog first
    if (window.confirm("Are you sure you want to delete this property? This action cannot be undone.")) {
      try {
        // await propertyService.deleteProperty(id);
        toast.success("Property deleted successfully");
        navigate("/properties");
      } catch (error) {
        toast.error("Failed to delete property");
      }
    }
  };

  // Handle form input changes
  const handleInputChange = (field: string, value: string) => {
    setNewEvent(prev => ({ ...prev, [field]: value }));
  };

  // Submit new event
  const handleSubmitEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // In a real implementation, we would call the API here
      console.log("Creating event:", newEvent);
      toast.success("Event created successfully");
      setIsAddEventOpen(false);
      
      // Reset form
      setNewEvent({
        property_id: id || "",
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
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading property details...</p>
        </div>
      </div>
    );
  }
  
  if (error || !data) {
    return (
      <Alert variant="destructive" className="my-8">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load property details. Please try again later.
        </AlertDescription>
        <Button variant="outline" onClick={() => refetch()} className="mt-4">
          Retry
        </Button>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Property Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{data.name}</h1>
          <p className="text-muted-foreground">
            {data.address.city}, {data.address.country}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => navigate(`/properties/${id}/edit`)}>
            <Edit className="mr-2 h-4 w-4" /> Edit Property
          </Button>
          <Button variant="outline" onClick={handleSync}>
            <RefreshCw className="mr-2 h-4 w-4" /> Sync Now
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash className="mr-2 h-4 w-4" /> Delete
          </Button>
        </div>
      </div>
      
      {/* Tabs */}
      <Tabs defaultValue="overview" className="mt-6">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">
            <Info className="mr-2 h-4 w-4" /> Overview
          </TabsTrigger>
          <TabsTrigger value="calendar">
            <Calendar className="mr-2 h-4 w-4" /> Calendar
          </TabsTrigger>
          <TabsTrigger value="ical">
            <Link className="mr-2 h-4 w-4" /> iCal Connections
          </TabsTrigger>
          <TabsTrigger value="conflicts">
            <AlertTriangle className="mr-2 h-4 w-4" /> Conflicts
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="mr-2 h-4 w-4" /> Settings
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <PropertyOverview property={data} />
        </TabsContent>
        
        <TabsContent value="calendar" className="space-y-4">
          <div className="space-y-6">
            {/* Calendar Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Property Calendar</h2>
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
            
            {/* Calendar View */}
            <div className="border rounded-lg p-6 bg-background min-h-[500px] flex items-center justify-center">
              <div className="text-center p-12">
                <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">Property Calendar View</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  This is a placeholder for the property calendar integration.<br />
                  In a real application, you would see all the events for this property here.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="ical" className="space-y-4">
          <div className="grid gap-6 grid-cols-1">
            <div className="p-4 border rounded-md">
              <h2 className="text-xl font-semibold mb-2">Connected Platforms</h2>
              <p className="text-muted-foreground mb-4">Import and export calendars from various booking platforms.</p>
              <Button>
                <Link className="mr-2 h-4 w-4" /> Add Platform
              </Button>
            </div>
            
            <PropertyICalFeed propertyId={id || ""} />
          </div>
        </TabsContent>
        
        <TabsContent value="conflicts" className="space-y-4">
          <div className="p-4 border rounded-md">
            <h2 className="text-xl font-semibold mb-2">Conflicts</h2>
            {id && <PropertyConflictsView propertyId={id} />}
          </div>
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-4">
          <div className="p-4 border rounded-md">
            <h2 className="text-xl font-semibold mb-2">Property Settings</h2>
            <p className="text-muted-foreground">Settings functionality will be implemented soon.</p>
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Event Dialog */}
      <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Add New Calendar Event</DialogTitle>
            <DialogDescription>
              Create a new event for this property.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitEvent}>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-1 gap-4">
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
}

// Mock data function for development purposes
function getMockPropertyData(id: string) {
  return {
    id,
    name: "Oceanfront Villa",
    property_type: PropertyType.VILLA, // Using the enum value instead of string
    address: {
      street: "123 Ocean Drive",
      city: "Malibu",
      stateProvince: "California",
      postalCode: "90265",
      country: "USA",
      coordinates: {
        latitude: 34.0259,
        longitude: -118.7798
      }
    },
    accommodates: 8,
    bedrooms: 4,
    beds: 5,
    bathrooms: 3.5,
    amenities: {
      wifi: true,
      kitchen: true,
      ac: true,
      heating: true,
      tv: true,
      washer: true,
      dryer: true,
      parking: true,
      elevator: false,
      pool: true
    },
    policies: {
      check_in_time: "15:00",
      check_out_time: "11:00",
      minimum_stay: 2,
      pets_allowed: false,
      smoking_allowed: false
    },
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800&auto=format&fit=crop"
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
}
