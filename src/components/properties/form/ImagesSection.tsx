
import React, { useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "./PropertyFormSchema";
import { ImagesSummary } from "./images/ImagesSummary";
import { ExistingImagesGallery } from "./images/ExistingImagesGallery";
import { ImageDeletionPreview } from "./images/ImageDeletionPreview";
import { ImageUploadSection } from "./images/ImageUploadSection";
import { Image } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface ImagesSectionProps {
  form: UseFormReturn<FormValues>;
  isEditMode?: boolean;
}

export function ImagesSection({ form, isEditMode = false }: ImagesSectionProps) {
  // Store the actual File objects for submission
  const [uploadedImages, setUploadedImages] = useState<{ [key: number]: File | null }>({});
  const [previewUrls, setPreviewUrls] = useState<{ [key: number]: string }>({});
  
  // For tracking existing images to be deleted
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  
  // Get existing images from form values
  const existingImageUrls = React.useMemo(() => {
    if (!isEditMode) return [];
    
    const allFormImages = form.getValues("images") || [];
    return allFormImages
      .filter(img => img.value)
      .map(img => {
        // Remove leading slash from image URLs
        let imageUrl = img.value;
        if (imageUrl.startsWith('/https://')) {
          imageUrl = imageUrl.substring(1);
        }
        return imageUrl;
      });
  }, [isEditMode, form]);

  // Make uploadedImages and imagesToDelete available on the form element
  React.useEffect(() => {
    // @ts-ignore - adding custom properties to the form
    form.uploadedImages = uploadedImages;
    // @ts-ignore - adding custom properties for images to delete
    form.imagesToDelete = imagesToDelete;
  }, [uploadedImages, imagesToDelete, form]);
  
  const handleFileChange = (index: number, files: FileList | null) => {
    if (files && files.length > 0) {
      const file = files[0];
      
      // Update the uploadedImages state
      setUploadedImages(prev => ({
        ...prev,
        [index]: file
      }));
      
      // Create a preview URL
      const previewUrl = URL.createObjectURL(file);
      setPreviewUrls(prev => ({
        ...prev,
        [index]: previewUrl
      }));
    }
  };
  
  // Toggle an image for deletion
  const toggleImageForDeletion = (imageUrl: string) => {
    // Remove leading slash if present
    let normalizedUrl = imageUrl.startsWith('/https://') ? imageUrl.substring(1) : imageUrl;
    
    if (imagesToDelete.includes(normalizedUrl)) {
      setImagesToDelete(prev => prev.filter(url => url !== normalizedUrl));
    } else {
      setImagesToDelete(prev => [...prev, normalizedUrl]);
    }
  };
  
  // Count how many images are actually selected
  const selectedNewImagesCount = Object.values(uploadedImages).filter(img => img !== null).length;
  const existingImagesCount = existingImageUrls.length - imagesToDelete.length;
  
  const totalImagesCount = selectedNewImagesCount + existingImagesCount;

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium flex items-center gap-2">
          <Image className="h-4 w-4" /> Property Images
        </h3>
      
        <div className="bg-muted/30 p-3 rounded-md mt-2">
          <ImagesSummary totalImagesCount={totalImagesCount} isEditMode={isEditMode} />
        </div>
      </div>
      
      {isEditMode && existingImageUrls.length > 0 && (
        <>
          <ExistingImagesGallery
            imageUrls={existingImageUrls}
            imagesToDelete={imagesToDelete}
            onToggleImageForDeletion={toggleImageForDeletion}
            isEditMode={isEditMode}
          />
          
          <ImageDeletionPreview
            imagesToDelete={imagesToDelete}
            onToggleImageForDeletion={toggleImageForDeletion}
          />
          
          <Separator className="my-4" />
        </>
      )}
      
      <ImageUploadSection
        form={form}
        uploadedImages={uploadedImages}
        previewUrls={previewUrls}
        onFileChange={handleFileChange}
      />
    </div>
  );
}
