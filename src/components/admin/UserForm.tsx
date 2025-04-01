
import React from 'react';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { adminUserService } from '@/services/api-service';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { User } from '@/types/api-responses';
import { getMongoId, ensureMongoId } from '@/lib/mongo-helpers';

interface UserFormProps {
  user?: User;
  onSuccess?: () => void;
}

const userSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().optional(),
  is_active: z.boolean().default(true),
});

const UserForm = ({ user, onSuccess }: UserFormProps) => {
  const isNew = !user;
  const queryClient = useQueryClient();
  const userId = user ? getMongoId(user) : '';
  
  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(
      // Conditionally require password for new users
      isNew 
        ? userSchema.extend({ password: z.string().min(6, "Password must be at least 6 characters") })
        : userSchema
    ),
    defaultValues: {
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
      email: user?.email || "",
      password: "",
      is_active: user?.is_active !== false,
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof userSchema>) => {
      if (isNew) {
        return adminUserService.createUser(data as any);
      } else if (userId) {
        // Only include password if it was provided
        const updateData = { ...data };
        if (!updateData.password) delete updateData.password;
        return adminUserService.updateUser(userId, updateData);
      }
      throw new Error("Invalid operation");
    },
    onSuccess: () => {
      toast.success(isNew ? 'User created successfully' : 'User updated successfully');
      queryClient.invalidateQueries({ queryKey: ['users'] });
      if (onSuccess) onSuccess();
    },
  });

  const onSubmit = (data: z.infer<typeof userSchema>) => {
    mutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="first_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="last_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input {...field} type="email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{isNew ? "Password" : "New Password (leave blank to keep current)"}</FormLabel>
              <FormControl>
                <Input {...field} type="password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="is_active"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Active</FormLabel>
              </div>
            </FormItem>
          )}
        />
        
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Saving..." : isNew ? "Create User" : "Update User"}
        </Button>
      </form>
    </Form>
  );
};

export default UserForm;
