
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "../PropertyFormSchema";
import { Clock } from "lucide-react";

interface CheckInOutFieldProps {
  form: UseFormReturn<FormValues>;
  name: "checkInTime" | "checkOutTime";
  label: string;
}

export function CheckInOutField({ form, name, label }: CheckInOutFieldProps) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5 text-muted-foreground" /> {label}
          </FormLabel>
          <FormControl>
            <Input 
              type="time" 
              {...field} 
              className="font-mono"
              // Provide a default value in case it's undefined
              value={field.value || (name === "checkInTime" ? "15:00" : "11:00")}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
