import { CopyFactoryStrategyIdAndName } from "./history.client";
import DomainClient from "../domain.client";

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
  constructor(accountId: string, host: Object, domainClient: DomainClient);

  /**
   * Generates random signal id
   * @return {String} signal id
   */
  generateSignalId(): string;

  /**
   * Returns trading signals the subscriber is subscribed to. See
   * https://metaapi.cloud/docs/copyfactory/restApi/api/trading/getTradingSignals/
   * @returns {Promise<Array<CopyFactoryTradingSignal>>}
   */
  getTradingSignals(): Promise<Array<CopyFactoryTradingSignal>>;

  /**
   * Returns active external signals of a strategy. Requires access to
   * copyfactory-api:rest:public:external-signals:getSignals method which is included into reader role.
   * Requires access to strategy, account resources.
   * @param {string} strategyId strategy id
   * @returns {Promise<Array<CopyFactoryExternalSignal>>}
   */
  getStrategyExternalSignals(strategyId: string): Promise<Array<CopyFactoryExternalSignal>>

  /**
   * Updates external signal for a strategy. See
   * https://metaapi.cloud/docs/copyfactory/restApi/api/trading/updateExternalSignal/
   * @param {String} strategyId strategy id
   * @param {String} signalId external signal id (should be 8 alphanumerical symbols)
   * @param {CopyFactoryExternalSignalUpdate} signal signal update payload
   * @return {Promise} promise which resolves when the external signal is updated
   */
  updateExternalSignal(strategyId: string, signalId: string, signal: CopyFactoryExternalSignalUpdate): Promise<any>;

  /**
   * Updates external signal for a strategy. See
   * https://metaapi.cloud/docs/copyfactory/restApi/api/trading/removeExternalSignal/
   * @param {String} strategyId strategy id
   * @param {String} signalId external signal id
   * @param {CopyFactoryExternalSignalRemove} signal signal removal payload
   * @return {Promise} promise which resolves when the external signal is removed
   */
  removeExternalSignal(strategyId: string, signalId: string, signal: CopyFactoryExternalSignalRemove): Promise<any>;

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
   * pending or market order open price
   */
  openPrice?: number
}

/**
 * CopyFactory external signal
 */
export declare type CopyFactoryExternalSignal = CopyFactoryExternalSignalUpdate & {

  /**
   * external signal id
   */
  id: string

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
