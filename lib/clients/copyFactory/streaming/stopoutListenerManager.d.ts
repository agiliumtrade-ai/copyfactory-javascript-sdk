import MetaApiClient from '../metaApi.client';
import DomainClient from '../domain.client';
import StopoutListener from './stopoutListener';

/**
 * Stopout listener for handling a stream of stopout events
 */
export default class StopoutListenerManager extends MetaApiClient {

  /**
   * Constructs stopout listener manager instance
   * @param {DomainClient} domainClient domain client
   */
  constructor(domainClient: DomainClient);

  /**
   * Returns the dictionary of stopout listeners
   * @returns {Object} dictionary of stopout listeners
   */
  get stopoutListeners(): { [id: string]: StopoutListener };

  /**
   * Adds a stopout listener
   * @param {StopoutListener} listener 
   * @param {String} [accountId] account id
   * @param {String} [strategyId] strategy id
   * @param {Number} [sequenceNumber] event sequence number
   * @returns {String} stopout listener id
   */
  addStopoutListener(listener: StopoutListener, accountId?: string, strategyId?: string, sequenceNumber?: number): string;

  /**
   * Removes stopout listener by id
   * @param {String} listenerId listener id 
   */
  removeStopoutListener(listenerId: string): void;

}
