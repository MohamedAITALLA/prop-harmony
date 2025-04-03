
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
import { AlertTriangle, Info, Trash2, X, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const expectedText = "delete";
  
  const isConfirmDisabled = confirmText.toLowerCase() !== expectedText || isDeleting;

  const handleConfirmDelete = async () => {
    if (confirmText.toLowerCase() !== expectedText) return;
    
    setIsDeleting(true);
    
    try {
      onConfirm(preserveHistory);
    } catch (error) {
      console.error("Error in delete confirmation:", error);
      toast({
        title: "Delete failed",
        description: "There was an error deleting the property. Please try again.",
        variant: "destructive"
      });
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
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="preserve-history" 
              checked={preserveHistory}
              onCheckedChange={(checked) => setPreserveHistory(!!checked)}
              disabled={isDeleting}
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
          
          <div className={`p-3 rounded-md flex gap-2 ${preserveHistory ? "bg-amber-50 border border-amber-200" : "bg-red-50 border border-red-200"}`}>
            <Info className={`h-5 w-5 shrink-0 mt-0.5 ${preserveHistory ? "text-amber-600" : "text-red-600"}`} />
            <p className={`text-sm ${preserveHistory ? "text-amber-800" : "text-red-800"}`}>
              {preserveHistory 
                ? "The property will be deactivated but historical data will be preserved for reporting." 
                : "This will permanently delete all property data including historical bookings and sync records."}
            </p>
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
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Property
                </>
              )}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
