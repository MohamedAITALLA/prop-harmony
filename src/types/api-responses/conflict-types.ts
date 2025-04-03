
// Conflict related types

export interface Conflict {
  _id: string;
  property_id: string;
  property?: {
    _id: string;
    name: string;
  };
  event_ids: string[];
  conflict_type: string;
  start_date: string;
  end_date: string;
  severity: string;
  status: string;
  description: string;
  created_at: string;
  updated_at: string;
  platforms?: string[];
}

export interface ConflictsResponse {
  success: boolean;
  data: Conflict[];
  meta: {
    total: number;
    property_id: string;
    status_filter: string;
    status_breakdown: Record<string, number>;
  };
  message: string;
  timestamp: string;
}
