import HttpClient from "../httpClient";
import MetaApiClient from "../metaApi.client";

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
  constructor(httpClient: HttpClient, token: String, domain?: String);

  /**
   * Retrieves new unused strategy id. Method is accessible only with API access token. See
   * https://metaapi.cloud/docs/copyfactory/restApi/api/configuration/generateStrategyId/
   * @return {Promise<StrategyId>} promise resolving with strategy id generated
   */
  generateStrategyId(): Promise<StrategyId>;

  /**
   * Generates random account id
   * @return {String} account id
   */
  generateAccountId(): String;

  /**
   * Retrieves CopyFactory copy trading strategies. See
   * https://metaapi.cloud/docs/copyfactory/restApi/api/configuration/getStrategies/
   * @param {Boolean} [includeRemoved] flag instructing to include removed strategies in results
   * @param {Number} [limit] pagination limit
   * @param {Number} [offset] copy trading strategy id
   * @return {Promise<Array<CopyFactoryStrategy>>} promise resolving with CopyFactory strategies found
   */
  getStrategies(includeRemoved?: Boolean, limit?: Number, offset?: Number): Promise<Array<CopyFactoryStrategy>>;

  /**
   * Retrieves CopyFactory copy trading strategy by id. See
   * https://metaapi.cloud/docs/copyfactory/restApi/api/configuration/getStrategy/
   * @param {String} strategy id trading strategy id
   * @return {Promise<CopyFactoryStrategy>} promise resolving with CopyFactory strategy found
   */
  getStrategy(strategyId: String): Promise<CopyFactoryStrategy>;

  /**
   * Updates a CopyFactory strategy. See
   * https://metaapi.cloud/docs/copyfactory/restApi/api/configuration/updateStrategy/
   * @param {String} strategyId copy trading strategy id
   * @param {CopyFactoryStrategyUpdate} strategy trading strategy update
   * @return {Promise} promise resolving when strategy is updated
   */
  updateStrategy(strategyId: String, strategy: CopyFactoryStrategyUpdate): Promise<any>

  /**
   * Deletes a CopyFactory strategy. See
   * https://metaapi.cloud/docs/copyfactory/restApi/api/configuration/removeStrategy/
   * @param {String} strategyId copy trading strategy id
   * @param {CopyFactoryCloseInstructions} [closeInstructions] strategy close instructions
   * @return {Promise} promise resolving when strategy is removed
   */
  removeStrategy(strategyId: String, closeInstructions?: CopyFactoryCloseInstructions): Promise<any>

  /**
   * Retrieves CopyFactory copy portfolio strategies. See
   * https://metaapi.cloud/docs/copyfactory/restApi/api/configuration/getPortfolioStrategies/
   * @param {Boolean} [includeRemoved] flag instructing to include removed portfolio strategies in results
   * @param {Number} [limit] pagination limit
   * @param {Number} [offset] copy trading strategy id
   * @return {Promise<Array<CopyFactoryPortfolioStrategy>>} promise resolving with CopyFactory portfolio strategies
   * found
   */
  getPortfolioStrategies(includeRemoved?: Boolean, limit?: Number, offset?: Number): Promise<Array<CopyFactoryPortfolioStrategy>>;

  /**
   * Retrieves CopyFactory copy portfolio strategy by id. See
   * https://metaapi.cloud/docs/copyfactory/restApi/api/configuration/getPortfolioStrategy/
   * @param {String} portfolioId portfolio strategy id
   * @return {Promise<CopyFactoryPortfolioStrategy>} promise resolving with CopyFactory portfolio strategy found
   */
  getPortfolioStrategy(portfolioId: String): Promise<CopyFactoryPortfolioStrategy>;

  /**
   * Updates a CopyFactory portfolio strategy. See
   * https://metaapi.cloud/docs/copyfactory/restApi/api/configuration/updatePortfolioStrategy/
   * @param {String} portfolioId copy trading portfolio strategy id
   * @param {CopyFactoryPortfolioStrategyUpdate} portfolio portfolio strategy update
   * @return {Promise} promise resolving when portfolio strategy is updated
   */
  updatePortfolioStrategy(portfolioId: String, portfolio: CopyFactoryPortfolioStrategyUpdate): Promise<any>

  /**
   * Deletes a CopyFactory portfolio strategy. See
   * https://metaapi.cloud/docs/copyfactory/restApi/api/configuration/removePortfolioStrategy/
   * @param {String} portfolioId portfolio strategy id
   * @param {CopyFactoryCloseInstructions} [closeInstructions] strategy close instructions
   * @return {Promise} promise resolving when portfolio strategy is removed
   */
  removePortfolioStrategy(portfolioId: String, closeInstructions: CopyFactoryCloseInstructions): Promise<any>;

  /**
   * Returns CopyFactory subscribers the user has configured. See
   * https://metaapi.cloud/docs/copyfactory/restApi/api/history/getSubscribers/
   * @param {Boolean} [includeRemoved] flag instructing to include removed subscribers in results
   * @param {Number} [limit] pagination limit
   * @param {Number} [offset] copy trading strategy id
   * @return {Promise<Array<CopyFactorySubscriber>>} promise resolving with subscribers found
   */
  getSubscribers(includeRemoved?: Boolean, limit?: Number, offset?: Number): Promise<Array<CopyFactorySubscriber>>;

  /**
   * Returns CopyFactory subscriber by id. See
   * https://metaapi.cloud/docs/copyfactory/restApi/api/configuration/getSubscriber/
   * @param {String} subscriberId subscriber id
   * @returns {Promise<CopyFactorySubscriber>} promise resolving with subscriber found
   */
  getSubscriber(subscriberId: String): Promise<CopyFactorySubscriber>;

  /**
   * Updates CopyFactory subscriber configuration. See
   * https://metaapi.cloud/docs/copyfactory/restApi/api/configuration/updateSubscriber/
   * @param {String} subscriberId subscriber id
   * @param {CopyFactorySubscriberUpdate} subscriber subscriber update
   * @returns {Promise} promise resolving when subscriber is updated
   */
  updateSubscriber(subscriberId: String, subscriber: CopyFactorySubscriberUpdate): Promise<any>;
  
  /**
   * Deletes subscriber configuration. See
   * https://metaapi.cloud/docs/copyfactory/restApi/api/configuration/removeSubscriber/
   * @param {String} subscriberId subscriber id
   * @param {CopyFactoryCloseInstructions} [closeInstructions] subscriber close instructions
   * @returns {Promise} promise resolving when subscriber is removed
   */
  removeSubscriber(subscriberId: String, closeInstructions: CopyFactoryCloseInstructions): Promise<any>;

  /**
   * Deletes a subscription of subscriber to a strategy. See
   * https://metaapi.cloud/docs/copyfactory/restApi/api/configuration/removeSubscription/
   * @param {String} subscriberId subscriber id
   * @param {String} strategyId strategy id
   * @param {CopyFactoryCloseInstructions} [closeInstructions] subscriber close instructions
   * @returns {Promise} promise resolving when subscriber is removed
   */
  removeSubscription(subscriberId: String, strategyId: String, closeInstructions?: CopyFactoryCloseInstructions): Promise<any>;

  
}

/**
 * Strategy id
 */
export declare type StrategyId = {

  /**
   * strategy id
   */
  id: String
}

/**
 * CopyFactory strategy subscriptions
 */
export declare type CopyFactoryStrategySubscription = {

  /**
   * id of the strategy to subscribe to
   */
  strategyId: String,

  /**
   * subscription multiplier, default is 1x
   */
  multiplier?: Number,

  /**
   * flag indicating that pending orders should not be copied. Default
   * is to copy pending orders
   */
  skipPendingOrders?: Boolean,

  /**
   * setting wich instructs the application not to open new positions. by-symbol
   * means that it is still allowed to open new positions with a symbol equal to the symbol of an existing strategy
   * position (can be used to gracefuly exit strategies trading in netting mode or placing a series of related trades
   * per symbol). immediately means to close all positions immediately. One of 'by-position', 'by-symbol', 'immediately'
   */
  closeOnly?: String,

  /**
   * max risk per trade, expressed as a fraction of 1. If trade has a SL, the
   * trade size will be adjusted to match the risk limit. If not, the trade SL will be applied according to the risk
   * limit
   */
  maxTradeRisk?: Number,

  /**
   * flag indicating that the strategy should be copied in a reverse direction
   */
  reverse?: Boolean,

  /**
   * setting indicating whether to enable automatic trade
   * correlation reduction. Possible settings are not specified (disable correlation risk restrictions),
   * by-strategy (limit correlations for the strategy) or by-account (limit correlations for the account)
   */
  reduceCorrelations?: String,

  /**
   * stop out setting. All trading will be terminated
   * and positions closed once equity drawdown reaches this value
   */
  stopOutRisk?: CopyFactoryStrategyStopOutSettings,

  /**
   * symbol filter which can be used to copy only specific
   * symbols or exclude some symbols from copying
   */
  symbolFilter?: CopyFactoryStrategySymbolFilter

  /**
   * news risk filter configuration
   */
  newsFilter?: CopyFactoryStrategyNewsFilter,

  /**
   * strategy risk limits. You can configure trading to be
   * stopped once total drawdown generated during specific period is exceeded. Can be specified either for balance or
   * equity drawdown
   */
  riskLimits?: Array<CopyFactoryStrategyRiskLimit>,

  /**
   * stop loss value restriction
   */
  maxStopLoss?: CopyFactoryStrategyMaxStopLoss,

  /**
   * setting indicating maximum leverage allowed when opening a new positions.
   * Any trade which results in a higher leverage will be discarded
   */
  maxLeverage?: Number,

  /**
   * defines how symbol name should be changed when
   * trading (e.g. when broker uses symbol names with unusual suffixes). By default this setting is disabled and the
   * trades are copied using signal source symbol name
   */
  symbolMapping?: Array<CopyFactoryStrategySymbolMapping>,

  /**
   * Trade size scaling settings. By default the
   * trade size on strategy subscriber side will be scaled according to balance to preserve risk.
   */
  tradeSizeScaling?: CopyFactoryStrategyTradeSizeScaling,

  /**
   * flag indicating whether stop loss should be copied. Default is to copy stop loss.
   */
  copyStopLoss?: Boolean,

  /**
   * flag indicating whether take profit should be copied. Default is to copy take profit.
   */
  copyTakeProfit?: Boolean,

  /**
   * Minimum trade volume to copy. Trade signals with a smaller volume will not be copied
   */
  minTradeVolume?: Number,

  /**
   * Maximum trade volume to copy. Trade signals with a larger volume will be copied
   * with maximum volume instead
   */
  maxTradeVolume?: Number,

  /**
   * flag indicating that the subscription was scheduled for removal once all subscription
   * positions will be closed
   */
  removed?: Boolean
}

/**
 * CopyFactory strategy trade size scaling settings
 */
export declare type CopyFactoryStrategyTradeSizeScaling = {

  /**
   * If set to balance, the trade size on strategy subscriber will be scaled according to
   * balance to preserve risk. If value is none, then trade size will be preserved irregardless of the subscriber
   * balance. If value is contractSize, then trade size will be scaled according to contract size. If fixedVolume is
   * set, then trade will be copied with a fixed volume of traceVolume setting. If fixedRisk is set, then each trade
   * will be copied with a trade volume set to risk specific fraction of balance as configured by riskFraction setting.
   * Note, that in fixedRisk mode trades without a SL are not copied. Default is balance. Allowed values: none,
   * contractSize, balance, fixedVolume, fixedRisk
   */
  mode: String,

  /**
   * Fixed trade volume for use with fixedVolume trade size scaling mode
   */
  tradeVolume?: Number,

  /**
   * Fixed risk fraction for use with fixedRisk trade size scaling mode
   */
  riskFraction?: Number
}

/**
 * CopyFactory strategy stopout settings
 */
export declare type CopyFactoryStrategyStopOutSettings = {

  /**
   * value of the stop out risk, expressed as a fraction of 1
   */
  value: Number,

  /**
   * the time to start risk calculation from. All previous trades will be ignored. You can
   * use it to reset the risk counter after a stopout event
   */
  startTime?: Date
}

/**
 * CopyFactory symbol filter
 */
export declare type CopyFactoryStrategySymbolFilter = {

  /**
   * list of symbols copied. Leave the value empty to copy all symbols
   */
  included: Array<String>,

  /**
   * list of symbols excluded from copying. Leave the value empty to copy all symbols
   */
  excluded: Array<String>
}

/**
 * CopyFactory news risk filter
 */
export declare type CopyFactoryStrategyNewsFilter = {

  /**
   * breaking news filter
   */
  breakingNewsFilter?: CopyFactoryStrategyBreakingNewsFilter

  /**
   * calendar news filter
   */
  calendarNewsFilter?: CopyFactoryStrategyCalendarNewsFilter
}

/**
 * CopyFactory breaking news risk filter
 */
export declare type CopyFactoryStrategyBreakingNewsFilter = {

  /**
   * list of breaking news priorities to stop trading on, leave empty to disable
   * breaking news filter. One of high, medium, low.
   */
  priorities: Array<String>,

  /**
   * time interval specifying when to force close an already
   * open position after breaking news. Default value is 60 minutes
   */
  closePositionTimeGapInMinutes?: Number,

  /**
   * time interval specifying when it is allowed to
   * open position after calendar news. Default value is 60 minutes
   */
  openPositionFollowingTimeGapInMinutes?: Number
}

/**
 * CopyFactory calendar new filter
 */
export declare type CopyFactoryStrategyCalendarNewsFilter = {

  /**
   * list of calendar news priorities to stop trading on, leave empty to disable
   * calendar news filter. One of election, high, medium, low.
   */
  priorities: Array<String>,

  /**
   * time interval specifying when to force close an already
   * open position before calendar news. Default value is 60 minutes
   */
  closePositionTimeGapInMinutes?: Number,

  /**
   * time interval specifying when it is still
   * allowed to open position before calendar news. Default value is 120 minutes
   */
  openPositionPrecedingTimeGapInMinutes?: Number

  /**
   * time interval specifying when it is allowed to
   * open position after calendar news. Default value is 60 minutes
   */
  openPositionFollowingTimeGapInMinutes?: Number
}

/**
 * CopyFactory risk limit filter
 */
export declare type CopyFactoryStrategyRiskLimit = {

  /**
   * restriction type. One of daily, monthly, or yearly
   */
  type: String,

  /**
   * account metric to apply limit to. One of balance, equity
   */
  applyTo: String,

  /**
   * max drawdown allowed, expressed as a fraction of 1
   */
  maxRisk: Number,

  /**
   * whether to force close positions when the risk is reached. If value is false
   * then only the new trades will be halted, but existing ones will not be closed
   */
  closePositions: Boolean

  /**
   * time to start risk tracking from. All previous trades will be ignored. You
   * can use this value to reset the filter after stopout event
   */
  startTime?: Date
}

/**
 * CopyFactory strategy max stop loss settings
 */
export declare type CopyFactoryStrategyMaxStopLoss = {

  /**
   * maximum SL value
   */
  value: Number,

  /**
   * SL units. Only pips value is supported at this point
   */
  units: String
}

/**
 * CopyFactory strategy symbol mapping
 */
export declare type CopyFactoryStrategySymbolMapping = {

  /**
   * symbol name to convert from
   */
  from: String,

  /**
   * symbol name to convert to
   */
  to: String
}

/**
 * CopyFactory account update
 */
export declare type CopyFactorySubscriberUpdate = {

  /**
   * account human-readable name
   */
  name: String

  /**
   * fraction of reserved margin to reduce a risk of margin call.
   * Default is to reserve no margin. We recommend using maxLeverage setting instead. Specified as a fraction of balance
   * thus the value is usually greater than 1
   */
  reservedMarginFraction?: Number,

  /**
   * phone numbers to send sms notifications to. Leave empty to
   * receive no sms notifications
   */
  phoneNumbers?: Array<String>,

  /**
   * value of minimal trade size allowed, expressed in amount of account
   * currency. Can be useful if your broker charges a fixed fee per transaction so that you can skip small trades with
   * high broker commission rates. Default is 0
   */
  minTradeAmount?: Number,

  /**
   * setting wich instructs the application not to open new positions. by-symbol
   * means that it is still allowed to open new positions with a symbol equal to the symbol of an existing strategy
   * position (can be used to gracefuly exit strategies trading in netting mode or placing a series of related trades
   * per symbol). immediately means to close all positions immediately. One of 'by-position', 'by-symbol', 'immediately'
   */
  closeOnly?: String,

  /**
   * stop out setting. All trading will
   * be terminated and positions closed once equity drawdown reaches this value
   */
  stopOutRisk?: CopyFactoryStrategyStopOutSettings,

  /**
   * account risk limits. You can configure trading to be
   * stopped once total drawdown generated during specific period is exceeded. Can be specified either for balance or
   * equity drawdown
   */
  riskLimits?: Array<CopyFactoryStrategyRiskLimit>,

  /**
   * setting indicating maxumum leverage allowed when opening a new positions.
   * Any trade which results in a higher leverage will be discarded.
   */
  maxLeverage?: Number,

  /**
   * flag indicating whether stop loss should be copied. Default is to copy stop
   * loss.
   */
  copyStopLoss?: Boolean,

  /**
   * flag indicating whether take profit should be copied. Default is to copy take
   * profit.
   */
  copyTakeProfit?: Boolean,

  /**
   * Minimum trade volume to copy. Trade signals with a smaller volume will not be
   * copied
   */
  minTradeVolume?: Number,

  /**
   * Maximum trade volume to copy. Trade signals with a larger volume will be copied
   * with maximum volume instead
   */
  maxTradeVolume?: Number,

  /**
   * strategy subscriptions
   */
  subscriptions?: Array<CopyFactoryStrategySubscription>
}

/**
 * CopyFactory subscriber model
 */
export declare type CopyFactorySubscriber = CopyFactorySubscriberUpdate & {

  /**
   * id of the MetaApi account to copy trades to
   */
  _id: String
}

/**
 * CopyFactory provider strategy
 */
export declare type CopyFactoryStrategy = CopyFactoryStrategyUpdate & {
  
  /**
   * unique strategy id
   */
  _id: String,

  /**
   * commission rate the platform charges for strategy copying, applied to
   * commissions charged by provider. This commission applies only to accounts not managed directly by provider. Should
   * be fraction of 1
   */
  platformCommissionRate: Number
}

/**
 * CopyFactory strategy commission scheme
 */
export declare type CopyFactoryStrategyCommissionScheme = {

  /**
   * commission type. One of flat-fee, lots-traded, lots-won, amount-traded, amount-won,
   * high-water-mark
   */
  type: String,

  /**
   * billing period. One of week, month, quarter
   */
  billingPeriod: String,

  /**
   * commission rate. Should be greater than or equal to zero if commission type is
   * flat-fee, lots-traded or lots-won, should be greater than or equal to zero and less than or equal to 1 if
   * commission type is amount-traded, amount-won, high-water-mark.
   */
  commissionRate: Number
}

/**
 * CopyFactory strategy magic filter
 */
export declare type CopyFactoryStrategyMagicFilter = {

  /**
   * list of magics (expert ids) or magic ranges copied. Leave the value empty to
   * copy all magics
   */
  included: Array<String>,

  /**
   * list of magics (expert ids) or magic ranges excluded from copying. Leave the
   * value empty to copy all magics
   */
  excluded: Array<String>
}

/**
 * CopyFactory strategy time settings
 */
export declare type CopyFactoryStrategyTimeSettings = {

  /**
   * position lifetime. Default is to keep positions open up to 90 days
   */
  lifetimeInHours?: Number,

  /**
   * time interval to copy new positions. Default is to let 1
   * minute for the position to get copied. If position were not copied during this time, the copying will not be
   * retried anymore.
   */
  openingIntervalInMinutes?: Number
}

/**
 * CopyFactory strategy equity curve filter
 */
export declare type CopyFactoryStrategyEquityCurveFilter = {

  /**
   * moving average period, must be greater or equal to 1
   */
  period: Number,

  /**
   * moving average timeframe, a positive integer followed by time unit, e.g. 2h.
   * Allowed units are s, m, h, d and w.
   */
  timeframe: String
}

/**
 * CopyFactory strategy drawdown filter
 */
export declare type CopyFactoryStrategyDrawdownFilter = {

  /**
   * maximum drawdown value after which action is executed. Drawdown should
   * be configured as a fraction of 1, i.e. 0.15 means 15% drawdown value
   */
  maxDrawdown: Number,

  /**
   * action to take when drawdown exceeds maxDrawdown value. include means the trading
   * signal will be transmitted only if dd is greater than maxDrawdown value. exclude means the trading signal 
   * will be transmitted only if dd is less than maxDrawdown value
   */
  action: String
}

/**
 * CopyFactory strategy update
 */
export declare type CopyFactoryStrategyUpdate = {

  /**
   * strategy human-readable name
   */
  name: String,

  /**
   * longer strategy human-readable description
   */
  description: String,

  /**
   * id of the MetaApi account providing the strategy
   */
  accountId: String,

  /**
   * flag indicating that pending orders should not be copied.
   * Default is to copy pending orders
   */
  skipPendingOrders?: Boolean,

  /**
   * commission scheme allowed by this strategy
   */
  commissionScheme?: CopyFactoryStrategyCommissionScheme,

  /**
   * max risk per trade, expressed as a fraction of 1. If trade has a SL, the
   * trade size will be adjusted to match the risk limit. If not, the trade SL will be applied according to the risk
   * limit
   */
  maxTradeRisk?: Number,

  /**
   * flag indicating that the strategy should be copied in a reverse direction
   */
  reverse?: Boolean,

  /**
   * setting indicating whether to enable automatic trade
   * correlation reduction. Possible settings are not specified (disable correlation risk restrictions),
   * by-strategy (limit correlations for the strategy) or by-account (limit correlations for the account)
   */
  reduceCorrelations?: String,

  /**
   * stop out setting. All trading will
   * be terminated and positions closed once equity drawdown reaches this value
   */
  stopOutRisk?: CopyFactoryStrategyStopOutSettings,

  /**
   * symbol filters which can be used to copy only specific
   * symbols or exclude some symbols from copying
   */
  symbolFilter?: CopyFactoryStrategySymbolFilter,
  
  /**
   * news risk filter configuration
   */
  newsFilter?: CopyFactoryStrategyNewsFilter,

  /**
   * strategy risk limits. You can configure
   * trading to be stopped once total drawdown generated during specific period is exceeded. Can be specified either for
   * balance or equity drawdown
   */
  riskLimits?: Array<CopyFactoryStrategyRiskLimit>,

  /**
   * stop loss value restriction
   */
  maxStopLoss?: CopyFactoryStrategyMaxStopLoss,

  /**
   * max leverage risk restriction. All trades resulting in a leverage value
   * higher than specified will be skipped
   */
  maxLeverage?: Number,

  /**
   * defines how symbol name should be changed when
   * trading (e.g. when broker uses symbol names with unusual suffixes). By default this setting is disabled and the
   * trades are copied using signal source symbol name
   */
  symbolMapping?: Array<CopyFactoryStrategySymbolMapping>,

  /**
   * Trade size scaling settings. By default the
   * trade size on strategy subscriber side will be scaled according to balance to preserve risk.
   */
  tradeSizeScaling?: CopyFactoryStrategyTradeSizeScaling,

  /**
   * flag indicating whether stop loss should be copied. Default is to copy stop
   * loss.
   */
  copyStopLoss?: Boolean,

  /**
   * flag indicating whether take profit should be copied. Default is to copy take
   * profit.
   */
  copyTakeProfit?: Boolean,

  /**
   * Minimum trade volume to copy. Trade signals with a smaller volume will not be
   * copied
   */
  minTradeVolume?: Number,

  /**
   * Maximum trade volume to copy. Trade signals with a larger volume will be copied
   * with maximum volume instead
   */
  maxTradeVolume?: Number,

  /**
   * magic (expert id) filter
   */
  magicFilter?: CopyFactoryStrategyMagicFilter,

  /**
   * filter which permits the trades only if account
   * equity is greater than balance moving average
   */
  equityCurveFilter?: CopyFactoryStrategyEquityCurveFilter,

  /**
   *  master account strategy drawdown filter
   */
  drawdownFilter?: CopyFactoryStrategyDrawdownFilter,

  /**
   * symbols traded by this strategy. Specifying the symbols will improve trade
   * latency on first trades made by strategy. If you do not specify this setting the application will monitor the strategy
   * trades and detect the symbols automatically over time
   */
  symbolsTraded?: Array<String>,

  /**
   * settings to manage copying timeframe and position
   * lifetime. Default is to copy position within 1 minute from being opened at source and let the position to live for
   * up to 90 days
   */
  timeSettings?: CopyFactoryStrategyTimeSettings
}

/**
 * CopyFactory close instructions
 */
export declare type CopyFactoryCloseInstructions = {

  /**
   * position close mode on strategy or subscription removal. Preserve means
   * that positions will not be closed and will not be managed by CopyFactory.
   * close-gracefully-by-position means that positions will continue to be managed by CopyFactory,
   * but only close signals will be copied. close-gracefully-by-symbol means that positions will
   * continue to be managed by CopyFactory, but only close signals will be copied or signals to
   * open positions for the symbols which already have positions opened. close-immediately means
   * that all positions will be closed immediately. Default is close-immediately. One of 'preserve',
   * 'close-gracefully-by-position', 'close-gracefully-by-symbol', 'close-immediately'
   */
  mode?: String,

  /**
   * time to force remove object after. The object will be removed after
   * this time, even if positions are not yet closed fully. Default is current date plus 30 days.
   * Can not be less than 30 days or greater than current date plus 90 days. The setting is ignored
   * when a subscription is being removed
   */
  removeAfter?: Date
}

/**
 * Portfolio strategy member
 */
export declare type CopyFactoryPortfolioStrategyMember = {

  /**
   * member strategy id
   */
  strategyId: String,

  /**
   * copying multiplier (weight in the portfolio)
   */
  multiplier: Number,

  /**
   * flag indicating that pending orders should not be copied.
   * Default is to copy pending orders
   */
  skipPendingOrders?: Boolean,

  /**
   * max risk per trade, expressed as a fraction of 1. If trade has a SL, the
   * trade size will be adjusted to match the risk limit. If not, the trade SL will be applied according to the risk
   * limit
   */
  maxTradeRisk: Number,

  /**
   * flag indicating that the strategy should be copied in a reverse direction
   */
  reverse?: Boolean,

  /**
   * setting indicating whether to enable automatic trade
   * correlation reduction. Possible settings are not specified (disable correlation risk restrictions),
   * by-strategy (limit correlations for the strategy) or by-account (limit correlations for the account)
   */
  reduceCorrelations?: String,

  /**
   * stop out setting. All trading will
   * be terminated and positions closed once equity drawdown reaches this value
   */
  stopOutRisk?: CopyFactoryStrategyStopOutSettings,

  /**
   * symbol filters which can be used to copy only specific
   * symbols or exclude some symbols from copying
   */
  symbolFilter?: CopyFactoryStrategySymbolFilter,

  /**
   * news risk filter configuration
   */
  newsFilter?: CopyFactoryStrategyNewsFilter,

  /**
   * strategy risk limits. You can configure
   * trading to be stopped once total drawdown generated during specific period is exceeded. Can be specified either for
   * balance or equity drawdown
   */
  riskLimits?: Array<CopyFactoryStrategyRiskLimit>,

  /**
   * stop loss value restriction
   */
  maxStopLoss?: CopyFactoryStrategyMaxStopLoss,

  /**
   * max leverage risk restriction. All trades resulting in a leverage value
   * higher than specified will be skipped
   */
  maxLeverage?: Number,

  /**
   * defines how symbol name should be changed when
   * trading (e.g. when broker uses symbol names with unusual suffixes). By default this setting is disabled and the
   * trades are copied using signal source symbol name
   */
  symbolMapping?: Array<CopyFactoryStrategySymbolMapping>,

  /**
   * Trade size scaling settings. By default the
   * trade size on strategy subscriber side will be scaled according to balance to preserve risk.
   */
  tradeSizeScaling?: CopyFactoryStrategyTradeSizeScaling,

  /**
   * flag indicating whether stop loss should be copied. Default is to copy stop
   * loss.
   */
  copyStopLoss?: Boolean,

  /**
   * flag indicating whether take profit should be copied. Default is to copy take
   * profit.
   */
  copyTakeProfit?: Boolean,

  /**
   * Minimum trade volume to copy. Trade signals with a smaller volume will not be
   * copied
   */
  minTradeVolume?: Number,

  /**
   * Maximum trade volume to copy. Trade signals with a larger volume will be copied
   * with maximum volume instead
   */
  maxTradeVolume?: Number
}

/**
 * Portfolio strategy update
 */
export declare type CopyFactoryPortfolioStrategyUpdate = {

  /**
   * strategy human-readable name
   */
  name: String,

  /**
   * longer strategy human-readable description
   */
  description: String,

  /**
   * array of portfolio members
   */
  members: Array<CopyFactoryPortfolioStrategyMember>,

  /**
   * commission scheme allowed by this strategy. By
   * default monthly billing period with no commission is being used
   */
  commissionScheme?: CopyFactoryStrategyCommissionScheme,

  /**
   * flag indicating that pending orders should not be copied.
   * Default is to copy pending orders
   */
  skipPendingOrders?: Boolean,

  /**
   * max risk per trade, expressed as a fraction of 1. If trade has a SL, the
   * trade size will be adjusted to match the risk limit. If not, the trade SL will be applied according to the risk
   * limit
   */
  maxTradeRisk?: Number,

  /**
   * flag indicating that the strategy should be copied in a reverse direction
   */
  reverse?: Boolean,

  /**
   * setting indicating whether to enable automatic trade
   * correlation reduction. Possible settings are not specified (disable correlation risk restrictions),
   * by-strategy (limit correlations for the strategy) or by-account (limit correlations for the account)
   */
  reduceCorrelations?: String,

  /**
   * stop out setting. All trading will
   * be terminated and positions closed once equity drawdown reaches this value
   */
  stopOutRisk?: CopyFactoryStrategyStopOutSettings,

  /**
   * symbol filters which can be used to copy only specific
   * symbols or exclude some symbols from copying
   */
  symbolFilter?: CopyFactoryStrategySymbolFilter,

  /**
   * news risk filter configuration
   */
  newsFilter?: CopyFactoryStrategyNewsFilter,

  /**
   * strategy risk limits. You can configure
   * trading to be stopped once total drawdown generated during specific period is exceeded. Can be specified either for
   * balance or equity drawdown
   */
  riskLimits?: Array<CopyFactoryStrategyRiskLimit>,

  /**
   * stop loss value restriction
   */
  maxStopLoss?: CopyFactoryStrategyMaxStopLoss,

  /**
   * max leverage risk restriction. All trades resulting in a leverage value
   * higher than specified will be skipped
   */
  maxLeverage?: Number,

  /**
   * defines how symbol name should be changed when
   * trading (e.g. when broker uses symbol names with unusual suffixes). By default this setting is disabled and the
   * trades are copied using signal source symbol name
   */
  symbolMapping?: Array<CopyFactoryStrategySymbolMapping>,

  /**
   * Trade size scaling settings. By default the
   * trade size on strategy subscriber side will be scaled according to balance to preserve risk.
   */
  tradeSizeScaling?: CopyFactoryStrategyTradeSizeScaling,

  /**
   * flag indicating whether stop loss should be copied. Default is to copy stop
   * loss.
   */
  copyStopLoss?: Boolean,

  /**
   * flag indicating whether take profit should be copied. Default is to copy take
   * profit.
   */
  copyTakeProfit?: Boolean,

  /**
   * Minimum trade volume to copy. Trade signals with a smaller volume will not be
   * copied
   */
  minTradeVolume?: Number,  

  /**
   * Maximum trade volume to copy. Trade signals with a larger volume will be copied
   * with maximum volume instead
   */
  maxTradeVolume?: Number
}

/**
 * Portfolio strategy, i.e. the strategy which includes a set of other strategies
 */
export declare type CopyFactoryPortfolioStrategy = CopyFactoryPortfolioStrategyUpdate & {

  /**
   * unique strategy id
   */
  _id: String,

  /**
   * commission rate the platform charges for strategy copying, applied to
   * commissions charged by provider. This commission applies only to accounts not managed directly by provider. Should
   * be fraction of 1
   */
  platformCommissionRate: Number
}