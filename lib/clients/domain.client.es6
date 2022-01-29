'use strict';

/**
 * Connection URL and request managing client
 */
export default class DomainClient {

  /**
   * Constructs domain client instance
   * @param {HttpClient} httpClient HTTP client
   * @param {String} token authorization token
   * @param {String} domain domain to connect to, default is agiliumtrade.agiliumtrade.ai
   */
  constructor(httpClient, token, domain = 'agiliumtrade.agiliumtrade.ai') {
    this._httpClient = httpClient;
    this._domain = domain;
    this._token = token;
    this._urlCache = null;
    this._regionCache = [];
    this._regionIndex = 0;
  }

  /**
   * Returns domain client domain
   * @returns {String} client domain
   */
  get domain() {
    return this._domain;
  }

  /**
   * Returns domain client token
   * @returns {String} client token
   */
  get token() {
    return this._token;
  }

  /**
   * Sends a CopyFactory API request
   * @param {Object} opts options request options
   * @param {Boolean} isExtendedTimeout whether to run the request with an extended timeout
   * @returns {Object|String|any} request result
   */
  async requestCopyFactory(opts, isExtendedTimeout = false) {
    await this._updateHost();
    try {
      return await this._httpClient.request(Object.assign({}, opts, {
        url: this._urlCache.url + opts.url
      }), isExtendedTimeout);
    } catch (err) {
      if(!['ConflictError', 'InternalError', 'ApiError', 'TimeoutError'].includes(err.name)) {
        throw err;
      } else {
        if(this._regionCache.length === this._regionIndex + 1) {
          throw err;
        } else {
          this._regionIndex++;
          return this.requestCopyFactory(opts);
        }
      }
    }

  }

  /**
   * Sends an http request
   * @param {Object} opts options request options
   * @returns {Object|String|any} request result
   */
  request(opts) {
    return this._httpClient.request(opts);
  }

  /**
   * Sends a signal client request
   * @param {Object} opts options request options 
   * @param {Object} host signal client host data
   * @param {String[]} availableRegions list of available regions
   * @returns {Object|String|any} request result
   */
  async requestSignal(opts, host, availableRegions = this._regionCache) {
    try {
      return await this._httpClient.request(Object.assign({}, opts, {
        url: `${host.host}.${host.region}.${host.domain}` + opts.url,
        headers: {
          'auth-token': this._token
        },
      }));
    } catch (err) {
      if(!['ConflictError', 'InternalError', 'ApiError', 'TimeoutError'].includes(err.name)) {
        throw err;
      } else {
        availableRegions = availableRegions.filter(region => region !== host.region);
        if(!availableRegions.length) {
          throw err;
        } else {
          return this.requestSignal(opts, Object.assign({}, host, { region: availableRegions[0]}), availableRegions);
        }
      }
    }

  }

  /**
   * Returns CopyFactory host for signal client requests
   * @param {String} region subscriber region
   * @returns {String} signal client CopyFactory host
   */
  async getSignalClientHost(region) {
    await this._updateHost();
    return {
      host: 'https://copyfactory-api-v1',
      region,
      domain: this._urlCache.domain
    };
  }

  async _updateHost() {
    if(!this._urlCache || this._urlCache.lastUpdated < Date.now() - 1000 * 60 * 10) {
      await this._updateRegions();
      const urlSettings = await this._httpClient.request({
        url: `https://mt-provisioning-api-v1.${this._domain}/users/current/servers/mt-client-api`,
        method: 'GET',
        headers: {
          'auth-token': this._token
        },
        json: true,
      });
      this._urlCache = {
        url: `https://copyfactory-api-v1.${this._regionCache[this._regionIndex]}.${urlSettings.domain}`,
        domain: urlSettings.domain,
        lastUpdated: Date.now()
      }; 
    } else {
      this._urlCache = {
        url: `https://copyfactory-api-v1.${this._regionCache[this._regionIndex]}.${this._urlCache.domain}`,
        domain: this._urlCache.domain,
        lastUpdated: Date.now()
      }; 
    }
  }

  async _updateRegions() {
    this._regionIndex = 0;
    this._regionCache = await this._httpClient.request({
      url: `https://mt-provisioning-api-v1.${this._domain}/users/current/regions`,
      method: 'GET',
      headers: {
        'auth-token': this._token
      },
      json: true,
    });
  }
    
}