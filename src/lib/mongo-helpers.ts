
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
  
  const result = { ...obj };
  
  // If we already have _id, ensure id is also present for backwards compatibility
  if (obj._id) {
    result.id = obj._id;
  }
  // If we have id but no _id, use id as _id
  else if (obj.id && !obj._id) {
    result._id = obj.id;
  }
  
  return result as T & { _id: string; id: string };
}

/**
 * Maps all objects in an array to ensure they have MongoDB _id fields
 */
export function ensureMongoIds<T extends Record<string, any>>(arr: T[]): (T & { _id: string, id: string })[] {
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

/**
 * Normalizes an object's ID fields by ensuring both _id and id exist and match
 * This is useful when handling responses from APIs that might return either format
 */
export function normalizeMongoObject<T extends Record<string, any>>(obj: T): T {
  if (!obj) return obj;
  
  const normalizedObj = { ...obj };
  
  // If we have _id but no id, add id
  if (normalizedObj._id && !normalizedObj.id) {
    normalizedObj.id = normalizedObj._id;
  } 
  // If we have id but no _id, add _id
  else if (normalizedObj.id && !normalizedObj._id) {
    normalizedObj._id = normalizedObj.id;
  }
  
  return normalizedObj;
}

/**
 * Normalizes an array of objects by ensuring consistent _id and id fields
 */
export function normalizeMongoObjects<T extends Record<string, any>>(arr: T[]): T[] {
  if (!arr) return arr;
  return arr.map(item => normalizeMongoObject(item));
}
