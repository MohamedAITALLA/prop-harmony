
import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CompletionBadgeProps {
  value: boolean;
  className?: string;
}

const CompletionBadge = ({ value, className }: CompletionBadgeProps) => {
  return (
    <div 
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        value 
          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" 
          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
        className
      )}
    >
      {value ? (
        <>
          <CheckCircle className="mr-1 h-3 w-3" />
          Completed
        </>
      ) : (
        <>
          <XCircle className="mr-1 h-3 w-3" />
          Pending
        </>
      )}
    </div>
  );
};

export default CompletionBadge;
