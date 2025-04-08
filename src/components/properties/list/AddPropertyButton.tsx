
import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

interface AddPropertyButtonProps {
  onClick: () => void;
}

export function AddPropertyButton({ onClick }: AddPropertyButtonProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button onClick={onClick} className="bg-primary hover:bg-primary/90 text-white">
            <Plus className="w-4 h-4 mr-1" /> Add Property
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Add a new property to your collection</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
