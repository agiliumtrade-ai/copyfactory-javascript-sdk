'use strict';

import request from 'request-promise-any';
import {
  UnauthorizedError, ForbiddenError, ApiError, ConflictError,
  ValidationError, InternalError, NotFoundError, TooManyRequestsError
} from './errorHandler';

/**
 * HTTP client library based on request-promise
 */
export default class HttpClient {

  /**
   * Constructs HttpClient class instance
   * @param timeout request timeout in seconds
   */
  constructor(timeout = 60, retryOpts = {}) {
    this._timeout = timeout * 1000;
    this._retries = retryOpts.retries || 5;
    this._minRetryDelayInSeconds = retryOpts.minDelayInSeconds || 1;
    this._maxRetryDelayInSeconds = retryOpts.maxDelayInSeconds || 30;
  }

  /**
   * Performs a request. Response errors are returned as ApiError or subclasses.
   * @param {Object} options request options
   * @returns {Promise} promise returning request results
   */
  request(options, retryCounter = 0) {
    options.timeout = this._timeout;
    return this._makeRequest(options)
      .catch(async (err) => {
        const error = this._convertError(err);
        if(['ConflictError', 'InternalError', 'ApiError', 'TimeoutError']
          .includes(error.name) && retryCounter < this._retries) {
          await new Promise(res => setTimeout(res, 
            Math.min(Math.pow(2, retryCounter) * this._minRetryDelayInSeconds, this._maxRetryDelayInSeconds) * 1000));
          return this.request(options, retryCounter + 1);
        } else {
          throw error;
        }
      });
  }

  _makeRequest(options) {
    return request(options);
  }

  // eslint-disable-next-line complexity
  _convertError(err) {
    let error;
    err.error = err.error || {};
    let status = err.statusCode || err.status;
    switch (status) {
    case 400:
      return new ValidationError(err.error.message || err.message, err.error.details || err.details);
    case 401:
      return new UnauthorizedError(err.error.message || err.message);
    case 403:
      return new ForbiddenError(err.error.message || err.message);
    case 404:
      return new NotFoundError(err.error.message || err.message);
    case 409:
      return new ConflictError(err.error.message || err.message);
    case 429:
      return new TooManyRequestsError(err.error.message || err.message, err.error.metadata || err.metadata);
    case 500:
      return new InternalError(err.error.message || err.message);
    default:
      return new ApiError(ApiError, err.error.message || err.message, status);
    }
  }

}

/**
 * HTTP client service mock for tests
 */
export class HttpClientMock extends HttpClient {

  /**
   * Constructs HTTP client mock
   * @param {Function(options:Object):Promise} requestFn mocked request function
   */
  constructor(requestFn, timeout = 60, retryOpts = {}) {
    super(timeout, retryOpts);
    this._requestFn = requestFn;
  }

  _makeRequest() {
    return this._requestFn.apply(this, arguments);
  }

  /**
   * Set request mock function
   * @param {Function} requestFn mock function
   */
  set requestFn(requestFn) {
    this._requestFn = requestFn;
  }

  /**
   * Return request mock function
   * @returns {Function} request mock function
   */
  get requestFn() {
    return this._requestFn;
  }

}
