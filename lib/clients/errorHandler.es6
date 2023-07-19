'use strict';

/**
 * Base class for API errors. Contains indication of HTTP status.
 */

const isNode = typeof process !== 'undefined' && process.release && process.release.name === 'node';


export class ApiError extends Error {

  /**
   * ApiError constructor
   * @param {Function} clazz error name
   * @param {Object} message error message
   * @param {number} status HTTP status
   * @param {string} url API request URL
   */
  constructor(clazz, message, status, url) {
    super(url? message + '. Request URL: ' + url : message);
    /**
     * Error name
     * @type {string}
     */
    this.name = clazz.name;
    /**
     * HTTP status code
     * @type {number}
     */
    this.status = status;
    /**
     * API request URL
     */
    this.url = url;

    if (isNode && Error.captureStackTrace) {
      Error.captureStackTrace(this, clazz);
    }
  }

  /**
   * Sets error code, used for i18n
   * @param {string} code error code for i18n
   */
  set code(code) {
    this._code = code;
  }

  /**
   * Returns error code used for i18n
   * @return {string} error code
   */
  get code() {
    return this._code;
  }

  /**
   * Set message arguments for i18n
   * @param {Array<Object>} args arguments for i18n
   */
  set arguments(args) {
    this._args = args;
  }

  /**
   * Returns message arguments for i18n
   * @return {Array<Object>} message arguments for i18n
   */
  get arguments() {
    return this._args;
  }

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
  constructor(message, url) {
    super(NotFoundError, message, 404, url);
  }

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
  constructor(message, url) {
    super(ForbiddenError, message, 403, url);
  }

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
  constructor(message, url) {
    super(UnauthorizedError, message, 401, url);
  }

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
  constructor(message, details, url) {
    super(ValidationError, message, 400, url);
    /**
     * Validation error details
     * @type {Object}
     */
    this.details = details;
  }

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
  constructor(message, url) {
    super(InternalError, message, 500, url);
  }

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
  constructor(message, url) {
    super(ConflictError, message, 409, url);
  }
}

/**
 * @typedef {Object} TooManyRequestsErrorMetadata
 * @property {Number} periodInMinutes throttling period in minutes
 * @property {Number} requestsPerPeriodAllowed available requests for periodInMinutes
 * @property {Date} recommendedRetryTime recommended date to retry request
 * @property {String} type error type
 */

/**
 * Represents too many requests error. Throwing this error results in 429 (Too Many Requests) HTTP response code.
 */
export class TooManyRequestsError extends ApiError {
  /**
   * Constructs too many requests error.
   * @param {string} message error message
   * @param {TooManyRequestsErrorMetadata} metadata error metadata
   */
  constructor(message, metadata, url) {
    super(TooManyRequestsError, message, 429, url);
    this.metadata = metadata;
  }
}
