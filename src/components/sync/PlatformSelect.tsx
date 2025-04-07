
import React from 'react';
import { Platform } from '@/types/enums';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlatformIcon } from '@/components/ui/platform-icon';

export interface PlatformSelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  onChange?: (value: any) => void; // Added for compatibility
  placeholder?: string;
  disabled?: boolean;
}

export function PlatformSelect({ 
  value, 
  onValueChange, 
  onChange, 
  placeholder = "Select platform", 
  disabled = false 
}: PlatformSelectProps) {
  const handleValueChange = (selectedValue: string) => {
    if (onValueChange) onValueChange(selectedValue);
    if (onChange) onChange(selectedValue);
  };

  return (
    <Select 
      value={value} 
      onValueChange={handleValueChange} 
      disabled={disabled}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">
          <div className="flex items-center gap-2">
            <span className="h-4 w-4" />
            <span>All Platforms</span>
          </div>
        </SelectItem>
        {Object.values(Platform).map((platform) => (
          <SelectItem key={platform} value={platform}>
            <div className="flex items-center gap-2">
              <PlatformIcon platform={platform} className="h-4 w-4" />
              <span>{platform}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
