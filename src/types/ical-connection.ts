
import { ICalConnection } from "./api-responses";

export interface TestConnectionResponse {
  valid: boolean;
  connection: ICalConnection;
  error?: string;
}

export interface TestConnectionMeta {
  property_id: string;
  connection_id: string;
  platform: string;
  status: string;
  tested_at: string;
}

export interface TestResult {
  data: TestConnectionResponse | null;
  meta: TestConnectionMeta | null;
  message: string | null;
  timestamp: string | null;
}
