'use strict';

import HttpClient from '../httpClient';
import sinon from 'sinon';
import TradingClient from './trading.client';
import DomainClient from '../domain.client';

/**
 * @test {TradingClient}
 */
describe('TradingClient', () => {

  let tradingClient;
  const token = 'header.payload.sign';
  let httpClient = new HttpClient();
  let domainClient;
  let sandbox;
  let requestStub;

  before(() => {
    sandbox = sinon.createSandbox();
  });

  beforeEach(() => {
    domainClient = new DomainClient(httpClient, token);
    tradingClient = new TradingClient(domainClient);
    requestStub = sandbox.stub(domainClient, 'requestCopyFactory');
  });

  afterEach(() => {
    sandbox.restore();
  });

  /**
   * @test {TradingClient#resynchronize}
   */
  it('should resynchronize CopyFactory account', async () => {
    await tradingClient.resynchronize('e8867baa-5ec2-45ae-9930-4d5cea18d0d6', ['ABCD'],
      ['0123456']);
    sinon.assert.calledOnceWithExactly(domainClient.requestCopyFactory, {
      url: '/users/current/subscribers/e8867baa-5ec2-45ae-9930-4d5cea18d0d6/resynchronize',
      method: 'POST',
      headers: {
        'auth-token': token
      },
      json: true,
      qs: {
        strategyId: ['ABCD'],
        positionId: ['0123456']
      }
    });
  });

  /**
   * @test {TradingClient#resynchronize}
   */
  it('should not resynchronize account with account token', async () => {
    domainClient = new DomainClient(httpClient, 'token');
    tradingClient = new TradingClient(domainClient);
    try {
      await tradingClient.resynchronize('e8867baa-5ec2-45ae-9930-4d5cea18d0d6');
      throw new Error('MethodAccessError expected');
    } catch (error) {
      error.name.should.equal('MethodAccessError');
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
    requestStub.resolves(expected);
    let stopouts = await tradingClient.getStopouts('e8867baa-5ec2-45ae-9930-4d5cea18d0d6');
    stopouts.should.equal(expected);
    sinon.assert.calledOnceWithExactly(domainClient.requestCopyFactory, {
      url: '/users/current/subscribers/e8867baa-5ec2-45ae-9930-4d5cea18d0d6/stopouts',
      method: 'GET',
      headers: {
        'auth-token': token
      },
      json: true,
    });
  });

  /**
   * @test {TradingClient#getStopouts}
   */
  it('should not retrieve stopouts from API with account token', async () => {
    domainClient = new DomainClient(httpClient, 'token');
    tradingClient = new TradingClient(domainClient);
    try {
      await tradingClient.getStopouts('e8867baa-5ec2-45ae-9930-4d5cea18d0d6');
      throw new Error('MethodAccessError expected');
    } catch (error) {
      error.name.should.equal('MethodAccessError');
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
    await tradingClient.resetStopouts('e8867baa-5ec2-45ae-9930-4d5cea18d0d6', 'ABCD', 'daily-equity');
    sinon.assert.calledOnceWithExactly(domainClient.requestCopyFactory, {
      url: '/users/current/subscribers/' +
        'e8867baa-5ec2-45ae-9930-4d5cea18d0d6/subscription-strategies/ABCD/stopouts/daily-equity/reset',
      method: 'POST',
      headers: {
        'auth-token': token
      },
      json: true,
    });
  });

  /**
   * @test {TradingClient#resetStopouts}
   */
  it('should not reset stopouts with account token', async () => {
    domainClient = new DomainClient(httpClient, 'token');
    tradingClient = new TradingClient(domainClient);
    try {
      await tradingClient.resetStopouts('e8867baa-5ec2-45ae-9930-4d5cea18d0d6',
        'ABCD', 'daily-equity');
      throw new Error('MethodAccessError expected');
    } catch (error) {
      error.name.should.equal('MethodAccessError');
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
    requestStub.resolves(expected);
    let records = await tradingClient.getUserLog('e8867baa-5ec2-45ae-9930-4d5cea18d0d6',
      new Date('2020-08-01T00:00:00.000Z'), new Date('2020-08-10T00:00:00.000Z'), 10, 100);
    records.should.equal(expected);
    sinon.assert.calledOnceWithExactly(domainClient.requestCopyFactory, {
      url: '/users/current/subscribers/e8867baa-5ec2-45ae-9930-4d5cea18d0d6/user-log',
      method: 'GET',
      qs: {
        startTime: new Date('2020-08-01T00:00:00.000Z'),
        endTime: new Date('2020-08-10T00:00:00.000Z'),
        offset: 10,
        limit: 100
      },
      headers: {
        'auth-token': token
      },
      json: true,
    }, true);
  });

  /**
   * @test {TradingClient#getUserLog}
   */
  it('should not retrieve copy trading user log from API with account token', async () => {
    domainClient = new DomainClient(httpClient, 'token');
    tradingClient = new TradingClient(domainClient);
    try {
      await tradingClient.getUserLog('e8867baa-5ec2-45ae-9930-4d5cea18d0d6');
      throw new Error('MethodAccessError expected');
    } catch (error) {
      error.name.should.equal('MethodAccessError');
      error.message.should.equal(
        'You can not invoke getUserLog method, because you have connected with account access token. ' +
        'Please use API access token from https://app.metaapi.cloud/token page to invoke this method.'
      );
    }
  });

});
