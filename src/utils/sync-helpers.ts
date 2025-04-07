
import { format, formatDistanceToNow, parseISO } from "date-fns";

/**
 * Format a date as a relative time from now (e.g., "2 hours ago")
 */
export const formatRelativeTime = (dateString?: string | null): string => {
  if (!dateString) return "Never";
  try {
    const date = parseISO(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  } catch (e) {
    return "Unknown date";
  }
};

/**
 * Format a date as a readable date and time (e.g., "Apr 7, 2023 14:30")
 */
export const formatDateTime = (dateString?: string | null): string => {
  if (!dateString) return "N/A";
  try {
    return format(parseISO(dateString), "MMM d, yyyy HH:mm");
  } catch (e) {
    return dateString || "N/A";
  }
};

/**
 * Calculate the health percentage for sync connections
 */
export const calculateHealthPercentage = (
  activeConnections: number, 
  totalConnections: number
): number => {
  if (totalConnections === 0) return 100;
  return Math.round((activeConnections / totalConnections) * 100);
};

/**
 * Get a color class based on health percentage
 */
export const getHealthColor = (percentage: number): string => {
  if (percentage >= 90) return "text-green-500";
  if (percentage >= 70) return "text-yellow-500";
  return "text-red-500";
};

/**
 * Get a background color class based on health percentage
 */
export const getHealthBgColor = (percentage: number): string => {
  if (percentage >= 90) return "bg-green-50 border-green-200";
  if (percentage >= 70) return "bg-yellow-50 border-yellow-200";
  return "bg-red-50 border-red-200";
};

/**
 * Format seconds to a human-readable duration
 */
export const formatDuration = (seconds: number): string => {
  if (seconds < 60) return `${seconds} seconds`;
  if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes} min${minutes !== 1 ? 's' : ''} ${remainingSeconds > 0 ? `${remainingSeconds} sec` : ''}`;
  }
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours} hr${hours !== 1 ? 's' : ''} ${minutes > 0 ? `${minutes} min` : ''}`;
};
