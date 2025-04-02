
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { syncService } from "@/services/api-service";
import { SyncDialog } from "@/components/ui/sync-dialog";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  };

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
