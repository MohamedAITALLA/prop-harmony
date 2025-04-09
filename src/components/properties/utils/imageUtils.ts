
/**
 * Gets a clean image URL from the property images array
 * @param images Array of image URLs or undefined
 * @param defaultImage Default image URL to use if no valid images are found
 * @returns A clean, usable image URL
 */
export function getPropertyImageUrl(images: string[] | undefined, defaultImage: string): string {
  // Return default image if no images array or empty array
  if (!images || images.length === 0) {
    return defaultImage;
  }
  
  // Get the first image from the array
  let imageUrl = typeof images[0] === 'string' ? images[0] : '';
  
  // Fix image URL if it starts with "/https://"
  if (imageUrl.startsWith('/https://')) {
    imageUrl = imageUrl.substring(1);
  }
  
  // Return the image URL or default if empty
  return imageUrl || defaultImage;
}
