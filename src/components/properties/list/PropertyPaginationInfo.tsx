
import React from "react";

interface PropertyPaginationInfoProps {
  count: number;
  pagination?: {
    total: number;
    page: number;
    pages: number;
  };
}

export function PropertyPaginationInfo({ count, pagination }: PropertyPaginationInfoProps) {
  return (
    <div className="flex justify-between items-center text-sm text-muted-foreground border-b pb-3">
      <div>
        Showing {count} properties
        {pagination && ` of ${pagination.total}`}
      </div>
      {pagination && (
        <div>
          Page {pagination.page} of {pagination.pages}
        </div>
      )}
    </div>
  );
}
