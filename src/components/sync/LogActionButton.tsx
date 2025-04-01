
import React from "react";
import { Button } from "@/components/ui/button";
import { SyncLog } from "@/types/api-responses";
import { Info } from "lucide-react";

interface LogActionButtonProps {
  row: SyncLog;
  onViewDetails: (log: SyncLog) => void;
}

export function LogActionButton({ row, onViewDetails }: LogActionButtonProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => onViewDetails(row)}
      className="h-8 px-2"
    >
      <Info className="h-4 w-4 mr-1" />
      <span>Details</span>
    </Button>
  );
}
