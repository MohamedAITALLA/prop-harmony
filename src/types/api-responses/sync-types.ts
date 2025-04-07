
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

export interface SyncLog {
  _id: string;
  property_id: string;
  property?: {
    _id: string;
    name: string;
  };
  platform: string;
  action: string;
  status: string;
  timestamp: string;
  duration: number;
  message: string;
  details?: Record<string, any>;
  created_at: string;
  results?: {
    events_processed?: number;
    events_created?: number;
    events_updated?: number;
    events_deleted?: number;
    errors?: string[];
  };
}

export interface SyncLogsResponse {
  success: boolean;
  data: {
    logs: SyncLog[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      pages: number;
      has_next_page: boolean;
      has_previous_page: boolean;
    };
    summary?: {
      by_status: Record<string, number>;
      by_platform: Record<string, number>;
      by_property: Record<string, number>;
      total_count: number;
    };
  };
  message: string;
  timestamp: string;
}
