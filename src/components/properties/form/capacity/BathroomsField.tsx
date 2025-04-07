
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Bath } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "../PropertyFormSchema";
import { handleIncrement, handleDecrement } from "./capacityUtils";

interface BathroomsFieldProps {
  form: UseFormReturn<FormValues>;
}

export function BathroomsField({ form }: BathroomsFieldProps) {
  return (
    <FormField
      control={form.control}
      name="bathrooms"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="flex items-center gap-1">
            <Bath className="h-4 w-4" /> Bathrooms
          </FormLabel>
          <FormControl>
            <div className="flex items-center">
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                className="h-9 px-2"
                onClick={() => handleDecrement(form, "bathrooms")}
              >
                -
              </Button>
              <Input 
                type="number" 
                min="0" 
                step="1"
                className="mx-2 text-center" 
                {...field} 
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  field.onChange(isNaN(value) ? 0 : value);
                }}
              />
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                className="h-9 px-2"
                onClick={() => handleIncrement(form, "bathrooms")}
              >
                +
              </Button>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
