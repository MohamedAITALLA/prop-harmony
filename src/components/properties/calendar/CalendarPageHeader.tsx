
import React from 'react';
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Download, ChevronDown, Copy } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { createICalFeedUrl } from './CalendarUtils';
import { Badge } from "@/components/ui/badge";

interface CalendarPageHeaderProps {
  hasConflicts?: boolean;
  onExport?: (format: string) => void;
  propertyId?: string;
  onAddEvent?: () => void;
  propertyName?: string;
}

export const CalendarPageHeader: React.FC<CalendarPageHeaderProps> = ({
  onExport,
  propertyId,
  propertyName
}) => {
  const handleExport = (format: string) => {
    if (onExport) {
      onExport(format);
    }
  };

  const copyICalFeedUrl = () => {
    if (!propertyId) return;
    const url = createICalFeedUrl(propertyId);
    navigator.clipboard.writeText(url);
  };

  return (
    <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <CalendarIcon className="h-6 w-6 text-primary" />
          {propertyName ? `${propertyName} Calendar` : 'Property Calendar'}
        </h2>
        <p className="text-muted-foreground">Manage bookings and availability</p>
      </div>
      <div className="flex items-center gap-2 self-end sm:self-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1">
              <Download className="h-4 w-4 mr-1" /> Export <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem onClick={() => handleExport("PDF")}>
              Export as PDF
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport("iCal")}>
              Export as iCal
            </DropdownMenuItem>
            {propertyId && (
              <DropdownMenuItem onClick={copyICalFeedUrl}>
                <Copy className="mr-2 h-4 w-4" /> Copy iCal URL
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
