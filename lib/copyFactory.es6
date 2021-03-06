'use strict';

import HttpClient from './clients/httpClient';
import ConfigurationClient from './clients/copyFactory/configuration.client';
import HistoryClient from './clients/copyFactory/history.client';
import TradingClient from './clients/copyFactory/trading.client';

/**
 * MetaApi CopyFactory copy trading API SDK
 */
export default class CopyFactory {

  /**
   * Constructs CopyFactory class instance
   * @param {String} token authorization token
   * @param {Object} opts connection options
   * @param {String} [opts.domain] domain to connect to
   * @param {Number} [opts.requestTimeout] timeout for http requests in seconds
   */
  constructor(token, opts = {}) {
    let domain = opts.domain || 'agiliumtrade.agiliumtrade.ai';
    let requestTimeout = opts.requestTimeout || 60;
    const retryOpts = opts.retryOpts || {};
    let httpClient = new HttpClient(requestTimeout, retryOpts);
    this._configurationClient = new ConfigurationClient(httpClient, token, domain);
    this._historyClient = new HistoryClient(httpClient, token, domain);
    this._tradingClient = new TradingClient(httpClient, token, domain);
  }

  /**
   * Returns CopyFactory configuration API
   * @returns {ConfigurationClient} configuration API
   */
  get configurationApi() {
    return this._configurationClient;
  }

  /**
   * Returns CopyFactory history API
   * @return {HistoryClient} history API
   */
  get historyApi() {
    return this._historyClient;
  }

  /**
   * Returns CopyFactory trading API
   * @return {TradingClient} trading API
   */
  get tradingApi() {
    return this._tradingClient;
  }

}
