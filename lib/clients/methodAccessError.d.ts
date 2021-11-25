/**
 * Error which indicates that user doesn't have access to a method
 */
export default class MethodAccessError extends Error {

  /**
   * Constructs the error
   * @param {string} methodName Name of method
   * @param {string} accessType Type of method access
   */
  constructor(methodName: String, accessType?: String);
}