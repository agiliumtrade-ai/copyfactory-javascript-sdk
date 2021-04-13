'use strict';

import HttpClient from '../httpClient';
import sinon from 'sinon';
import HistoryClient from './history.client';

const copyFactoryApiUrl = 'https://trading-api-v1.agiliumtrade.agiliumtrade.ai';

/**
 * @test {TradingClient}
 */
describe('HistoryClient', () => {

  let copyFactoryClient;
  const token = 'header.payload.sign';
  let httpClient = new HttpClient();
  let sandbox;
  let requestStub;

  before(() => {
    sandbox = sinon.createSandbox();
  });

  beforeEach(() => {
    copyFactoryClient = new HistoryClient(httpClient, token);
    requestStub = sandbox.stub(httpClient, 'request');
  });

  afterEach(() => {
    sandbox.restore();
  });

  /**
   * @test {TradingClient#getProviders}
   */
  it('should retrieve providers from API', async () => {
    let expected = [{
      id: '577f095ab64b4d1710de34f6a28ab3bd',
      name: 'First Last',
      strategies: [{
        id: 'ABCD',
        name: 'Test strategy'
      }]
    }];
    requestStub.resolves(expected);
    let providers = await copyFactoryClient.getProviders();
    providers.should.equal(expected);
    sinon.assert.calledOnceWithExactly(httpClient.request, {
      url: `${copyFactoryApiUrl}/users/current/providers`,
      method: 'GET',
      headers: {
        'auth-token': token
      },
      json: true,
    });
  });

  /**
   * @test {TradingClient#getProviders}
   */
  it('should not retrieve providers from API with account token', async () => {
    copyFactoryClient = new HistoryClient(httpClient, 'token');
    try {
      await copyFactoryClient.getProviders();
    } catch (error) {
      error.message.should.equal(
        'You can not invoke getProviders method, because you have connected with account access token. ' +
        'Please use API access token from https://app.metaapi.cloud/token page to invoke this method.'
      );
    }
  });

  /**
   * @test {TradingClient#getSubscribers}
   */
  it('should retrieve subscribers from API', async () => {
    let expected = [{
      id: '577f095ab64b4d1710de34f6a28ab3bd',
      name: 'First Last',
      strategies: [{
        id: 'ABCD',
        name: 'Test strategy'
      }]
    }];
    requestStub.resolves(expected);
    let providers = await copyFactoryClient.getSubscribers();
    providers.should.equal(expected);
    sinon.assert.calledOnceWithExactly(httpClient.request, {
      url: `${copyFactoryApiUrl}/users/current/subscribers`,
      method: 'GET',
      headers: {
        'auth-token': token
      },
      json: true,
    });
  });

  /**
   * @test {TradingClient#getSubscribers}
   */
  it('should not retrieve subscribers from API with account token', async () => {
    copyFactoryClient = new HistoryClient(httpClient, 'token');
    try {
      await copyFactoryClient.getSubscribers();
    } catch (error) {
      error.message.should.equal(
        'You can not invoke getSubscribers method, because you have connected with account access token. ' +
        'Please use API access token from https://app.metaapi.cloud/token page to invoke this method.'
      );
    }
  });

  /**
   * @test {TradingClient#getStrategiesSubscribed}
   */
  it('should retrieve strategies subscribed to from API', async () => {
    let expected = [{
      id: 'ABCD',
      name: 'Test strategy'
    }];
    requestStub.resolves(expected);
    let strategies = await copyFactoryClient.getStrategiesSubscribed();
    strategies.should.equal(expected);
    sinon.assert.calledOnceWithExactly(httpClient.request, {
      url: `${copyFactoryApiUrl}/users/current/strategies-subscribed`,
      method: 'GET',
      headers: {
        'auth-token': token
      },
      json: true,
    });
  });

  /**
   * @test {TradingClient#getStrategiesSubscribed}
   */
  it('should not retrieve strategies subscribed to from API with account token', async () => {
    copyFactoryClient = new HistoryClient(httpClient, 'token');
    try {
      await copyFactoryClient.getStrategiesSubscribed();
    } catch (error) {
      error.message.should.equal(
        'You can not invoke getStrategiesSubscribed method, because you have connected with account access token. ' +
        'Please use API access token from https://app.metaapi.cloud/token page to invoke this method.'
      );
    }
  });

  /**
   * @test {TradingClient#getProvidedStrategies}
   */
  it('should retrieve provided strategies from API', async () => {
    let expected = [{
      id: 'ABCD',
      name: 'Test strategy'
    }];
    requestStub.resolves(expected);
    let strategies = await copyFactoryClient.getProvidedStrategies();
    strategies.should.equal(expected);
    sinon.assert.calledOnceWithExactly(httpClient.request, {
      url: `${copyFactoryApiUrl}/users/current/provided-strategies`,
      method: 'GET',
      headers: {
        'auth-token': token
      },
      json: true,
    });
  });

  /**
   * @test {TradingClient#getProvidedStrategies}
   */
  it('should not retrieve provided strategies from API with account token', async () => {
    copyFactoryClient = new HistoryClient(httpClient, 'token');
    try {
      await copyFactoryClient.getProvidedStrategies();
    } catch (error) {
      error.message.should.equal(
        'You can not invoke getProvidedStrategies method, because you have connected with account access token. ' +
        'Please use API access token from https://app.metaapi.cloud/token page to invoke this method.'
      );
    }
  });

  /**
   * @test {TradingClient#getProvidedStrategiesTransactions}
   */
  it('should retrieve transactions performed on provided strategies from API', async () => {
    let expected = [{
      id: '64664661:close',
      type: 'DEAL_TYPE_SELL',
      time: new Date('2020-08-02T21:01:01.830Z'),
      accountId: '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
      symbol: 'EURJPY',
      subscriber: {
        id: 'subscriberId',
        name: 'Subscriber'
      },
      demo: false,
      provider: {
        id: 'providerId',
        name: 'Provider'
      },
      strategy: {
        id: 'ABCD'
      },
      improvement: 0,
      providerCommission: 0,
      platformCommission: 0,
      quantity: -0.04,
      lotPrice: 117566.08744776,
      tickPrice: 124.526,
      amount: -4702.643497910401,
      commission: -0.14,
      swap: -0.14,
      profit: 0.49
    }];
    let from = new Date();
    let till = new Date();
    requestStub.resolves(expected);
    let transactions = await copyFactoryClient.getProvidedStrategiesTransactions(from, till, ['ABCD'], ['accountId'],
      ['subscriberId'], 100, 200);
    transactions.should.equal(expected);
    sinon.assert.calledOnceWithExactly(httpClient.request, {
      url: `${copyFactoryApiUrl}/users/current/provided-strategies/transactions`,
      method: 'GET',
      headers: {
        'auth-token': token
      },
      qs: {
        from,
        till,
        strategyId: ['ABCD'],
        accountId: ['accountId'],
        subscriberId: ['subscriberId'],
        offset: 100,
        limit: 200
      },
      json: true,
    });
  });

  /**
   * @test {TradingClient#getProvidedStrategiesTransactions}
   */
  it('should not retrieve transactions on provided strategies from API with account token', async () => {
    copyFactoryClient = new HistoryClient(httpClient, 'token');
    try {
      await copyFactoryClient.getProvidedStrategiesTransactions(new Date(), new Date());
    } catch (error) {
      error.message.should.equal(
        'You can not invoke getProvidedStrategiesTransactions method, because you have connected with account ' + 
        'access token. Please use API access token from https://app.metaapi.cloud/token page to invoke this method.'
      );
    }
  });

  /**
   * @test {TradingClient#getStrategiesSubscribedTransactions}
   */
  it('should retrieve transactions performed on strategies current user is subscribed to from API', async () => {
    let expected = [{
      id: '64664661:close',
      type: 'DEAL_TYPE_SELL',
      time: new Date('2020-08-02T21:01:01.830Z'),
      accountId: '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
      symbol: 'EURJPY',
      subscriber: {
        id: 'subscriberId',
        name: 'Subscriber'
      },
      demo: false,
      provider: {
        id: 'providerId',
        name: 'Provider'
      },
      strategy: {
        id: 'ABCD'
      },
      improvement: 0,
      providerCommission: 0,
      platformCommission: 0,
      quantity: -0.04,
      lotPrice: 117566.08744776,
      tickPrice: 124.526,
      amount: -4702.643497910401,
      commission: -0.14,
      swap: -0.14,
      profit: 0.49
    }];
    let from = new Date();
    let till = new Date();
    requestStub.resolves(expected);
    let transactions = await copyFactoryClient.getStrategiesSubscribedTransactions(from, till, ['ABCD'], ['accountId'],
      ['providerId'], 100, 200);
    transactions.should.equal(expected);
    sinon.assert.calledOnceWithExactly(httpClient.request, {
      url: `${copyFactoryApiUrl}/users/current/strategies-subscribed/transactions`,
      method: 'GET',
      headers: {
        'auth-token': token
      },
      json: true,
      qs: {
        from,
        till,
        strategyId: ['ABCD'],
        accountId: ['accountId'],
        providerId: ['providerId'],
        offset: 100,
        limit: 200
      },
    });
  });

  /**
   * @test {TradingClient#getStrategiesSubscribedTransactions}
   */
  it('should not retrieve transactions on strategies subscribed to from API with account token', async () => {
    copyFactoryClient = new HistoryClient(httpClient, 'token');
    try {
      await copyFactoryClient.getStrategiesSubscribedTransactions(new Date(), new Date());
    } catch (error) {
      error.message.should.equal(
        'You can not invoke getStrategiesSubscribedTransactions method, because you have connected with account ' + 
        'access token. Please use API access token from https://app.metaapi.cloud/token page to invoke this method.'
      );
    }
  });

});
