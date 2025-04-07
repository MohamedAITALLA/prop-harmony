
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { PropertyICalFeed } from "@/components/properties/PropertyICalFeed";
import { ICalConnectionsManager } from "@/components/properties/ICalConnectionsManager";
import { Platform } from "@/types/enums";
import { CalendarIcon, Link2 } from "lucide-react";

interface ICalTabContentProps {
  propertyId: string;
}

export function ICalTabContent({ propertyId }: ICalTabContentProps) {
  return (
    <div className="space-y-8">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2">
          <CalendarIcon className="h-6 w-6 text-primary" />
          iCalendar Integration
        </h2>
        <p className="text-muted-foreground mb-6">
          Manage your property's iCalendar feeds and external calendar connections.
          Import and export reservations between different booking platforms.
        </p>
        
        <Card className="bg-primary/5 border-primary/20 mb-4">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="bg-primary/10 p-2 rounded-full mt-0.5">
                <Link2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium mb-1">How iCal Integration Works</h3>
                <p className="text-sm text-muted-foreground">
                  iCalendar (iCal) integration allows you to sync your property's availability with external platforms like Airbnb, 
                  VRBO, and Booking.com. Export your property's calendar to external platforms or import their calendars here to 
                  prevent double bookings.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <PropertyICalFeed propertyId={propertyId} platform={Platform.MANUAL} />
      {propertyId && <ICalConnectionsManager propertyId={propertyId} />}
    </div>
  );
}
