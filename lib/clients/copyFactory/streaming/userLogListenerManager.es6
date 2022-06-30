'use strict';

import MetaApiClient from '../../metaApi.client';
import randomstring from 'randomstring';
import LoggerManager from '../../../logger';

/**
 * User log event listener manager
 */
export default class UserLogListenerManager extends MetaApiClient {

  /**
   * Constructs user log event listener manager instance
   * @param {DomainClient} domainClient domain client
   */
  constructor(domainClient) {
    super(domainClient);
    this._domainClient = domainClient;
    this._strategyLogListeners = {};
    this._subscriberLogListeners = {};
    this._errorThrottleTime = 1000;
    this._logger = LoggerManager.getLogger('UserLogListenerManager');
  }

  /**
   * Returns the dictionary of strategy log listeners
   * @returns {Object} dictionary of strategy log listeners
   */
  get strategyLogListeners() {
    return this._strategyLogListeners;
  }

  /**
   * Returns the dictionary of subscriber log listeners
   * @returns {Object} dictionary of subscriber log listeners
   */
  get subscriberLogListeners() {
    return this._subscriberLogListeners;
  }

  /**
   * Adds a strategy log listener
   * @param {UserLogListener} listener user log listener
   * @param {String} strategyId strategy id
   * @param {Date} [startTime] log search start time
   * @returns {String} strategy log listener id
   */
  addStrategyLogListener(listener, strategyId, startTime) {
    const listenerId = randomstring.generate(10);
    this._strategyLogListeners[listenerId] = listener;
    this._startStrategyLogStreamJob(listenerId, listener, strategyId, startTime);
    return listenerId;
  }

  /**
   * Adds a subscriber log listener
   * @param {UserLogListener} listener user log listener
   * @param {String} subscriberId subscriber id
   * @param {Date} [startTime] log search start time
   * @returns {String} subscriber log listener id
   */
  addSubscriberLogListener(listener, subscriberId, startTime) {
    const listenerId = randomstring.generate(10);
    this._subscriberLogListeners[listenerId] = listener;
    this._startSubscriberLogStreamJob(listenerId, listener, subscriberId, startTime);
    return listenerId;
  }

  /**
   * Removes strategy log listener by id
   * @param {String} listenerId listener id 
   */
  removeStrategyLogListener(listenerId) {
    delete this._strategyLogListeners[listenerId];
  }

  /**
   * Removes subscriber log listener by id
   * @param {String} listenerId listener id 
   */
  removeSubscriberLogListener(listenerId) {
    delete this._subscriberLogListeners[listenerId];
  }

  async _startStrategyLogStreamJob(listenerId, listener, strategyId, startTime) {
    let throttleTime = this._errorThrottleTime;

    while(this._strategyLogListeners[listenerId]) {
      const opts = {
        url: `/users/current/strategies/${strategyId}/user-log/stream`,
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
        await listener.onUserLog(packets);
        throttleTime = this._errorThrottleTime;
        if(this._strategyLogListeners[listenerId] && packets.length) {
          startTime = new Date(new Date(packets[0].time).getTime() + 1);
        }
      } catch (err) {
        if (err.name === 'NotFoundError') {
          this._logger.error(`Strategy ${strategyId} not found, removing listener ${listenerId}`);
          delete this._strategyLogListeners[listenerId]; 
        } else {
          await new Promise(res => setTimeout(res, throttleTime));
          throttleTime = Math.min(throttleTime * 2, 30000);
        }
      }
    }
  }

  async _startSubscriberLogStreamJob(listenerId, listener, subscriberId, startTime) {
    let throttleTime = this._errorThrottleTime;

    while(this._subscriberLogListeners[listenerId]) {
      const opts = {
        url: `/users/current/subscribers/${subscriberId}/user-log/stream`,
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
        await listener.onUserLog(packets);
        throttleTime = this._errorThrottleTime;
        if(this._subscriberLogListeners[listenerId] && packets.length) {
          startTime = new Date(new Date(packets[0].time).getTime() + 1);
        }
      } catch (err) {
        if (err.name === 'NotFoundError') {
          this._logger.error(`Subscriber ${subscriberId} not found, removing listener ${listenerId}`);
          delete this._subscriberLogListeners[listenerId]; 
        } else { 
          await new Promise(res => setTimeout(res, throttleTime));
          throttleTime = Math.min(throttleTime * 2, 30000);
        }
      }
    }
  }

}
