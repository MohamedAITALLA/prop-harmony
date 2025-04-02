
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { syncService } from "@/services/api-service";
import { eventService } from "@/services/api-event-service";
import { notificationService } from "@/services/notification-service";
import { NotificationsList } from "@/components/ui/notifications-list";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { SyncDialog } from "@/components/ui/sync-dialog";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { CalendarEvent, ApiResponse } from "@/types/api-responses";

export function PropertyAnalytics() {
  const { id: propertyId } = useParams<{ id: string }>();
  const [syncDialogOpen, setSyncDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  
  // Fetch property sync status
  const { 
    data: syncStatus, 
    isLoading: isLoadingSyncStatus,
    refetch: refetchSyncStatus
  } = useQuery({
    queryKey: ["property-sync-status", propertyId],
    queryFn: async () => {
      if (!propertyId) return null;
      const response = await syncService.getPropertySyncStatus(propertyId);
      return response.data;
    },
    enabled: !!propertyId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Fetch property sync logs
  const {
    data: syncLogs,
    isLoading: isLoadingSyncLogs
  } = useQuery({
    queryKey: ["property-sync-logs", propertyId],
    queryFn: async () => {
      if (!propertyId) return null;
      const response = await syncService.getPropertySyncLogs(propertyId);
      return response.data;
    },
    enabled: !!propertyId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Fetch property-specific notifications
  const {
    data: notificationsData,
    isLoading: isLoadingNotifications
  } = useQuery({
    queryKey: ["property-notifications", propertyId],
    queryFn: async () => {
      if (!propertyId) return null;
      const response = await notificationService.getNotifications({
        property_id: propertyId,
        limit: 20
      });
      return response.data;
    },
    enabled: !!propertyId,
    staleTime: 1000 * 60, // 1 minute
  });
  
  // Fetch property events
  const {
    data: eventsData,
    isLoading: isLoadingEvents
  } = useQuery({
    queryKey: ["property-events", propertyId],
    queryFn: async () => {
      if (!propertyId) return { data: [], meta: { total: 0, property_id: propertyId, platforms: {} } };
      const response = await eventService.getEvents(propertyId);
      return response;
    },
    enabled: !!propertyId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Prepare data for sync performance chart
  const syncPerformanceData = React.useMemo(() => {
    if (!syncLogs?.logs) return [];
    
    return syncLogs.logs.slice(0, 10).map(log => ({
      name: format(new Date(log.timestamp), 'MMM dd'),
      duration: log.duration,
      platform: log.platform,
      status: log.status,
      eventsProcessed: log.results?.events_processed || 0,
    })).reverse();
  }, [syncLogs]);

  // Prepare data for events distribution chart
  const eventsDistributionData = React.useMemo(() => {
    if (!eventsData?.data?.length) return [];
    
    // Group events by platform
    const platforms: Record<string, number> = {};
    eventsData.data.forEach(event => {
      const platform = event.platform || 'unknown';
      platforms[platform] = (platforms[platform] || 0) + 1;
    });
    
    return Object.entries(platforms).map(([platform, count]) => ({
      name: platform,
      value: count,
    }));
  }, [eventsData]);

  // Prepare notification type distribution data
  const notificationTypeData = React.useMemo(() => {
    if (!notificationsData?.summary?.by_type) return [];
    
    return Object.entries(notificationsData.summary.by_type).map(([type, count]) => ({
      name: formatNotificationType(type),
      value: count as number,
    }));
  }, [notificationsData]);

  // Function to format notification type for display
  const formatNotificationType = (type: string): string => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  // Colors for the pie charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  // Handle sync button click
  const handleSyncClick = () => {
    setSyncDialogOpen(true);
  };

  // Handle sync completion
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
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Total Events */}
            <StatsCard
              title="Total Events"
              value={eventsData?.data?.length || 0}
              icon="calendar-check"
              isLoading={isLoadingEvents}
            />
            
            {/* Platform Connections */}
            <StatsCard
              title="Connected Platforms"
              value={eventsDistributionData.length || 0}
              icon="home"
              isLoading={isLoadingEvents}
            />
            
            {/* Sync Success Rate */}
            <StatsCard
              title="Sync Success Rate"
              value={`${syncLogs?.summary?.by_status?.success 
                ? Math.round((syncLogs.summary.by_status.success / syncLogs.summary.total_count) * 100) 
                : 0}%`}
              icon="percent"
              variant="success"
              isLoading={isLoadingSyncLogs}
            />
            
            {/* Unresolved Notifications */}
            <StatsCard
              title="Unread Notifications"
              value={notificationsData?.summary?.unread_count || 0}
              icon="alert-triangle"
              variant={notificationsData?.summary?.unread_count ? "warning" : "default"}
              isLoading={isLoadingNotifications}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Events by Platform */}
            <Card>
              <CardHeader>
                <CardTitle>Events by Platform</CardTitle>
                <CardDescription>Distribution of events across platforms</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingEvents ? (
                  <div className="h-[300px] w-full flex items-center justify-center">
                    <Skeleton className="h-[250px] w-[250px] rounded-full" />
                  </div>
                ) : eventsDistributionData.length > 0 ? (
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={eventsDistributionData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {eventsDistributionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="bg-background border border-border p-2 rounded shadow-md">
                                  <p className="font-medium">{String(payload[0].name)}</p>
                                  <p>Events: {payload[0].value}</p>
                                </div>
                              );
                            }
                            return null;
                          }} 
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                    No event data available
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Notification Types */}
            <Card>
              <CardHeader>
                <CardTitle>Notification Types</CardTitle>
                <CardDescription>Distribution of notifications by type</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingNotifications ? (
                  <div className="h-[300px] w-full flex items-center justify-center">
                    <Skeleton className="h-[250px] w-[250px] rounded-full" />
                  </div>
                ) : notificationTypeData.length > 0 ? (
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={notificationTypeData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {notificationTypeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="bg-background border border-border p-2 rounded shadow-md">
                                  <p className="font-medium">{String(payload[0].name)}</p>
                                  <p>Count: {payload[0].value}</p>
                                </div>
                              );
                            }
                            return null;
                          }} 
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                    No notification data available
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="sync" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sync Performance History</CardTitle>
              <CardDescription>Duration of sync operations over time</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingSyncLogs ? (
                <div className="h-[400px] w-full">
                  <Skeleton className="h-full w-full" />
                </div>
              ) : syncPerformanceData.length > 0 ? (
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={syncPerformanceData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis label={{ value: 'Duration (ms)', angle: -90, position: 'insideLeft' }} />
                      <Tooltip
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-background border border-border p-3 rounded shadow-md">
                                <p className="font-medium">{label}</p>
                                <p>Duration: {payload[0].value} ms</p>
                                <p>Platform: {payload[0].payload.platform}</p>
                                <p>Events: {payload[0].payload.eventsProcessed}</p>
                                <Badge 
                                  variant={payload[0].payload.status === "success" ? "outline" : "destructive"}
                                  className="mt-1"
                                >
                                  {payload[0].payload.status}
                                </Badge>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Legend />
                      <Bar 
                        dataKey="duration" 
                        fill="#8884d8" 
                        name="Sync Duration (ms)"
                        fillOpacity={0.8}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                  No sync performance data available
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Events Processed During Sync</CardTitle>
              <CardDescription>Number of events processed in each sync operation</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingSyncLogs ? (
                <div className="h-[400px] w-full">
                  <Skeleton className="h-full w-full" />
                </div>
              ) : syncPerformanceData.length > 0 ? (
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={syncPerformanceData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-background border border-border p-3 rounded shadow-md">
                                <p className="font-medium">{label}</p>
                                <p>Events Processed: {payload[0].value}</p>
                                <p>Platform: {payload[0].payload.platform}</p>
                                <Badge 
                                  variant={payload[0].payload.status === "success" ? "outline" : "destructive"}
                                  className="mt-1"
                                >
                                  {payload[0].payload.status}
                                </Badge>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="eventsProcessed" 
                        stroke="#82ca9d" 
                        activeDot={{ r: 8 }}
                        name="Events Processed"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                  No event processing data available
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Events Timeline</CardTitle>
              <CardDescription>Distribution of events over time</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingEvents ? (
                <div className="h-[400px] w-full">
                  <Skeleton className="h-full w-full" />
                </div>
              ) : eventsData?.data && eventsData.data.length > 0 ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <div className="col-span-2 sm:col-span-4">
                      <h3 className="text-lg font-medium">Event Status</h3>
                      <div className="mt-2 grid grid-cols-2 gap-4 sm:grid-cols-4">
                        {Object.entries(
                          eventsData.data.reduce((acc: Record<string, number>, event) => {
                            acc[event.status] = (acc[event.status] || 0) + 1;
                            return acc;
                          }, {})
                        ).map(([status, count]) => (
                          <div key={status} className="rounded-lg border p-3">
                            <div className="text-xs font-medium text-muted-foreground">
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </div>
                            <div className="mt-1 text-2xl font-bold">{String(count)}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <div className="col-span-2 sm:col-span-4">
                      <h3 className="text-lg font-medium">Event Types</h3>
                      <div className="mt-2 grid grid-cols-2 gap-4 sm:grid-cols-4">
                        {Object.entries(
                          eventsData.data.reduce((acc: Record<string, number>, event) => {
                            acc[event.event_type] = (acc[event.event_type] || 0) + 1;
                            return acc;
                          }, {})
                        ).map(([type, count]) => (
                          <div key={type} className="rounded-lg border p-3">
                            <div className="text-xs font-medium text-muted-foreground">
                              {type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </div>
                            <div className="mt-1 text-2xl font-bold">{String(count)}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                  No event data available
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Property Notifications</CardTitle>
                  <CardDescription>Recent notifications for this property</CardDescription>
                </div>
                {notificationsData?.summary?.unread_count ? (
                  <Badge variant="secondary" className="ml-2">
                    {notificationsData.summary.unread_count} unread
                  </Badge>
                ) : null}
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingNotifications ? (
                <div className="space-y-2">
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                </div>
              ) : notificationsData?.notifications?.length ? (
                <NotificationsList
                  notifications={notificationsData.notifications.map(n => ({
                    id: n._id,
                    title: n.title,
                    message: n.message,
                    type: n.type,
                    severity: n.severity,
                    read: n.read,
                    created_at: n.created_at,
                    property_id: n.property_id,
                    user_id: n.user_id
                  }))}
                  showHeader={false}
                  maxHeight="500px"
                />
              ) : (
                <div className="py-10 text-center text-muted-foreground">
                  No notifications found for this property
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Notification Severity Breakdown</CardTitle>
              <CardDescription>Distribution of notifications by severity level</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingNotifications ? (
                <div className="h-[300px] w-full flex items-center justify-center">
                  <Skeleton className="h-[250px] w-[250px] rounded-full" />
                </div>
              ) : notificationsData?.notifications?.length > 0 ? (
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={
                          Object.entries(
                            notificationsData.notifications.reduce((acc: Record<string, number>, n) => {
                              acc[n.severity] = (acc[n.severity] || 0) + 1;
                              return acc;
                            }, {})
                          ).map(([severity, count]) => ({
                            name: severity.charAt(0).toUpperCase() + severity.slice(1),
                            value: count as number,
                          }))
                        }
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {[
                          { name: 'Info', color: '#0088FE' },
                          { name: 'Warning', color: '#FFBB28' },
                          { name: 'Critical', color: '#FF8042' },
                          { name: 'Low', color: '#00C49F' }
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-background border border-border p-2 rounded shadow-md">
                                <p className="font-medium">{String(payload[0].name)}</p>
                                <p>Count: {payload[0].value}</p>
                              </div>
                            );
                          }
                          return null;
                        }} 
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  No notification data available
                </div>
              )}
            </CardContent>
          </Card>
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

// Add missing Lucide icon component
function RefreshCw(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
      <path d="M3 21v-5h5" />
    </svg>
  );
}
