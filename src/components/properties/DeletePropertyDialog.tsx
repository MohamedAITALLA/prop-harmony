
import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertTriangle, Info } from "lucide-react";

interface DeletePropertyDialogProps {
  propertyName: string;
  isOpen: boolean;
  onConfirm: (preserveHistory: boolean) => void;
  onCancel: () => void;
}

export function DeletePropertyDialog({
  propertyName,
  isOpen,
  onConfirm,
  onCancel,
}: DeletePropertyDialogProps) {
  const [confirmText, setConfirmText] = useState("");
  const [preserveHistory, setPreserveHistory] = useState(true);
  const expectedText = "delete";
  
  const isConfirmDisabled = confirmText.toLowerCase() !== expectedText;

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            <AlertDialogTitle>Delete Property</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="pt-2">
            This action cannot be undone. It will permanently delete the property
            <span className="font-medium text-foreground"> {propertyName} </span>
            and remove all associated data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="space-y-4 py-3">
          <div className="space-y-2">
            <Label htmlFor="confirm-text">Type <strong>delete</strong> to confirm</Label>
            <Input
              id="confirm-text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="delete"
              autoComplete="off"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="preserve-history" 
              checked={preserveHistory}
              onCheckedChange={(checked) => setPreserveHistory(!!checked)} 
            />
            <div className="grid gap-1.5">
              <Label 
                htmlFor="preserve-history" 
                className="text-sm font-medium cursor-pointer"
              >
                Preserve booking history
              </Label>
              <p className="text-xs text-muted-foreground">
                Keeps past bookings and sync records for reporting purposes
              </p>
            </div>
          </div>
          
          <div className="bg-amber-50 border border-amber-200 p-3 rounded-md flex gap-2">
            <Info className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800">
              {preserveHistory 
                ? "The property will be deactivated but historical data will be preserved for reporting." 
                : "This will permanently delete all property data including historical bookings and sync records."}
            </p>
          </div>
        </div>
        
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="outline">Cancel</Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button 
              variant="destructive" 
              disabled={isConfirmDisabled}
              onClick={() => onConfirm(preserveHistory)}
            >
              Delete Property
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
