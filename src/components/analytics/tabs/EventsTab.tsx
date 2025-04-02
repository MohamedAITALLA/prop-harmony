
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarEvent } from "@/types/api-responses";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";
import { EventTypeBadge } from "@/components/ui/event-type-badge";
import { DateRange } from "@/components/ui/date-range";
import { EventAnalyticsData } from "../hooks/useEventData";

interface EventsTabProps {
  eventsData: EventAnalyticsData["eventsData"];
  eventStatusCounts: Record<string, number>;
  eventTypeCounts: Record<string, number>;
  eventsByMonth: Array<{name: string; count: number}>;
  isLoadingEvents: boolean;
}

export function EventsTab({ 
  eventsData, 
  eventStatusCounts, 
  eventTypeCounts, 
  eventsByMonth,
  isLoadingEvents 
}: EventsTabProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Events Timeline</CardTitle>
          <CardDescription>Distribution of events over the last 6 months</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingEvents ? (
            <div className="h-[400px] w-full">
              <Skeleton className="h-full w-full" />
            </div>
          ) : eventsByMonth.length > 0 ? (
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={eventsByMonth}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 60,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45} 
                    textAnchor="end"
                    height={70} 
                  />
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
                  <Bar dataKey="count" name="Number of Events" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[400px] flex items-center justify-center text-muted-foreground">
              No event data available
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Event Status</CardTitle>
            <CardDescription>Distribution of events by status</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingEvents ? (
              <div className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : Object.keys(eventStatusCounts).length > 0 ? (
              <div className="grid gap-4 grid-cols-2">
                {Object.entries(eventStatusCounts).map(([status, count]) => (
                  <div key={status} className="rounded-lg border p-3">
                    <div className="text-xs font-medium text-muted-foreground">
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </div>
                    <div className="mt-1 text-2xl font-bold">{String(count)}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                No event status data available
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Event Types</CardTitle>
            <CardDescription>Distribution of events by type</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingEvents ? (
              <div className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : Object.keys(eventTypeCounts).length > 0 ? (
              <div className="grid gap-4 grid-cols-2">
                {Object.entries(eventTypeCounts).map(([type, count]) => (
                  <div key={type} className="rounded-lg border p-3">
                    <div className="flex items-center space-x-2">
                      <EventTypeBadge eventType={type} />
                    </div>
                    <div className="mt-2 text-2xl font-bold">{String(count)}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                No event type data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Events</CardTitle>
          <CardDescription>Last 5 events on this property</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingEvents ? (
            <div className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : eventsData?.data && eventsData.data.length > 0 ? (
            <div className="space-y-4">
              {eventsData.data.slice(0, 5).map((event: CalendarEvent) => (
                <div key={event._id} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <div className="font-medium">{event.summary}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <EventTypeBadge eventType={event.event_type} />
                      <span className="text-sm text-muted-foreground">
                        {event.platform || "Unknown Platform"}
                      </span>
                    </div>
                  </div>
                  <DateRange
                    startDate={event.start_date}
                    endDate={event.end_date}
                    format="MMM d"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-muted-foreground">
              No event data available
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
