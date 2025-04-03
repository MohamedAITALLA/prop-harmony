
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
              // Ensure the value is always defined as a number
              value={field.value || 1}
              // Ensure the value is treated as a number
              onChange={(e) => {
                const value = parseInt(e.target.value, 10);
                field.onChange(isNaN(value) ? 1 : value);
              }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
