
import React from "react";
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Image } from "lucide-react";
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
  
  const addImageUrl = () => {
    append({ value: "" });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium flex items-center gap-2">
        <Image className="h-4 w-4" /> Property Images
      </h3>
      
      {fields.map((field, index) => (
        <div key={field.id} className="flex items-center gap-2">
          <FormField
            control={form.control}
            name={`images.${index}`}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input placeholder="Image URL" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button 
            type="button" 
            variant="destructive"
            size="icon"
            onClick={() => remove(index)}
            disabled={fields.length <= 1}
          >
            x
          </Button>
        </div>
      ))}
      
      <Button
        type="button"
        variant="outline"
        onClick={addImageUrl}
        className="w-full mt-2"
      >
        <Image className="mr-2 h-4 w-4" /> Add Another Image URL
      </Button>
    </div>
  );
}
