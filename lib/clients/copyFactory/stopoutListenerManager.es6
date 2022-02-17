'use strict';

import MetaApiClient from '../metaApi.client';
import randomstring from 'randomstring';

/**
 * Stopout event listener manager
 */
export default class StopoutListenerManager extends MetaApiClient {

  /**
   * Constructs stopout listener manager instance
   * @param {DomainClient} domainClient domain client
   */
  constructor(domainClient) {
    super(domainClient);
    this._domainClient = domainClient;
    this._stopoutListeners = {};
    this._errorThrottleTime = 1000;
  }

  /**
   * Returns the dictionary of stopout listeners
   * @returns {Object} dictionary of stopout listeners
   */
  get stopoutListeners() {
    return this._stopoutListeners;
  }

  /**
   * Adds a stopout listener
   * @param {StopoutListener} listener 
   * @param {String} [accountId] account id
   * @param {String} [strategyId] strategy id
   * @param {Number} [sequenceNumber] event sequence number
   * @returns {String} stopout listener id
   */
  addStopoutListener(listener, accountId, strategyId, sequenceNumber) {
    const listenerId = randomstring.generate(10);
    this._stopoutListeners[listenerId] = listener;
    this._startStopoutEventJob(listenerId, listener, accountId, strategyId, sequenceNumber);
    return listenerId;
  }

  /**
   * Removes stopout listener by id
   * @param {String} listenerId listener id 
   */
  removeStopoutListener(listenerId) {
    delete this._stopoutListeners[listenerId];
  }

  async _startStopoutEventJob(listenerId, listener, accountId, strategyId, sequenceNumber) {
    let throttleTime = this._errorThrottleTime;

    while(this._stopoutListeners[listenerId]) {
      const opts = {
        url: '/users/current/stopouts/stream',
        method: 'GET',
        qs: {
          previousSequenceNumber: sequenceNumber,
          subscriberId: accountId,
          strategyId: strategyId,
          limit: 1000
        },
        headers: {
          'auth-token': this._token
        },
        json: true
      };
      try {
        const packets = await this._domainClient.requestCopyFactory(opts, true);
        await listener.onStopout(packets);
        throttleTime = this._errorThrottleTime;
        if(this._stopoutListeners[listenerId] && packets.length) {
          sequenceNumber = packets.slice(-1)[0].sequenceNumber;
        }
      } catch (error) {
        await new Promise(res => setTimeout(res, throttleTime));
        throttleTime = Math.min(throttleTime * 2, 30000);
      }
    }
  }

}
