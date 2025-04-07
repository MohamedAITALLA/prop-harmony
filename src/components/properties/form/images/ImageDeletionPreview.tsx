
import React from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface ImageDeletionPreviewProps {
  imagesToDelete: string[];
  onToggleImageForDeletion: (imageUrl: string) => void;
}

export function ImageDeletionPreview({
  imagesToDelete,
  onToggleImageForDeletion,
}: ImageDeletionPreviewProps) {
  if (imagesToDelete.length === 0) {
    return null;
  }

  return (
    <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 p-3 rounded-md">
      <h4 className="text-sm font-medium flex items-center gap-2 text-red-700 dark:text-red-400 mb-2">
        <Trash2 className="h-4 w-4" /> Images to delete ({imagesToDelete.length})
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        {imagesToDelete.map((imageUrl, idx) => {
          // Fix image URL for display
          let finalImageUrl = imageUrl.startsWith('/https://') ? imageUrl.substring(1) : imageUrl;
          
          return (
            <div key={`delete-${idx}`} className="flex items-center gap-2 bg-white dark:bg-gray-800 p-2 rounded-md">
              <img 
                src={finalImageUrl} 
                alt={`Delete ${idx}`} 
                className="h-10 w-10 object-cover rounded"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=800&auto=format&fit=crop";
                }}
              />
              <span className="text-xs truncate flex-1">{imageUrl.split('/').pop()}</span>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm"
                onClick={() => onToggleImageForDeletion(imageUrl)}
              >
                Keep
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
