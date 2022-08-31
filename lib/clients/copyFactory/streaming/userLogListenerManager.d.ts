import MetaApiClient from '../../metaApi.client';
import DomainClient from '../../domain.client';
import UserLogListener from './userLogListener';

/**
 * User log event listener manager
 */
export default class UserLogListenerManager extends MetaApiClient {

  /**
   * Constructs user log event listener manager instance
   * @param {DomainClient} domainClient domain client
   */
  constructor(domainClient: DomainClient);

  /**
   * Returns the dictionary of strategy log listeners
   * @returns {Object} dictionary of strategy log listeners
   */
  get strategyLogListeners(): { [id: string]: UserLogListener };

  /**
   * Returns the dictionary of subscriber log listeners
   * @returns {Object} dictionary of subscriber log listeners
   */
  get subscriberLogListeners(): { [id: string]: UserLogListener };

  /**
   * Adds a strategy log listener
   * @param {UserLogListener} listener user log listener
   * @param {String} strategyId strategy id
   * @param {Date} [startTime] log search start time
   * @param {String} [positionId] position id filter
   * @param {'DEBUG'|'INFO'|'WARN'|'ERROR'} [level] minimum severity level
   * @param {Number} [limit] log pagination limit
   * @returns {String} strategy log listener id
   */
  addStrategyLogListener(listener: UserLogListener, strategyId: string, startTime?: Date, positionId?: string, level?: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR', limit?: number): string;

  /**
   * Adds a subscriber log listener
   * @param {UserLogListener} listener user log listener
   * @param {String} subscriberId subscriber id
   * @param {Date} [startTime] log search start time
   * @param {string} [strategyId] strategy id filter
   * @param {string} [positionId] position id filter
   * @param {'DEBUG'|'INFO'|'WARN'|'ERROR'} [level] minimum severity level
   * @param {Number} [limit] log pagination limit
   * @returns {String} subscriber log listener id
   */
  addSubscriberLogListener(listener: UserLogListener, subscriberId: string, startTime?: Date, strategyId?: string, positionId?: string, level?: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR', limit?: number): string;

  /**
   * Removes strategy log listener by id
   * @param {String} listenerId listener id 
   */
  removeStrategyLogListener(listenerId: string): void;

  /**
   * Removes subscriber log listener by id
   * @param {String} listenerId listener id 
   */
  removeSubscriberLogListener(listenerId: string): void;

}
