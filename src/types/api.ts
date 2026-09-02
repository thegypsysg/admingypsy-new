/**
 * API Response and Error Type Definitions
 */

/** Struktur response standar dari API backend */
export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  status?: number;
  current_page?: number;
  per_page?: number;
  total?: number;
  last_page?: number;
}

/** Struktur response paginated */
export interface PaginatedResponse<T = unknown> {
  data: {
    data: T[];
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  };
  message?: string;
}

/** Error response dari API */
export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  status?: number;
}
