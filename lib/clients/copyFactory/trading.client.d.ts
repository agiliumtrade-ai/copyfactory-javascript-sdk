import DomainClient from "../domain.client";
import MetaApiClient from "../metaApi.client";
import { CopyFactoryStrategyIdAndName } from "./history.client";
import SignalClient from "./signal.client";

/**
 * metaapi.cloud CopyFactory trading API (trade copying trading API) client (see
 * https://metaapi.cloud/docs/copyfactory/)
 */
export default class TradingClient extends MetaApiClient {

  /**
   * Constructs CopyFactory trading API client instance
   * @param {DomainClient} domainClient domain client
   */
  constructor(domainClient: DomainClient);

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
  resynchronize(accountId: string, strategyIds?: Array<String>, positionIds?: Array<String>): Promise<any>;

  /**
   * Generates an instance of signal client for an account
   * @param {String} accountId account id
   * @returns {Promise<SignalClient>}
   */
  getSignalClient(accountId: string): Promise<SignalClient>;

  /**
   * Returns subscriber account stopouts. See
   * https://metaapi.cloud/docs/copyfactory/restApi/api/trading/getStopOuts/
   * @param {String} subscriberId subscriber id
   * @return {Promise<Array<CopyFactoryStrategyStopout>>} promise which resolves with stopouts found
   */
  getStopouts(subscriberId: string): Promise<Array<CopyFactoryStrategyStopout>>;

  /**
   * Resets strategy stopouts. See
   * https://metaapi.cloud/docs/copyfactory/restApi/api/trading/resetStopOuts/
   * @param {String} subscriberId subscriber id
   * @param {String} strategyId strategy id
   * @param {String} reason stopout reason to reset. One of yearly-balance, monthly-balance, daily-balance,
   * yearly-equity, monthly-equity, daily-equity, max-drawdown
   * @return {Promise} promise which resolves when the stopouts are reset
   */
  resetStopouts(subscriberId: string, strategyId: string, reason: string): Promise<any>;

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
  getUserLog(subscriberId: string, startTime?: Date, endTime?: Date, offset?: number, limit?: number): Promise<Array<CopyFactoryUserLogMessage>>;
  
}

/**
 * CopyFactory external signal update payload
 */
export declare type CopyFactoryExternalSignalUpdate = {

  /**
   * trade symbol
   */
  symbol: string,

  /**
   * trade type (one of POSITION_TYPE_BUY, POSITION_TYPE_SELL, ORDER_TYPE_BUY_LIMIT, ORDER_TYPE_SELL_LIMIT, 
   * ORDER_TYPE_BUY_STOP, ORDER_TYPE_SELL_STOP)
   */
  type: string,

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
  volume: number,
  
  /**
   * expert advisor id
   */
  magic?: number,

  /**
   * stop loss price
   */
  stopLoss?: number,

  /**
   * take profit price
   */
  takeProfit?: number,

  /**
   * pending order open price
   */
  openPrice?: number
}

/**
 * CopyFactory trading signal
 */
export declare type CopyFactoryTradingSignal = {

  /**
   * strategy the signal arrived from
   */
  strategy: CopyFactoryStrategyIdAndName,

  /**
   * id of the position the signal was generated from
   */
  positionId: string,

  /**
   * signal time
   */
  time: Date,

  /**
   * symbol traded
   */
  symbol: string,

  /**
   * type of the trade (one of market, limit, stop)
   */
  type: string,

  /**
   * side of the trade (one of buy, sell, close)
   */
  side: string,

  /**
   * open price for limit and stop orders
   */
  openPrice?: number,

  /**
   * stop loss price
   */
  stopLoss?: number,

  /**
   * take profit price
   */
  takeProfit?: number,

  /**
   * the signal volume
   */
  signalVolume: number,

  /**
   * the volume already open on subscriber side
   */
  subscriberVolume: number,

  /**
   * total profit of the position on subscriber side
   */
  subscriberProfit: number,

  /**
   * the time the signal will be automatically closed at
   */
  closeAfter: Date,

  /**
   * flag indicating that only closing side of this signal will be copied
   */
  closeOnly?: boolean
}

/**
 * CopyFactory external signal remove payload
 */
export declare type CopyFactoryExternalSignalRemove = {

  /**
   * the time signal was removed (closed) at
   */
  time: Date
}

/**
 * CopyFactory strategy stopout
 */
export declare type CopyFactoryStrategyStopout = {

  /**
   * strategy which was stopped out
   */
  strategy: CopyFactoryStrategyIdAndName,

  /**
   * flag indicating that stopout is partial
   */
  partial: boolean,

  /**
   * stopout reason. One of yearly-balance, monthly-balance, daily-balance, yearly-equity,
   * monthly-equity, daily-equity, max-drawdown
   */
  reason: string,

  /**
   * human-readable description of the stopout reason
   */
  reasonDescription: string,

  /**
   * flag indicating if positions should be closed
   */
  closePositions?: boolean,

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
export declare type CopyFactoryUserLogMessage = {

  /**
   * log record time
   */
  time: Date,

  /**
   * symbol traded
   */
  symbol?: string,

  /**
   * id of the strategy event relates to
   */
  strategyId?: string,
  
  /**
   * name of the strategy event relates to
   */
  strategyName?: string,

  /**
   * position id event relates to
   */
  positionId?: string,

  /**
   * side of the trade event relates to. One of buy, sell, close
   */
  side?: string,

  /**
   * type of the trade event relates to. One of market, limit, stop
   */
  type?: string,

  /**
   * open price for limit and stop orders
   */
  openPrice?: number,

  /**
   * log level. One of INFO, WARN, ERROR
   */
  level: string,

  /**
   * log message
   */
  message: string
}