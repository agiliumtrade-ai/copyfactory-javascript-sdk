'use strict';

import {HttpClientMock} from '../httpClient';
import TradingClient from './trading.client';

const copyFactoryApiUrl = 'https://trading-api-v1.agiliumtrade.agiliumtrade.ai';

/**
 * @test {TradingClient}
 */
describe('TradingClient', () => {

  let tradingClient;
  let httpClient = new HttpClientMock(() => 'empty');

  beforeEach(() => {
    tradingClient = new TradingClient(httpClient, 'header.payload.sign');
  });

  /**
   * @test {TradingClient#resynchronize}
   */
  it('should resynchronize CopyFactory account', async () => {
    httpClient.requestFn = (opts) => {
      return Promise
        .resolve()
        .then(() => {
          opts.should.eql({
            url: `${copyFactoryApiUrl}/users/current/accounts/` +
              '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef/resynchronize',
            method: 'POST',
            headers: {
              'auth-token': 'header.payload.sign'
            },
            json: true,
            timeout: 60000,
            qs: {
              strategyId: ['ABCD']
            }
          });
          return;
        });
    };
    await tradingClient.resynchronize('0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef', ['ABCD']);
  });

  /**
   * @test {TradingClient#resynchronize}
   */
  it('should not resynchronize account with account token', async () => {
    tradingClient = new TradingClient(httpClient, 'token');
    try {
      await tradingClient.resynchronize('0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef');
    } catch (error) {
      error.message.should.equal(
        'You can not invoke resynchronize method, because you have connected with account access token. ' +
        'Please use API access token from https://app.metaapi.cloud/token page to invoke this method.'
      );
    }
  });

  /**
   * @test {TradingClient#getStopouts}
   */
  it('should retrieve stopouts', async () => {
    let expected = [{
      reason: 'max-drawdown',
      stoppedAt: new Date('2020-08-08T07:57:30.328Z'),
      strategy: {
        id: 'ABCD',
        name: 'Strategy'
      },
      reasonDescription: 'total strategy equity drawdown exceeded limit'
    }
    ];
    httpClient.requestFn = (opts) => {
      return Promise
        .resolve()
        .then(() => {
          opts.should.eql({
            url: `${copyFactoryApiUrl}/users/current/accounts/` +
              '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef/stopouts',
            method: 'GET',
            headers: {
              'auth-token': 'header.payload.sign'
            },
            json: true,
            timeout: 60000
          });
          return expected;
        });
    };
    let stopouts = await tradingClient
      .getStopouts('0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef');
    stopouts.should.equal(expected);
  });

  /**
   * @test {TradingClient#getStopouts}
   */
  it('should not retrieve stopouts from API with account token', async () => {
    tradingClient = new TradingClient(httpClient, 'token');
    try {
      await tradingClient.getStopouts('0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef');
    } catch (error) {
      error.message.should.equal(
        'You can not invoke getStopouts method, because you have connected with account access token. ' +
        'Please use API access token from https://app.metaapi.cloud/token page to invoke this method.'
      );
    }
  });

  /**
   * @test {TradingClient#resetStopouts}
   */
  it('should reset stopouts', async () => {
    httpClient.requestFn = (opts) => {
      return Promise
        .resolve()
        .then(() => {
          opts.should.eql({
            url: `${copyFactoryApiUrl}/users/current/accounts/` +
              '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef/strategies-subscribed/' +
              'ABCD/stopouts/daily-equity/reset',
            method: 'POST',
            headers: {
              'auth-token': 'header.payload.sign'
            },
            json: true,
            timeout: 60000
          });
          return;
        });
    };
    await tradingClient.resetStopouts('0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
      'ABCD', 'daily-equity');
  });

  /**
   * @test {TradingClient#resetStopouts}
   */
  it('should not reset stopouts with account token', async () => {
    tradingClient = new TradingClient(httpClient, 'token');
    try {
      await tradingClient.resetStopouts('0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
        'ABCD', 'daily-equity');
    } catch (error) {
      error.message.should.equal(
        'You can not invoke resetStopouts method, because you have connected with account access token. ' +
        'Please use API access token from https://app.metaapi.cloud/token page to invoke this method.'
      );
    }
  });

  /**
   * @test {TradingClient#getUserLog}
   */
  it('should retrieve copy trading user log', async () => {
    let expected = [{
      time: new Date('2020-08-08T07:57:30.328Z'),
      level: 'INFO',
      message: 'message'
    }];
    httpClient.requestFn = (opts) => {
      return Promise
        .resolve()
        .then(() => {
          opts.should.eql({
            url: `${copyFactoryApiUrl}/users/current/accounts/` +
            '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef/user-log',
            method: 'GET',
            qs: {
              startTime: new Date('2020-08-01T00:00:00.000Z'),
              endTime: new Date('2020-08-10T00:00:00.000Z'),
              offset: 10,
              limit: 100
            },
            headers: {
              'auth-token': 'header.payload.sign'
            },
            json: true,
            timeout: 60000
          });
          return expected;
        });
    };
    let records = await tradingClient
      .getUserLog('0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
        new Date('2020-08-01T00:00:00.000Z'), new Date('2020-08-10T00:00:00.000Z'), 10, 100);
    records.should.equal(expected);
  });

  /**
   * @test {TradingClient#getUserLog}
   */
  it('should not retrieve copy trading user log from API with account token', async () => {
    tradingClient = new TradingClient(httpClient, 'token');
    try {
      await tradingClient.getUserLog('0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef');
    } catch (error) {
      error.message.should.equal(
        'You can not invoke getUserLog method, because you have connected with account access token. ' +
        'Please use API access token from https://app.metaapi.cloud/token page to invoke this method.'
      );
    }
  });

});
