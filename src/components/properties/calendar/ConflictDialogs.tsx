
import React from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { AlertTriangle } from "lucide-react";
import { ConflictResolver } from "@/components/ui/conflict-resolver";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ConflictDialogsProps {
  isConflictDialogOpen: boolean;
  setIsConflictDialogOpen: (open: boolean) => void;
  isConflictResolverOpen: boolean;
  setIsConflictResolverOpen: (open: boolean) => void;
  conflictDetails: any;
  conflictingEvents: any[];
  propertyId: string;
  onResolveConflicts: () => void;
  onConflictResolution: () => void;
  refetchEvents: () => void;
  resetEventForm: () => void;
  setIsAddEventOpen: (open: boolean) => void;
}

export const ConflictDialogs: React.FC<ConflictDialogsProps> = ({
  isConflictDialogOpen,
  setIsConflictDialogOpen,
  isConflictResolverOpen,
  setIsConflictResolverOpen,
  conflictDetails,
  conflictingEvents,
  propertyId,
  onResolveConflicts,
  onConflictResolution,
  refetchEvents,
  resetEventForm,
  setIsAddEventOpen
}) => {
  return (
    <>
      <Dialog open={isConflictDialogOpen} onOpenChange={setIsConflictDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle className="flex items-center text-red-600">
              <AlertTriangle className="mr-2 h-5 w-5" />
              Booking Conflict Detected
            </DialogTitle>
            <DialogDescription>
              Your new event conflicts with {conflictDetails?.conflicts_detected || 0} existing events.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <div className="p-3 bg-red-50 border border-red-100 rounded-md">
              <p>The event you're trying to create overlaps with existing bookings. Would you like to:</p>
              <ul className="mt-2 space-y-2 list-disc pl-4">
                <li>Proceed anyway (may cause double bookings)</li>
                <li>Cancel and edit the event dates</li>
                <li>View the conflicts and resolve them</li>
              </ul>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsConflictDialogOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={() => {
                toast.success("Event created despite conflicts");
                setIsConflictDialogOpen(false);
                setIsAddEventOpen(false);
                refetchEvents();
                resetEventForm();
              }}
            >
              Create Anyway
            </Button>
            <Button
              variant="destructive"
              onClick={onResolveConflicts}
            >
              Resolve Conflicts
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isConflictResolverOpen} onOpenChange={setIsConflictResolverOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Resolve Booking Conflict</DialogTitle>
            <DialogDescription>
              Please choose how to resolve this booking conflict
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-2">
            <ConflictResolver
              conflictId="current-conflict"
              propertyId={propertyId}
              events={conflictingEvents}
              onResolve={onConflictResolution}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
