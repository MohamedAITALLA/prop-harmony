
import React, { useEffect, useState } from "react";
import { GalleryHorizontal, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Property } from "@/types/api-responses";
import { Button } from "@/components/ui/button";

interface ImagesCardProps {
  property: Property;
}

export function ImagesCard({ property }: ImagesCardProps) {
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  
  // Use effect to process images whenever property changes
  useEffect(() => {
    if (!property.images || property.images.length === 0) {
      setImageUrls([]);
      return;
    }
    
    // Process image URLs
    const processedUrls = property.images.map(image => {
      // Handle both string and object with value property
      let imageUrl = typeof image === 'string' ? image : (image as any)?.value || '';
      
      // Fix image URL if it starts with a slash or contains double paths
      if (imageUrl.startsWith('/https://')) {
        imageUrl = imageUrl.substring(1);
      }
      
      return imageUrl;
    }).filter(url => url); // Filter out any empty URLs
    
    console.log("Processed image URLs:", processedUrls);
    setImageUrls(processedUrls);
  }, [property.images]);
  
  // Only render if images exist
  if (!imageUrls || imageUrls.length === 0) {
    return (
      <Card className="shadow-sm border-border/40">
        <CardHeader className="bg-muted/30">
          <CardTitle className="text-xl flex items-center gap-2">
            <GalleryHorizontal className="h-5 w-5 text-primary" />
            Property Images (0)
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 flex justify-center items-center h-32 text-muted-foreground">
          No images available for this property
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="shadow-sm border-border/40">
      <CardHeader className="bg-muted/30">
        <CardTitle className="text-xl flex items-center gap-2">
          <GalleryHorizontal className="h-5 w-5 text-primary" />
          Property Images ({imageUrls.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {imageUrls.map((imageUrl, index) => (
            <div key={`${index}-${imageUrl}`} className="aspect-video overflow-hidden rounded-md shadow-sm border border-border/50">
              <img 
                src={imageUrl} 
                alt={`${property.name} - ${index + 1}`} 
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
      </CardContent>
    </Card>
  );
}
