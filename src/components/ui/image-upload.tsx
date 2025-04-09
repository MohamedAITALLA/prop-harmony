
import React, { useState } from 'react';
import { Button } from './button';
import { Upload, X, Loader2 } from 'lucide-react';

interface ImageUploadProps {
  currentImageUrl?: string;
  onImageUpload: (file: File) => void;
  onImageRemove?: () => void;
  className?: string;
  isLoading?: boolean;
}

export function ImageUpload({ 
  currentImageUrl, 
  onImageUpload, 
  onImageRemove,
  className,
  isLoading = false
}: ImageUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageUpload(file);
      
      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleRemove = () => {
    setPreviewUrl(null);
    if (onImageRemove) {
      onImageRemove();
    }
  };
  
  const displayUrl = previewUrl || currentImageUrl;
  
  return (
    <div className={className}>
      <div className="flex flex-col items-center">
        {displayUrl ? (
          <div className="relative mb-4">
            <img 
              src={displayUrl} 
              alt="Preview" 
              className="w-32 h-32 object-cover rounded-full"
            />
            {onImageRemove && (
              <button 
                type="button"
                onClick={handleRemove}
                className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground p-1 rounded-full"
              >
                <X size={16} />
              </button>
            )}
          </div>
        ) : (
          <div className="w-32 h-32 bg-muted rounded-full flex items-center justify-center mb-4">
            <Upload className="h-8 w-8 text-muted-foreground" />
          </div>
        )}
        
        <div>
          <input
            type="file"
            id="image-upload"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            disabled={isLoading}
          />
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => document.getElementById('image-upload')?.click()}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              displayUrl ? 'Change Image' : 'Upload Image'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
