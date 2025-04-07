
import React from "react";
import { FileCheck, Image } from "lucide-react";

interface ImagesSummaryProps {
  totalImagesCount: number;
  isEditMode: boolean;
}

export function ImagesSummary({ totalImagesCount, isEditMode }: ImagesSummaryProps) {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <FileCheck className="h-4 w-4" />
      <span>
        {totalImagesCount} {totalImagesCount === 1 ? 'image' : 'images'} selected
        {!isEditMode && totalImagesCount === 0 && ' (at least one image is required)'}
      </span>
    </div>
  );
}
