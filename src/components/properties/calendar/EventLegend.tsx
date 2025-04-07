
import React from 'react';
import { Platform, EventType } from "@/types/enums";
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { CalendarIcon, Hotel } from 'lucide-react';
import { PlatformIcon } from '@/components/ui/platform-icon';

interface EventLegendProps {
  getEventColor: (platform?: Platform, eventType?: EventType) => string;
}

export const EventLegend: React.FC<EventLegendProps> = ({ getEventColor }) => {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2 bg-muted/20">
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-primary" />
          <CardTitle className="text-base">Calendar Legend</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
          <h4 className="text-sm font-semibold col-span-full mb-1">Event Types</h4>
          <LegendItem color={getEventColor(undefined, EventType.BOOKING)} label="Booking" />
          <LegendItem color={getEventColor(undefined, EventType.BLOCKED)} label="Blocked" />
          <LegendItem color={getEventColor(undefined, EventType.MAINTENANCE)} label="Maintenance" />
          
          <div className="col-span-full h-px bg-border my-2"></div>
          
          <h4 className="text-sm font-semibold col-span-full mb-1">Platforms</h4>
          <LegendItem color={getEventColor(Platform.AIRBNB)} label="Airbnb" icon={<PlatformIcon platform="airbnb" />} />
          <LegendItem color={getEventColor(Platform.BOOKING)} label="Booking.com" icon={<PlatformIcon platform="booking" />} />
          <LegendItem color={getEventColor(Platform.VRBO)} label="VRBO" icon={<PlatformIcon platform="vrbo" />} />
          <LegendItem color={getEventColor(Platform.EXPEDIA)} label="Expedia" icon={<PlatformIcon platform="expedia" />} />
          <LegendItem color={getEventColor(Platform.TRIPADVISOR)} label="TripAdvisor" icon={<PlatformIcon platform="tripadvisor" />} />
          <LegendItem color={getEventColor(Platform.MANUAL)} label="Manual" icon={<Hotel size={14} className="text-gray-500" />} />
        </div>
      </CardContent>
    </Card>
  );
};

const LegendItem = ({ color, label, icon }: { color: string; label: string; icon?: React.ReactNode }) => (
  <div className="flex items-center gap-2">
    <div className="w-4 h-4 rounded-full shadow-inner" style={{ backgroundColor: color }}></div>
    {icon && <div className="ml-1">{icon}</div>}
    <span className="text-sm">{label}</span>
  </div>
);
