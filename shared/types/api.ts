// Base API Response Types
export interface ApiResponse<T = any> {
  data: T;
  status: number;
  message?: string;
}

export class ApiError extends Error {
  public status: number;
  public code?: string;

  constructor(params: { message: string; status: number; code?: string }) {
    super(params.message);
    this.name = 'ApiError';
    this.status = params.status;
    this.code = params.code;
  }
}