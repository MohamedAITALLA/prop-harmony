
import React from 'react';
import { Button } from "@/components/ui/button";
import { Download, ChevronDown, Plus, AlertTriangle } from "lucide-react";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { FileText, Calendar as CalendarIcon, Copy } from "lucide-react";
import { createICalFeedUrl } from './CalendarUtils';
import { toast } from 'sonner';

interface CalendarHeaderProps {
  hasConflicts?: boolean;
  onViewConflicts?: () => void;
  onAddEvent: () => void;
  onExport?: (format: string) => void;
  copyICalFeedUrl: () => void;
  propertyId: string;
}

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  hasConflicts,
  onViewConflicts,
  onAddEvent,
  onExport,
  copyICalFeedUrl,
  propertyId
}) => {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-xl font-semibold">Property Calendar</h2>
      <div className="flex space-x-2">
        {hasConflicts && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="destructive" 
                  onClick={onViewConflicts}
                  className="flex items-center gap-1"
                >
                  <AlertTriangle className="mr-1 h-4 w-4" />
                  View Conflicts
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>This property has booking conflicts that need attention</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        <Button onClick={onAddEvent}>
          <Plus className="mr-2 h-4 w-4" />
          Add Event
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => onExport && onExport("PDF")}>
              <FileText className="mr-2 h-4 w-4" />
              Export as PDF
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onExport && onExport("iCal")}>
              <CalendarIcon className="mr-2 h-4 w-4" />
              Export as iCal
            </DropdownMenuItem>
            {propertyId && (
              <DropdownMenuItem onClick={copyICalFeedUrl}>
                <Copy className="mr-2 h-4 w-4" />
                Copy iCal URL
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
