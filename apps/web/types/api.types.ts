export interface ApiErrorIssue {
  message: string;
  field?: string;
}

export interface ApiErrorResponse {
  data?: {
    error?: {
      message?: string;
      details?: {
        issues?: ApiErrorIssue[];
      };
    };
    message?: string;
  };
  message?: string;
}
