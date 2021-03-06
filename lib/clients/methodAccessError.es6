'use strict';

/**
 * Error which indicates that user doesn't have access to a method
 */
export default class MethodAccessError extends Error {

  /**
   * Constructs the error
   * @param {string} methodName Name of method
   * @param {string} accessType Type of method access
   */
  constructor(methodName, accessType = 'api') {
    let errorMessage = '';
    switch (accessType) {
    case 'api': {
      errorMessage = `You can not invoke ${methodName} method, because you have connected with API access token. ` +
            'Please use account access token to invoke this method.';
      break;
    }
    case 'account': {
      errorMessage = `You can not invoke ${methodName} method, because you have connected with account access token. ` +
            'Please use API access token from https://app.metaapi.cloud/token page to invoke this method.';
      break;
    }
    default: {
      errorMessage = '';
      break;
    }
    }
    super(errorMessage);
    this.name = 'MethodAccessError';
  }

}
