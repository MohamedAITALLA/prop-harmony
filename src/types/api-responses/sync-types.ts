
// Sync related types
export interface PropertySyncResult {
  platform: string;
  success: boolean;
  events_synced: number;
  events_created: number;
  events_updated: number;
  events_cancelled: number;
  sync_duration_ms: number;
  conflicts: any[];
  last_synced: string;
  error?: string;
}

export interface SyncResult {
  property_id: string;
  platform: string;
  status: string;
  events_synced: number;
  events_created: number;
  events_updated: number;
  events_cancelled: number;
  conflicts_detected: number;
  sync_duration_ms: number;
  error?: string;
}

export interface PropertySyncResponse {
  property_id: string;
  sync_results: PropertySyncResult[];
  summary: {
    total_connections: number;
    successful_syncs: number;
    failed_syncs: number;
    total_events_synced: number;
    events_created: number;
    events_updated: number;
    events_cancelled: number;
    conflicts_detected: number;
    sync_completion_time: string;
  };
  next_sync?: string;
}

export interface GlobalSyncResponse {
  sync_results: Record<string, SyncResult[]>;
  summary: {
    total_connections: number;
    successful_syncs: number;
    failed_syncs: number;
    total_events_synced: number;
    properties_synced: number;
    sync_completion_time: string;
  };
}

export interface PropertySyncConnection {
  id: string;
  platform: string;
  status: 'active' | 'inactive' | 'error' | 'syncing';
  last_synced: string | null;
  next_sync: string | null;
  error_message: string | null;
  last_error_time: string | null;
  sync_frequency_minutes: number;
  url_hash: string | null;
}

export interface PropertyEventCount {
  platform: string;
  total_events: number;
  active_events: number;
}

export interface PropertySyncStatusResponse {
  property_id: string;
  connections: PropertySyncConnection[];
  event_counts: PropertyEventCount[];
  summary: {
    last_sync: string | null;
    next_sync: string | null;
    overall_status: 'healthy' | 'error' | 'no_connections';
    total_connections: number;
    active_connections: number;
    error_connections: number;
    health_percentage: number;
  };
}

export interface GlobalSyncStatusResponse {
  summary: {
    total_connections: number;
    active_connections: number;
    error_connections: number;
    total_properties: number;
    properties_with_errors: number;
    health_percentage: number;
    health_status: string;
    last_system_sync: string;
  };
  recent_failures: {
    property_id: string;
    platform: string;
    error_message: string;
    last_error_time: string;
  }[];
  upcoming_syncs: {
    property_id: string;
    platform: string;
    last_synced: string;
    next_sync: string;
    minutes_until_next_sync: number;
  }[];
  sync_history: {
    _id: string;
    count: number;
  }[];
  platforms: Record<string, {
    total: number;
    active: number;
    error: number;
  }>;
}
