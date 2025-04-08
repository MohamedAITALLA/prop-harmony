
export enum PropertyType {
  APARTMENT = 'apartment',
  HOUSE = 'house',
  VILLA = 'villa',
  CONDO = 'condo',
  CABIN = 'cabin',
  ROOM = 'room',
  HOTEL = 'hotel',
  OTHER = 'other'
}

export enum EventType {
  BOOKING = 'booking',
  BLOCKED = 'blocked',
  MAINTENANCE = 'maintenance',
  OTHER = 'other'
}

export enum EventStatus {
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  TENTATIVE = 'tentative'
}

export enum ConflictType {
  OVERLAP = 'overlap',
  ADJACENT = 'adjacent',
  TURNOVER = 'turnover',
  BACK_TO_BACK = 'back_to_back',
  MISSING_CLEANING = 'missing_cleaning',
  DUPLICATE_BOOKING = 'duplicate_booking',
  OTHER = 'other'
}

export enum ConflictSeverity {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
  CRITICAL = 'critical'
}

export enum ConflictStatus {
  NEW = 'new',
  ACKNOWLEDGED = 'acknowledged',
  RESOLVED = 'resolved',
  UNRESOLVED = 'unresolved',
  IGNORED = 'ignored'
}

export enum NotificationType {
  NEW_BOOKING = 'new_booking',
  MODIFIED_BOOKING = 'modified_booking',
  CANCELLED_BOOKING = 'cancelled_booking',
  BOOKING_CONFLICT = 'booking_conflict',
  SYNC_FAILURE = 'sync_failure',
  ICAL_REMOVED = 'ical_removed',
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  SUCCESS = 'success'
}

export enum NotificationSeverity {
  CRITICAL = 'critical',
  WARNING = 'warning',
  INFO = 'info',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low'
}

export enum SyncStatus {
  PENDING = 'pending',
  SYNCING = 'syncing',
  SUCCESS = 'success',
  PARTIAL = 'partial',
  FAILED = 'failed'
}

export enum UserRole {
  ADMIN = 'admin',
  OWNER = 'owner',
  MANAGER = 'manager',
  STAFF = 'staff',
  GUEST = 'guest'
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
  SUSPENDED = 'suspended'
}

export enum Platform {
  AIRBNB = 'Airbnb',
  BOOKING = 'Booking',
  EXPEDIA = 'Expedia',
  TRIPADVISOR = 'TripAdvisor',
  VRBO = 'Vrbo',
  MANUAL = 'manual'
}

export enum ConnectionStatus {
  ACTIVE = 'active',
  ERROR = 'error',
  INACTIVE = 'inactive'
}

export enum EventSource {
  MANUAL = 'manual',
  AIRBNB = 'airbnb',
  BOOKING = 'booking',
  VRBO = 'vrbo',
  EXPEDIA = 'expedia',
  GOOGLE = 'google',
  OTHER = 'other'
}

export enum PlatformType {
  AIRBNB = 'airbnb',
  BOOKING = 'booking',
  VRBO = 'vrbo',
  EXPEDIA = 'expedia',
  TRIPADVISOR = 'tripadvisor',
  GOOGLE = 'google',
  OTHER = 'other'
}
