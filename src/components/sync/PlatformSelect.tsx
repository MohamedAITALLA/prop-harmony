
import React from 'react';
import { Platform } from "@/types/enums";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PlatformSelectProps {
  selected: Platform[];
  onSelectionChange: (platforms: Platform[]) => void;
}

export function PlatformSelect({ selected, onSelectionChange }: PlatformSelectProps) {
  const handleSelect = (platform: Platform) => {
    if (!selected.includes(platform)) {
      onSelectionChange([...selected, platform]);
    }
  };

  const handleRemove = (platform: Platform) => {
    onSelectionChange(selected.filter(p => p !== platform));
  };

  return (
    <div className="space-y-2">
      <Select onValueChange={(value: Platform) => handleSelect(value)}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select platforms" />
        </SelectTrigger>
        <SelectContent>
          {Object.values(Platform).map((platform) => (
            <SelectItem key={platform} value={platform}>
              {platform}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex flex-wrap gap-1">
        {selected.map((platform) => (
          <Badge key={platform} variant="secondary" className="flex items-center gap-1">
            {platform}
            <X 
              className="h-3 w-3 cursor-pointer" 
              onClick={() => handleRemove(platform)} 
            />
          </Badge>
        ))}
      </div>
    </div>
  );
}
