import randomstring from 'randomstring';

/**
 * CopyFactory client for signal requests
 */
export default class SignalClient {

  /**
   * Constructs CopyFactory signal client instance
   * @param {string} accountId account id
   * @param {Object} host host data
   * @param {DomainClient} domainClient domain client
   */
  constructor(accountId, host, domainClient) {
    this._accountId = accountId;
    this._domainClient = domainClient;
    this._host = host;
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
   * @property {Number} [openPrice] pending or market order open price
   */

  /**
   * CopyFactory external signal
   * @typedef {CopyFactoryExternalSignalUpdate} CopyFactoryExternalSignal
   * @property {String} id external signal id
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
   * @property {Number} subscriberProfit total profit of the position on subscriber side
   * @property {Date} closeAfter the time the signal will be automatically closed at
   * @property {Boolean} [closeOnly] flag indicating that only closing side of this signal will be copied
   */

  /**
   * CopyFactory external signal remove payload
   * @typedef {Object} CopyFactoryExternalSignalRemove
   * @property {Date} time the time signal was removed (closed) at
   */

  /**
   * Returns trading signals the subscriber is subscribed to. See
   * https://metaapi.cloud/docs/copyfactory/restApi/api/trading/getTradingSignals/
   * @returns {Promise<Array<CopyFactoryTradingSignal>>}
   */
  getTradingSignals() {
    const opts = {
      url: `/users/current/subscribers/${this._accountId}/signals`,
      method: 'GET',
      headers: {
        'auth-token': this._domainClient.token
      },
      json: true
    };
    return this._domainClient.requestSignal(opts, this._host, this._accountId);
  }

  /**
   * Returns active external signals of a strategy. Requires access to
   * copyfactory-api:rest:public:external-signals:getSignals method which is included into reader role.
   * Requires access to strategy, account resources.
   * @param {String} strategyId strategy id
   * @returns {Promise<Array<CopyFactoryExternalSignal>>}
   */
  getStrategyExternalSignals(strategyId) {
    const opts = {
      url: `/users/current/strategies/${strategyId}/external-signals`,
      method: 'GET',
      headers: {
        'auth-token': this._domainClient.token
      },
      json: true
    };
    return this._domainClient.requestSignal(opts, this._host, this._accountId);
  }

  /**
   * Updates external signal for a strategy. See
   * https://metaapi.cloud/docs/copyfactory/restApi/api/trading/updateExternalSignal/
   * @param {String} strategyId strategy id
   * @param {String} signalId external signal id (should be 8 alphanumerical symbols)
   * @param {CopyFactoryExternalSignalUpdate} signal signal update payload
   * @return {Promise} promise which resolves when the external signal is updated
   */
  updateExternalSignal(strategyId, signalId, signal) {
    const opts = {
      url: `/users/current/strategies/${strategyId}/external-signals/${signalId}`,
      method: 'PUT',
      headers: {
        'auth-token': this._domainClient.token
      },
      body: signal,
      json: true
    };
    return this._domainClient.requestSignal(opts, this._host, this._accountId);
  }

  /**
   * CopyFactory external signal remove payload
   * @typedef {Object} CopyFactoryExternalSignalRemove
   * @property {Date} time the time signal was removed (closed) at
   */

  /**
   * Removes (closes) external signal for a strategy. See
   * https://metaapi.cloud/docs/copyfactory/restApi/api/trading/removeExternalSignal/
   * @param {String} strategyId strategy id
   * @param {String} signalId external signal id
   * @param {CopyFactoryExternalSignalRemove} signal signal removal payload
   * @return {Promise} promise which resolves when the external signal is removed
   */
  removeExternalSignal(strategyId, signalId, signal) {
    const opts = {
      url: `/users/current/strategies/${strategyId}/external-signals/${signalId}/remove`,
      method: 'POST',
      headers: {
        'auth-token': this._domainClient.token
      },
      body: signal,
      json: true
    };
    return this._domainClient.requestSignal(opts, this._host, this._accountId);
  }
}