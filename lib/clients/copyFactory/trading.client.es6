'use strict';

import MetaApiClient from '../metaApi.client';
import SignalClient from './signal.client';

/**
 * metaapi.cloud CopyFactory trading API (trade copying trading API) client (see
 * https://metaapi.cloud/docs/copyfactory/)
 */
export default class TradingClient extends MetaApiClient {

  /**
   * Constructs CopyFactory trading API client instance
   * @param {DomainClient} domainClient domain client
   */
  constructor(domainClient) {
    super(domainClient);
    this._domainClient = domainClient;
  }

  /**
   * Resynchronizes the account. See
   * https://metaapi.cloud/docs/copyfactory/restApi/api/trading/resynchronize/
   * @param {String} accountId account id
   * @param {Array<String>} [strategyIds] array of strategy ids to recynchronize. Default is to synchronize all
   * strategies
   * @param {Array<String>} [positionIds] array of position ids to resynchronize. Default is to synchronize all
   * positions
   * @return {Promise} promise which resolves when resynchronization is scheduled
   */
  async resynchronize(accountId, strategyIds, positionIds) {
    if (this._isNotJwtToken()) {
      return this._handleNoAccessError('resynchronize');
    }
    const opts = {
      url: `/users/current/subscribers/${accountId}/resynchronize`,
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
    return this._domainClient.requestCopyFactory(opts);
  }

  /**
   * Generates an instance of signal client for an account
   * @param {String} accountId account id
   */
  async getSignalClient(accountId) {
    if (this._isNotJwtToken()) {
      return this._handleNoAccessError('getSignalClient');
    }

    const getAccount = async (id) => {
      const accountOpts = {
        url: `https://mt-provisioning-api-v1.${this._domainClient.domain}/users/current/accounts/${id}`,
        method: 'GET',
        headers: {
          'auth-token': this._token
        },
        json: true
      };
      return await this._domainClient.request(accountOpts);
    };

    let accountData = await getAccount(accountId);
    let signalClientAccountId = '';
    if(accountData.primaryAccountId) {
      signalClientAccountId = accountData.primaryAccountId;
      accountData = await getAccount(signalClientAccountId);
    } else {
      signalClientAccountId = accountData._id;
    }
    let regions = [accountData.region].concat(accountData.accountReplicas && 
      accountData.accountReplicas.map(replica => replica.region) || []);

    const host = await this._domainClient.getSignalClientHost(regions);
    return new SignalClient(signalClientAccountId, host, this._domainClient);
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
      url: `/users/current/subscribers/${subscriberId}/stopouts`,
      method: 'GET',
      headers: {
        'auth-token': this._token
      },
      json: true
    };
    return this._domainClient.requestCopyFactory(opts);
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
  resetStopouts(subscriberId, strategyId, reason) {
    if (this._isNotJwtToken()) {
      return this._handleNoAccessError('resetStopouts');
    }
    const opts = {
      url: `/users/current/subscribers/${subscriberId}/subscription-strategies/` +
        `${strategyId}/stopouts/${reason}/reset`,
      method: 'POST',
      headers: {
        'auth-token': this._token
      },
      json: true
    };
    return this._domainClient.requestCopyFactory(opts);
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
      url: `/users/current/subscribers/${subscriberId}/user-log`,
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
    let result = await this._domainClient.requestCopyFactory(opts, true);
    if (result) {
      result.map(r => r.time = new Date(r.time));
    }
    return result;
  }

}
