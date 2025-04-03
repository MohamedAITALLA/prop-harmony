
// Common API response types

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  timestamp: string;
  meta?: Record<string, any>;
}

export interface PaginationResponse {
  total: number;
  page: number;
  limit: number;
  pages: number;
  has_next_page: boolean;
  has_previous_page: boolean;
}
