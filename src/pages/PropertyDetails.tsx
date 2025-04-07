
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
import { DeletePropertyDialog } from "@/components/properties/DeletePropertyDialog";
import { propertyService } from "@/services/property-service";

export default function PropertyDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isSyncDialogOpen, setIsSyncDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const initialTab = searchParams.get("tab") || "overview";
  const [activeTab, setActiveTab] = useState(initialTab);

  const { 
    property, 
    propertyLoading, 
    propertyError, 
    refetchProperty,
    isError 
  } = usePropertyDetails(id);

  const { 
    formattedEvents, 
    eventsLoading, 
    refetchEvents 
  } = usePropertyEvents(id);

  // Setting a simple flag for hasConflicts - since we're removing that functionality
  const hasConflicts = false;

  const handleTabChange = (value) => {
    setActiveTab(value);
    setSearchParams({ tab: value });
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSync = () => {
    setIsSyncDialogOpen(true);
  };

  const handleDelete = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async (preserveHistory: boolean) => {
    try {
      if (!id) throw new Error("Property ID not found");
      
      const result = await propertyService.deleteProperty(id, preserveHistory);
      
      const actionText = preserveHistory ? "archived" : "deleted";
      const descriptionText = preserveHistory 
        ? "The property has been made inactive but historical data is preserved"
        : "All property data has been permanently deleted";
      
      toast.success(`Property ${property?.name} successfully ${actionText}`, {
        description: descriptionText
      });
      
      navigate("/properties");
    } catch (error) {
      console.error("Error deleting property:", error);
      toast.error(`Failed to delete property: ${(error as Error).message || "Unknown error"}`);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleExport = (format) => {
    toast.success(`Exporting calendar as ${format}...`);
  };

  const handleSyncComplete = () => {
    refetchEvents();
    toast.success("Sync completed successfully");
  };
  
  const handleViewConflicts = () => {
    // This function would have changed tabs to conflicts, but we've removed that tab
    toast.info("Conflict management has been removed from this version");
  };

  const handleRetryLoadProperty = () => {
    refetchProperty();
    toast.info("Retrying to load property details...");
  };

  const handleBackToProperties = () => {
    navigate("/properties");
  };

  if (propertyLoading) {
    return <PropertyDetailsLoading />;
  }

  if (isError || !property) {
    return <PropertyDetailsError 
      onRetry={handleRetryLoadProperty} 
      onBack={handleBackToProperties}
      error={propertyError instanceof Error ? propertyError : null} 
    />;
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 py-6">
      <PropertyDetailsHeader 
        property={property} 
        onSync={handleSync} 
        onDelete={handleDelete} 
      />
      
      <div className="bg-background/50 rounded-lg p-6">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="mt-0">
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
      </div>

      <SyncDialog
        open={isSyncDialogOpen}
        onOpenChange={setIsSyncDialogOpen}
        propertyId={id}
        onSyncComplete={handleSyncComplete}
      />

      <DeletePropertyDialog
        propertyName={property.name}
        isOpen={isDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setIsDeleteDialogOpen(false)}
      />
    </div>
  );
}
