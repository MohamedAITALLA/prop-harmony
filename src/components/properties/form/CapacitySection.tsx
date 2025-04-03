
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Users } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "./PropertyFormSchema";

interface CapacitySectionProps {
  form: UseFormReturn<FormValues>;
}

export function CapacitySection({ form }: CapacitySectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium flex items-center gap-2">
        <Users className="h-4 w-4" /> Capacity & Rooms
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <FormField
          control={form.control}
          name="bedrooms"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bedrooms</FormLabel>
              <FormControl>
                <Input type="number" min="0" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bathrooms"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bathrooms</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  min="0" 
                  step="0.5" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="beds"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Beds</FormLabel>
              <FormControl>
                <Input type="number" min="0" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="accommodates"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Accommodates</FormLabel>
              <FormControl>
                <Input type="number" min="1" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
