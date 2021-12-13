/**
 * Error which indicates a timeout
 */
export default class TimeoutError extends Error {

  /**
   * Constructs the timeout error
   * @param {String} message error message
   */
  constructor(message: string);
}