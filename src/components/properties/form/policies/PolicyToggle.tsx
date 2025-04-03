
import React from "react";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "../PropertyFormSchema";

interface PolicyToggleProps {
  form: UseFormReturn<FormValues>;
  name: "petsAllowed" | "smokingAllowed";
  label: string;
}

export function PolicyToggle({ form, name, label }: PolicyToggleProps) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-row items-center justify-between space-x-3 space-y-0 rounded-md border p-4">
          <div className="space-y-0.5">
            <FormLabel>{label}</FormLabel>
          </div>
          <FormControl>
            <Switch
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
}
