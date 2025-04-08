
// Re-export individual services for backward compatibility
import propertyService from "./property-service";
import icalConnectionService from "./ical-connection-service";
import { syncService } from "./sync-service";
import authService from "./auth-service";
import profileService from "./profile-service";
import adminUserService from "./admin-user-service";
import adminProfileService from "./admin-profile-service";
import eventService from "./event-service";
import notificationService from "./notification-service";
import calendarService from "./calendar-service";
import conflictService from "./conflict-service";

// Export all services
export {
  propertyService,
  icalConnectionService,
  syncService,
  authService,
  profileService,
  adminUserService,
  adminProfileService,
  eventService,
  notificationService,
  calendarService,
  conflictService
};
