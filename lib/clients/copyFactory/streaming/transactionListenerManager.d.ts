import MetaApiClient from '../../metaApi.client';
import DomainClient from '../../domain.client';
import TransactionListener from './transactionListener';

/**
 * User transaction event listener manager
 */
export default class TransactionListenerManager extends MetaApiClient {

  /**
   * Constructs user transaction event listener manager instance
   * @param {DomainClient} domainClient domain client
   */
  constructor(domainClient: DomainClient);

  /**
   * Returns the dictionary of strategy transaction listeners
   * @returns {Object} dictionary of strategy transaction listeners
   */
  get strategyTransactionListeners(): { [id: string]: TransactionListener };

  /**
   * Returns the dictionary of subscriber transaction listeners
   * @returns {Object} dictionary of subscriber transaction listeners
   */
  get subscriberTransactionListeners(): { [id: string]: TransactionListener };

  /**
   * Adds a strategy transaction listener
   * @param {TransactionListener} listener user transaction listener
   * @param {String} strategyId strategy id
   * @param {Date} [startTime] transaction search start time
   * @returns {String} strategy transaction listener id
   */
  addStrategyTransactionListener(listener: TransactionListener, strategyId: string, startTime?: Date): string;

  /**
   * Adds a subscriber transaction listener
   * @param {TransactionListener} listener user transaction listener
   * @param {String} subscriberId subscriber id
   * @param {Date} [startTime] transaction search start time
   * @returns {String} subscriber transaction listener id
   */
  addSubscriberTransactionListener(listener: TransactionListener, subscriberId: string, startTime?: Date): string;

  /**
   * Removes strategy transaction listener by id
   * @param {String} listenerId listener id 
   */
  removeStrategyTransactionListener(listenerId: string): void;

  /**
   * Removes subscriber transaction listener by id
   * @param {String} listenerId listener id 
   */
  removeSubscriberTransactionListener(listenerId: string): void;

}
