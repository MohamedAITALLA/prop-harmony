
import React from "react";
import { PropertyConflictsList } from "@/components/conflicts/PropertyConflictsList";

interface ConflictsTabContentProps {
  propertyId: string;
}

export function ConflictsTabContent({ propertyId }: ConflictsTabContentProps) {
  return (
    <div className="border rounded-md">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold">Calendar Conflicts</h2>
        <p className="text-muted-foreground">Review and resolve calendar conflicts for this property</p>
      </div>
      {propertyId && <PropertyConflictsList propertyId={propertyId} />}
    </div>
  );
}
