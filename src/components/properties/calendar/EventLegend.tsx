
import React from 'react';
import { Platform, EventType } from "@/types/enums";

interface EventLegendProps {
  getEventColor: (platform?: Platform, eventType?: EventType) => string;
}

export const EventLegend: React.FC<EventLegendProps> = ({ getEventColor }) => {
  return (
    <div className="border rounded-lg p-4 bg-background">
      <h3 className="font-medium mb-3">Event Legend</h3>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full" style={{backgroundColor: getEventColor(undefined, EventType.BOOKING)}}></div>
          <span>Booking</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full" style={{backgroundColor: getEventColor(undefined, EventType.BLOCKED)}}></div>
          <span>Blocked</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full" style={{backgroundColor: getEventColor(undefined, EventType.MAINTENANCE)}}></div>
          <span>Maintenance</span>
        </div>
        <hr className="my-2" />
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full" style={{backgroundColor: getEventColor(Platform.AIRBNB)}}></div>
          <span>Airbnb</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full" style={{backgroundColor: getEventColor(Platform.BOOKING)}}></div>
          <span>Booking.com</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full" style={{backgroundColor: getEventColor(Platform.VRBO)}}></div>
          <span>VRBO</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full" style={{backgroundColor: getEventColor(Platform.MANUAL)}}></div>
          <span>Manual</span>
        </div>
      </div>
    </div>
  );
};
