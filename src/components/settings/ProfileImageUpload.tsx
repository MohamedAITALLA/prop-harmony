
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ImageUpload } from '@/components/ui/image-upload';
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export const ProfileImageUpload = () => {
  const { user, updateProfile } = useAuth();

  // Use default image if profile_image is not available
  const profileImage = user?.profile_image || '';
  
  const handleImageUpload = async (file: File) => {
    try {
      // Here we would typically upload the image to a server
      // For now, just show a success message
      toast.success("Profile image updated successfully");
      
      // If you have an updateProfile function in your auth context
      if (updateProfile) {
        await updateProfile({ profile_image: URL.createObjectURL(file) });
      }
    } catch (error) {
      toast.error("Failed to update profile image");
      console.error("Error uploading profile image:", error);
    }
  };
  
  // Get initials from name or use fallback
  const getInitials = () => {
    const name = user?.name || '';
    return name.split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase() || 'U';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Image</CardTitle>
        <CardDescription>Update your profile picture</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
        <div className="flex flex-col items-center gap-2">
          <Avatar className="w-24 h-24">
            <AvatarImage src={profileImage} alt={user?.name || 'User'} />
            <AvatarFallback className="text-lg">{getInitials()}</AvatarFallback>
          </Avatar>
          <span className="text-sm text-muted-foreground">Current Image</span>
        </div>
        
        <ImageUpload 
          currentImageUrl={profileImage}
          onImageUpload={handleImageUpload}
          className="flex-1"
        />
      </CardContent>
    </Card>
  );
};

export default ProfileImageUpload;
