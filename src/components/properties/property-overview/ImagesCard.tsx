
import React, { useEffect, useState } from "react";
import { GalleryHorizontal } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Property } from "@/types/api-responses";
import { ImageGallery } from "./ImageGallery";
import { NoImagesPlaceholder } from "./NoImagesPlaceholder";

interface ImagesCardProps {
  property: Property;
}

export function ImagesCard({ property }: ImagesCardProps) {
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  
  useEffect(() => {
    if (!property.images || property.images.length === 0) {
      setImageUrls([]);
      return;
    }
    
    // Process image URLs to remove leading slash
    const processedUrls = property.images.map(image => {
      let imageUrl = typeof image === 'string' ? image : (image as any)?.value || '';
      
      // Remove leading slash from URLs starting with '/https://'
      if (imageUrl.startsWith('/https://')) {
        imageUrl = imageUrl.substring(1);
      }
      
      return imageUrl;
    }).filter(url => url);
    
    console.log("Processed image URLs:", processedUrls);
    setImageUrls(processedUrls);
  }, [property.images]);
  
  return (
    <Card className="shadow-sm border-border/40">
      <CardHeader className="bg-muted/30">
        <CardTitle className="text-xl flex items-center gap-2">
          <GalleryHorizontal className="h-5 w-5 text-primary" />
          Property Images ({imageUrls.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        {imageUrls.length > 0 ? (
          <ImageGallery imageUrls={imageUrls} propertyName={property.name} />
        ) : (
          <NoImagesPlaceholder />
        )}
      </CardContent>
    </Card>
  );
}
