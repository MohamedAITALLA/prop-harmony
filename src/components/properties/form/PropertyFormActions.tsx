
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface PropertyFormActionsProps {
  onSubmit: () => void;
}

export function PropertyFormActions({ onSubmit }: PropertyFormActionsProps) {
  const navigate = useNavigate();
  
  return (
    <div className="flex justify-end gap-4 pt-4">
      <Button 
        type="button" 
        variant="outline" 
        onClick={() => navigate("/properties")}
      >
        Cancel
      </Button>
      <Button type="submit" onClick={onSubmit}>Create Property</Button>
    </div>
  );
}
