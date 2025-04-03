
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "../PropertyFormSchema";

interface MinimumStayFieldProps {
  form: UseFormReturn<FormValues>;
}

export function MinimumStayField({ form }: MinimumStayFieldProps) {
  return (
    <FormField
      control={form.control}
      name="minimumStay"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Minimum Stay (nights)</FormLabel>
          <FormControl>
            <Input 
              type="number" 
              min="1" 
              {...field}
              // Ensure the value is treated as a number
              onChange={(e) => field.onChange(Number(e.target.value))}
              value={field.value}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
