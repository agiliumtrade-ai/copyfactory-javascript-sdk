/**
 * Base class for API errors. Contains indication of HTTP status.
 */
export class ApiError extends Error {

  /**
   * ApiError constructor
   * @param {Function} clazz error name
   * @param {Object} message error message
   * @param {Number} status HTTP status
   */
  constructor(clazz: Function, message: Object, status: number);

  /**
   * Sets error code, used for i18n
   * @param {String} code error code for i18n
   */
  set code(code: string);

  /**
   * Returns error code used for i18n
   * @return {String} error code
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
   * @param {String} message error message
   */
  constructor(message: string);
}

/**
 * Throwing this error results in 403 (Forbidden) HTTP response code.
 */
export class ForbiddenError extends ApiError {

  /**
   * Constructs forbidden error.
   * @param {String} message error message
   */
   constructor(message: string);
}

/**
 * Throwing this error results in 401 (Unauthorized) HTTP response code.
 */
export class UnauthorizedError extends ApiError {

  /**
   * Constructs unauthorized error.
   * @param {String} message error message
   */
   constructor(message: string);
}

/**
 * Represents validation error. Throwing this error results in 400 (Bad Request) HTTP response code.
 */
export class ValidationError extends ApiError {

  /**
   * Constructs validation error.
   * @param {String} message error message
   * @param {Object} details error data
   */
  constructor(message: string, details: Object);
}

/**
 * Represents unexpected error. Throwing this error results in 500 (Internal Error) HTTP response code.
 */
export class InternalError extends ApiError {
  
  /**
   * Constructs unexpected error.
   * @param {String} message error message
   */
  constructor(message: string);
}

/**
 * Represents conflict error. Throwing this error results in 409 (Conflict) HTTP response code.
 */
 export class ConflictError extends ApiError {

  /**
   * Constructs conflict error.
   * @param {String} message error message
   */
  constructor(message: string);
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
   *available requests for periodInMinutes
   */
  requestsPerPeriodAllowed: number,

  /**
   * recommended date to retry request
   */
  recommendedRetryTime: Date
}

/**
 * Represents too many requests error. Throwing this error results in 429 (Too Many Requests) HTTP response code.
 */
export class TooManyRequestsError extends ApiError {

  /**
   * Constructs too many requests error.
   * @param {String} message error message
   * @param {TooManyRequestsErrorMetadata} metadata error metadata
   */
  constructor(message: string, metadata: TooManyRequestsErrorMetadata);
}