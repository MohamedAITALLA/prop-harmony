
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
              // Ensure value is always a number, defaulting to 1
              value={field.value ?? 1}
              onChange={(e) => {
                const value = e.target.value !== "" 
                  ? Number(e.target.value) 
                  : 1;
                field.onChange(value);
              }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
