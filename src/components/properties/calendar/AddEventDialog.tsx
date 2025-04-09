
import React from 'react';
import { PropertyEventDialog } from "@/components/properties/PropertyEventDialog";
import { Platform, EventType } from "@/types/enums";

interface AddEventDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  formData: {
    property_id: string;
    platform: Platform;
    summary: string;
    start_date: string;
    end_date: string;
    event_type: EventType;
    status: string;
    description: string;
  };
  onInputChange: (field: string, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const AddEventDialog: React.FC<AddEventDialogProps> = ({
  isOpen,
  onOpenChange,
  formData,
  onInputChange,
  onSubmit
}) => {
  return (
    <PropertyEventDialog
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      formData={formData}
      onInputChange={onInputChange}
      onSubmit={onSubmit}
      title="New Calendar Event"
      description="Add a new event or booking to your property calendar."
      submitLabel="Create Event"
    />
  );
};
