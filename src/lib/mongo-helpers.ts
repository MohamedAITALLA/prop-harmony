/**
 * MongoDB helper functions for ID handling across the application
 */

/**
 * Ensures an object has a MongoDB _id field
 * If _id is missing but id exists, it will use id as _id
 */
export function ensureMongoId<T extends { _id?: string; id?: string }>(obj: T): T & { _id: string } {
  if (!obj) return obj as any;
  
  const result = { ...obj };
  
  // If we already have _id, keep it
  if (obj._id) {
    // Keep _id as is
  }
  // If we have id but no _id, use id as _id
  else if (obj.id && !obj._id) {
    result._id = obj.id;
  }
  
  // Remove the id field if it exists
  if ('id' in result) {
    delete result.id;
  }
  
  return result as T & { _id: string };
}

/**
 * Maps all objects in an array to ensure they have MongoDB _id fields
 */
export function ensureMongoIds<T extends { _id?: string; id?: string }>(arr: T[]): (T & { _id: string })[] {
  if (!arr) return arr as any;
  return arr.map(item => ensureMongoId(item));
}

/**
 * Gets the MongoDB ID from an object, using _id
 */
export function getMongoId(obj: Record<string, any> | null | undefined): string | undefined {
  if (!obj) return undefined;
  return obj._id;
}

/**
 * Normalizes an object's ID fields by ensuring _id exists
 * This is useful when handling responses from APIs that might return either format
 */
export function normalizeMongoObject<T extends { _id?: string; id?: string }>(obj: T): T & { _id: string } {
  if (!obj) return obj as any;
  
  const normalizedObj = { ...obj };
  
  // If we have id but no _id, add _id
  if (normalizedObj.id && !normalizedObj._id) {
    normalizedObj._id = normalizedObj.id;
  }
  
  // Remove the id field
  if ('id' in normalizedObj) {
    delete normalizedObj.id;
  }
  
  return normalizedObj as T & { _id: string };
}

/**
 * Normalizes an array of objects by ensuring consistent _id fields
 */
export function normalizeMongoObjects<T extends { _id?: string; id?: string }>(arr: T[]): (T & { _id: string })[] {
  if (!arr) return arr as any;
  return arr.map(item => normalizeMongoObject(item));
}
