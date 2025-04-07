
import { toast } from "sonner";

/**
 * Processes image-related response data and generates appropriate toast messages
 */
export const handleImageResponseData = (
  imagesAdded: number = 0,
  imagesDeleted: number = 0
): string | null => {
  if (imagesAdded === 0 && imagesDeleted === 0) {
    return null;
  }
  
  const imageChanges = [];
  if (imagesAdded > 0) {
    imageChanges.push(`${imagesAdded} image${imagesAdded > 1 ? 's' : ''} added`);
  }
  if (imagesDeleted > 0) {
    imageChanges.push(`${imagesDeleted} image${imagesDeleted > 1 ? 's' : ''} deleted`);
  }
  
  return imageChanges.length > 0 ? imageChanges.join(', ') : null;
};

/**
 * Logs image update details to the console
 */
export const logImageDetails = (
  response: any,
  initialImagesCount: number
): void => {
  // Explicitly log the updated property data to confirm image updates
  console.log("Updated property data:", response?.data?.property);
  console.log("Updated images:", response?.data?.property?.images || []);
  console.log("Original images count:", initialImagesCount);
  console.log("Updated images count:", response?.data?.property?.images?.length || 0);
};
