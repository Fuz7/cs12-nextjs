/**
 * Standard response format for API calls
 */
export interface JsonResponse<T> {
  status: 'success' | 'error';
  data: T;
  message?: string;
}

/**
 * Helper function to create a standard JSON response
 */
export function jsonResponse<T>(
  data: T,
  status: 'success' | 'error' = 'success',
  message?: string
): JsonResponse<T> {
  return {
    status,
    data,
    message,
  };
}
