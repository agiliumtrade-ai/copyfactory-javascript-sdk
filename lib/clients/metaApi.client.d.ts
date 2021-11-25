import HttpClient from "./httpClient";

/**
 * metaapi.cloud MetaTrader API client
 */
export default class MetaApiClient {

  /**
   * Constructs MetaTrader API client instance
   * @param {HttpClient} httpClient HTTP client
   * @param {String} token authorization token
   * @param {String} domain domain to connect to, default is agiliumtrade.agiliumtrade.ai
   */
  constructor(httpClient: HttpClient, token: String, domain?: String);
}