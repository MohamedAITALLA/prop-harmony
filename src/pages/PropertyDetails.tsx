
import React, { useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { Tabs } from "@/components/ui/tabs";
import { toast } from "sonner";
import { SyncDialog } from "@/components/ui/sync-dialog";
import { PropertyDetailsHeader } from "@/components/properties/PropertyDetailsHeader";
import { PropertyDetailsTabs } from "@/components/properties/PropertyDetailsTabs";
import { PropertyDetailsContent } from "@/components/properties/PropertyDetailsContent";
import { PropertyDetailsLoading } from "@/components/properties/PropertyDetailsLoading";
import { PropertyDetailsError } from "@/components/properties/PropertyDetailsError";
import { usePropertyDetails } from "@/hooks/properties/usePropertyDetails";
import { usePropertyEvents } from "@/hooks/properties/usePropertyEvents";
import { usePropertyConflicts } from "@/hooks/properties/usePropertyConflicts";

export default function PropertyDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isSyncDialogOpen, setIsSyncDialogOpen] = useState(false);
  const initialTab = searchParams.get("tab") || "overview";
  const [activeTab, setActiveTab] = useState(initialTab);

  // Use custom hooks to fetch data
  const { 
    property, 
    propertyLoading, 
    propertyError, 
    refetchProperty 
  } = usePropertyDetails(id);

  const { 
    formattedEvents, 
    eventsLoading, 
    refetchEvents 
  } = usePropertyEvents(id);

  const { hasConflicts } = usePropertyConflicts(id);

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
