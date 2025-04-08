
import React from 'react';

export const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-background">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-3"></div>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
};
