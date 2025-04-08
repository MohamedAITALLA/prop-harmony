
import { CalendarEvent } from './event-types';

export interface Conflict {
  _id: string;
  property_id: string;
  events: CalendarEvent[];
  status: 'active' | 'resolved' | 'ignored';
  severity: 'low' | 'medium' | 'high';
  detected_at: string;
  resolved_at?: string;
  ignored_at?: string;
  created_at: string;
  updated_at: string;
}

export interface ConflictResponse {
  success: boolean;
  data: Conflict[];
  meta: {
    total: number;
    property_id: string;
    status_filter?: string;
    status_breakdown?: Record<string, number>;
  };
  message: string;
  timestamp: string;
}

export interface ConflictDetailResponse {
  success: boolean;
  data: Conflict;
  meta: {
    property_id: string;
    conflict_id: string;
  };
  message: string;
  timestamp: string;
}

export interface ConflictDeleteResponse {
  success: boolean;
  data: Conflict;
  meta: {
    property_id: string;
    conflict_id: string;
    preserve_history: boolean;
    action: string;
    affected_events: number;
  };
  message: string;
  timestamp: string;
}

export interface EventSummary {
  id: string;
  summary: string;
  start_date: string;
  end_date: string;
  platform: string;
  duration_days?: number;
}

export interface EventsCount {
  total: number;
  kept: number;
  removed: number;
}

export interface ResolveConflictRequest {
  events_to_keep: string[];
  resolution_strategy: 'delete' | 'deactivate';
}

export interface ResolveConflictResponse {
  success: boolean;
  data: {
    conflict_id: string;
    property_id: string;
    resolution_strategy: 'delete' | 'deactivate';
    events_kept: EventSummary[];
    events_removed: string[];
    events_count: EventsCount;
  };
  message: string;
  timestamp: string;
}

export interface AutoResolveConflictResponse {
  success: boolean;
  data: {
    conflict_id: string;
    property_id: string;
    resolution_strategy: 'delete' | 'deactivate';
    auto_resolution_method: string;
    event_kept: EventSummary;
    events_removed: EventSummary[];
    events_count: EventsCount;
  };
  message: string;
  timestamp: string;
}
