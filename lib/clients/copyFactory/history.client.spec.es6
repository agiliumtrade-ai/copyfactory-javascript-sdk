'use strict';

import HttpClient from '../httpClient';
import sinon from 'sinon';
import HistoryClient from './history.client';

const copyFactoryApiUrl = 'https://copyfactory-application-history-master-v1.agiliumtrade.agiliumtrade.ai';

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
   * @test {TradingClient#getProvidedTransactions}
   */
  it('should retrieve transactions performed on provided strategies from API', async () => {
    let expected = [{
      id: '64664661:close',
      type: 'DEAL_TYPE_SELL',
      time: new Date('2020-08-02T21:01:01.830Z'),
      subscriberId: 'e8867baa-5ec2-45ae-9930-4d5cea18d0d6',
      symbol: 'EURJPY',
      subscriberUser: {
        id: 'subscriberId',
        name: 'Subscriber'
      },
      demo: false,
      providerUser: {
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
    let transactions = await copyFactoryClient.getProvidedTransactions(from, till, ['ABCD'],
      ['e8867baa-5ec2-45ae-9930-4d5cea18d0d6'], 100, 200);
    transactions.should.equal(expected);
    sinon.assert.calledOnceWithExactly(httpClient.request, {
      url: `${copyFactoryApiUrl}/users/current/provided-transactions`,
      method: 'GET',
      headers: {
        'auth-token': token
      },
      qs: {
        from,
        till,
        strategyId: ['ABCD'],
        subscriberId: ['e8867baa-5ec2-45ae-9930-4d5cea18d0d6'],
        offset: 100,
        limit: 200
      },
      json: true,
    });
  });

  /**
   * @test {TradingClient#getProvidedTransactions}
   */
  it('should not retrieve transactions on provided strategies from API with account token', async () => {
    copyFactoryClient = new HistoryClient(httpClient, 'token');
    try {
      await copyFactoryClient.getProvidedTransactions(new Date(), new Date());
    } catch (error) {
      error.message.should.equal(
        'You can not invoke getProvidedTransactions method, because you have connected with account ' + 
        'access token. Please use API access token from https://app.metaapi.cloud/token page to invoke this method.'
      );
    }
  });

  /**
   * @test {TradingClient#getSubscriptionTransactions}
   */
  it('should retrieve transactions performed on strategies current user is subscribed to from API', async () => {
    let expected = [{
      id: '64664661:close',
      type: 'DEAL_TYPE_SELL',
      time: new Date('2020-08-02T21:01:01.830Z'),
      subscriberId: 'e8867baa-5ec2-45ae-9930-4d5cea18d0d6',
      symbol: 'EURJPY',
      subscriberUser: {
        id: 'subscriberId',
        name: 'Subscriber'
      },
      demo: false,
      providerUser: {
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
    let transactions = await copyFactoryClient.getSubscriptionTransactions(from, till, ['ABCD'],
      ['e8867baa-5ec2-45ae-9930-4d5cea18d0d6'], 100, 200);
    transactions.should.equal(expected);
    sinon.assert.calledOnceWithExactly(httpClient.request, {
      url: `${copyFactoryApiUrl}/users/current/subscription-transactions`,
      method: 'GET',
      headers: {
        'auth-token': token
      },
      json: true,
      qs: {
        from,
        till,
        strategyId: ['ABCD'],
        subscriberId: ['e8867baa-5ec2-45ae-9930-4d5cea18d0d6'],
        offset: 100,
        limit: 200
      },
    });
  });

  /**
   * @test {TradingClient#getSubscriptionTransactions}
   */
  it('should not retrieve transactions on strategies subscribed to from API with account token', async () => {
    copyFactoryClient = new HistoryClient(httpClient, 'token');
    try {
      await copyFactoryClient.getSubscriptionTransactions(new Date(), new Date());
    } catch (error) {
      error.message.should.equal(
        'You can not invoke getSubscriptionTransactions method, because you have connected with account ' + 
        'access token. Please use API access token from https://app.metaapi.cloud/token page to invoke this method.'
      );
    }
  });

});
