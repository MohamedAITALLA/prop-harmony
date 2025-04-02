
import React from 'react';
import { Button } from "@/components/ui/button";
import { EventFormFields } from "@/components/properties/calendar/EventFormFields";
import { Platform, EventType } from "@/types/enums";
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
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit}>
          <div className="py-4">
            <EventFormFields 
              formData={formData}
              onInputChange={onInputChange}
              readOnly={readOnly}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {readOnly ? "Close" : "Cancel"}
            </Button>
            {!readOnly && <Button type="submit">{submitLabel}</Button>}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
