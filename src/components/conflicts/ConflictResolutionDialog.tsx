
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Conflict, ConflictStatus } from "@/types/enums";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ConflictResolutionDialogProps {
  conflict: any; // Using any for now to avoid more type issues
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onResolve: () => void;
}

export function ConflictResolutionDialog({
  conflict,
  open,
  onOpenChange,
  onResolve
}: ConflictResolutionDialogProps) {
  const [resolution, setResolution] = useState("reschedule");
  const [notes, setNotes] = useState("");

  const handleSubmit = () => {
    onResolve();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Resolve Conflict</DialogTitle>
          <DialogDescription>
            Select a resolution for this booking conflict
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <h3 className="font-medium">Conflict Details</h3>
            <p className="text-sm text-muted-foreground">{conflict.description}</p>
          </div>

          <div className="space-y-3">
            <h3 className="font-medium">Resolution Type</h3>
            <RadioGroup value={resolution} onValueChange={setResolution}>
              <div className="flex items-start space-x-2">
                <RadioGroupItem value="reschedule" id="reschedule" />
                <div className="grid gap-1">
                  <Label htmlFor="reschedule">Reschedule Booking</Label>
                  <p className="text-sm text-muted-foreground">
                    Move one booking to different dates
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <RadioGroupItem value="cancel" id="cancel" />
                <div className="grid gap-1">
                  <Label htmlFor="cancel">Cancel Booking</Label>
                  <p className="text-sm text-muted-foreground">
                    Cancel one of the conflicting bookings
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <RadioGroupItem value="override" id="override" />
                <div className="grid gap-1">
                  <Label htmlFor="override">Override</Label>
                  <p className="text-sm text-muted-foreground">
                    Accept the overlap (for maintenance, blocking, etc.)
                  </p>
                </div>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Resolution Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter details about how you resolved this conflict"
              rows={4}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Resolve Conflict
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
