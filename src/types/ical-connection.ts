// Types related to iCal connection functionality

export interface TestResult {
  data: any | null;
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
  tested_at?: string;
}

export interface TestConnectionResponse {
  valid: boolean;
  error?: string;
  events_found?: number;
  connection?: {
    ical_url: string;
    // other connection properties
  };
}

export interface UpdateConnectionResponse {
  connection: {
    _id: string;
    platform: string;
    ical_url: string;
    status: string;
    // other connection properties
  };
  meta?: {
    action: string;
    platform: string;
    updated_fields?: string[]; // Added this field
  };
  message: string;
}

export interface DeleteConnectionResponse {
  success: boolean;
  data: {
    connection_id: string;
    platform: string;
    status: string;
  };
  meta?: {
    action: string;
    platform: string;
    events_affected?: number;
  };
  message: string;
}
