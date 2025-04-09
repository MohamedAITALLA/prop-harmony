
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ImageUpload } from '@/components/ui/image-upload';
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { profileService } from "@/services/api-service";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export const ProfileImageUpload = () => {
  const { user, updateProfile } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Use default image if profile_image is not available
  const profileImage = user?.profile_image || '';
  
  const handleImageUpload = async (file: File) => {
    try {
      setIsUploading(true);
      
      const response = await profileService.uploadProfileImage(file);
      
      if (response.data.success) {
        toast.success(response.data.message || "Profile image updated successfully");
        
        // Update the user in context with the new image URL
        if (updateProfile && response.data.data.profile_image) {
          await updateProfile({ profile_image: response.data.data.profile_image });
        }
      } else {
        toast.error("Failed to update profile image");
      }
    } catch (error) {
      console.error("Error uploading profile image:", error);
      toast.error("Failed to update profile image");
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleDeleteImage = async () => {
    if (!profileImage) return;
    
    try {
      setIsDeleting(true);
      
      const response = await profileService.deleteProfileImage();
      
      if (response.data.success) {
        toast.success(response.data.message || "Profile image removed successfully");
        
        // Update the user in context to remove the image
        if (updateProfile) {
          await updateProfile({ profile_image: '' });
        }
      } else {
        toast.error("Failed to remove profile image");
      }
    } catch (error) {
      console.error("Error deleting profile image:", error);
      toast.error("Failed to remove profile image");
    } finally {
      setIsDeleting(false);
    }
  };
  
  // Get initials from name or use fallback
  const getInitials = () => {
    const name = user?.name || user?.full_name || '';
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
            <AvatarImage src={profileImage} alt={user?.name || user?.full_name || 'User'} />
            <AvatarFallback className="text-lg">{getInitials()}</AvatarFallback>
          </Avatar>
          <span className="text-sm text-muted-foreground">Current Image</span>
          
          {profileImage && (
            <Button
              variant="outline"
              size="sm"
              className="mt-2 text-destructive hover:text-destructive"
              onClick={handleDeleteImage}
              disabled={isDeleting}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {isDeleting ? "Removing..." : "Remove"}
            </Button>
          )}
        </div>
        
        <ImageUpload 
          currentImageUrl={profileImage}
          onImageUpload={handleImageUpload}
          className="flex-1"
          isLoading={isUploading}
        />
      </CardContent>
    </Card>
  );
};

export default ProfileImageUpload;
