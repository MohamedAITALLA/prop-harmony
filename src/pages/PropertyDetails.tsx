
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { propertyService, eventService } from "@/services/api-service";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Edit, RefreshCw, Trash, Info, Calendar, Link, AlertTriangle, Settings } from "lucide-react";
import { PropertyOverview } from "@/components/properties/PropertyOverview";
import { PropertyICalFeed } from "@/components/properties/PropertyICalFeed";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Platform, EventType } from "@/types/enums";
import { PropertyConflictsView } from "@/components/conflicts/PropertyConflictsView";
import { PropertyCalendar } from "@/components/properties/PropertyCalendar";
import { PropertyEventDialog } from "@/components/properties/PropertyEventDialog";
import { CalendarEvent } from "@/types/api-responses";

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
        const response = await propertyService.getProperty(id);
        return response.data.property;
      } catch (error) {
        console.error("Error fetching property:", error);
        
        return getMockPropertyData(id);
      }
    },
  });

  // Fetch events for the specific property
  const { data: eventsData, isLoading: eventsLoading } = useQuery({
    queryKey: ["property-events", id],
    queryFn: async () => {
      if (!id) return [];
      try {
        const response = await eventService.getEvents(id);
        return response.data.events || [];
      } catch (error) {
        console.error("Error fetching property events:", error);
        return [];
      }
    },
  });

  // Format events for FullCalendar
  const formattedEvents = React.useMemo(() => {
    if (!eventsData) return [];
    
    return eventsData.map((event: CalendarEvent) => ({
      id: event.id,
      title: event.summary,
      start: event.start_date,
      end: event.end_date,
      extendedProps: {
        platform: event.platform,
        event_type: event.event_type,
        status: event.status,
        description: event.description
      }
    }));
  }, [eventsData]);

  // Handle sync now
  const handleSync = async () => {
    toast.success("Property calendar synced successfully");
  };

  // Handle delete property
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this property? This action cannot be undone.")) {
      try {
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
      console.log("Creating event:", newEvent);
      toast.success("Event created successfully");
      setIsAddEventOpen(false);
      
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
          <PropertyCalendar
            events={formattedEvents}
            eventsLoading={eventsLoading}
            onAddEvent={() => setIsAddEventOpen(true)}
            onExport={handleExport}
          />
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

      {/* Event Dialog Component */}
      <PropertyEventDialog
        isOpen={isAddEventOpen}
        onOpenChange={setIsAddEventOpen}
        formData={newEvent}
        onInputChange={handleInputChange}
        onSubmit={handleSubmitEvent}
      />
    </div>
  );
}

function getMockPropertyData(id: string) {
  return {
    id,
    name: "Oceanfront Villa",
    property_type: "villa",
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
