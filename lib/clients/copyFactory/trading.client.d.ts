import HttpClient from "../httpClient";
import MetaApiClient from "../metaApi.client";
import { CopyFactoryStrategyIdAndName } from "./history.client";

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
  constructor(httpClient: HttpClient, token: String, domain: String);

  /**
   * Generates random signal id
   * @return {String} signal id
   */
  generateSignalId(): String;

  /**
   * Updates external signal for a strategy. See
   * https://metaapi.cloud/docs/copyfactory/restApi/api/trading/updateExternalSignal/
   * @param {String} strategyId strategy id
   * @param {String} signalId external signal id (should be 8 alphanumerical symbols)
   * @param {CopyFactoryExternalSignalUpdate} signal signal update payload
   * @return {Promise} promise which resolves when the external signal is updated
   */
  updateExternalSignal(strategyId: String, signalId: String, signal: CopyFactoryExternalSignalUpdate): Promise<any>;

  /**
   * Updates external signal for a strategy. See
   * https://metaapi.cloud/docs/copyfactory/restApi/api/trading/removeExternalSignal/
   * @param {String} strategyId strategy id
   * @param {String} signalId external signal id
   * @param {CopyFactoryExternalSignalRemove} signal signal removal payload
   * @return {Promise} promise which resolves when the external signal is removed
   */
  removeExternalSignal(strategyId: String, signalId: String, signal: CopyFactoryExternalSignalRemove): Promise<any>;

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
  resynchronize(accountId: String, strategyIds?: Array<String>, positionIds?: Array<String>): Promise<any>;

  /**
   * Returns trading signals the subscriber is subscribed to. See
   * https://metaapi.cloud/docs/copyfactory/restApi/api/trading/getTradingSignals/
   * @param {String} subscriberId subscriber id
   * @returns {Promise<Array<CopyFactoryTradingSignal>>}
   */
  getTradingSignals(subscriberId: String): Promise<Array<CopyFactoryTradingSignal>>;

  /**
   * Returns subscriber account stopouts. See
   * https://metaapi.cloud/docs/copyfactory/restApi/api/trading/getStopOuts/
   * @param {String} subscriberId subscriber id
   * @return {Promise<Array<CopyFactoryStrategyStopout>>} promise which resolves with stopouts found
   */
  getStopouts(subscriberId: String): Promise<Array<CopyFactoryStrategyStopout>>;

  /**
   * Resets strategy stopouts. See
   * https://metaapi.cloud/docs/copyfactory/restApi/api/trading/resetStopOuts/
   * @param {String} subscriberId subscriber id
   * @param {String} strategyId strategy id
   * @param {String} reason stopout reason to reset. One of yearly-balance, monthly-balance, daily-balance,
   * yearly-equity, monthly-equity, daily-equity, max-drawdown
   * @return {Promise} promise which resolves when the stopouts are reset
   */
  resetStopouts(subscriberId: String, strategyId: String, reason: String): Promise<any>;

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
  getUserLog(subscriberId: String, startTime?: Date, endTime?: Date, offset?: Number, limit?: Number): Promise<Array<CopyFactoryUserLogMessage>>;
  
}

/**
 * CopyFactory external signal update payload
 */
declare type CopyFactoryExternalSignalUpdate = {

  /**
   * trade symbol
   */
  symbol: String,

  /**
   * trade type (one of POSITION_TYPE_BUY, POSITION_TYPE_SELL, ORDER_TYPE_BUY_LIMIT, ORDER_TYPE_SELL_LIMIT, 
   * ORDER_TYPE_BUY_STOP, ORDER_TYPE_SELL_STOP)
   */
  type: String,

  /**
   * time the signal was emitted at
   */
  time: Date,

  /**
   * last time of the signal update
   */
  updateTime?: Date,

  /**
   * volume traded
   */
  volume: Number,
  
  /**
   * expert advisor id
   */
  magic?: Number,

  /**
   * stop loss price
   */
  stopLoss?: Number,

  /**
   * take profit price
   */
  takeProfit?: Number,

  /**
   * pending order open price
   */
  openPrice?: Number
}

/**
 * CopyFactory trading signal
 */
declare type CopyFactoryTradingSignal = {

  /**
   * strategy the signal arrived from
   */
  strategy: CopyFactoryStrategyIdAndName,

  /**
   * id of the position the signal was generated from
   */
  positionId: String,

  /**
   * signal time
   */
  time: Date,

  /**
   * symbol traded
   */
  symbol: String,

  /**
   * type of the trade (one of market, limit, stop)
   */
  type: String,

  /**
   * side of the trade (one of buy, sell, close)
   */
  side: String,

  /**
   * open price for limit and stop orders
   */
  openPrice?: Number,

  /**
   * stop loss price
   */
  stopLoss?: Number,

  /**
   * take profit price
   */
  takeProfit?: Number,

  /**
   * the signal volume
   */
  signalVolume: Number,

  /**
   * the volume already open on subscriber side
   */
  subscriberVolume: Number,

  /**
   * total profit of the position on subscriber side
   */
  subscriberProfit: Number,

  /**
   * the time the signal will be automatically closed at
   */
  closeAfter: Date,

  /**
   * flag indicating that only closing side of this signal will be copied
   */
  closeOnly?: Boolean
}

/**
 * CopyFactory external signal remove payload
 */
declare type CopyFactoryExternalSignalRemove = {

  /**
   * the time signal was removed (closed) at
   */
  time: Date
}

/**
 * CopyFactory strategy stopout
 */
declare type CopyFactoryStrategyStopout = {

  /**
   * strategy which was stopped out
   */
  strategy: CopyFactoryStrategyIdAndName,

  /**
   * flag indicating that stopout is partial
   */
  partial: Boolean,

  /**
   * stopout reason. One of yearly-balance, monthly-balance, daily-balance, yearly-equity,
   * monthly-equity, daily-equity, max-drawdown
   */
  reason: String,

  /**
   * human-readable description of the stopout reason
   */
  reasonDescription: String,

  /**
   * flag indicating if positions should be closed
   */
  closePositions?: Boolean,

  /**
   * time the strategy was stopped at
   */
  stoppedAt: Date,

  /**
   * time the strategy is stopped till
   */
  stoppedTill: Date
}

/**
 * Trade copying user log record
 */
declare type CopyFactoryUserLogMessage = {

  /**
   * log record time
   */
  time: Date,

  /**
   * symbol traded
   */
  symbol?: String,

  /**
   * id of the strategy event relates to
   */
  strategyId?: String,
  
  /**
   * name of the strategy event relates to
   */
  strategyName?: String,

  /**
   * position id event relates to
   */
  positionId?: String,

  /**
   * side of the trade event relates to. One of buy, sell, close
   */
  side?: String,

  /**
   * type of the trade event relates to. One of market, limit, stop
   */
  type?: String,

  /**
   * open price for limit and stop orders
   */
  openPrice?: Number,

  /**
   * log level. One of INFO, WARN, ERROR
   */
  level: String,

  /**
   * log message
   */
  message: String
}