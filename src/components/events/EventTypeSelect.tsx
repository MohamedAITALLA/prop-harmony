
import React from 'react';
import { EventType } from "@/types/enums";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EventTypeSelectProps {
  selected: EventType[];
  onSelectionChange: (eventTypes: EventType[]) => void;
}

export function EventTypeSelect({ selected, onSelectionChange }: EventTypeSelectProps) {
  const handleSelect = (eventType: EventType) => {
    if (!selected.includes(eventType)) {
      onSelectionChange([...selected, eventType]);
    }
  };

  const handleRemove = (eventType: EventType) => {
    onSelectionChange(selected.filter(t => t !== eventType));
  };

  return (
    <div className="space-y-2">
      <Select onValueChange={(value: EventType) => handleSelect(value)}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select event types" />
        </SelectTrigger>
        <SelectContent>
          {Object.values(EventType).map((eventType) => (
            <SelectItem key={eventType} value={eventType}>
              {eventType}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex flex-wrap gap-1">
        {selected.map((eventType) => (
          <Badge key={eventType} variant="secondary" className="flex items-center gap-1">
            {eventType}
            <X 
              className="h-3 w-3 cursor-pointer" 
              onClick={() => handleRemove(eventType)} 
            />
          </Badge>
        ))}
      </div>
    </div>
  );
}
