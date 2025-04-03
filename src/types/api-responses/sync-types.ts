
// Sync related types

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
