
// Enum for Property Types
export enum PropertyType {
    APARTMENT = 'apartment',
    HOUSE = 'house',
    VILLA = 'villa',
    CONDO = 'condo',
    CABIN = 'cabin',
    OTHER = 'other',
}

// Enum for Event Types
export enum EventType {
    BOOKING = 'booking',
    BLOCKED = 'blocked',
    MAINTENANCE = 'maintenance',
}

// Enum for Event Statuses
export enum EventStatus {
    CONFIRMED = 'confirmed',
    CANCELLED = 'cancelled',
    TENTATIVE = 'tentative',
}

// Enum for Conflict Types
export enum ConflictType {
    OVERLAP = 'overlap',
    ADJACENT = 'adjacent',
    TURNOVER = 'turnover',
}

// Enum for Conflict Severities
export enum ConflictSeverity {
    HIGH = 'high',
    MEDIUM = 'medium',
    LOW = 'low',
}

// Enum for Conflict Statuses
export enum ConflictStatus {
    NEW = 'new',
    ACKNOWLEDGED = 'acknowledged',
    RESOLVED = 'resolved',
}

// Enum for Notification Types
export enum NotificationType {
    NEW_BOOKING = 'new_booking',
    MODIFIED_BOOKING = 'modified_booking',
    CANCELLED_BOOKING = 'cancelled_booking',
    BOOKING_CONFLICT = 'booking_conflict',
    SYNC_FAILURE = 'sync_failure',
}

// Enum for Notification Severities
export enum NotificationSeverity {
    CRITICAL = 'critical',
    WARNING = 'warning',
    INFO = 'info',
}

// Enum for Platforms
export enum Platform {
    AIRBNB = 'Airbnb',
    BOOKING = 'Booking',
    EXPEDIA = 'Expedia',
    TRIPADVISOR = 'TripAdvisor',
    VRBO = 'Vrbo',
    MANUAL = 'manual',
}

// Enum for Connection Statuses
export enum ConnectionStatus {
    ACTIVE = 'active',
    ERROR = 'error',
    INACTIVE = 'inactive',
}
