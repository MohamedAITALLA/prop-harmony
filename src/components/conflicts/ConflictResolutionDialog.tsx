
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ConflictSeverity, ConflictType, Platform } from "@/types/enums";
import { Conflict } from "@/types/api-responses";

interface ConflictResolutionDialogProps {
  conflict: Conflict;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onResolve: (conflictId: string, resolution: string, notes: string) => void;
}

export function ConflictResolutionDialog({
  conflict,
  open,
  onOpenChange,
  onResolve
}: ConflictResolutionDialogProps) {
  const [resolution, setResolution] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  
  const handleResolve = () => {
    onResolve(conflict._id, resolution, notes);
    setResolution("");
    setNotes("");
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Resolve Conflict</DialogTitle>
          <DialogDescription>
            Choose how you want to resolve this booking conflict
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <RadioGroup value={resolution} onValueChange={setResolution} className="space-y-4">
            <div className="flex items-start space-x-3">
              <RadioGroupItem value="keep_first" id="keep_first" />
              <div>
                <Label htmlFor="keep_first">Keep first booking</Label>
                <p className="text-sm text-muted-foreground">
                  Keep the first booking and cancel the others.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <RadioGroupItem value="keep_last" id="keep_last" />
              <div>
                <Label htmlFor="keep_last">Keep last booking</Label>
                <p className="text-sm text-muted-foreground">
                  Keep the most recent booking and cancel the others.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <RadioGroupItem value="cancel_all" id="cancel_all" />
              <div>
                <Label htmlFor="cancel_all">Cancel all bookings</Label>
                <p className="text-sm text-muted-foreground">
                  Cancel all conflicting bookings.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <RadioGroupItem value="manual" id="manual" />
              <div>
                <Label htmlFor="manual">Manual resolution</Label>
                <p className="text-sm text-muted-foreground">
                  Resolve this conflict manually outside the system.
                </p>
              </div>
            </div>
          </RadioGroup>
          
          <div className="mt-4">
            <Label htmlFor="notes">Notes</Label>
            <Textarea 
              id="notes" 
              placeholder="Add any notes about this resolution..." 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mt-2"
              rows={3}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleResolve}
            disabled={!resolution}
          >
            Resolve Conflict
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
