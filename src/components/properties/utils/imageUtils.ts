
export const getPropertyImageUrl = (images?: string[], defaultImage?: string): string => {
  const fallbackImage = defaultImage || "https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=800&auto=format&fit=crop";
  
  let imageUrl = images && images.length > 0 
    ? images[0] 
    : fallbackImage;
    
  // Fix image URL if it starts with "/https://"
  if (imageUrl.startsWith('/https://')) {
    imageUrl = imageUrl.substring(1);
  }
  
  return imageUrl;
};
