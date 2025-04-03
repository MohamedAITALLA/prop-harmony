
import React from "react";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { LucideIcon } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "../PropertyFormSchema";

interface AmenityItemProps {
  form: UseFormReturn<FormValues>;
  name: keyof FormValues; // Restrict to keys of FormValues that are boolean amenities
  label: string;
  icon: LucideIcon;
}

export function AmenityItem({ form, name, label, icon: Icon }: AmenityItemProps) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
          <FormControl>
            <Checkbox
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          </FormControl>
          <div className="space-y-1 leading-none">
            <FormLabel className="flex items-center gap-2">
              <Icon className="h-4 w-4" /> {label}
            </FormLabel>
          </div>
        </FormItem>
      )}
    />
  );
}
