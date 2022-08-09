export type IFormEventValue = React.ChangeEvent<{ name?: string; value: unknown }>;

export interface ErrorResponse {
  request_id: string;
  error_code: number;
  error: string;
}

export interface GoogleDns {
  Answer: { name: string; data: string }[];
}
