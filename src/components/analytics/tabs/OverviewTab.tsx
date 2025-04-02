
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Skeleton } from "@/components/ui/skeleton";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

interface OverviewTabProps {
  eventsData: any;
  eventsDistributionData: Array<{ name: string; value: number }>;
  eventsByMonth: Array<{ name: string; count: number }>;
  syncLogs: any;
  notificationsData: any;
  notificationTypeData: Array<{ name: string; value: number }>;
  isLoadingEvents: boolean;
  isLoadingSyncLogs: boolean;
  isLoadingNotifications: boolean;
}

export function OverviewTab({
  eventsData,
  eventsDistributionData,
  eventsByMonth,
  syncLogs,
  notificationsData,
  notificationTypeData,
  isLoadingEvents,
  isLoadingSyncLogs,
  isLoadingNotifications
}: OverviewTabProps) {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Events"
          value={eventsData?.data?.length || 0}
          icon="calendar-check"
          isLoading={isLoadingEvents}
        />
        
        <StatsCard
          title="Connected Platforms"
          value={eventsDistributionData.length || 0}
          icon="home"
          isLoading={isLoadingEvents}
        />
        
        <StatsCard
          title="Sync Success Rate"
          value={`${syncLogs?.summary?.by_status?.success 
            ? Math.round((syncLogs.summary.by_status.success / syncLogs.summary.total_count) * 100) 
            : 0}%`}
          icon="percent"
          variant="success"
          isLoading={isLoadingSyncLogs}
        />
        
        <StatsCard
          title="Unread Notifications"
          value={notificationsData?.summary?.unread_count || 0}
          icon="alert-triangle"
          variant={notificationsData?.summary?.unread_count ? "warning" : "default"}
          isLoading={isLoadingNotifications}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Events Trend</CardTitle>
          <CardDescription>Events over the past 6 months</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingEvents ? (
            <div className="h-[300px] w-full">
              <Skeleton className="h-full w-full" />
            </div>
          ) : eventsByMonth.length > 0 ? (
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={eventsByMonth}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-background border border-border p-2 rounded shadow-md">
                            <p className="font-medium">{String(payload[0].payload.name)}</p>
                            <p>Events: {payload[0].value}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="count"
                    name="Events"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              No event data available
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
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
    </>
  );
}
