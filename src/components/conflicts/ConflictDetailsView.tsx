
import React from "react";
import { Conflict } from "@/types/api-responses";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { DateRange } from "@/components/ui/date-range";
import { PlatformsList } from "@/components/sync/PlatformsList";
import { ConflictTypeBadge } from "@/components/ui/conflict-type-badge";
import { SeverityBadge } from "@/components/ui/severity-badge";
import { format, parseISO } from "date-fns";

interface ConflictDetailsViewProps {
  conflict: Conflict;
}

export function ConflictDetailsView({ conflict }: ConflictDetailsViewProps) {
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), "MMM d, yyyy h:mm a");
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Conflict Details</h2>
        <p className="text-muted-foreground">
          {conflict.property?.name || "Unknown Property"} - {formatDate(conflict.created_at)}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Overview</CardTitle>
          <CardDescription>Basic information about the conflict</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Type</p>
              <div className="mt-1">
                <ConflictTypeBadge type={conflict.conflict_type} />
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Severity</p>
              <div className="mt-1">
                <SeverityBadge severity={conflict.severity} />
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Date Range</p>
              <div className="mt-1">
                <DateRange startDate={conflict.start_date} endDate={conflict.end_date} />
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Platforms</p>
              <div className="mt-1">
                <PlatformsList platforms={conflict.platforms || []} />
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <p className="text-sm font-medium text-muted-foreground">Description</p>
            <p className="mt-1">{conflict.description}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Conflicting Bookings</CardTitle>
          <CardDescription>Bookings involved in this conflict</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border rounded-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Booking from Airbnb</p>
                  <p className="text-sm text-muted-foreground">John Smith</p>
                </div>
                <DateRange startDate={conflict.start_date} endDate={conflict.end_date} />
              </div>
            </div>
            
            <div className="p-4 border rounded-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Booking from Booking.com</p>
                  <p className="text-sm text-muted-foreground">Sarah Johnson</p>
                </div>
                <DateRange startDate={conflict.start_date} endDate={conflict.end_date} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Resolution History</CardTitle>
          <CardDescription>Timeline of actions taken on this conflict</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex">
              <div className="mr-4 flex items-center justify-center">
                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                <div className="h-full w-px bg-border"></div>
              </div>
              <div>
                <p className="font-medium">Conflict detected</p>
                <p className="text-sm text-muted-foreground">{formatDate(conflict.created_at)}</p>
              </div>
            </div>
            
            <div className="flex">
              <div className="mr-4 flex items-center justify-center">
                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
              </div>
              <div>
                <p className="font-medium">Notifications sent</p>
                <p className="text-sm text-muted-foreground">{formatDate(conflict.updated_at)}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
