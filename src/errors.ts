/**
 * Xeno SDK Errors
 */

export class XenoError extends Error {
  public statusCode?: number;
  public response?: Record<string, unknown>;

  constructor(
    message: string,
    statusCode?: number,
    response?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'XenoError';
    this.statusCode = statusCode;
    this.response = response;
  }
}

export class AuthenticationError extends XenoError {
  constructor(message: string, statusCode?: number) {
    super(message, statusCode);
    this.name = 'AuthenticationError';
  }
}

export class RateLimitError extends XenoError {
  public retryAfter?: number;

  constructor(message: string, statusCode?: number, retryAfter?: number) {
    super(message, statusCode);
    this.name = 'RateLimitError';
    this.retryAfter = retryAfter;
  }
}

export class APIError extends XenoError {
  constructor(message: string, statusCode?: number) {
    super(message, statusCode);
    this.name = 'APIError';
  }
}

export class InvalidRequestError extends XenoError {
  constructor(message: string, statusCode?: number) {
    super(message, statusCode);
    this.name = 'InvalidRequestError';
  }
}

export class InsufficientCreditsError extends XenoError {
  constructor(message: string, statusCode?: number) {
    super(message, statusCode);
    this.name = 'InsufficientCreditsError';
  }
}
