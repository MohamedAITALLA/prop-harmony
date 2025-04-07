
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
  // Add support for multi-select platforms
  selected?: Platform[];
  onSelectionChange?: (platforms: Platform[]) => void;
}

export function PlatformSelect({ 
  value, 
  onValueChange, 
  onChange, 
  placeholder = "Select platform", 
  disabled = false,
  selected = [],
  onSelectionChange
}: PlatformSelectProps) {
  const handleValueChange = (selectedValue: string) => {
    if (onValueChange) onValueChange(selectedValue);
    if (onChange) onChange(selectedValue);
  };

  // For multi-select functionality
  const handleSelectionChange = (platform: Platform) => {
    if (!onSelectionChange) return;
    
    const updatedSelection = selected?.includes(platform)
      ? selected.filter(p => p !== platform)
      : [...(selected || []), platform];
    
    onSelectionChange(updatedSelection);
  };

  // If we're in multi-select mode (selected prop is provided)
  if (selected !== undefined && onSelectionChange) {
    return (
      <div className="space-y-2">
        {Object.values(Platform).map((platform) => (
          <div key={platform} className="flex items-center gap-2">
            <input
              type="checkbox"
              id={`platform-${platform}`}
              checked={selected.includes(platform)}
              onChange={() => handleSelectionChange(platform)}
              className="h-4 w-4"
            />
            <label htmlFor={`platform-${platform}`} className="flex items-center gap-2 text-sm">
              <PlatformIcon platform={platform} className="h-4 w-4" />
              <span>{platform}</span>
            </label>
          </div>
        ))}
      </div>
    );
  }

  // Original single-select functionality
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
