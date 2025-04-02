
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { syncService } from "@/services/api-service";
import { SyncDialog } from "@/components/ui/sync-dialog";
import { RefreshCw, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

import { OverviewTab } from "./tabs/OverviewTab";
import { SyncTab } from "./tabs/SyncTab";
import { EventsTab } from "./tabs/EventsTab";
import { NotificationsTab } from "./tabs/NotificationsTab";
import { useSyncData } from "./hooks/useSyncData";
import { useEventData } from "./hooks/useEventData";
import { useNotificationData } from "./hooks/useNotificationData";

export function PropertyAnalytics() {
  const { id: propertyId } = useParams<{ id: string }>();
  const [syncDialogOpen, setSyncDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  
  const { 
    syncStatus, 
    syncLogs, 
    isLoadingSyncStatus, 
    isLoadingSyncLogs, 
    syncPerformanceData,
    refetchSyncStatus 
  } = useSyncData(propertyId);

  const {
    eventsData,
    isLoadingEvents,
    eventsDistributionData,
    eventStatusCounts,
    eventTypeCounts,
    eventsByMonth
  } = useEventData(propertyId);

  const {
    notificationsData,
    isLoadingNotifications,
    notificationTypeData
  } = useNotificationData(propertyId);

  const handleSyncClick = () => {
    setSyncDialogOpen(true);
  };

  const handleSyncComplete = () => {
    refetchSyncStatus();
    toast.success("Synchronization completed successfully!");
  };

  // Check if there was an error loading sync data
  const hasLoadError = !isLoadingSyncStatus && !syncStatus;

  // If there's a loading error, show an error message
  if (hasLoadError && propertyId) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold tracking-tight">Property Analytics</h2>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
              <AlertCircle className="h-12 w-12 text-red-500" />
              <h3 className="text-lg font-semibold">Failed to load synchronization status</h3>
              <p className="text-muted-foreground max-w-md">
                There was an issue retrieving the synchronization data for this property. 
                This could be due to a temporary service disruption.
              </p>
              <div className="flex gap-3 mt-4">
                <Button 
                  variant="outline" 
                  onClick={() => refetchSyncStatus()}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Retry
                </Button>
                <Button onClick={handleSyncClick}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Sync Now
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Property Analytics</h2>
        <Button onClick={handleSyncClick} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Sync Now
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sync">Sync Performance</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <OverviewTab 
            eventsData={eventsData}
            eventsDistributionData={eventsDistributionData}
            eventsByMonth={eventsByMonth}
            syncLogs={syncLogs}
            notificationsData={notificationsData}
            notificationTypeData={notificationTypeData}
            isLoadingEvents={isLoadingEvents}
            isLoadingSyncLogs={isLoadingSyncLogs}
            isLoadingNotifications={isLoadingNotifications}
          />
        </TabsContent>
        
        <TabsContent value="sync" className="space-y-4">
          <SyncTab 
            syncPerformanceData={syncPerformanceData}
            isLoadingSyncLogs={isLoadingSyncLogs}
          />
        </TabsContent>
        
        <TabsContent value="events" className="space-y-4">
          <EventsTab 
            eventsData={eventsData}
            eventStatusCounts={eventStatusCounts}
            eventTypeCounts={eventTypeCounts}
            eventsByMonth={eventsByMonth}
            isLoadingEvents={isLoadingEvents}
          />
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4">
          <NotificationsTab 
            notificationsData={notificationsData}
            isLoadingNotifications={isLoadingNotifications}
          />
        </TabsContent>
      </Tabs>
      
      <SyncDialog
        open={syncDialogOpen}
        onOpenChange={setSyncDialogOpen}
        propertyId={propertyId}
        onSyncComplete={handleSyncComplete}
      />
    </div>
  );
}
