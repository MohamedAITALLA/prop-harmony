
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface EventsTabProps {
  eventsData: any;
  eventStatusCounts: Record<string, number>;
  eventTypeCounts: Record<string, number>;
  isLoadingEvents: boolean;
}

export function EventsTab({ 
  eventsData, 
  eventStatusCounts, 
  eventTypeCounts, 
  isLoadingEvents 
}: EventsTabProps) {
  return (
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
                  {Object.entries(eventStatusCounts).map(([status, count]) => (
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
                  {Object.entries(eventTypeCounts).map(([type, count]) => (
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
  );
}
