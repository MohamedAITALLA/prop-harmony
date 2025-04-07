
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Users, Bed, Bath } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "./PropertyFormSchema";
import { Button } from "@/components/ui/button";

interface CapacitySectionProps {
  form: UseFormReturn<FormValues>;
}

export function CapacitySection({ form }: CapacitySectionProps) {
  // Ensure values are integers (except for bathrooms which can be decimal)
  const ensureInteger = (value: string): number => {
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? 0 : parsed;
  };

  const handleIncrement = (field: keyof FormValues) => {
    const currentValue = form.getValues(field);
    form.setValue(field, ensureInteger(String(currentValue)) + 1);
  };

  const handleDecrement = (field: keyof FormValues) => {
    const currentValue = form.getValues(field);
    const newValue = Math.max(0, ensureInteger(String(currentValue)) - 1);
    form.setValue(field, newValue);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium flex items-center gap-2">
        <Users className="h-4 w-4" /> Capacity & Rooms
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Bedrooms - Integer only */}
        <FormField
          control={form.control}
          name="bedrooms"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1">
                <Bed className="h-4 w-4" /> Bedrooms
              </FormLabel>
              <FormControl>
                <div className="flex items-center">
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    className="h-9 px-2"
                    onClick={() => handleDecrement("bedrooms")}
                  >
                    -
                  </Button>
                  <Input 
                    type="number" 
                    min="0" 
                    step="1"
                    className="mx-2 text-center" 
                    {...field} 
                    onChange={(e) => {
                      field.onChange(ensureInteger(e.target.value));
                    }}
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    className="h-9 px-2"
                    onClick={() => handleIncrement("bedrooms")}
                  >
                    +
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

          {/* Bathrooms - Can have decimal values */}
          <FormField
          control={form.control}
          name="bathrooms"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1">
                <Bed className="h-4 w-4" /> Bathrooms
              </FormLabel>
              <FormControl>
                <div className="flex items-center">
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    className="h-9 px-2"
                    onClick={() => handleDecrement("bathrooms")}
                  >
                    -
                  </Button>
                  <Input 
                    type="number" 
                    min="0" 
                    step="1"
                    className="mx-2 text-center" 
                    {...field} 
                    onChange={(e) => {
                      field.onChange(ensureInteger(e.target.value));
                    }}
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    className="h-9 px-2"
                    onClick={() => handleIncrement("bathrooms")}
                  >
                    +
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Beds - Integer only */}
        <FormField
          control={form.control}
          name="beds"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1">
                <Bed className="h-4 w-4" /> Beds
              </FormLabel>
              <FormControl>
                <div className="flex items-center">
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    className="h-9 px-2"
                    onClick={() => handleDecrement("beds")}
                  >
                    -
                  </Button>
                  <Input 
                    type="number" 
                    min="0" 
                    step="1"
                    className="mx-2 text-center" 
                    {...field} 
                    onChange={(e) => {
                      field.onChange(ensureInteger(e.target.value));
                    }}
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    className="h-9 px-2"
                    onClick={() => handleIncrement("beds")}
                  >
                    +
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Accommodates - Integer only, minimum 1 */}
        <FormField
          control={form.control}
          name="accommodates"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1">
                <Users className="h-4 w-4" /> Accommodates
              </FormLabel>
              <FormControl>
                <div className="flex items-center">
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    className="h-9 px-2"
                    onClick={() => {
                      const current = ensureInteger(field.value.toString());
                      const newValue = Math.max(1, current - 1);
                      field.onChange(newValue);
                    }}
                  >
                    -
                  </Button>
                  <Input 
                    type="number" 
                    min="1" 
                    step="1"
                    className="mx-2 text-center" 
                    {...field} 
                    onChange={(e) => {
                      const value = ensureInteger(e.target.value);
                      field.onChange(Math.max(1, value)); // Ensure at least 1
                    }}
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    className="h-9 px-2"
                    onClick={() => {
                      const current = ensureInteger(field.value.toString());
                      field.onChange(current + 1);
                    }}
                  >
                    +
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
