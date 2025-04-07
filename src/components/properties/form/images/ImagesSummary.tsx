
import React from "react";
import { FileCheck, Image } from "lucide-react";

interface ImagesSummaryProps {
  totalImagesCount: number;
  isEditMode: boolean;
}

export function ImagesSummary({ totalImagesCount, isEditMode }: ImagesSummaryProps) {
  return (
    <div>
      <h3 className="text-lg font-medium flex items-center gap-2">
        <Image className="h-4 w-4" /> Property Images
      </h3>
      
      <div className="bg-muted/30 p-3 rounded-md mt-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <FileCheck className="h-4 w-4" />
          <span>
            {totalImagesCount} {totalImagesCount === 1 ? 'image' : 'images'} selected
            {!isEditMode && totalImagesCount === 0 && ' (at least one image is required)'}
          </span>
        </div>
      </div>
    </div>
  );
}
