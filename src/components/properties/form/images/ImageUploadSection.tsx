
import React, { useState } from "react";
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ImagePlus, Upload, X, Image as ImageIcon, CheckCircle2 } from "lucide-react";
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
  
  const [isUploadActive, setIsUploadActive] = useState(false);
  
  // Toggle image upload section visibility
  const toggleUploadSection = () => {
    if (!isUploadActive) {
      // Add a new empty field when first showing the upload section
      if (fields.length === 0) {
        append({ value: "" });
      }
    }
    setIsUploadActive(!isUploadActive);
  };
  
  // Add another image upload field
  const addImageUpload = () => {
    append({ value: "" });
  };
  
  // Remove an image upload field
  const removeImageUpload = (index: number) => {
    // Clean up preview URL if it exists
    if (previewUrls[index]) {
      // Only revoke if it's a blob URL (new image)
      if (previewUrls[index].startsWith('blob:')) {
        URL.revokeObjectURL(previewUrls[index]);
      }
    }
    
    remove(index);
    
    // Hide the section if no fields remain
    if (fields.length <= 1) {
      setIsUploadActive(false);
    }
  };

  // Count the number of actual files selected
  const selectedFilesCount = Object.values(uploadedImages).filter(Boolean).length;

  return (
    <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
      <div className="bg-muted/30 p-4 flex justify-between items-center">
        <h4 className="text-sm font-medium flex items-center gap-2">
          <ImagePlus className="h-4 w-4 text-primary" />
          Add new images
        </h4>
        
        <Button
          type="button"
          variant={isUploadActive ? "outline" : "default"}
          size="sm"
          onClick={toggleUploadSection}
          className="gap-2"
        >
          {isUploadActive ? (
            <>Hide upload</>
          ) : (
            <><Upload className="h-4 w-4" /> Upload images</>
          )}
        </Button>
      </div>
      
      {isUploadActive && (
        <div className="p-4 space-y-4">
          {/* Selected files count */}
          {selectedFilesCount > 0 && (
            <div className="flex items-center gap-2 text-sm bg-primary/10 text-primary rounded p-2">
              <CheckCircle2 className="h-4 w-4" />
              <span>{selectedFilesCount} {selectedFilesCount === 1 ? 'file' : 'files'} selected</span>
            </div>
          )}
          
          {/* File inputs */}
          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="space-y-2">
                <div className="flex items-start gap-2">
                  <FormField
                    control={form.control}
                    name={`images.${index}.value`}
                    render={() => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <div className="grid grid-cols-1 gap-2">
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={(e) => onFileChange(index, e.target.files)}
                              className="cursor-pointer bg-background hover:bg-accent/50 transition-colors"
                            />
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
                    onClick={() => removeImageUpload(index)}
                    className="shrink-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                {/* Preview section */}
                {previewUrls[index] && (
                  <div className="relative group rounded-md overflow-hidden border border-input">
                    <div className="aspect-video w-full overflow-hidden bg-muted/20">
                      <img 
                        src={previewUrls[index]} 
                        alt={`Preview ${index + 1}`} 
                        className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=800&auto=format&fit=crop";
                        }}
                      />
                    </div>
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeImageUpload(index)}
                        className="gap-1"
                      >
                        <X className="h-3 w-3" /> Remove
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {/* Add another image button */}
          <Button
            type="button"
            variant="outline"
            onClick={addImageUpload}
            className="w-full mt-2 border-dashed"
          >
            <ImagePlus className="mr-2 h-4 w-4" /> Add Another Image
          </Button>
        </div>
      )}
      
      {/* Empty state when upload is not active */}
      {!isUploadActive && (
        <div className="p-6 flex flex-col items-center justify-center text-center space-y-3 border-t">
          <div className="bg-primary/10 p-3 rounded-full">
            <ImageIcon className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-medium">Upload property images</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Add high-quality photos to showcase your property
            </p>
          </div>
          <Button
            type="button"
            onClick={toggleUploadSection}
            className="mt-2"
          >
            <Upload className="mr-2 h-4 w-4" /> Select Files
          </Button>
        </div>
      )}
    </div>
  );
}
