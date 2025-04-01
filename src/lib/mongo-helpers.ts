
/**
 * MongoDB helper functions for ID handling across the application
 */

/**
 * Ensures an object has a MongoDB _id field
 * If _id is missing but id exists, it will use id as _id
 * Also keeps the original id for backwards compatibility
 */
export function ensureMongoId<T extends Record<string, any>>(obj: T): T & { _id: string; id: string } {
  if (!obj) return obj as any;
  
  // If we already have _id, use that
  if (obj._id) {
    return {
      ...obj,
      id: obj._id // Ensure id is also present for backwards compatibility
    };
  }
  
  // If we have id but no _id, use id as _id
  if (obj.id && !obj._id) {
    return {
      ...obj,
      _id: obj.id
    };
  }
  
  // If we have neither id nor _id, this function can't help
  return obj as any;
}

/**
 * Maps all objects in an array to ensure they have MongoDB _id fields
 */
export function ensureMongoIds<T extends Record<string, any>>(arr: T[]): (T & { _id: string })[] {
  if (!arr) return arr as any;
  return arr.map(item => ensureMongoId(item));
}

/**
 * Gets the MongoDB ID from an object, preferring _id but falling back to id
 */
export function getMongoId(obj: Record<string, any> | null | undefined): string | undefined {
  if (!obj) return undefined;
  return obj._id || obj.id;
}
