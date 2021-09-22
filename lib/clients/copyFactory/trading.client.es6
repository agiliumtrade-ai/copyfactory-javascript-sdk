'use strict';

import MetaApiClient from '../metaApi.client';
import randomstring from 'randomstring';

/**
 * metaapi.cloud CopyFactory trading API (trade copying trading API) client (see
 * https://metaapi.cloud/docs/copyfactory/)
 */
export default class TradingClient extends MetaApiClient {

  /**
   * Constructs CopyFactory trading API client instance
   * @param {HttpClient} httpClient HTTP client
   * @param {String} token authorization token
   * @param {String} domain domain to connect to, default is agiliumtrade.agiliumtrade.ai
   */
  constructor(httpClient, token, domain = 'agiliumtrade.agiliumtrade.ai') {
    super(httpClient, token, domain);
    this._host = `https://copyfactory-application-history-master-v1.${domain}`;
  }

  /**
   * Generates random signal id
   * @return {String} signal id
   */
  generateSignalId() {
    return randomstring.generate(8);
  }
  /**
   * CopyFactory external signal update payload
   * @typedef {Object} CopyFactoryExternalSignalUpdate
   * @property {String} symbol trade symbol
   * @property {String} type trade type (one of POSITION_TYPE_BUY, POSITION_TYPE_SELL, ORDER_TYPE_BUY_LIMIT, ORDER_TYPE_SELL_LIMIT, 
   * ORDER_TYPE_BUY_STOP, ORDER_TYPE_SELL_STOP)
   * @property {Date} time time the signal was emitted at
   * @property {Date} [updateTime] last time of the signal update
   * @property {Number} volume volume traded
   * @property {Number} [magic] expert advisor id
   * @property {Number} [stopLoss] stop loss price
   * @property {Number} [takeProfit] take profit price
   * @property {Number} [openPrice] pending order open price
   */

  /**
   * CopyFactory trading signal
   * @typedef {Object} CopyFactoryTradingSignal
   * @property {CopyFactoryStrategyIdAndName} strategy strategy the signal arrived from
   * @property {String} positionId id of the position the signal was generated from
   * @property {Date} time signal time
   * @property {String} symbol symbol traded
   * @property {String} type type of the trade (one of market, limit, stop)
   * @property {String} side side of the trade (one of buy, sell, close)
   * @property {Number} [openPrice] open price for limit and stop orders
   * @property {Number} [stopLoss] stop loss price
   * @property {Number} [takeProfit] take profit price
   * @property {Number} signalVolume the signal volume
   * @property {Number} subscriberVolume the volume already open on subscriber side
   * @property {Date} closeAfter the time the signal will be automatically closed at
   * @property {Boolean} [closeOnly] flag indicating that only closing side of this signal will be copied
   */

  /**
   * Updates external signal for a strategy. See
   * https://metaapi.cloud/docs/copyfactory/restApi/api/trading/updateExternalSignal/
   * @param {String} strategyId strategy id
   * @param {String} signalId external signal id (should be 8 alphanumerical symbols)
   * @param {CopyFactoryExternalSignalUpdate} signal signal update payload
   * @return {Promise} promise which resolves when the external signal is updated
   */
  updateExternalSignal(strategyId, signalId, signal) {
    if (this._isNotJwtToken()) {
      return this._handleNoAccessError('updateExternalSignal');
    }
    const opts = {
      url: `${this._host}/users/current/strategies/${strategyId}/external-signals/${signalId}`,
      method: 'PUT',
      headers: {
        'auth-token': this._token
      },
      body: signal,
      json: true
    };
    return this._httpClient.request(opts);
  }

  /**
   * CopyFactory external signal remove payload
   * @typedef {Object} CopyFactoryExternalSignalRemove
   * @property {Date} time the time signal was removed (closed) at
   */

  /**
   * Updates external signal for a strategy. See
   * https://metaapi.cloud/docs/copyfactory/restApi/api/trading/removeExternalSignal/
   * @param {String} strategyId strategy id
   * @param {String} signalId external signal id
   * @param {CopyFactoryExternalSignalRemove} signal signal removal payload
   * @return {Promise} promise which resolves when the external signal is removed
   */
  removeExternalSignal(strategyId, signalId, signal) {
    if (this._isNotJwtToken()) {
      return this._handleNoAccessError('removeExternalSignal');
    }
    const opts = {
      url: `${this._host}/users/current/strategies/${strategyId}/external-signals/${signalId}/remove`,
      method: 'POST',
      headers: {
        'auth-token': this._token
      },
      body: signal,
      json: true
    };
    return this._httpClient.request(opts);
  }

  /**
   * Resynchronizes the account. See
   * https://metaapi.cloud/docs/copyfactory/restApi/api/trading/resynchronize/
   * @param {String} accountId account id
   * @param {Array<String>} strategyIds optional array of strategy ids to recynchronize. Default is to synchronize all
   * strategies
   * @param {Array<String>} positionIds optional array of position ids to resynchronize. Default is to synchronize all
   * positions
   * @return {Promise} promise which resolves when resynchronization is scheduled
   */
  async resynchronize(accountId, strategyIds, positionIds) {
    if (this._isNotJwtToken()) {
      return this._handleNoAccessError('resynchronize');
    }
    const opts = {
      url: `${this._host}/users/current/subscribers/${accountId}/resynchronize`,
      method: 'POST',
      headers: {
        'auth-token': this._token
      },
      qs: {
        strategyId: strategyIds,
        positionId: positionIds
      },
      json: true
    };
    return this._httpClient.request(opts);
  }

  /**
   * Returns trading signals the subscriber is subscribed to. See
   * https://metaapi.cloud/docs/copyfactory/restApi/api/trading/getTradingSignals/
   * @param {String} subscriberId subscriber id
   * @returns {Promise<Array<CopyFactoryTradingSignal>>}
   */
  getTradingSignals(subscriberId) {
    if (this._isNotJwtToken()) {
      return this._handleNoAccessError('getTradingSignals');
    }
    const opts = {
      url: `${this._host}/users/current/subscribers/${subscriberId}/signals`,
      method: 'GET',
      headers: {
        'auth-token': this._token
      },
      json: true
    };
    return this._httpClient.request(opts);
  }

  /**
   * CopyFactory strategy stopout
   * @typedef {Object} CopyFactoryStrategyStopout
   * @property {CopyFactoryStrategyIdAndName} strategy strategy which was stopped out
   * @property {Boolean} partial flag indicating that stopout is partial
   * @property {String} reason stopout reason. One of yearly-balance, monthly-balance, daily-balance, yearly-equity,
   * monthly-equity, daily-equity, max-drawdown
   * @property {String} reasonDescription human-readable description of the stopout reason
   * @property {Boolean} [closePositions] flag indicating if positions should be closed
   * @property {Date} stoppedAt time the strategy was stopped at
   * @property {Date} stoppedTill time the strategy is stopped till
   */

  /**
   * Returns subscriber account stopouts. See
   * https://metaapi.cloud/docs/copyfactory/restApi/api/trading/getStopOuts/
   * @param {String} subscriberId subscriber id
   * @return {Promise<Array<CopyFactoryStrategyStopout>>} promise which resolves with stopouts found
   */
  async getStopouts(subscriberId) {
    if (this._isNotJwtToken()) {
      return this._handleNoAccessError('getStopouts');
    }
    const opts = {
      url: `${this._host}/users/current/subscribers/${subscriberId}/stopouts`,
      method: 'GET',
      headers: {
        'auth-token': this._token
      },
      json: true
    };
    return this._httpClient.request(opts);
  }

  /**
   * Resets strategy stopouts. See
   * https://metaapi.cloud/docs/copyfactory/restApi/api/trading/resetStopOuts/
   * @param {String} subscriberId subscriber id
   * @param {String} strategyId strategy id
   * @param {String} reason stopout reason to reset. One of yearly-balance, monthly-balance, daily-balance,
   * yearly-equity, monthly-equity, daily-equity, max-drawdown
   * @return {Promise} promise which resolves when the stopouts are reset
   */
  async resetStopouts(subscriberId, strategyId, reason) {
    if (this._isNotJwtToken()) {
      return this._handleNoAccessError('resetStopouts');
    }
    const opts = {
      url: `${this._host}/users/current/subscribers/${subscriberId}/subscription-strategies/` +
        `${strategyId}/stopouts/${reason}/reset`,
      method: 'POST',
      headers: {
        'auth-token': this._token
      },
      json: true
    };
    return this._httpClient.request(opts);
  }

  /**
   * Trade copying user log record
   * @typedef {Object} CopyFactoryUserLogMessage
   * @property {Date} time log record time
   * @property {string} [symbol] symbol traded
   * @property {string} [strategyId] id of the strategy event relates to
   * @property {string} [strategyName] name of the strategy event relates to
   * @property {string} [positionId] position id event relates to
   * @property {string} [side] side of the trade event relates to. One of buy, sell, close
   * @property {string} [type] type of the trade event relates to. One of market, limit, stop
   * @property {number} [openPrice] open price for limit and stop orders
   * @property {string} level log level. One of INFO, WARN, ERROR
   * @property {string} message log message
   */

  /**
   * Returns copy trading user log for an account and time range. See
   * https://metaapi.cloud/docs/copyfactory/restApi/api/trading/getUserLog/
   * @param {string} subscriberId subscriber id
   * @param {Date} [startTime] time to start loading data from
   * @param {Date} [endTime] time to stop loading data at
   * @param {number} [offset] pagination offset. Default is 0
   * @param {number} [limit] pagination limit. Default is 1000
   * @return {Promise<Array<CopyFactoryUserLogMessage>>} promise which resolves with log records found
   */
  async getUserLog(subscriberId, startTime, endTime, offset = 0, limit = 1000) {
    if (this._isNotJwtToken()) {
      return this._handleNoAccessError('getUserLog');
    }
    const opts = {
      url: `${this._host}/users/current/subscribers/${subscriberId}/user-log`,
      method: 'GET',
      qs: {
        startTime,
        endTime,
        offset,
        limit
      },
      headers: {
        'auth-token': this._token
      },
      json: true
    };
    let result = await this._httpClient.request(opts);
    if (result) {
      result.map(r => r.time = new Date(r.time));
    }
    return result;
  }

}
