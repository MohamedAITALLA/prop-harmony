
export enum PropertyType {
  APARTMENT = "APARTMENT",
  HOUSE = "HOUSE",
  ROOM = "ROOM",
  HOTEL = "HOTEL",
  CABIN = "CABIN",
  VILLA = "VILLA",
  CONDO = "CONDO",
  OTHER = "OTHER"
}

export enum EventType {
  BOOKING = "BOOKING",
  MAINTENANCE = "MAINTENANCE",
  CLEANING = "CLEANING",
  BLOCKED = "BLOCKED",
  OTHER = "OTHER"
}

export enum EventSource {
  MANUAL = "MANUAL",
  AIRBNB = "AIRBNB",
  BOOKING = "BOOKING",
  VRBO = "VRBO",
  EXPEDIA = "EXPEDIA",
  GOOGLE = "GOOGLE",
  OTHER = "OTHER",
}

export enum ConflictType {
  OVERLAP = "OVERLAP",
  BACK_TO_BACK = "BACK_TO_BACK",
  MISSING_CLEANING = "MISSING_CLEANING",
  DUPLICATE_BOOKING = "DUPLICATE_BOOKING",
  OTHER = "OTHER"
}

export enum ConflictStatus {
  UNRESOLVED = "UNRESOLVED",
  RESOLVED = "RESOLVED",
  IGNORED = "IGNORED"
}

export enum ConflictSeverity {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  CRITICAL = "CRITICAL"
}

export enum NotificationType {
  INFO = "INFO",
  WARNING = "WARNING",
  ERROR = "ERROR",
  SUCCESS = "SUCCESS"
}

export enum SyncStatus {
  PENDING = "PENDING",
  SYNCING = "SYNCING",
  SUCCESS = "SUCCESS",
  PARTIAL = "PARTIAL",
  FAILED = "FAILED"
}

export enum UserRole {
  ADMIN = "ADMIN",
  OWNER = "OWNER",
  MANAGER = "MANAGER",
  STAFF = "STAFF",
  GUEST = "GUEST"
}

export enum UserStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  PENDING = "PENDING",
  SUSPENDED = "SUSPENDED"
}

export enum PlatformType {
  AIRBNB = "AIRBNB",
  BOOKING = "BOOKING",
  VRBO = "VRBO",
  EXPEDIA = "EXPEDIA",
  TRIPADVISOR = "TRIPADVISOR",
  GOOGLE = "GOOGLE",
  OTHER = "OTHER"
}
