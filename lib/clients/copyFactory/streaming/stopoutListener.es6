'use strict';

/**
 * Stopout listener for handling a stream of stopout events
 */
export default class StopoutListener {

  /**
   * Calls a predefined function with the packets data
   * @param {CopyFactoryStrategyStopout[]} strategyStopoutEvent strategy stopout event with an array of packets
   */
  async onStopout(strategyStopoutEvent) {
    throw Error('Abstract method onStopout has no implementation');
  }

  /**
   * Calls a predefined function with the received error
   * @param {Error} error error received during retrieve attempt
   */
  async onError(error) {}

}