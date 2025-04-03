
import React from "react";
import { Tv } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Property } from "@/types/api-responses";

interface ImagesCardProps {
  property: Property;
}

export function ImagesCard({ property }: ImagesCardProps) {
  // Only render if images exist
  if (!property.images || property.images.length === 0) {
    return null;
  }
  
  return (
    <Card className="shadow-sm border-border/40">
      <CardHeader className="bg-muted/30">
        <CardTitle className="text-xl flex items-center gap-2">
          <Tv className="h-5 w-5 text-primary" />
          Property Images
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {property.images.map((image, index) => {
            // Handle both string and object with value property
            const imageUrl = typeof image === 'string' ? image : (image as any)?.value || '';
            
            // If imageUrl starts with '/' it's a server path, otherwise it's an external URL
            const finalImageUrl = imageUrl.startsWith('/') 
              ? `${import.meta.env.VITE_API_URL || ''}${imageUrl}`
              : imageUrl;
            
            return (
              <div key={index} className="aspect-video overflow-hidden rounded-md shadow-sm border border-border/50">
                <img 
                  src={finalImageUrl} 
                  alt={`${property.name} - ${index + 1}`} 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" 
                  onError={(e) => {
                    // Fallback image if the image fails to load
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=800&auto=format&fit=crop";
                  }}
                />
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
