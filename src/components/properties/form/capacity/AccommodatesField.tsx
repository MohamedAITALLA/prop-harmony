
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "../PropertyFormSchema";
import { ensureInteger, handleIncrement, handleAccommodatesDecrement } from "./capacityUtils";

interface AccommodatesFieldProps {
  form: UseFormReturn<FormValues>;
}

export function AccommodatesField({ form }: AccommodatesFieldProps) {
  return (
    <FormField
      control={form.control}
      name="accommodates"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="flex items-center gap-1">
            <Users className="h-4 w-4" /> Accommodates
          </FormLabel>
          <FormControl>
            <div className="flex items-center">
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                className="h-9 px-2"
                onClick={() => handleAccommodatesDecrement(form)}
              >
                -
              </Button>
              <Input 
                type="number" 
                min="1" 
                step="1"
                className="mx-2 text-center" 
                {...field} 
                onChange={(e) => {
                  const value = ensureInteger(e.target.value);
                  field.onChange(Math.max(1, value)); // Ensure at least 1
                }}
              />
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                className="h-9 px-2"
                onClick={() => handleIncrement(form, "accommodates")}
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
