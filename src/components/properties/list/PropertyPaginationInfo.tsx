
import React from "react";
import { motion } from "framer-motion";

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
    <motion.div 
      className="flex justify-between items-center text-sm text-muted-foreground border-b pb-3"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center">
        <span className="font-medium text-primary mr-1">{count}</span> 
        <span>properties</span>
        {pagination && (
          <span className="ml-1">
            of <span className="font-medium text-primary">{pagination.total}</span>
          </span>
        )}
      </div>
      {pagination && (
        <div className="flex items-center gap-1 bg-accent px-3 py-1 rounded-full">
          <span>Page</span>
          <span className="font-medium text-primary">{pagination.page}</span>
          <span>of</span>
          <span className="font-medium text-primary">{pagination.pages}</span>
        </div>
      )}
    </motion.div>
  );
}
