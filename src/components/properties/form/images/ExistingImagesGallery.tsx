
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface ExistingImagesGalleryProps {
  imageUrls: string[];
  imagesToDelete: string[];
  onToggleImageForDeletion: (imageUrl: string) => void;
  isEditMode: boolean;
}

export function ExistingImagesGallery({
  imageUrls,
  imagesToDelete,
  onToggleImageForDeletion,
  isEditMode,
}: ExistingImagesGalleryProps) {
  if (!isEditMode || imageUrls.length === 0) {
    return null;
  }

  return (
    <div className="bg-muted/20 p-4 rounded-md border border-border/50">
      <h4 className="text-sm font-medium mb-3">Select images to delete:</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {imageUrls.map((imageUrl, idx) => {
          // Ensure URL is normalized
          let finalImageUrl = imageUrl.startsWith('/https://') ? imageUrl.substring(1) : imageUrl;
          
          const isMarkedForDeletion = imagesToDelete.includes(finalImageUrl);
          
          return (
            <div 
              key={`existing-${idx}`} 
              className={`rounded-md border overflow-hidden transition-all ${
                isMarkedForDeletion 
                  ? 'border-red-400 dark:border-red-700 bg-red-50 dark:bg-red-950/30' 
                  : 'border-border'
              }`}
            >
              <div className="relative">
                <img 
                  src={finalImageUrl} 
                  alt={`Property image ${idx + 1}`} 
                  className={`w-full h-32 object-cover ${
                    isMarkedForDeletion ? 'opacity-50' : ''
                  }`}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=800&auto=format&fit=crop";
                  }}
                />
                <div className="absolute top-2 right-2">
                  <Checkbox 
                    id={`delete-image-${idx}`}
                    checked={isMarkedForDeletion}
                    onCheckedChange={() => onToggleImageForDeletion(imageUrl)}
                    className="h-5 w-5 border-2 border-white bg-white/80 data-[state=checked]:bg-red-500"
                  />
                </div>
              </div>
              <div className="p-2 flex justify-between items-center">
                <span className="text-xs truncate max-w-[160px]">
                  {isMarkedForDeletion ? 'Marked for deletion' : 'Keep image'}
                </span>
                <Button
                  type="button"
                  variant={isMarkedForDeletion ? "default" : "destructive"}
                  size="sm"
                  onClick={() => onToggleImageForDeletion(imageUrl)}
                  className="h-7 px-2"
                >
                  {isMarkedForDeletion ? 'Keep' : 'Delete'}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
