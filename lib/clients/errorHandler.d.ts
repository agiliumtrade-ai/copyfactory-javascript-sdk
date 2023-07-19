/**
 * Base class for API errors. Contains indication of HTTP status.
 */
export class ApiError extends Error {

  /**
   * ApiError constructor
   * @param {Function} clazz error name
   * @param {Object} message error message
   * @param {number} status HTTP status
   * @param {string} url API request URL
   */
  constructor(clazz: Function, message: Object, status: number, url?: string);

  /**
   * Sets error code, used for i18n
   * @param {string} code error code for i18n
   */
  set code(code: string);

  /**
   * Returns error code used for i18n
   * @return {string} error code
   */
  get code(): string;

  /**
   * Set message arguments for i18n
   * @param {Array<Object>} args arguments for i18n
   */
  set arguments(args: Array<Object>);

  /**
   * Returns message arguments for i18n
   * @return {Array<Object>} message arguments for i18n
   */
  get arguments(): Array<Object>;
}

/**
 * Throwing this error results in 404 (Not Found) HTTP response code.
 */
export class NotFoundError extends ApiError {

  /**
   * Represents NotFoundError.
   * @param {string} message error message
   * @param {string} url API request URL
   */
  constructor(message: string, url?: string);
}

/**
 * Throwing this error results in 403 (Forbidden) HTTP response code.
 */
export class ForbiddenError extends ApiError {

  /**
   * Constructs forbidden error.
   * @param {string} message error message
   * @param {string} url API request URL
   */
   constructor(message: string, url?: string);
}

/**
 * Throwing this error results in 401 (Unauthorized) HTTP response code.
 */
export class UnauthorizedError extends ApiError {

  /**
   * Constructs unauthorized error.
   * @param {string} message error message
   * @param {string} url API request URL
   */
   constructor(message: string, url?: string);
}

/**
 * Represents validation error. Throwing this error results in 400 (Bad Request) HTTP response code.
 */
export class ValidationError extends ApiError {

  /**
   * Constructs validation error.
   * @param {string} message error message
   * @param {Object} details error data
   * @param {string} url API request URL
   */
  constructor(message: string, details: Object, url?: string);
}

/**
 * Represents unexpected error. Throwing this error results in 500 (Internal Error) HTTP response code.
 */
export class InternalError extends ApiError {
  
  /**
   * Constructs unexpected error.
   * @param {string} message error message
   * @param {string} url API request URL
   */
  constructor(message: string, url?: string);
}

/**
 * Represents conflict error. Throwing this error results in 409 (Conflict) HTTP response code.
 */
export class ConflictError extends ApiError {

  /**
   * Constructs conflict error.
   * @param {string} message error message
   * @param {string} url API request URL
   */
  constructor(message: string, url?: string);
}

/**
 * metadata for too many requests error
 */
export type TooManyRequestsErrorMetadata = {

  /**
   * throttling period in minutes
   */
  periodInMinutes: number,

  /**
   * available requests for periodInMinutes
   */
  requestsPerPeriodAllowed: number,

  /**
   * recommended date to retry request
   */
  recommendedRetryTime: Date,

  /**
   * error type
   */
  type: string
}

/**
 * Represents too many requests error. Throwing this error results in 429 (Too Many Requests) HTTP response code.
 */
export class TooManyRequestsError extends ApiError {

  /**
   * Constructs too many requests error.
   * @param {string} message error message
   * @param {TooManyRequestsErrorMetadata} metadata error metadata
   * @param {string} url API request URL
   */
  constructor(message: string, metadata: TooManyRequestsErrorMetadata, url?: string);
}