import HttpClient from "../httpClient";
import MetaApiClient from "../metaApi.client";

/**
 * metaapi.cloud CopyFactory history API (trade copying history API) client (see
 * https://metaapi.cloud/docs/copyfactory/)
 */
export default class HistoryClient extends MetaApiClient {

  /**
   * Constructs CopyFactory history API client instance
   * @param {HttpClient} httpClient HTTP client
   * @param {String} token authorization token
   * @param {String} domain domain to connect to, default is agiliumtrade.agiliumtrade.ai
   */
  constructor(httpClien: HttpClient, token: String, domain?: String);
  
  /**
   * Returns list of transactions on the strategies the current user provides to other users
   * https://metaapi.cloud/docs/copyfactory/restApi/api/history/getProvidedTransactions/
   * @param {Date} from time to load transactions from
   * @param {Date} till time to load transactions till
   * @param {Array<string>} [strategyIds] list of strategy ids to filter transactions by
   * @param {Array<string>} [subscriberIds] the list of CopyFactory subscriber account ids to filter by
   * @param {number} [offset] pagination offset. Default value is 0
   * @param {number} [limit] pagination limit. Default value is 1000
   * @return {Promise<Array<CopyFactoryTransaction>>} promise resolving with transactions found
   */
  getProvidedTransactions(from: Date, till: Date, strategyIds?: Array<String>, subscriberIds?: Array<String>, offset?: Number, limit?: Number): Promise<Array<CopyFactoryTransaction>>;

  /**
   * Returns list of trades on the strategies the current user subscribed to
   * https://metaapi.cloud/docs/copyfactory/restApi/api/history/getSubscriptionTransactions/
   * @param {Date} from time to load transactions from
   * @param {Date} till time to load transactions till
   * @param {Array<String>} [strategyIds] list of strategy ids to filter transactions by
   * @param {Array<string>} [subscriberIds] the list of CopyFactory subscriber account ids to filter by
   * @param {Number} offset pagination offset. Default value is 0
   * @param {Number} limit pagination limit. Default value is 1000
   * @return {Promise<Array<CopyFactoryTransaction>>} promise resolving with transactions found
   */
  getSubscriptionTransactions(from: Date, till: Date, strategyIds?: Array<String>, subscriberIds?: Array<String>, offset?: Number, limit?: Number): Promise<Array<CopyFactoryTransaction>>;

  
}

/**
 * CopyFactory provider or subscriber user
 */
declare type CopyFactorySubscriberOrProviderUser = {

  /**
   * profile id
   */
  id: String,

  /**
   * user name
   */
  name: String,

  /**
   * array of strategy IDs provided by provider or subscribed to by subscriber
   */
  strategies?: Array<CopyFactoryStrategyIdAndName>
}

/**
 * CopyFactory strategy id and name
 */
declare type CopyFactoryStrategyIdAndName = {
  
  /**
   * unique strategy id
   */
  id: String,

  /**
   * human-readable strategy name
   */
  name: String
}

/**
 * CopyFactory transaction
 */
declare type CopyFactoryTransaction = {

  /**
   * transaction id
   */
  id: String,

  /**
   * transaction type (one of DEAL_TYPE_BUY, DEAL_TYPE_SELL, DEAL_TYPE_BALANCE,
   * DEAL_TYPE_CREDIT, DEAL_TYPE_CHARGE, DEAL_TYPE_CORRECTION, DEAL_TYPE_BONUS, DEAL_TYPE_COMMISSION,
   * DEAL_TYPE_COMMISSION_DAILY, DEAL_TYPE_COMMISSION_MONTHLY, DEAL_TYPE_COMMISSION_AGENT_DAILY,
   * DEAL_TYPE_COMMISSION_AGENT_MONTHLY, DEAL_TYPE_INTEREST, DEAL_TYPE_BUY_CANCELED, DEAL_TYPE_SELL_CANCELED,
   * DEAL_DIVIDEND, DEAL_DIVIDEND_FRANKED, DEAL_TAX). See
   * https://www.mql5.com/en/docs/constants/tradingconstants/dealproperties#enum_deal_type
   */
  type: String,

  /**
   * transaction time
   */
  time: Date,

  /**
   * CopyFactory subscriber id
   */
  subscriberId: String,

  /**
   * symbol traded
   */
  symbol?: String,

  /**
   * strategy subscriber
   */
  subscriberUser: CopyFactorySubscriberOrProviderUser,

  /**
   * demo account flag
   */
  demo: Boolean,

  /**
   * strategy provider
   */
  providerUser: CopyFactorySubscriberOrProviderUser,

  /**
   * strategy
   */
  strategy: CopyFactoryStrategyIdAndName,

  /**
   * source position id
   */
  positionId?: String,

  /**
   * slave position id
   */
  slavePositionId?: String,

  /**
   * high-water mark strategy balance improvement
   */
  improvement: Number,

  /**
   * provider commission
   */
  providerCommission: Number,

  /**
   * platform commission
   */
  platformCommission: Number,

  /**
   * commission paid by provider to underlying providers
   */
  incomingProviderCommission?: Number,

  /**
   * platform commission paid by provider to underlying providers
   */
  incomingPlatformCommission?: Number,

  /**
   * trade volume
   */
  quantity?: Number,

  /**
   * trade lot price
   */
  lotPrice?: Number,

  /**
   * trade tick price
   */
  tickPrice?: Number,

  /**
   * trade amount
   */
  amount?: Number,

  /**
   * trade commission
   */
  commission?: Number,

  /**
   * trade swap 
   */
  swap: Number,

  /**
   * trade profit
   */
  profit: Number,

  /**
   * trade copying metrics such as slippage and latencies. Measured
   * selectively for copied trades
   */
  metrics?: CopyFactoryTransactionMetrics
}

/**
 * Trade copying metrics such as slippage and latencies
 */
declare type CopyFactoryTransactionMetrics = {

  /**
   * trade copying latency, measured in milliseconds based on transaction time
   * provided by broker
   */
  tradeCopyingLatency?: Number,

  /**
   * trade copying slippage, measured in basis points (0.01
   * percent) based on transaction price provided by broker
   */
  tradeCopyingSlippageInBasisPoints?: Number,

  /**
   * trade copying slippage, measured in account currency
   * based on transaction price provided by broker
   */
  tradeCopyingSlippageInAccountCurrency?: Number,

  /**
   * trade signal latency introduced by broker and MT platform, measured
   * in milliseconds
   */
  mtAndBrokerSignalLatency?: Number,

  /**
   * trade algorithm latency introduced by CopyFactory servers, measured in
   * milliseconds
   */
  tradeAlgorithmLatency?: Number,

  /**
   * trade latency for a copied trade introduced by broker and MT platform,
   * measured in milliseconds
   */
  mtAndBrokerTradeLatency?: Number
}

