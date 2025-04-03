
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Clock, Check } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "./PropertyFormSchema";

interface PoliciesSectionProps {
  form: UseFormReturn<FormValues>;
}

export function PoliciesSection({ form }: PoliciesSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium flex items-center gap-2">
        <Clock className="h-4 w-4" /> Policies & Rules
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <FormField
          control={form.control}
          name="checkInTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Check-in Time</FormLabel>
              <FormControl>
                <Input type="time" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="checkOutTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Check-out Time</FormLabel>
              <FormControl>
                <Input type="time" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="minimumStay"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Minimum Stay (nights)</FormLabel>
            <FormControl>
              <Input type="number" min="1" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
        <FormField
          control={form.control}
          name="petsAllowed"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between space-x-3 space-y-0 rounded-md border p-4">
              <div className="space-y-0.5">
                <FormLabel>Pets Allowed</FormLabel>
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
        
        <FormField
          control={form.control}
          name="smokingAllowed"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between space-x-3 space-y-0 rounded-md border p-4">
              <div className="space-y-0.5">
                <FormLabel>Smoking Allowed</FormLabel>
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
      </div>
    </div>
  );
}
