'use strict';

import MetaApiClient from '../metaApi.client';
import randomstring from 'randomstring';

/**
 * metaapi.cloud CopyFactory history API (trade copying history API) client (see
 * https://trading-api-v1.project-stock.agiliumlabs.cloud/swagger/#/)
 */
export default class HistoryClient extends MetaApiClient {

  /**
   * Constructs CopyFactory history API client instance
   * @param {HttpClient} httpClient HTTP client
   * @param {String} token authorization token
   * @param {String} domain domain to connect to, default is agiliumtrade.agiliumtrade.ai
   */
  constructor(httpClient, token, domain = 'agiliumtrade.agiliumtrade.ai') {
    super(httpClient, token, domain);
    this._host = `https://trading-api-v1.${domain}`;
  }

  /**
   * CopyFactory provider or subscriber
   * @typedef {Object} CopyFactorySubscriberOrProvider
   * @property {String} id profile id
   * @property {String} name user name
   * @property {Array<CopyFactoryStrategyIdAndName>} strategies array of strategy IDs provided by provider or subscribed to by
   * subscriber
   */

  /**
   * CopyFactory strategy id and name
   * @typedef {Object} CopyFactoryStrategyIdAndName
   * @property {String} id unique strategy id
   * @property {String} name human-readable strategy name
   */

  /**
   * Returns list of providers providing strategies to the current user
   * https://trading-api-v1.agiliumtrade.agiliumtrade.ai/swagger/#!/default/get_users_current_providers
   * @return {Promise<Array<CopyFactorySubscriberOrProvider>>} promise resolving with providers found
   */
  getProviders() {
    if (this._isNotJwtToken()) {
      return this._handleNoAccessError('getProviders');
    }
    const opts = {
      url: `${this._host}/users/current/providers`,
      method: 'GET',
      headers: {
        'auth-token': this._token
      },
      json: true
    };
    return this._httpClient.request(opts);
  }

  /**
   * Returns list of subscribers subscribed to the strategies of the current user
   * https://trading-api-v1.agiliumtrade.agiliumtrade.ai/swagger/#!/default/get_users_current_subscribers
   * @return {Promise<Array<CopyFactorySubscriberOrProvider>>} promise resolving with subscribers found
   */
  getSubscribers() {
    if (this._isNotJwtToken()) {
      return this._handleNoAccessError('getSubscribers');
    }
    const opts = {
      url: `${this._host}/users/current/subscribers`,
      method: 'GET',
      headers: {
        'auth-token': this._token
      },
      json: true
    };
    return this._httpClient.request(opts);
  }

  /**
   * Returns list of strategies the current user is subscribed to
   * https://trading-api-v1.agiliumtrade.agiliumtrade.ai/swagger/#!/default/get_users_current_strategies_subscribed
   * @return {Promise<Array<CopyFactoyStrategyIdAndName>>} promise resolving with strategies found
   */
  getStrategiesSubscribed() {
    if (this._isNotJwtToken()) {
      return this._handleNoAccessError('getStrategiesSubscribed');
    }
    const opts = {
      url: `${this._host}/users/current/strategies-subscribed`,
      method: 'GET',
      headers: {
        'auth-token': this._token
      },
      json: true
    };
    return this._httpClient.request(opts);
  }

  /**
   * Returns list of strategies the current user provides to other users
   * https://trading-api-v1.agiliumtrade.agiliumtrade.ai/swagger/#!/default/get_users_current_provided_strategies
   * @return {Promise<Array<CopyFactoryStrategyIdAndName>>} promise resolving with strategies found
   */
  getProvidedStrategies() {
    if (this._isNotJwtToken()) {
      return this._handleNoAccessError('getProvidedStrategies');
    }
    const opts = {
      url: `${this._host}/users/current/provided-strategies`,
      method: 'GET',
      headers: {
        'auth-token': this._token
      },
      json: true
    };
    return this._httpClient.request(opts);
  }

  /**
   * CopyFactory transaction
   * @typedef {Object} CopyFactoryTransaction
   * @property {String} id transaction id
   * @property {String} type transaction type (one of DEAL_TYPE_BUY, DEAL_TYPE_SELL, DEAL_TYPE_BALANCE,
   * DEAL_TYPE_CREDIT, DEAL_TYPE_CHARGE, DEAL_TYPE_CORRECTION, DEAL_TYPE_BONUS, DEAL_TYPE_COMMISSION,
   * DEAL_TYPE_COMMISSION_DAILY, DEAL_TYPE_COMMISSION_MONTHLY, DEAL_TYPE_COMMISSION_AGENT_DAILY,
   * DEAL_TYPE_COMMISSION_AGENT_MONTHLY, DEAL_TYPE_INTEREST, DEAL_TYPE_BUY_CANCELED, DEAL_TYPE_SELL_CANCELED,
   * DEAL_DIVIDEND, DEAL_DIVIDEND_FRANKED, DEAL_TAX). See
   * https://www.mql5.com/en/docs/constants/tradingconstants/dealproperties#enum_deal_type
   * @property {Date} time transaction time
   * @property {String} accountId CopyFactory account id
   * @property {String} [symbol] optional symbol traded
   * @property {CopyFactorySubscriberOrProvider} subscriber strategy subscriber
   * @property {Boolean} demo demo account flag
   * @property {CopyFactorySubscriberOrProvider} provider strategy provider
   * @property {CopyFactoryStrategyIdAndName} strategy strategy
   * @property {String} [positionId] source position id
   * @property {Number} improvement high-water mark strategy balance improvement
   * @property {Number} providerCommission provider commission
   * @property {Number} platformCommission platform commission
   * @property {Number} [incomingProviderCommission] commission paid by provider to underlying providers
   * @property {Number} [incomingPlatformCommission] platform commission paid by provider to underlying providers
   * @property {Number} [lotPrice] trade lot price
   * @property {Number} [tickPrice] trade tick price
   * @property {Number} [amount] trade amount
   * @property {Number} [commission] trade commission
   * @property {Number} swap trade swap
   * @property {Number} profit trade profit
   * @property {CopyFactoryTransactionMetrics} [metrics] trade copying metrics such as slippage and latencies. Measured
   * selectively for copied trades
   */

  /**
   * Trade copying metrics such as slippage and latencies
   * @typedef {Object} CopyFactoryTransactionMetrics
   * @property {Number} [tradeCopyingLatency] trade copying latency, measured in milliseconds based on transaction time
   * provided by broker
   * @property {Number} [tradeCopyingSlippageInBasisPoints] trade copying slippage, measured in basis points (0.01
   * percent) based on transaction price provided by broker
   * @property {Number} [tradeCopyingSlippageInAccountCurrency] trade copying slippage, measured in account currency
   * based on transaction price provided by broker
   * @property {Number} [mtAndBrokerSignalLatency] trade signal latency introduced by broker and MT platform, measured
   * in milliseconds
   * @property {Number} [tradeAlgorithmLatency] trade algorithm latency introduced by CopyFactory servers, measured in
   * milliseconds
   * @property {Number} [mtAndBrokerTradeLatency] trade latency for a copied trade introduced by broker and MT platform,
   * measured in milliseconds
   * @property {Number} [totalLatency] total trade copying latency, measured in milliseconds. This value might be
   * slightly different from tradeCopyingLatency value due to limited measurement precision as it is measured based
   * on timestamps captured during copy trading process as opposed to broker data
   */

  /**
   * Returns list of transactions on the strategies the current user provides to other users
   * https://trading-api-v1.agiliumtrade.agiliumtrade.ai/swagger/#!/default/get_users_current_provided_strategies_transactions
   * @param {Date} from time to load transactions from
   * @param {Date} till time to load transactions till
   * @param {Array<String>} [strategyIds] optional list of strategy ids to filter transactions by
   * @param {Array<String>} [subscriberIds] optional list of subscribers to filter transactions by
   * @param {Number} [offset] pagination offset. Default value is 0
   * @param {Number} [limit] pagination limit. Default value is 10000
   * @return {Promise<Array<CopyFactoryTransaction>>} promise resolving with transactions found
   */
  async getProvidedStrategiesTransactions(from, till, strategyIds, subscriberIds, offset, limit) {
    if (this._isNotJwtToken()) {
      return this._handleNoAccessError('getProvidedStrategiesTransactions');
    }
    let qs = {
      from,
      till
    };
    if (strategyIds) {
      qs.strategyId = strategyIds;
    }
    if (subscriberIds) {
      qs.subscriberId = subscriberIds;
    }
    if (offset !== undefined) {
      qs.offset = offset;
    }
    if (limit) {
      qs.limit = limit;
    }
    const opts = {
      url: `${this._host}/users/current/provided-strategies/transactions`,
      method: 'GET',
      headers: {
        'auth-token': this._token
      },
      qs,
      json: true
    };
    let transactions = await this._httpClient.request(opts);
    transactions.forEach(t => t.time = new Date(t.time));
    return transactions;
  }

  /**
   * Returns list of trades on the strategies the current user subscribed to
   * https://trading-api-v1.agiliumtrade.agiliumtrade.ai/swagger/#!/default/get_users_current_strategies_subscribed_transactions
   * @param {Date} from time to load transactions from
   * @param {Date} till time to load transactions till
   * @param {Array<String>} strategyIds optional list of strategy ids to filter transactions by
   * @param {Array<String>} providerIds optional list of providers to filter transactions by
   * @param {Number} offset pagination offset. Default value is 0
   * @param {Number} limit pagination limit. Default value is 10000
   * @return {Promise<Array<CopyFactoryTransaction>>} promise resolving with transactions found
   */
  async getStrategiesSubscribedTransactions(from, till, strategyIds, providerIds, offset, limit) {
    if (this._isNotJwtToken()) {
      return this._handleNoAccessError('getStrategiesSubscribedTransactions');
    }
    let qs = {
      from,
      till
    };
    if (strategyIds) {
      qs.strategyId = strategyIds;
    }
    if (providerIds) {
      qs.providerId = providerIds;
    }
    if (offset !== undefined) {
      qs.offset = offset;
    }
    if (limit) {
      qs.limit = limit;
    }
    const opts = {
      url: `${this._host}/users/current/strategies-subscribed/transactions`,
      method: 'GET',
      headers: {
        'auth-token': this._token
      },
      qs,
      json: true
    };
    let transactions = await this._httpClient.request(opts);
    transactions.forEach(t => t.time = new Date(t.time));
    return transactions;
  }

}
