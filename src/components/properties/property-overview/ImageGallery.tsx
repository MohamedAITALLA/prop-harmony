
import React from "react";

interface ImageGalleryProps {
  imageUrls: string[];
  propertyName: string;
}

export function ImageGallery({ imageUrls, propertyName }: ImageGalleryProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {imageUrls.map((imageUrl, index) => (
        <div key={`${index}-${imageUrl}`} className="aspect-video overflow-hidden rounded-md shadow-sm border border-border/50">
          <img 
            src={imageUrl} 
            alt={`${propertyName} - ${index + 1}`} 
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" 
            onError={(e) => {
              // Fallback image if the image fails to load
              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=800&auto=format&fit=crop";
              console.error(`Failed to load image at ${imageUrl}`);
            }}
          />
        </div>
      ))}
    </div>
  );
}
