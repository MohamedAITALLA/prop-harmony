
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
          <FormLabel>Minimum Stay (Nights)</FormLabel>
          <FormControl>
            <Input 
              type="number" 
              min="1"
              {...field}
              value={field.value}
              onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
