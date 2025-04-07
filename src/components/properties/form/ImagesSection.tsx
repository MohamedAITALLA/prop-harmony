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
  // Field array for new images only
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "images"
  });
  
  // Store the actual File objects for submission
  const [uploadedImages, setUploadedImages] = useState<{ [key: number]: File | null }>({});
  const [previewUrls, setPreviewUrls] = useState<{ [key: number]: string }>({});
  
  // For tracking existing images to be deleted
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  
  // Get existing images from form values
  const existingImageUrls = React.useMemo(() => {
    if (!isEditMode) return [];
    
    // Get the initial values that were loaded into the form
    const allFormImages = form.getValues("images") || [];
    return allFormImages
      .filter(img => img.value && (img.value.startsWith('http') || img.value.startsWith('/')) && !img.value.startsWith('blob:'))
      .map(img => img.value);
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
  
  const addImageUpload = () => {
    append({ value: "" });
  };
  
  const removeNewImage = (index: number) => {
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

  // Toggle an image for deletion
  const toggleImageForDeletion = (imageUrl: string) => {
    if (imagesToDelete.includes(imageUrl)) {
      // Remove from delete list if already there
      setImagesToDelete(prev => prev.filter(url => url !== imageUrl));
    } else {
      // Add to delete list
      setImagesToDelete(prev => [...prev, imageUrl]);
    }
  };
  
  // Count how many images are actually selected
  const selectedNewImagesCount = Object.values(uploadedImages).filter(img => img !== null).length;
  const existingImagesCount = existingImageUrls.length - imagesToDelete.length;
  
  const totalImagesCount = selectedNewImagesCount + existingImagesCount;

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
      
      {/* Existing images gallery with deletion controls - only shown in edit mode */}
      {isEditMode && existingImageUrls.length > 0 && (
        <div className="bg-muted/20 p-4 rounded-md border border-border/50">
          <h4 className="text-sm font-medium mb-3">Select images to delete:</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {existingImageUrls.map((imageUrl, idx) => {
              // Fix image URL if it starts with a slash or contains double paths
              let finalImageUrl = imageUrl;
              if (imageUrl.startsWith('/https://')) {
                finalImageUrl = imageUrl.substring(1);
              }
              
              const isMarkedForDeletion = imagesToDelete.includes(imageUrl);
              
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
                        onCheckedChange={() => toggleImageForDeletion(imageUrl)}
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
                      onClick={() => toggleImageForDeletion(imageUrl)}
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
      )}
      
      {/* Images to delete summary */}
      {imagesToDelete.length > 0 && (
        <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 p-3 rounded-md">
          <h4 className="text-sm font-medium flex items-center gap-2 text-red-700 dark:text-red-400 mb-2">
            <Trash2 className="h-4 w-4" /> Images to delete ({imagesToDelete.length})
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {imagesToDelete.map((imageUrl, idx) => {
              // Fix image URL for display
              let finalImageUrl = imageUrl;
              if (imageUrl.startsWith('/https://')) {
                finalImageUrl = imageUrl.substring(1);
              }
              
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
                    onClick={() => toggleImageForDeletion(imageUrl)}
                  >
                    Keep
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      {/* Add new images section - completely separate from existing images */}
      <div className="border-t pt-4 mt-6">
        <h4 className="text-sm font-medium mb-3">Add new images:</h4>
        {fields.map((field, index) => (
          <div key={field.id} className="space-y-2 mb-4">
            <div className="flex items-start gap-2">
              <FormField
                control={form.control}
                name={`images.${index}.value`}
                render={() => (
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
                onClick={() => removeNewImage(index)}
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
    </div>
  );
}
