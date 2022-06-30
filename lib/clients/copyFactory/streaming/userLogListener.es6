'use strict';

/**
 * User log listener for handling a stream of user log events
 */
export default class UserLogListener {

  /**
   * Calls a predefined function with the packets data
   * @param {CopyFactoryUserLogMessage[]} logEvent user log event with an array of packets
   */
  async onUserLog(logEvent) {
    throw Error('Abstract method onUserLog has no implementation');
  }

}