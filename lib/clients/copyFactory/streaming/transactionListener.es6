'use strict';

/**
 * Transaction listener for handling a stream of transaction events
 */
export default class TransactionListener {

  /**
   * Calls a predefined function with the packets data
   * @param {CopyFactoryTransaction[]} transactionEvent transaction event with an array of packets
   */
  async onTransaction(transactionEvent) {
    throw Error('Abstract method onTransaction has no implementation');
  }

  /**
   * Calls a predefined function with the received error
   * @param {Error} error error received during retrieve attempt
   */
  async onError(error) {}

}