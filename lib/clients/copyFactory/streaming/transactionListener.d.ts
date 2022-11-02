import { CopyFactoryTransaction } from '../history.client';

/**
 * Transaction listener for handling a stream of transaction events
 */
export default class TransactionListener {

  /**
   * Calls a predefined function with the packets data
   * @param {CopyFactoryTransaction[]} transactionEvent transaction event with an array of packets
   */
  onTransaction(transactionEvent: CopyFactoryTransaction[]): Promise<void>;

  /**
   * Calls a predefined function with the received error
   * @param {Error} error error received during retrieve attempt
   */
  onError(error: Error): Promise<void>;

}
