
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
            const imageUrl = typeof image === 'string' ? image : image.value || '';
            
            return (
              <div key={index} className="aspect-video overflow-hidden rounded-md shadow-sm border border-border/50">
                <img 
                  src={imageUrl} 
                  alt={`${property.name} - ${index + 1}`} 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" 
                />
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
