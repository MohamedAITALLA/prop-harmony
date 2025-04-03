
// Add to existing types
export interface UpdateConnectionResponse {
  success: boolean;
  data: ICalConnection;
  meta: {
    property_id: string;
    connection_id: string;
    platform: string;
    status: string;
    updated_fields: string[];
    updated_at: string;
  };
  message: string;
  timestamp: string;
}

export interface DeleteConnectionResponse {
  success: boolean;
  data: ICalConnection;
  meta: {
    property_id: string;
    connection_id: string;
    platform: string;
    preserve_history: boolean;
    action: "deactivated" | "permanently deleted";
  };
  message: string;
  timestamp: string;
}

export interface TestResult {
  data: {
    valid: boolean;
    events_found?: number;
    parse_time_ms?: number;
    error?: string;
  } | null;
  meta: TestConnectionMeta | null;
  message: string | null;
  timestamp: string | null;
}

export interface TestConnectionMeta {
  url: string;
  status_code?: number;
  content_type?: string;
  content_length?: number;
  response_time_ms?: number;
}

export interface TestConnectionResponse {
  valid: boolean;
  events_found?: number;
  parse_time_ms?: number;
  error?: string;
}
