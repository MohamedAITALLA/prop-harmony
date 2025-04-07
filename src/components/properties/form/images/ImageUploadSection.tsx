import React, { useState } from "react";
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ImagePlus, X, Upload, Image as ImageIcon } from "lucide-react";
import { useFieldArray, UseFormReturn } from "react-hook-form";
import { FormValues } from "../PropertyFormSchema";

interface ImageUploadSectionProps {
  form: UseFormReturn<FormValues>;
  uploadedImages: { [key: number]: File | null };
  previewUrls: { [key: number]: string };
  onFileChange: (index: number, files: FileList | null) => void;
}

export function ImageUploadSection({
  form,
  uploadedImages,
  previewUrls,
  onFileChange,
}: ImageUploadSectionProps) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "images"
  });
  
  const [showFileInputs, setShowFileInputs] = useState(false);
  
  const addImageUpload = () => {
    // If already showing inputs, just add one more
    // Otherwise initialize with a single input
    if (!showFileInputs) {
      // If we're not showing inputs yet, don't append to existing fields
      // Just initialize with a single field
      if (fields.length === 0) {
        append({ value: "" });
      }
      setShowFileInputs(true);
    } else {
      // Add another input when already showing inputs
      append({ value: "" });
    }
  };
  
  const removeNewImage = (index: number) => {
    // Clean up preview URL if it exists
    if (previewUrls[index]) {
      // Only revoke if it's a blob URL (new image)
      if (previewUrls[index].startsWith('blob:')) {
        URL.revokeObjectURL(previewUrls[index]);
      }
    }
    
    remove(index);
    
    // Hide the inputs if there are no more fields
    if (fields.length <= 1) {
      setShowFileInputs(false);
    }
  };

  return (
    <div className="border rounded-md p-4 bg-background mt-4">
      <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
        <ImagePlus className="h-4 w-4 text-primary" />
        Add new images
      </h4>
      
      {/* Only show file inputs when showFileInputs is true */}
      {showFileInputs && (
        <div className="space-y-4 mb-4">
          {fields.map((field, index) => (
            <div key={field.id} className="space-y-2">
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
                              onChange={(e) => onFileChange(index, e.target.files)}
                              className="cursor-pointer bg-background"
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
        </div>
      )}
      
      <Button
        type="button"
        variant={showFileInputs ? "outline" : "default"}
        onClick={addImageUpload}
        className="w-full"
      >
        <ImagePlus className="mr-2 h-4 w-4" /> {showFileInputs ? "Add Another Image" : "Add Images"}
      </Button>
    </div>
  );
}
