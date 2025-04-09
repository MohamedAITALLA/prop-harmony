
import React from 'react';
import { Button } from "@/components/ui/button";
import { EventFormFields } from "@/components/properties/calendar/EventFormFields";
import { Platform, EventType } from "@/types/enums";
import { CalendarPlus, CheckCircle, ClipboardList } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface EventFormData {
  property_id: string;
  platform: Platform;
  summary: string;
  start_date: string;
  end_date: string;
  event_type: EventType;
  status: string;
  description: string;
}

interface PropertyEventDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  formData: EventFormData;
  onInputChange: (field: string, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  title?: string;
  description?: string;
  submitLabel?: string;
  readOnly?: boolean;
}

export const PropertyEventDialog: React.FC<PropertyEventDialogProps> = ({
  isOpen,
  onOpenChange,
  formData,
  onInputChange,
  onSubmit,
  title = "Add New Calendar Event",
  description = "Create a new event for this property.",
  submitLabel = "Create Event",
  readOnly = false
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px] p-4">
        <DialogHeader className="pb-2">
          <div className="flex items-center gap-2">
            {readOnly ? (
              <ClipboardList className="h-5 w-5 text-primary" />
            ) : (
              <CalendarPlus className="h-5 w-5 text-primary" />
            )}
            <DialogTitle className="text-lg">{title}</DialogTitle>
          </div>
          <DialogDescription className="text-xs">
            {description}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="py-2">
            <EventFormFields 
              formData={formData}
              onInputChange={onInputChange}
              readOnly={readOnly}
            />
          </div>
          <DialogFooter className="pt-2 border-t">
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={() => onOpenChange(false)}
            >
              {readOnly ? "Close" : "Cancel"}
            </Button>
            {!readOnly && (
              <Button 
                type="submit" 
                size="sm"
                className="flex items-center gap-1.5"
              >
                <CheckCircle className="h-3.5 w-3.5" />
                {submitLabel}
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
