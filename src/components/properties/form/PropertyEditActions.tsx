
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Save, X } from "lucide-react";
import { useFormContext } from "react-hook-form";

interface PropertyEditActionsProps {
  propertyId: string;
}

export function PropertyEditActions({ propertyId }: PropertyEditActionsProps) {
  const navigate = useNavigate();
  const form = useFormContext();
  
  const handleCancel = () => {
    if (form.formState.isDirty) {
      if (window.confirm("You have unsaved changes. Are you sure you want to cancel?")) {
        navigate(`/properties/${propertyId}`);
      }
    } else {
      navigate(`/properties/${propertyId}`);
    }
  };
  
  return (
    <div className="flex justify-end gap-4 pt-4">
      <Button 
        type="button" 
        variant="outline" 
        onClick={handleCancel}
      >
        <X className="mr-2 h-4 w-4" /> Cancel
      </Button>
      <Button 
        type="submit"
        className="bg-green-600 hover:bg-green-700"
        disabled={form.formState.isSubmitting}
      >
        <Save className="mr-2 h-4 w-4" />
        {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  );
}
