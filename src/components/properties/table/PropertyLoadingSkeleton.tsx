
import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";

interface PropertyLoadingSkeletonProps {
  rowCount?: number;
}

export function PropertyLoadingSkeleton({ rowCount = 5 }: PropertyLoadingSkeletonProps) {
  return (
    <>
      {Array.from({ length: rowCount }).map((_, index) => (
        <TableRow key={`loading-${index}`}>
          <TableCell colSpan={6}>
            <div className="h-8 bg-muted animate-pulse rounded-md"></div>
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}
