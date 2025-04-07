
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Bed } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "../PropertyFormSchema";
import { ensureInteger, handleIncrement, handleDecrement } from "./capacityUtils";

interface BedsFieldProps {
  form: UseFormReturn<FormValues>;
}

export function BedsField({ form }: BedsFieldProps) {
  return (
    <FormField
      control={form.control}
      name="beds"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="flex items-center gap-1">
            <Bed className="h-4 w-4" /> Beds
          </FormLabel>
          <FormControl>
            <div className="flex items-center">
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                className="h-9 px-2"
                onClick={() => handleDecrement(form, "beds")}
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
                  field.onChange(ensureInteger(e.target.value));
                }}
              />
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                className="h-9 px-2"
                onClick={() => handleIncrement(form, "beds")}
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
