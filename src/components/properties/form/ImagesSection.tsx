
import React, { useState } from "react";
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Image, Upload, X } from "lucide-react";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import { FormValues } from "./PropertyFormSchema";

interface ImagesSectionProps {
  form: UseFormReturn<FormValues>;
}

export function ImagesSection({ form }: ImagesSectionProps) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "images"
  });
  
  const [uploadedImages, setUploadedImages] = useState<{ [key: number]: File | null }>({});
  const [previewUrls, setPreviewUrls] = useState<{ [key: number]: string }>({});
  
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
      const values = [...form.getValues("images")];
      values[index] = { value: previewUrl };
      form.setValue("images", values);
    }
  };
  
  const addImageUpload = () => {
    append({ value: "" });
  };
  
  const removeImage = (index: number) => {
    // Clean up preview URL if it exists
    if (previewUrls[index]) {
      URL.revokeObjectURL(previewUrls[index]);
      
      const newPreviewUrls = { ...previewUrls };
      delete newPreviewUrls[index];
      setPreviewUrls(newPreviewUrls);
      
      const newUploadedImages = { ...uploadedImages };
      delete newUploadedImages[index];
      setUploadedImages(newUploadedImages);
    }
    
    remove(index);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium flex items-center gap-2">
        <Image className="h-4 w-4" /> Property Images
      </h3>
      
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
