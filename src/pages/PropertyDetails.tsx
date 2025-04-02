
import React, { useState, useMemo } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { propertyService } from "@/services/api-service";
import { eventService } from "@/services/api-event-service";
import { Tabs } from "@/components/ui/tabs";
import { toast } from "sonner";
import { PropertyType } from "@/types/enums";
import api from "@/lib/api";
import { SyncDialog } from "@/components/ui/sync-dialog";
import { PropertyDetailsHeader } from "@/components/properties/PropertyDetailsHeader";
import { PropertyDetailsTabs } from "@/components/properties/PropertyDetailsTabs";
import { PropertyDetailsContent } from "@/components/properties/PropertyDetailsContent";
import { PropertyDetailsLoading } from "@/components/properties/PropertyDetailsLoading";
import { PropertyDetailsError } from "@/components/properties/PropertyDetailsError";

export default function PropertyDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isSyncDialogOpen, setIsSyncDialogOpen] = useState(false);
  const initialTab = searchParams.get("tab") || "overview";
  const [activeTab, setActiveTab] = useState(initialTab);

  const { 
    data: property, 
    isLoading: propertyLoading, 
    error: propertyError, 
    refetch: refetchProperty 
  } = useQuery({
    queryKey: ["property", id],
    queryFn: async () => {
      if (!id) throw new Error("Property ID is required");
      
      try {
        console.log("Fetching property details for ID:", id);
        const responseData = await propertyService.getProperty(id);
        
        console.log("API response:", responseData);
        
        // Check if the response has the expected structure
        if (responseData?.success && responseData?.data?.property) {
          console.log("Property data found:", responseData.data.property);
          return responseData.data.property;
        } else {
          console.error("Unexpected API response structure:", responseData);
          throw new Error("Property data not found in the API response");
        }
      } catch (error) {
        console.error("Error fetching property:", error);
        throw error;
      }
    },
  });

  const { 
    data: eventsData, 
    isLoading: eventsLoading, 
    refetch: refetchEvents 
  } = useQuery({
    queryKey: ["property-events", id],
    queryFn: async () => {
      if (!id) return [];
      try {
        const response = await eventService.getEvents(id);
        return response.data || [];
      } catch (error) {
        console.error("Error fetching property events:", error);
        return [];
      }
    },
  });

  const { data: conflictsData } = useQuery({
    queryKey: ["property-conflicts", id],
    queryFn: async () => {
      if (!id) return { conflicts: [] };
      try {
        const response = await api.get(`/properties/${id}/conflicts`);
        return response.data;
      } catch (error) {
        console.error("Error fetching conflicts:", error);
        return { conflicts: [] };
      }
    },
    enabled: !!id,
  });

  const hasConflicts = useMemo(() => {
    return conflictsData && conflictsData.conflicts && conflictsData.conflicts.length > 0;
  }, [conflictsData]);

  const formattedEvents = useMemo(() => {
    if (!eventsData) return [];
    
    return eventsData.map((event) => ({
      id: event._id,
      title: event.summary,
      start: event.start_date,
      end: event.end_date,
      extendedProps: {
        platform: event.platform,
        event_type: event.event_type,
        status: event.status,
        description: event.description,
        property_id: id,
        created_at: event.created_at,
        updated_at: event.updated_at,
        ical_uid: event.ical_uid
      }
    }));
  }, [eventsData, id]);

  const handleTabChange = (value) => {
    setActiveTab(value);
    setSearchParams({ tab: value });
  };

  const handleSync = () => {
    setIsSyncDialogOpen(true);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this property? This action cannot be undone.")) {
      try {
        toast.success("Property deleted successfully");
        navigate("/properties");
      } catch (error) {
        toast.error("Failed to delete property");
      }
    }
  };

  const handleExport = (format) => {
    toast(`Exporting calendar as ${format}...`);
  };

  const handleSyncComplete = () => {
    refetchEvents();
  };
  
  const handleViewConflicts = () => {
    handleTabChange("conflicts");
  };

  const handleRetryLoadProperty = () => {
    refetchProperty();
    toast.info("Retrying to load property details...");
  };

  if (propertyLoading) {
    return <PropertyDetailsLoading />;
  }

  if (propertyError || !property) {
    return <PropertyDetailsError 
      onRetry={handleRetryLoadProperty} 
      error={propertyError instanceof Error ? propertyError : null} 
    />;
  }

  return (
    <div className="space-y-6">
      <PropertyDetailsHeader 
        property={property} 
        onSync={handleSync} 
        onDelete={handleDelete} 
      />
      
      <Tabs value={activeTab} onValueChange={handleTabChange} className="mt-6">
        <PropertyDetailsTabs 
          activeTab={activeTab} 
          onTabChange={handleTabChange} 
          hasConflicts={hasConflicts} 
        />
        
        <PropertyDetailsContent 
          property={property}
          activeTab={activeTab}
          propertyId={id || ""}
          formattedEvents={formattedEvents}
          eventsLoading={eventsLoading}
          hasConflicts={hasConflicts}
          onExport={handleExport}
          onViewConflicts={handleViewConflicts}
          refetchEvents={refetchEvents}
        />
      </Tabs>

      <SyncDialog
        open={isSyncDialogOpen}
        onOpenChange={setIsSyncDialogOpen}
        propertyId={id}
        onSyncComplete={handleSyncComplete}
      />
    </div>
  );
}

function getMockPropertyData(id) {
  return {
    _id: id,
    name: "Oceanfront Villa",
    property_type: PropertyType.VILLA,
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
