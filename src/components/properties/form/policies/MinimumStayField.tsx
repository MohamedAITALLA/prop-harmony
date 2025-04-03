
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "../PropertyFormSchema";
import { Clock } from "lucide-react";

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
          <FormLabel className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5 text-muted-foreground" /> Minimum Stay (nights)
          </FormLabel>
          <FormControl>
            <Input 
              type="number" 
              min="1"
              {...field}
              // Parse the field value as a number for controlled component
              value={field.value !== undefined && field.value !== "" ? field.value : 1}
              // Convert to number on change
              onChange={(e) => {
                const value = e.target.value !== "" ? parseInt(e.target.value, 10) : "";
                field.onChange(value === "" ? 1 : value);
              }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
