'use strict';

import MetaApiClient from '../metaApi.client';
import TimeoutError from '../timeoutError';
import randomstring from 'randomstring';

/**
 * metaapi.cloud CopyFactory configuration API (trade copying configuration API) client (see
 * https://metaapi.cloud/docs/copyfactory/)
 */
export default class ConfigurationClient extends MetaApiClient {

  /**
   * Constructs CopyFactory configuration API client instance
   * @param {HttpClient} httpClient HTTP client
   * @param {String} token authorization token
   * @param {String} domain domain to connect to, default is agiliumtrade.agiliumtrade.ai
   */
  constructor(httpClient, token, domain = 'agiliumtrade.agiliumtrade.ai') {
    super(httpClient, token, domain);
    this._host = `https://trading-api-v1.${domain}`;
  }

  /**
   * Strategy id
   * @typedef {Object} StrategyId
   * @property {String} id strategy id
   */

  /**
   * Retrieves new unused strategy id. Method is accessible only with API access token. See
   * https://metaapi.cloud/docs/copyfactory/restApi/api/configuration/generateStrategyId/
   * @return {Promise<StrategyId>} promise resolving with strategy id generated
   */
  generateStrategyId() {
    if (this._isNotJwtToken()) {
      return this._handleNoAccessError('generateStrategyId');
    }
    const opts = {
      url: `${this._host}/users/current/configuration/unused-strategy-id`,
      method: 'GET',
      headers: {
        'auth-token': this._token
      },
      json: true
    };
    return this._httpClient.request(opts);
  }

  /**
   * Generates random account id
   * @return {String} account id
   */
  generateAccountId() {
    return randomstring.generate(64);
  }

  /**
   * CopyFactory account model
   * @typedef {CopyFactoryAccountUpdate} CopyFactoryAccount
   * @property {String} _id account unique identifier
   */

  /**
   * CopyFactory strategy subscriptions
   * @typedef {Object} CopyFactoryStrategySubscription
   * @property {String} strategyId id of the strategy to subscribe to
   * @property {Number} [multiplier] optional subscription multiplier, default is 1x
   * @property {Boolean} [skipPendingOrders] optional flag indicating that pending orders should not be copied. Default
   * is to copy pending orders
   * @property {String} [closeOnly] optional setting wich instructs the application not to open new positions. by-symbol
   * means that it is still allowed to open new positions with a symbol equal to the symbol of an existing strategy
   * position (can be used to gracefuly exit strategies trading in netting mode or placing a series of related trades
   * per symbol). One of by-position, by-symbol or leave empty to disable this setting.
   * @property {Number} [maxTradeRisk] optional max risk per trade, expressed as a fraction of 1. If trade has a SL, the
   * trade size will be adjusted to match the risk limit. If not, the trade SL will be applied according to the risk
   * limit
   * @property {Boolean} [reverse] flag indicating that the strategy should be copied in a reverse direction
   * @property {String} [reduceCorrelations] optional setting indicating whether to enable automatic trade correlation
   * reduction. Possible settings are not specified (disable correlation risk restrictions), by-strategy (limit
   * correlations on strategy level) or by-symbol (limit correlations on symbol level).
   * @property {CopyFactoryStrategyStopOut} [stopOutRisk] optional stop out setting. All trading will be terminated and positions closed
   * once equity drawdown reaches this value
   * @property {CopyFactoryStrategySymbolFilter} [symbolFilter] optional symbol filter which can be used to copy only specific
   * symbols or exclude some symbols from copying
   * @property {CopyFactoryStrategyNewsFilter} [newsFilter] optional news risk filter configuration
   * @property {Array<CopyFactoryStrategyRiskLimit>} [riskLimits] optional strategy risk limits. You can configure trading to be
   * stopped once total drawdown generated during specific period is exceeded. Can be specified either for balance or
   * equity drawdown
   * @property {CopyFactoryStrategyMaxStopLoss} [maxStopLoss] optional stop loss value restriction
   * @property {Number} [maxLeverage] optional setting indicating maximum leverage allowed when opening a new positions.
   * Any trade which results in a higher leverage will be discarded
   * @property {Array<CopyFactoryStrategySymbolMapping>} [symbolMapping] defines how symbol name should be changed when
   * trading (e.g. when broker uses symbol names with unusual suffixes). By default this setting is disabled and the
   * trades are copied using signal source symbol name
   * @property {CopyFactoryStrategyTradeSizeAcaling} [tradeSizeScaling] Trade size scaling settings. By default the
   * trade size on strategy subscriber side will be scaled according to balance to preserve risk.
   * @property {boolean} [copyStopLoss] flag indicating whether stop loss should be copied. Default is to copy stop
   * loss.
   * @property {boolean} [copyTakeProfit] flag indicating whether take profit should be copied. Default is to copy take
   * profit.
   * @property {number} [minTradeVolume] Minimum trade volume to copy. Trade signals with a smaller volume will not be
   * copied
   * @property {number} [maxTradeVolume] Maximum trade volume to copy. Trade signals with a larger volume will be copied
   * with maximum volume instead
   */

  /**
   * CopyFactory strategy trade size scaling settings
   * @typedef {Object} CopyFactoryStrategyTradeSizeScaling
   * @property {string} mode If set to balance, the trade size on strategy subscriber will be scaled according to
   * balance to preserve risk. If value is none, then trade size will be preserved irregardless of the subscriber
   * balance. If value is contractSize, then trade size will be scaled according to contract size. If fixedVolume is
   * set, then trade will be copied with a fixed volume of traceVolume setting. If fixedRisk is set, then each trade
   * will be copied with a trade volume set to risk specific fraction of balance as configured by riskFraction setting.
   * Note, that in fixedRisk mode trades without a SL are not copied. Default is balance. Allowed values: none,
   * contractSize, balance, fixedVolume, fixedRisk
   * @property {number} [tradeVolume] Fixed trade volume for use with fixedVolume trade size scaling mode
   * @property {number} [riskFraction] Fixed risk fraction for use with fixedRisk trade size scaling mode
   */

  /**
   * CopyFactory strategy stopout settings
   * @typedef {Object} CopyFactoryStrategyStopOut
   * @property {Number} value value of the stop out risk, expressed as a fraction of 1
   * @property {Date} [startTime] the time to start risk calculation from. All previous trades will be ignored. You can
   * use it to reset the risk counter after a stopout event
   */

  /**
   * CopyFactory symbol filter
   * @typedef {Object} CopyFactoryStrategySymbolFilter
   * @property {Array<String>} included list of symbols copied. Leave the value empty to copy all symbols
   * @property {Array<String>} excluded list of symbols excluded from copying. Leave the value empty to copy all symbols
   */

  /**
   * CopyFactory news risk filter
   * @typedef {Object} CopyFactoryStrategyNewsFilter
   * @property {CopyFactoryStrategyBreakingNewsFilter} [breakingNewsFilter] optional breaking news filter
   * @property {CopyFactoryStrategyCalendarNewsFilter} [calendarNewsFilter] optional calendar news filter
   */

  /**
   * CopyFactory breaking news risk filter
   * @typedef {Object} CopyFactoryStrategyBreakingNewsFilter
   * @property {Array<String>} priorities list of breaking news priorities to stop trading on, leave empty to disable
   * breaking news filter. One of high, medium, low.
   * @property {Number} [closePositionTimeGapInMinutes] optional time interval specifying when to force close an already
   * open position after breaking news. Default value is 60 minutes
   * @property {Number} [openPositionFollowingTimeGapInMinutes] optional time interval specifying when it is allowed to
   * open position after calendar news. Default value is 60 minutes
   */

  /**
   * CopyFactory calendar new filter
   * @typedef {Object} CopyFactoryStrategyCalendarNewsFilter
   * @property {Array<String>} priorities list of calendar news priorities to stop trading on, leave empty to disable
   * calendar news filter. One of election, high, medium, low.
   * @property {Number} [closePositionTimeGapInMinutes] optional time interval specifying when to force close an already
   * open position before calendar news. Default value is 60 minutes
   * @property {Number} [openPositionPrecedingTimeGapInMinutes] optional time interval specifying when it is still
   * allowed to open position before calendar news. Default value is 120 minutes
   * @property {Number} [openPositionFollowingTimeGapInMinutes] optional time interval specifying when it is allowed to
   * open position after calendar news. Default value is 60 minutes
   */

  /**
   * CopyFactory risk limit filter
   * @typedef {Object} CopyFactoryStrategyRiskLimit
   * @property {String} type restriction type. One of daily, monthly, or yearly
   * @property {String} applyTo account metric to apply limit to. One of balance, equity
   * @property {Number} maxRisk max drawdown allowed, expressed as a fraction of 1
   * @property {Boolean} closePositions whether to force close positions when the risk is reached. If value is false
   * then only the new trades will be halted, but existing ones will not be closed
   * @property {Date} [startTime] optional time to start risk tracking from. All previous trades will be ignored. You
   * can use this value to reset the filter after stopout event
   */

  /**
   * CopyFactory strategy max stop loss settings
   * @typedef {Object} CopyFactoryStrategyMaxStopLoss
   * @property {Number} value maximum SL value
   * @property {String} units SL units. Only pips value is supported at this point
   */

  /**
   * CopyFactory strategy symbol mapping
   * @typedef {Object} CopyFactoryStrategySymbolMapping
   * @property {String} from symbol name to convert from
   * @property {String} to symbol name to convert to
   */

  /**
   * Retrieves CopyFactory copy trading accounts. See
   * https://metaapi.cloud/docs/copyfactory/restApi/api/configuration/getAccounts/
   * @return {Promise<Array<CopyFactoryAccount>>} promise resolving with CopyFactory accounts found
   */
  getAccounts() {
    if (this._isNotJwtToken()) {
      return this._handleNoAccessError('getAccounts');
    }
    const opts = {
      url: `${this._host}/users/current/configuration/accounts`,
      method: 'GET',
      headers: {
        'auth-token': this._token
      },
      json: true
    };
    return this._httpClient.request(opts);
  }

  /**
   * Retrieves CopyFactory copy trading account by id. See
   * https://metaapi.cloud/docs/copyfactory/restApi/api/configuration/getAccount/
   * @param {string} accountId CopyFactory account id
   * @return {Promise<CopyFactoryAccount>} promise resolving with CopyFactory account found
   */
  getAccount(accountId) {
    if (this._isNotJwtToken()) {
      return this._handleNoAccessError('getAccount');
    }
    const opts = {
      url: `${this._host}/users/current/configuration/accounts/${accountId}`,
      method: 'GET',
      headers: {
        'auth-token': this._token
      },
      json: true
    };
    return this._httpClient.request(opts);
  }

  /**
   * CopyFactory account update
   * @typedef {Object} CopyFactoryAccountUpdate
   * @property {String} name account human-readable name
   * @property {String} connectionId id of the MetaApi MetaTrader account this copy trading account is connected to
   * @property {Number} [reservedMarginFraction] optional fraction of reserved margin to reduce a risk of margin call.
   * Default is to reserve no margin. We recommend using maxLeverage setting instead. Specified as a fraction of balance
   * thus the value is usually greater than 1
   * @property {Array<String>} [phoneNumbers] optional phone numbers to send sms notifications to. Leave empty to
   * receive no sms notifications
   * @property {Number} [minTradeAmount] optional value of minimal trade size allowed, expressed in amount of account
   * currency. Can be useful if your broker charges a fixed fee per transaction so that you can skip small trades with
   * high broker commission rates. Default is 100
   * @property {String} [closeOnly] optional setting wich instructs the application not to open new positions. by-symbol
   * means that it is still allowed to open new positions with a symbol equal to the symbol of an existing strategy
   * position (can be used to gracefuly exit strategies trading in netting mode or placing a series of related trades
   * per symbol). One of by-position, by-symbol or leave empty to disable this setting.
   * @property {CopyFactoryStrategyStopOut} [stopOutRisk] optional stop out setting. All trading will be terminated and positions closed
   * once equity drawdown reaches this value
   * @property {Array<CopyFactoryStrategyRiskLimit>} [riskLimits] optional account risk limits. You can configure trading to be
   * stopped once total drawdown generated during specific period is exceeded. Can be specified either for balance or
   * equity drawdown
   * @property {Number} [maxLeverage] optional setting indicating maxumum leverage allowed when opening a new positions.
   * Any trade which results in a higher leverage will be discarded.
   * @property {boolean} [copyStopLoss] flag indicating whether stop loss should be copied. Default is to copy stop
   * loss.
   * @property {boolean} [copyTakeProfit] flag indicating whether take profit should be copied. Default is to copy take
   * profit.
   * @property {number} [minTradeVolume] Minimum trade volume to copy. Trade signals with a smaller volume will not be
   * copied
   * @property {number} [maxTradeVolume] Maximum trade volume to copy. Trade signals with a larger volume will be copied
   * with maximum volume instead
   * @property {Array<CopyFactoryStrategySubscription>} subscriptions strategy subscriptions
   */

  /**
   * Updates a CopyFactory trade copying account. See
   * https://metaapi.cloud/docs/copyfactory/restApi/api/configuration/updateAccount/
   * @param {String} id copy trading account id
   * @param {CopyFactoryAccountUpdate} account trading account update
   * @return {Promise} promise resolving when account is updated
   */
  updateAccount(id, account) {
    if (this._isNotJwtToken()) {
      return this._handleNoAccessError('updateAccount');
    }
    const opts = {
      url: `${this._host}/users/current/configuration/accounts/${id}`,
      method: 'PUT',
      headers: {
        'auth-token': this._token
      },
      body: account,
      json: true
    };
    return this._httpClient.request(opts);
  }

  /**
   * Deletes a CopyFactory trade copying account. See
   * https://metaapi.cloud/docs/copyfactory/restApi/api/configuration/removeAccount/
   * @param {String} id copy trading account id
   * @return {Promise} promise resolving when account is removed
   */
  removeAccount(id) {
    if (this._isNotJwtToken()) {
      return this._handleNoAccessError('removeAccount');
    }
    const opts = {
      url: `${this._host}/users/current/configuration/accounts/${id}`,
      method: 'DELETE',
      headers: {
        'auth-token': this._token
      },
      json: true
    };
    return this._httpClient.request(opts);
  }

  /**
   * CopyFactory provider strategy
   * @typedef {CopyFactoryStrategyUpdate} CopyFactoryStrategy
   * @property {String} _id unique strategy id
   * @property {Number} platformCommissionRate commission rate the platform charges for strategy copying, applied to
   * commissions charged by provider. This commission applies only to accounts not managed directly by provider. Should
   * be fraction of 1
   */

  /**
   * CopyFactory strategy commission scheme
   * @typedef {Object} CopyFactoryStrategyCommissionScheme
   * @property {String} type commission type. One of flat-fee, lots-traded, lots-won, amount-traded, amount-won,
   * high-water-mark
   * @property {String} billingPeriod billing period. One of week, month, quarter
   * @property {Number} commissionRate commission rate. Should be greater than or equal to zero if commission type is
   * flat-fee, lots-traded or lots-won, should be greater than or equal to zero and less than or equal to 1 if
   * commission type is amount-traded, amount-won, high-water-mark.
   */

  /**
   * CopyFactory strategy magic filter
   * @typedef {Object} CopyFactoryStrategyMagicFilter
   * @property {Array<String>} included list of magics (expert ids) or magic ranges copied. Leave the value empty to
   * copy all magics
   * @property {Array<String>} excluded list of magics (expert ids) or magic ranges excluded from copying. Leave the
   * value empty to copy all magics
   */

  /**
   * CopyFactory strategy time settings
   * @typedef {Object} CopyFactoryStrategyTimeSettings
   * @property {Number} [lifetimeInHours] optional position lifetime. Default is to keep positions open up to 90 days
   * @property {Number} [openingIntervalInMinutes] optional time interval to copy new positions. Default is to let 1
   * minute for the position to get copied. If position were not copied during this time, the copying will not be
   * retried anymore.
   */

  /**
   * CopyFactory strategy equity curve filter
   * @typedef {Object} CopyFactoryStrategyEquityCurveFilter
   * @property {Number} period moving average period, must be greater or equal to 1
   * @property {String} granularity moving average granularity, a positive integer followed by time unit, e.g. 2h.
   * Allowed units are s, m, h, d and w.
   */

  /**
   * CopyFactory strategy drawdown filter
   * @typedef {Object} CopyFactoryStrategyDrawdownFilter
   * @property {Number} maxDrawdown Maximum drawdown value after which action is executed. Drawdown should be configured
   * as a fraction of 1, i.e. 0.15 means 15% drawdown value
   * @property {String} action Action to take when drawdown exceeds maxDrawdown value. include means the trading signal
   * will be transmitted only if dd is greater than maxDrawdown value. exclude means the trading signal will be
   * transmitted only if dd is less than maxDrawdown value.
   */

  /**
   * Retrieves CopyFactory copy trading strategies. See
   * https://metaapi.cloud/docs/copyfactory/restApi/api/configuration/getStrategies/
   * @return {Promise<Array<CopyFactoryStrategy>>} promise resolving with CopyFactory strategies found
   */
  getStrategies() {
    if (this._isNotJwtToken()) {
      return this._handleNoAccessError('getStrategies');
    }
    const opts = {
      url: `${this._host}/users/current/configuration/strategies`,
      method: 'GET',
      headers: {
        'auth-token': this._token
      },
      json: true
    };
    return this._httpClient.request(opts);
  }

  /**
   * Retrieves CopyFactory copy trading strategy by id. See
   * https://metaapi.cloud/docs/copyfactory/restApi/api/configuration/getStrategy/
   * @param {string} strategy id trading strategy id
   * @return {Promise<CopyFactoryStrategy>} promise resolving with CopyFactory strategy found
   */
  getStrategy(strategyId) {
    if (this._isNotJwtToken()) {
      return this._handleNoAccessError('getStrategy');
    }
    const opts = {
      url: `${this._host}/users/current/configuration/strategies/${strategyId}`,
      method: 'GET',
      headers: {
        'auth-token': this._token
      },
      json: true
    };
    return this._httpClient.request(opts);
  }

  /**
   * CopyFactory strategy update
   * @typedef {Object} CopyFactoryStrategyUpdate
   * @property {String} name strategy human-readable name
   * @property {String} description longer strategy human-readable description
   * @property {String} positionLifecycle position detection mode. Allowed values are netting (single position per
   * strategy per symbol), hedging (multiple positions per strategy per symbol)
   * @property {String} connectionId id of the MetaApi account providing the strategy
   * @property {Boolean} [skipPendingOrders] optional flag indicating that pending orders should not be copied.
   * Default is to copy pending orders
   * @property {CopyFactoryStrategyCommissionScheme} [commissionScheme] commission scheme allowed by this strategy
   * @property {Number} platformCommissionRate commission rate the platform charges for strategy copying, applied to
   * commissions charged by provider. This commission applies only to accounts not managed directly by provider. Should
   * be fraction of 1
   * @property {Number} [maxTradeRisk] optional max risk per trade, expressed as a fraction of 1. If trade has a SL, the
   * trade size will be adjusted to match the risk limit. If not, the trade SL will be applied according to the risk
   * limit
   * @property {Boolean} [reverse] flag indicating that the strategy should be copied in a reverse direction
   * @property {String} [reduceCorrelations] optional setting indicating whether to enable automatic trade correlation
   * reduction. Possible settings are not specified (disable correlation risk restrictions), by-strategy (limit
   * correlations on strategy level) or by-symbol (limit correlations on symbol level)
   * @property {CopyFactoryStrategyStopOut} [stopOutRisk] optional stop out setting. All trading will be terminated and
   * positions closed once equity drawdown reaches this value
   * @property {CopyFactoryStrategySymbolFilter} [symbolFilter] symbol filters which can be used to copy only specific
   * symbols or exclude some symbols from copying
   * @property {CopyFactoryStrategyNewsFilter} [newsFilter] news risk filter configuration
   * @property {Array<CopyFactoryStrategyRiskLimit>} [riskLimits] optional strategy risk limits. You can configure
   * trading to be stopped once total drawdown generated during specific period is exceeded. Can be specified either for
   * balance or equity drawdown
   * @property {CopyFactoryStrategyMaxStopLoss} [maxStopLoss] optional stop loss value restriction
   * @property {Number} [maxLeverage] optional max leverage risk restriction. All trades resulting in a leverage value
   * higher than specified will be skipped
   * @property {CopyFactoryStrategyMagicFilter} [magicFilter] optional magic (expert id) filter
   * @property {CopyFactoryStrategyTimeSettings} [timeSettings] settings to manage copying timeframe and position
   * lifetime. Default is to copy position within 1 minute from being opened at source and let the position to live for
   * up to 90 days
   * @property {Array<CopyFactoryStrategySymbolMapping>} [symbolMapping] defines how symbol name should be changed when
   * trading (e.g. when broker uses symbol names with unusual suffixes). By default this setting is disabled and the
   * trades are copied using signal source symbol name
   * @property {CopyFactoryStrategyTradeSizeAcaling} [tradeSizeScaling] Trade size scaling settings. By default the
   * trade size on strategy subscriber side will be scaled according to balance to preserve risk.
   * @property {CopyFactoryStrategyEquityCurveFilter} [equityCurveFilter] filter which permits the trades only if account
   * equity is greater than balance moving average
   * @property {boolean} [copyStopLoss] flag indicating whether stop loss should be copied. Default is to copy stop
   * loss.
   * @property {boolean} [copyTakeProfit] flag indicating whether take profit should be copied. Default is to copy take
   * profit.
   * @property {number} [minTradeVolume] Minimum trade volume to copy. Trade signals with a smaller volume will not be
   * copied
   * @property {number} [maxTradeVolume] Maximum trade volume to copy. Trade signals with a larger volume will be copied
   * with maximum volume instead
   * @property {CopyFactoryStrategyDrawdownFilter} [drawdownFilter] Master account strategy drawdown filter
   */

  /**
   * Updates a CopyFactory strategy. See
   * https://metaapi.cloud/docs/copyfactory/restApi/api/configuration/updateStrategy/
   * @param {String} id copy trading strategy id
   * @param {CopyFactoryStrategyUpdate} strategy trading strategy update
   * @return {Promise} promise resolving when strategy is updated
   */
  updateStrategy(id, strategy) {
    if (this._isNotJwtToken()) {
      return this._handleNoAccessError('updateStrategy');
    }
    const opts = {
      url: `${this._host}/users/current/configuration/strategies/${id}`,
      method: 'PUT',
      headers: {
        'auth-token': this._token
      },
      body: strategy,
      json: true
    };
    return this._httpClient.request(opts);
  }

  /**
   * Deletes a CopyFactory strategy. See
   * https://metaapi.cloud/docs/copyfactory/restApi/api/configuration/removeStrategy/
   * @param {String} id strategy id
   * @return {Promise} promise resolving when strategy is removed
   */
  removeStrategy(id) {
    if (this._isNotJwtToken()) {
      return this._handleNoAccessError('removeStrategy');
    }
    const opts = {
      url: `${this._host}/users/current/configuration/strategies/${id}`,
      method: 'DELETE',
      headers: {
        'auth-token': this._token
      },
      json: true
    };
    return this._httpClient.request(opts);
  }

  /**
   * Portfolio strategy member
   * @typedef {Object} CopyFactoryPortfolioMember
   * @property {String} strategyId member strategy id
   * @property {Number} multiplier copying multiplier (weight in the portfolio)
   * @property {Boolean} [skipPendingOrders] optional flag indicating that pending orders should not be copied.
   * Default is to copy pending orders
   * @property {Number} [maxTradeRisk] optional max risk per trade, expressed as a fraction of 1. If trade has a SL, the
   * trade size will be adjusted to match the risk limit. If not, the trade SL will be applied according to the risk
   * limit
   * @property {Boolean} [reverse] flag indicating that the strategy should be copied in a reverse direction
   * @property {String} [reduceCorrelations] optional setting indicating whether to enable automatic trade correlation
   * reduction. Possible settings are not specified (disable correlation risk restrictions), by-strategy (limit
   * correlations on strategy level) or by-symbol (limit correlations on symbol level)
   * @property {CopyFactoryStrategyStopOut} [stopOutRisk] optional stop out setting. All trading will be terminated and
   * positions closed once equity drawdown reaches this value
   * @property {CopyFactoryStrategySymbolFilter} [symbolFilter] symbol filters which can be used to copy only specific
   * symbols or exclude some symbols from copying
   * @property {CopyFactoryStrategyNewsFilter} [newsFilter] news risk filter configuration
   * @property {Array<CopyFactoryStrategyRiskLimit>} [riskLimits] optional strategy risk limits. You can configure
   * trading to be stopped once total drawdown generated during specific period is exceeded. Can be specified either for
   * balance or equity drawdown
   * @property {CopyFactoryStrategyMaxStopLoss} [maxStopLoss] optional stop loss value restriction
   * @property {Number} [maxLeverage] optional max leverage risk restriction. All trades resulting in a leverage value
   * higher than specified will be skipped
   * @property {Array<CopyFactoryStrategySymbolMapping>} [symbolMapping] defines how symbol name should be changed when
   * trading (e.g. when broker uses symbol names with unusual suffixes). By default this setting is disabled and the
   * trades are copied using signal source symbol name
   * @property {CopyFactoryStrategyTradeSizeAcaling} [tradeSizeScaling] Trade size scaling settings. By default the
   * trade size on strategy subscriber side will be scaled according to balance to preserve risk.
   * @property {boolean} [copyStopLoss] flag indicating whether stop loss should be copied. Default is to copy stop
   * loss.
   * @property {boolean} [copyTakeProfit] flag indicating whether take profit should be copied. Default is to copy take
   * profit.
   * @property {number} [minTradeVolume] Minimum trade volume to copy. Trade signals with a smaller volume will not be
   * copied
   * @property {number} [maxTradeVolume] Maximum trade volume to copy. Trade signals with a larger volume will be copied
   * with maximum volume instead
   */

  /**
   * Portfolio strategy update
   * @typedef {Object} CopyFactoryPortfolioStrategyUpdate
   * @property {String} name strategy human-readable name
   * @property {String} description longer strategy human-readable description
   * @property {Array<CopyFactoryPortfolioMember>} members array of portfolio memebers
   * @property {CopyFactoryStrategyCommissionScheme} [commissionScheme] commission scheme allowed by this strategy. By
   * default monthly billing period with no commission is being used
   * @property {Boolean} [skipPendingOrders] optional flag indicating that pending orders should not be copied.
   * Default is to copy pending orders
   * @property {Number} [maxTradeRisk] optional max risk per trade, expressed as a fraction of 1. If trade has a SL, the
   * trade size will be adjusted to match the risk limit. If not, the trade SL will be applied according to the risk
   * limit
   * @property {Boolean} [reverse] flag indicating that the strategy should be copied in a reverse direction
   * @property {String} [reduceCorrelations] optional setting indicating whether to enable automatic trade correlation
   * reduction. Possible settings are not specified (disable correlation risk restrictions), by-strategy (limit
   * correlations on strategy level) or by-symbol (limit correlations on symbol level)
   * @property {CopyFactoryStrategyStopOut} [stopOutRisk] optional stop out setting. All trading will be terminated and
   * positions closed once equity drawdown reaches this value
   * @property {CopyFactoryStrategySymbolFilter} [symbolFilter] symbol filters which can be used to copy only specific
   * symbols or exclude some symbols from copying
   * @property {CopyFactoryStrategyNewsFilter} [newsFilter] news risk filter configuration
   * @property {Array<CopyFactoryStrategyRiskLimit>} [riskLimits] optional strategy risk limits. You can configure
   * trading to be stopped once total drawdown generated during specific period is exceeded. Can be specified either for
   * balance or equity drawdown
   * @property {CopyFactoryStrategyMaxStopLoss} [maxStopLoss] optional stop loss value restriction
   * @property {Number} [maxLeverage] optional max leverage risk restriction. All trades resulting in a leverage value
   * higher than specified will be skipped
   * @property {Array<CopyFactoryStrategySymbolMapping>} [symbolMapping] defines how symbol name should be changed when
   * trading (e.g. when broker uses symbol names with unusual suffixes). By default this setting is disabled and the
   * trades are copied using signal source symbol name
   * @property {CopyFactoryStrategyTradeSizeAcaling} [tradeSizeScaling] Trade size scaling settings. By default the
   * trade size on strategy subscriber side will be scaled according to balance to preserve risk.
   * @property {boolean} [copyStopLoss] flag indicating whether stop loss should be copied. Default is to copy stop
   * loss.
   * @property {boolean} [copyTakeProfit] flag indicating whether take profit should be copied. Default is to copy take
   * profit.
   * @property {number} [minTradeVolume] Minimum trade volume to copy. Trade signals with a smaller volume will not be
   * copied
   * @property {number} [maxTradeVolume] Maximum trade volume to copy. Trade signals with a larger volume will be copied
   * with maximum volume instead
   */

  /**
   * Portfolio strategy, i.e. the strategy which includes a set of other strategies
   * @typedef {CopyFactoryPortfolioStrategyUpdate} CopyFactoryPortfolioStrategy
   * @property {String} _id unique strategy id
   * @property {Number} platformCommissionRate commission rate the platform charges for strategy copying, applied to
   * commissions charged by provider. This commission applies only to accounts not managed directly by provider. Should
   * be fraction of 1
   */

  /**
   * Retrieves CopyFactory copy portfolio strategies. See
   * https://metaapi.cloud/docs/copyfactory/restApi/api/configuration/getPortfolioStrategies/
   * @return {Promise<Array<CopyFactoryPortfolioStrategy>>} promise resolving with CopyFactory portfolio strategies
   * found
   */
  getPortfolioStrategies() {
    if (this._isNotJwtToken()) {
      return this._handleNoAccessError('getPortfolioStrategies');
    }
    const opts = {
      url: `${this._host}/users/current/configuration/portfolio-strategies`,
      method: 'GET',
      headers: {
        'auth-token': this._token
      },
      json: true
    };
    return this._httpClient.request(opts);
  }

  /**
   * Retrieves CopyFactory copy portfolio strategy by id. See
   * https://metaapi.cloud/docs/copyfactory/restApi/api/configuration/getPortfolioStrategy/
   * @param {string} portfolioId portfolio strategy id
   * @return {Promise<CopyFactoryPortfolioStrategy>} promise resolving with CopyFactory portfolio strategy found
   */
  getPortfolioStrategy(portfolioId) {
    if (this._isNotJwtToken()) {
      return this._handleNoAccessError('getPortfolioStrategy');
    }
    const opts = {
      url: `${this._host}/users/current/configuration/portfolio-strategies/${portfolioId}`,
      method: 'GET',
      headers: {
        'auth-token': this._token
      },
      json: true
    };
    return this._httpClient.request(opts);
  }

  /**
   * Updates a CopyFactory portfolio strategy. See
   * https://metaapi.cloud/docs/copyfactory/restApi/api/configuration/updatePortfolioStrategy/
   * @param {String} id copy trading portfolio strategy id
   * @param {CopyFactoryPortfolioStrategyUpdate} strategy portfolio strategy update
   * @return {Promise} promise resolving when portfolio strategy is updated
   */
  updatePortfolioStrategy(id, strategy) {
    if (this._isNotJwtToken()) {
      return this._handleNoAccessError('updatePortfolioStrategy');
    }
    const opts = {
      url: `${this._host}/users/current/configuration/portfolio-strategies/${id}`,
      method: 'PUT',
      headers: {
        'auth-token': this._token
      },
      body: strategy,
      json: true
    };
    return this._httpClient.request(opts);
  }

  /**
   * Deletes a CopyFactory portfolio strategy. See
   * https://metaapi.cloud/docs/copyfactory/restApi/api/configuration/removePortfolioStrategy/
   * @param {String} id portfolio strategy id
   * @return {Promise} promise resolving when portfolio strategy is removed
   */
  removePortfolioStrategy(id) {
    if (this._isNotJwtToken()) {
      return this._handleNoAccessError('removePortfolioStrategy');
    }
    const opts = {
      url: `${this._host}/users/current/configuration/portfolio-strategies/${id}`,
      method: 'DELETE',
      headers: {
        'auth-token': this._token
      },
      json: true
    };
    return this._httpClient.request(opts);
  }

  /**
   * Resynchronization task
   * @typedef {Object} ResynchronizationTask
   * @property {String} _id task unique id
   * @property {String} type task type. One of CREATE_ACCOUNT, CREATE_STRATEGY, UPDATE_STRATEGY, REMOVE_STRATEGY
   * @property {Date} createdAt the time task was created at
   * @property {String} status task status. One of PLANNED, EXECUTING, SYNCHRONIZING
   */
  
  /**
   * Returns list of active resynchronization tasks for a specified connection. See
   * https://metaapi.cloud/docs/copyfactory/restApi/api/configuration/getActiveResynchronizationTasks/
   * @param {String} connectionId MetaApi account id to return tasks for
   * @return {Promise<Array<ResynchronizationTask>>} promise resolving with list of active resynchronization tasks
   */
  async getActiveResynchronizationTasks(connectionId) {
    if (this._isNotJwtToken()) {
      return this._handleNoAccessError('getActiveResynchronizationTasks');
    }
    const opts = {
      url: `${this._host}/users/current/configuration/connections/${connectionId}/active-resynchronization-tasks`,
      method: 'GET',
      headers: {
        'auth-token': this._token
      },
      json: true
    };
    let tasks = await this._httpClient.request(opts);
    tasks.forEach(t => t.createdAt = new Date(t.createdAt));
    return tasks;
  }

  /**
   * Waits until active resynchronization tasks are completed
   * @param {String} connectionId MetaApi account id to wait tasks completed for
   * @param {Number} timeoutInSeconds wait timeout in seconds, default is 5m
   * @param {Number} intervalInMilliseconds interval between tasks reload while waiting for a change, default is 1s
   * @return {Promise} promise which resolves when tasks are completed
   * @throws {TimeoutError} if tasks have not completed withing timeout allowed
   */
  async waitResynchronizationTasksCompleted(connectionId, timeoutInSeconds = 300, intervalInMilliseconds = 1000) {
    let startTime = Date.now();
    let tasks = await this.getActiveResynchronizationTasks(connectionId);
    while (tasks.length !== 0 && (startTime + timeoutInSeconds * 1000) > Date.now()) {
      await new Promise(res => setTimeout(res, intervalInMilliseconds));
      tasks = await this.getActiveResynchronizationTasks(connectionId);
    }
    if (tasks.length !== 0) {
      throw new TimeoutError('Timed out waiting for resynchronization tasks for account '
        + connectionId + ' to be completed');
    }
  }
}
