import React, { useState, useEffect } from "react";
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Image, Upload, X, FileCheck, Trash2 } from "lucide-react";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import { FormValues } from "./PropertyFormSchema";
import { Checkbox } from "@/components/ui/checkbox";

interface ImagesSectionProps {
  form: UseFormReturn<FormValues>;
  isEditMode?: boolean;
}

export function ImagesSection({ form, isEditMode = false }: ImagesSectionProps) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "images"
  });
  
  // Store the actual File objects for submission
  const [uploadedImages, setUploadedImages] = useState<{ [key: number]: File | null }>({});
  const [previewUrls, setPreviewUrls] = useState<{ [key: number]: string }>({});
  
  // For tracking existing images to be deleted
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  
  // Initialize preview URLs for existing images
  useEffect(() => {
    const existingImages = form.getValues("images") || [];
    const initialPreviews: { [key: number]: string } = {};
    
    existingImages.forEach((img, index) => {
      if (img.value) {
        initialPreviews[index] = img.value;
      }
    });
    
    setPreviewUrls(initialPreviews);
  }, []);
  
  // Make uploadedImages available on the form element so we can access it during submission
  React.useEffect(() => {
    // @ts-ignore - adding a custom property to the form
    form.uploadedImages = uploadedImages;
    // @ts-ignore - adding a custom property for images to delete
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
      
      // Update the form value to include the preview URL
      const values = [...form.getValues("images") || []];
      values[index] = { value: previewUrl };
      form.setValue("images", values);
    }
  };
  
  const addImageUpload = () => {
    append({ value: "" });
  };
  
  const removeImage = (index: number) => {
    // If this is an existing image (not a new upload), add it to the delete list
    const imageValue = form.getValues(`images.${index}.value`) || "";
    
    // Check if it looks like a URL (existing image) and not a blob URL (new upload)
    if (imageValue && 
        (imageValue.startsWith('http') || imageValue.startsWith('/')) && 
        !imageValue.startsWith('blob:')) {
      setImagesToDelete(prev => [...prev, imageValue]);
    }
    
    // Clean up preview URL if it exists
    if (previewUrls[index]) {
      // Only revoke if it's a blob URL (new image)
      if (previewUrls[index].startsWith('blob:')) {
        URL.revokeObjectURL(previewUrls[index]);
      }
      
      const newPreviewUrls = { ...previewUrls };
      delete newPreviewUrls[index];
      setPreviewUrls(newPreviewUrls);
      
      const newUploadedImages = { ...uploadedImages };
      delete newUploadedImages[index];
      setUploadedImages(newUploadedImages);
    }
    
    remove(index);
  };

  // Remove an image from the delete list (keep it)
  const keepImage = (imageUrl: string) => {
    setImagesToDelete(prev => prev.filter(url => url !== imageUrl));
  };

  // Count how many images are actually selected
  const selectedImagesCount = Object.values(uploadedImages).filter(img => img !== null).length;
  const existingImagesCount = fields.filter(field => {
    const value = field.value;
    return value && (value.startsWith('http') || value.startsWith('/')) && !imagesToDelete.includes(value);
  }).length;
  
  const totalImagesCount = selectedImagesCount + existingImagesCount;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium flex items-center gap-2">
        <Image className="h-4 w-4" /> Property Images
      </h3>
      
      <div className="bg-muted/30 p-3 rounded-md">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <FileCheck className="h-4 w-4" />
          <span>
            {totalImagesCount} {totalImagesCount === 1 ? 'image' : 'images'} selected
            {!isEditMode && totalImagesCount === 0 && ' (at least one image is required)'}
          </span>
        </div>
      </div>
      
      {/* Existing images that are marked for deletion */}
      {imagesToDelete.length > 0 && (
        <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 p-3 rounded-md">
          <h4 className="text-sm font-medium flex items-center gap-2 text-red-700 dark:text-red-400 mb-2">
            <Trash2 className="h-4 w-4" /> Images to delete ({imagesToDelete.length})
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {imagesToDelete.map((imageUrl, idx) => (
              <div key={`delete-${idx}`} className="flex items-center gap-2 bg-white dark:bg-gray-800 p-2 rounded-md">
                <img 
                  src={imageUrl} 
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
                  onClick={() => keepImage(imageUrl)}
                >
                  Keep
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {fields.map((field, index) => (
        <div key={field.id} className="space-y-2">
          <div className="flex items-start gap-2">
            <FormField
              control={form.control}
              name={`images.${index}.value`}
              render={({ field: formField }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <div className="flex flex-col gap-2">
                      <div className="grid grid-cols-1 gap-2">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(index, e.target.files)}
                          className="cursor-pointer"
                        />
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button 
              type="button" 
              variant="destructive"
              size="icon"
              onClick={() => removeImage(index)}
              className="mt-1"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {previewUrls[index] && (
            <div className="relative w-full h-40 overflow-hidden rounded-md border border-border/50">
              <img 
                src={previewUrls[index]} 
                alt={`Preview ${index}`} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  // If the image fails to load, show a placeholder
                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=800&auto=format&fit=crop";
                }}
              />
            </div>
          )}
        </div>
      ))}
      
      <Button
        type="button"
        variant="outline"
        onClick={addImageUpload}
        className="w-full mt-2"
      >
        <Upload className="mr-2 h-4 w-4" /> Add Image
      </Button>
    </div>
  );
}
