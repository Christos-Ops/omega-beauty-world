export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export function notFound(message = 'Resource not found'): ApiError {
  return new ApiError(404, message);
}

export function badRequest(message = 'Invalid request'): ApiError {
  return new ApiError(400, message);
}

export function unauthorized(message = 'Authentication required'): ApiError {
  return new ApiError(401, message);
}

export function conflict(message = 'Conflict'): ApiError {
  return new ApiError(409, message);
}
