
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AdvancedPagination } from "@/components/ui/advanced-pagination";

interface PropertyListPaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export function PropertyListPagination({
  currentPage,
  totalPages,
  pageSize,
  onPageChange,
  onPageSizeChange
}: PropertyListPaginationProps) {
  if (totalPages <= 1) return null;
  
  return (
    <div className="flex justify-center mt-8">
      <div className="flex flex-col items-center gap-2">
        <AdvancedPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          className="mt-2"
        />
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Show</span>
          <Select value={pageSize.toString()} onValueChange={(val) => onPageSizeChange(Number(val))}>
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder="12" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="6">6</SelectItem>
              <SelectItem value="12">12</SelectItem>
              <SelectItem value="24">24</SelectItem>
              <SelectItem value="48">48</SelectItem>
            </SelectContent>
          </Select>
          <span>per page</span>
        </div>
      </div>
    </div>
  );
}
