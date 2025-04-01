
import { getMongoId, ensureMongoId, ensureMongoIds } from './mongo-helpers';

/**
 * Helper function to convert objects or arrays that might have 'id' to use '_id'
 * This function helps with the transition from id-based to _id-based schemas
 */
export function convertToMongoIdFormat<T extends object>(data: T): T {
  // If data is null or undefined, return it as is
  if (data == null) return data;
  
  // If data is an array, process each item
  if (Array.isArray(data)) {
    return data.map(item => convertToMongoIdFormat(item)) as unknown as T;
  }
  
  // If data is an object but not an array
  if (typeof data === 'object') {
    // Create a new object to avoid mutating the original
    const result = { ...data } as Record<string, any>;
    
    // If the object has 'id' but no '_id', add '_id' with the value of 'id'
    if ('id' in result && !('_id' in result)) {
      result._id = result.id;
    }
    
    // Remove 'id' if it exists
    if ('id' in result) {
      delete result.id;
    }
    
    // Process nested objects recursively
    for (const key in result) {
      if (result[key] !== null && typeof result[key] === 'object') {
        result[key] = convertToMongoIdFormat(result[key]);
      }
    }
    
    return result as T;
  }
  
  // For primitive types, return as is
  return data;
}

/**
 * A simple mapping utility to convert arrays from 'id' to '_id'
 */
export function mapIdsToMongoFormat<T extends object>(items: T[]): T[] {
  return items.map(item => convertToMongoIdFormat(item));
}

/**
 * Safely access the ID of an object, prioritizing _id over id
 */
export function getSafeId(obj: Record<string, any> | null | undefined): string | undefined {
  if (!obj) return undefined;
  return obj._id || obj.id;
}
