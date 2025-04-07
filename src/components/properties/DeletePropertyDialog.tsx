
import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, X, Archive } from "lucide-react";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";

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
  const [isDeleting, setIsDeleting] = useState(false);
  const [preserveHistory, setPreserveHistory] = useState(true);
  const expectedText = "delete";
  
  const isConfirmDisabled = confirmText.toLowerCase() !== expectedText || isDeleting;

  const handleConfirmDelete = async () => {
    if (confirmText.toLowerCase() !== expectedText) return;
    
    setIsDeleting(true);
    
    try {
      onConfirm(preserveHistory);
    } catch (error) {
      console.error("Error in delete confirmation:", error);
      toast.error("Delete failed. There was an error deleting the property. Please try again.");
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center gap-2 text-destructive">
            <Trash2 className="h-5 w-5" />
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
              disabled={isDeleting}
            />
          </div>
          
          <div className="flex items-start space-x-2">
            <Checkbox 
              id="preserve-history" 
              checked={preserveHistory} 
              onCheckedChange={(checked) => setPreserveHistory(checked === true)}
            />
            <div className="grid gap-1.5 leading-none">
              <Label
                htmlFor="preserve-history"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Preserve historical data
              </Label>
              <p className="text-sm text-muted-foreground">
                Keep historical booking data for reporting while making the property inactive.
              </p>
            </div>
          </div>
          
          <div className={`p-3 rounded-md flex gap-2 ${preserveHistory ? 'bg-amber-50 border border-amber-200' : 'bg-red-50 border border-red-200'}`}>
            <AlertDialogDescription className={preserveHistory ? 'text-amber-800' : 'text-red-800'}>
              {preserveHistory 
                ? "The property will be made inactive but historical data will be preserved for reporting purposes."
                : "This will permanently delete all property data including historical bookings and sync records."}
            </AlertDialogDescription>
          </div>
        </div>
        
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="outline" disabled={isDeleting} className="flex items-center">
              <X className="mr-2 h-4 w-4" /> Cancel
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button 
              variant="destructive" 
              disabled={isConfirmDisabled}
              onClick={handleConfirmDelete}
              className="flex items-center"
            >
              {isDeleting ? (
                <>
                  <span className="inline-block h-4 w-4 mr-2 rounded-full border-2 border-t-transparent border-white animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  {preserveHistory ? (
                    <Archive className="mr-2 h-4 w-4" />
                  ) : (
                    <Trash2 className="mr-2 h-4 w-4" />
                  )}
                  {preserveHistory ? 'Archive Property' : 'Delete Property'}
                </>
              )}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
