
import * as React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { ButtonProps, buttonVariants } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  siblingsCount?: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function AdvancedPagination({
  currentPage,
  totalPages,
  siblingsCount = 1,
  onPageChange,
  className,
}: PaginationProps) {
  // Generate array of page numbers to display
  const getPageNumbers = () => {
    const totalPageNumbers = siblingsCount * 2 + 3; // siblings + current + first + last

    // Show all if total pages is less than total page numbers to display
    if (totalPages <= totalPageNumbers) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingsCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingsCount, totalPages);

    // Don't show dots when there is only one page number to be inserted
    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 1;

    if (!shouldShowLeftDots && shouldShowRightDots) {
      // No left dots, show more on the right side
      const leftItemCount = 1 + 2 * siblingsCount;
      const leftRange = Array.from(
        { length: leftItemCount },
        (_, i) => i + 1
      );
      return [...leftRange, "dots", totalPages];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      // No right dots, show more on the left side
      const rightItemCount = 1 + 2 * siblingsCount;
      const rightRange = Array.from(
        { length: rightItemCount },
        (_, i) => totalPages - rightItemCount + i + 1
      );
      return [1, "dots", ...rightRange];
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
      // Show both left and right dots
      const middleRange = Array.from(
        { length: rightSiblingIndex - leftSiblingIndex + 1 },
        (_, i) => leftSiblingIndex + i
      );
      return [1, "dots", ...middleRange, "dots", totalPages];
    }

    return [];
  };

  const pageNumbers = getPageNumbers();

  return (
    <Pagination className={cn("my-4", className)}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => {
              if (currentPage > 1) onPageChange(currentPage - 1);
            }}
            className={cn(
              currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"
            )}
            aria-disabled={currentPage === 1}
          />
        </PaginationItem>

        {pageNumbers.map((pageNumber, i) => (
          <PaginationItem key={i}>
            {pageNumber === "dots" ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                isActive={pageNumber === currentPage}
                onClick={() =>
                  typeof pageNumber === "number" && onPageChange(pageNumber)
                }
                className={cn(
                  typeof pageNumber === "number" && pageNumber === currentPage
                    ? ""
                    : "cursor-pointer"
                )}
              >
                {pageNumber}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            onClick={() => {
              if (currentPage < totalPages) onPageChange(currentPage + 1);
            }}
            className={cn(
              currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"
            )}
            aria-disabled={currentPage === totalPages}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
