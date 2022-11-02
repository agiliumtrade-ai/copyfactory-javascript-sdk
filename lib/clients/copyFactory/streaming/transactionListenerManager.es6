/**
 * 
 */'use strict';

import MetaApiClient from '../../metaApi.client';
import randomstring from 'randomstring';
import LoggerManager from '../../../logger';

/**
 * Transaction event listener manager
 */
export default class TransactionListenerManager extends MetaApiClient {

  /**
   * Constructs transaction event listener manager instance
   * @param {DomainClient} domainClient domain client
   */
  constructor(domainClient) {
    super(domainClient);
    this._domainClient = domainClient;
    this._strategyTransactionListeners = {};
    this._subscriberTransactionListeners = {};
    this._errorThrottleTime = 1000;
    this._logger = LoggerManager.getLogger('TransactionListenerManager');
  }

  /**
   * Returns the dictionary of strategy transaction listeners
   * @returns {Object} dictionary of strategy transaction listeners
   */
  get strategyTransactionListeners() {
    return this._strategyTransactionListeners;
  }

  /**
   * Returns the dictionary of subscriber transaction listeners
   * @returns {Object} dictionary of subscriber transaction listeners
   */
  get subscriberTransactionListeners() {
    return this._subscriberTransactionListeners;
  }

  /**
   * Adds a strategy transaction listener
   * @param {UserTransactionListener} listener user transaction listener
   * @param {String} strategyId strategy id
   * @param {Date} [startTime] transaction search start time
   * @returns {String} strategy transaction listener id
   */
  addStrategyTransactionListener(listener, strategyId, startTime) {
    const listenerId = randomstring.generate(10);
    this._strategyTransactionListeners[listenerId] = listener;
    this._startStrategyTransactionStreamJob(listenerId, listener, strategyId, startTime);
    return listenerId;
  }

  /**
   * Adds a subscriber transaction listener
   * @param {UserTransactionListener} listener user transaction listener
   * @param {String} subscriberId subscriber id
   * @param {Date} [startTime] transaction search start time
   * @returns {String} subscriber transaction listener id
   */
  addSubscriberTransactionListener(listener, subscriberId, startTime) {
    const listenerId = randomstring.generate(10);
    this._subscriberTransactionListeners[listenerId] = listener;
    this._startSubscriberTransactionStreamJob(listenerId, listener, subscriberId, startTime);
    return listenerId;
  }

  /**
   * Removes strategy transaction listener by id
   * @param {String} listenerId listener id 
   */
  removeStrategyTransactionListener(listenerId) {
    delete this._strategyTransactionListeners[listenerId];
  }

  /**
   * Removes subscriber transaction listener by id
   * @param {String} listenerId listener id 
   */
  removeSubscriberTransactionListener(listenerId) {
    delete this._subscriberTransactionListeners[listenerId];
  }

  async _startStrategyTransactionStreamJob(listenerId, listener, strategyId, startTime) {
    let throttleTime = this._errorThrottleTime;

    while(this._strategyTransactionListeners[listenerId]) {
      const opts = {
        url: `/users/current/strategies/${strategyId}/transactions/stream`,
        method: 'GET',
        qs: {
          startTime,
          limit: 1000
        },
        headers: {
          'auth-token': this._token
        },
        json: true
      };
      try {
        const packets = await this._domainClient.requestCopyFactory(opts, true);
        await listener.onTransaction(packets);
        throttleTime = this._errorThrottleTime;
        if(this._strategyTransactionListeners[listenerId] && packets.length) {
          startTime = new Date(new Date(packets[0].time).getTime() + 1);
        }
      } catch (err) {
        await listener.onError(err);
        if (err.name === 'NotFoundError') {
          this._logger.error(`Strategy ${strategyId} not found, removing listener ${listenerId}`);
          delete this._strategyTransactionListeners[listenerId]; 
        } else {
          this._logger.error(`Failed to retrieve transactions stream for strategy ${strategyId}, ` +
            `listener ${listenerId}, retrying in ${Math.floor(throttleTime/1000)} seconds`, err);
          await new Promise(res => setTimeout(res, throttleTime));
          throttleTime = Math.min(throttleTime * 2, 30000);
        }
      }
    }
  }

  async _startSubscriberTransactionStreamJob(listenerId, listener, subscriberId, startTime) {
    let throttleTime = this._errorThrottleTime;

    while(this._subscriberTransactionListeners[listenerId]) {
      const opts = {
        url: `/users/current/subscribers/${subscriberId}/transactions/stream`,
        method: 'GET',
        qs: {
          startTime,
          limit: 1000
        },
        headers: {
          'auth-token': this._token
        },
        json: true
      };
      try {
        const packets = await this._domainClient.requestCopyFactory(opts, true);
        await listener.onTransaction(packets);
        throttleTime = this._errorThrottleTime;
        if(this._subscriberTransactionListeners[listenerId] && packets.length) {
          startTime = new Date(new Date(packets[0].time).getTime() + 1);
        }
      } catch (err) {
        await listener.onError(err);
        if (err.name === 'NotFoundError') {
          this._logger.error(`Subscriber ${subscriberId} not found, removing listener ${listenerId}`);
          delete this._subscriberTransactionListeners[listenerId]; 
        } else {
          this._logger.error(`Failed to retrieve transactions stream for subscriber ${subscriberId}, ` +
            `listener ${listenerId}, retrying in ${Math.floor(throttleTime/1000)} seconds`, err);
          await new Promise(res => setTimeout(res, throttleTime));
          throttleTime = Math.min(throttleTime * 2, 30000);
        }
      }
    }
  }

}
