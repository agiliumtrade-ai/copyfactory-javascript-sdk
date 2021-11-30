/**
 * HTTP client library based on request-promise
 */
export default class HttpClient {

  /**
   * Constructs HttpClient class instance
   * @param {Number} timeout request timeout in seconds
   * @param {RetryOptions} [retryOpts] retry options
   */
  constructor(timeout?: Number, retryOpts?: RetryOptions);

  /**
   * Performs a request. Response errors are returned as ApiError or subclasses.
   * @param {Object} options request options
   * @returns {Object|String|any} request result
   */
  request(options: Object): Object | String | any;
}

/**
 * retry options
 */
export declare type RetryOptions = {

  /**
   * the number of attempts to retry failed request, default 5
   */
  retries?: Number,

  /**
   * minimum delay in seconds before retrying, default 1
   */
  minDelayInSeconds?: Number,

  /**
   * maximum delay in seconds before retrying, default 30
   */
  maxDelayInSeconds?: Number
}