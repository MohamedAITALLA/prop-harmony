
import React from 'react';
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";

interface EventDialogFooterProps {
  onClose: () => void;
  onDelete?: () => void;
  onSubmit?: () => void;
  isReadOnly?: boolean;
  submitLabel?: string;
  closeLabel?: string;
}

export const EventDialogFooter: React.FC<EventDialogFooterProps> = ({
  onClose,
  onDelete,
  onSubmit,
  isReadOnly = false,
  submitLabel = "Save",
  closeLabel = "Close"
}) => {
  return (
    <DialogFooter>
      {onDelete && (
        <Button 
          type="button" 
          variant="destructive" 
          onClick={onDelete}
        >
          Delete Event
        </Button>
      )}
      <Button 
        type="button" 
        variant="outline" 
        onClick={onClose}
      >
        {isReadOnly ? closeLabel : "Cancel"}
      </Button>
      {!isReadOnly && onSubmit && (
        <Button 
          type="submit"
          onClick={typeof onSubmit === 'function' ? onSubmit : undefined}
        >
          {submitLabel}
        </Button>
      )}
    </DialogFooter>
  );
};
