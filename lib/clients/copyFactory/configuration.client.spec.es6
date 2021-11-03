'use strict';

import should from 'should';
import sinon from 'sinon';
import HttpClient from '../httpClient';
import ConfigurationClient from './configuration.client';

const copyFactoryApiUrl = 'https://copyfactory-application-history-master-v1.agiliumtrade.agiliumtrade.ai';

/**
 * @test {ConfigurationClient}
 */
describe('ConfigurationClient', () => {

  let sandbox;
  let copyFactoryClient;
  const token = 'header.payload.sign';
  let httpClient = new HttpClient();
  let requestStub;

  before(() => {
    sandbox = sinon.createSandbox();
  });

  beforeEach(() => {
    copyFactoryClient = new ConfigurationClient(httpClient, token);
    requestStub = sandbox.stub(httpClient, 'request');
  });

  afterEach(() => {
    sandbox.restore();
  });

  /**
   * @test {ConfigurationClient#generateAccountId}
   */
  it('should generate account id', async () => {
    copyFactoryClient.generateAccountId().length.should.equal(64);
  });

  /**
   * @test {ConfigurationClient#generateStrategyId}
   */
  it('should generate strategy id', async () => {
    let expected = {
      id: 'ABCD'
    };
    requestStub.resolves(expected);
    let id = await copyFactoryClient.generateStrategyId();
    id.should.equal(expected);
    sinon.assert.calledOnceWithExactly(httpClient.request, {
      url: `${copyFactoryApiUrl}/users/current/configuration/unused-strategy-id`,
      method: 'GET',
      headers: {
        'auth-token': token
      },
      json: true,
    });
  });

  /**
   * @test {ConfigurationClient#generateStrategyId}
   */
  it('should not generate strategy id with account token', async () => {
    copyFactoryClient = new ConfigurationClient(httpClient, 'token');
    try {
      await copyFactoryClient.generateStrategyId();
    } catch (error) {
      error.message.should.equal(
        'You can not invoke generateStrategyId method, because you have connected with account access token. ' +
        'Please use API access token from https://app.metaapi.cloud/token page to invoke this method.'
      );
    }
  });

  /**
   * @test {ConfigurationClient#getStrategies}
   */
  it('should retrieve strategies from API', async () => {
    let expected = [{
      _id: 'ABCD',
      platformCommissionRate: 0.01,
      name: 'Test strategy',
      accountId: 'e8867baa-5ec2-45ae-9930-4d5cea18d0d6',
      maxTradeRisk: 0.1,
      stopOutRisk: {
        value: 0.4,
        startTime: '2020-08-24T00:00:00.000Z'
      },
      riskLimits: [{
        type: 'monthly',
        applyTo: 'balance',
        maxRisk: 0.5,
        closePositions: false,
        startTime: '2020-08-24T00:00:01.000Z'
      }],
      timeSettings: {
        lifetimeInHours: 192,
        openingIntervalInMinutes: 5
      }
    }];
    requestStub.resolves(expected);
    let strategies = await copyFactoryClient.getStrategies();
    strategies.should.equal(expected);
    sinon.assert.calledOnceWithExactly(httpClient.request, {
      url: `${copyFactoryApiUrl}/users/current/configuration/strategies`,
      method: 'GET',
      headers: {
        'auth-token': token
      },
      json: true,
    });
  });
  
  /**
     * @test {ConfigurationClient#getStrategies}
     */
  it('should not retrieve strategies from API with account token', async () => {
    copyFactoryClient = new ConfigurationClient(httpClient, 'token');
    try {
      await copyFactoryClient.getStrategies();
    } catch (error) {
      error.message.should.equal(
        'You can not invoke getStrategies method, because you have connected with account access token. ' +
          'Please use API access token from https://app.metaapi.cloud/token page to invoke this method.'
      );
    }
  });

  /**
   * @test {ConfigurationClient#getStrategy}
   */
  it('should retrieve strategy from API', async () => {
    let expected = {
      _id: 'ABCD',
      providerId: 'providerId',
      platformCommissionRate: 0.01,
      name: 'Test strategy',
      connectionId: 'e8867baa-5ec2-45ae-9930-4d5cea18d0d6',
      maxTradeRisk: 0.1,
      stopOutRisk: {
        value: 0.4,
        startTime: '2020-08-24T00:00:00.000Z'
      },
      timeSettings: {
        lifetimeInHours: 192,
        openingIntervalInMinutes: 5
      }
    };
    requestStub.resolves(expected);
    let strategies = await copyFactoryClient.getStrategy('ABCD');
    strategies.should.equal(expected);
    sinon.assert.calledOnceWithExactly(httpClient.request, {
      url: `${copyFactoryApiUrl}/users/current/configuration/strategies/ABCD`,
      method: 'GET',
      headers: {
        'auth-token': token
      },
      json: true,
    });
  });
  
  /**
     * @test {ConfigurationClient#getStrategy}
     */
  it('should not retrieve strategy from API with account token', async () => {
    copyFactoryClient = new ConfigurationClient(httpClient, 'token');
    try {
      await copyFactoryClient.getStrategy('ABCD');
    } catch (error) {
      error.message.should.equal(
        'You can not invoke getStrategy method, because you have connected with account access token. ' +
          'Please use API access token from https://app.metaapi.cloud/token page to invoke this method.'
      );
    }
  });

  /**
   * @test {ConfigurationClient#updateStrategy}
   */
  it('should update strategy via API', async () => {
    const strategy = {
      name: 'Test strategy',
      accountId: 'e8867baa-5ec2-45ae-9930-4d5cea18d0d6',
      maxTradeRisk: 0.1,
      stopOutRisk: {
        value: 0.4,
        startTime: '2020-08-24T00:00:00.000Z'
      },
      riskLimits: [{
        type: 'monthly',
        applyTo: 'balance',
        maxRisk: 0.5,
        closePositions: false,
        startTime: '2020-08-24T00:00:01.000Z'
      }],
      timeSettings: {
        lifetimeInHours: 192,
        openingIntervalInMinutes: 5
      }
    };
    await copyFactoryClient.updateStrategy('ABCD', strategy);
    sinon.assert.calledOnceWithExactly(httpClient.request, {
      url: `${copyFactoryApiUrl}/users/current/configuration/strategies/ABCD`,
      method: 'PUT',
      headers: {
        'auth-token': token
      },
      json: true,
      body: strategy});
  });

  /**
   * @test {ConfigurationClient#updateStrategy}
   */
  it('should not update strategy via API with account token', async () => {
    copyFactoryClient = new ConfigurationClient(httpClient, 'token');
    try {
      await copyFactoryClient.updateStrategy('ABCD', {});
    } catch (error) {
      error.message.should.equal(
        'You can not invoke updateStrategy method, because you have connected with account access token. ' +
        'Please use API access token from https://app.metaapi.cloud/token page to invoke this method.'
      );
    }
  });

  /**
   * @test {ConfigurationClient#removeStrategy}
   */
  it('should remove strategy via API', async () => {
    const payload = {mode: 'preserve', removeAfter: '2020-08-24T00:00:00.000Z'};
    await copyFactoryClient.removeStrategy('ABCD', payload);
    sinon.assert.calledOnceWithExactly(httpClient.request, {
      url: `${copyFactoryApiUrl}/users/current/configuration/strategies/ABCD`,
      method: 'DELETE',
      headers: {
        'auth-token': token
      },
      body: payload,
      json: true,
    });
  });

  /**
   * @test {ConfigurationClient#removeStrategy}
   */
  it('should not remove strategy from via with account token', async () => {
    copyFactoryClient = new ConfigurationClient(httpClient, 'token');
    try {
      await copyFactoryClient.removeStrategy('ABCD');
    } catch (error) {
      error.message.should.equal(
        'You can not invoke removeStrategy method, because you have connected with account access token. ' +
        'Please use API access token from https://app.metaapi.cloud/token page to invoke this method.'
      );
    }
  });

  /**
   * @test {ConfigurationClient#getPortfolioStrategies}
   */
  it('should retrieve portfolio strategies from API', async () => {
    let expected = [{
      _id: 'ABCD',
      providerId: 'providerId',
      platformCommissionRate: 0.01,
      name: 'Test strategy',
      members: [
        {
          strategyId: 'BCDE'
        }
      ],
      maxTradeRisk: 0.1,
      stopOutRisk: {
        value: 0.4,
        startTime: '2020-08-24T00:00:00.000Z'
      }
    }];
    requestStub.resolves(expected);
    let strategies = await copyFactoryClient.getPortfolioStrategies();
    strategies.should.equal(expected);
    sinon.assert.calledOnceWithExactly(httpClient.request, {
      url: `${copyFactoryApiUrl}/users/current/configuration/portfolio-strategies`,
      method: 'GET',
      headers: {
        'auth-token': token
      },
      json: true,
    });
  });

  /**
   * @test {ConfigurationClient#getPortfolioStrategies}
   */
  it('should not retrieve portfolio strategies from API with account token', async () => {
    copyFactoryClient = new ConfigurationClient(httpClient, 'token');
    try {
      await copyFactoryClient.getPortfolioStrategies();
    } catch (error) {
      error.message.should.equal(
        'You can not invoke getPortfolioStrategies method, because you have connected with account access token. ' +
        'Please use API access token from https://app.metaapi.cloud/token page to invoke this method.'
      );
    }
  });

  /**
   * @test {ConfigurationClient#getPortfolioStrategy}
   */
  it('should retrieve portfolio strategy from API', async () => {
    let expected = {
      _id: 'ABCD',
      providerId: 'providerId',
      platformCommissionRate: 0.01,
      name: 'Test strategy',
      members: [
        {
          strategyId: 'BCDE'
        }
      ],
      maxTradeRisk: 0.1,
      stopOutRisk: {
        value: 0.4,
        startTime: '2020-08-24T00:00:00.000Z'
      }
    };
    requestStub.resolves(expected);
    let strategies = await copyFactoryClient.getPortfolioStrategy('ABCD');
    strategies.should.equal(expected);
    sinon.assert.calledOnceWithExactly(httpClient.request, {
      url: `${copyFactoryApiUrl}/users/current/configuration/portfolio-strategies/ABCD`,
      method: 'GET',
      headers: {
        'auth-token': token
      },
      json: true,
    });
  });

  /**
   * @test {ConfigurationClient#getPortfolioStrategy}
   */
  it('should not retrieve portfolio strategy from API with account token', async () => {
    copyFactoryClient = new ConfigurationClient(httpClient, 'token');
    try {
      await copyFactoryClient.getPortfolioStrategy('ABCD');
    } catch (error) {
      error.message.should.equal(
        'You can not invoke getPortfolioStrategy method, because you have connected with account access token. ' +
        'Please use API access token from https://app.metaapi.cloud/token page to invoke this method.'
      );
    }
  });

  /**
   * @test {ConfigurationClient#updatePortfolioStrategy}
   */
  it('should update portfolio strategy via API', async () => {
    const strategy = {
      name: 'Test strategy',
      members: [
        {
          strategyId: 'BCDE'
        }
      ],
      maxTradeRisk: 0.1,
      stopOutRisk: {
        value: 0.4,
        startTime: '2020-08-24T00:00:00.000Z'
      }
    };
    await copyFactoryClient.updatePortfolioStrategy('ABCD', strategy);
    sinon.assert.calledOnceWithExactly(httpClient.request, {
      url: `${copyFactoryApiUrl}/users/current/configuration/portfolio-strategies/ABCD`,
      method: 'PUT',
      headers: {
        'auth-token': token
      },
      json: true,
      body: strategy
    });
  });

  /**
   * @test {ConfigurationClient#updatePortfolioStrategy}
   */
  it('should not update portfolio strategy via API with account token', async () => {
    copyFactoryClient = new ConfigurationClient(httpClient, 'token');
    try {
      await copyFactoryClient.updatePortfolioStrategy('ABCD', {});
    } catch (error) {
      error.message.should.equal(
        'You can not invoke updatePortfolioStrategy method, because you have connected with account access token. ' +
        'Please use API access token from https://app.metaapi.cloud/token page to invoke this method.'
      );
    }
  });

  /**
   * @test {ConfigurationClient#removePortfolioStrategy}
   */
  it('should remove portfolio strategy via API', async () => {
    const payload = {mode: 'preserve', removeAfter: '2020-08-24T00:00:00.000Z'};
    await copyFactoryClient.removePortfolioStrategy('ABCD', payload);
    sinon.assert.calledOnceWithExactly(httpClient.request, {
      url: `${copyFactoryApiUrl}/users/current/configuration/portfolio-strategies/ABCD`,
      method: 'DELETE',
      headers: {
        'auth-token': token
      },
      body: payload,
      json: true,
    });
  });

  /**
   * @test {ConfigurationClient#removePortfolioStrategy}
   */
  it('should not remove portfolio strategy from via with account token', async () => {
    copyFactoryClient = new ConfigurationClient(httpClient, 'token');
    try {
      await copyFactoryClient.removePortfolioStrategy('ABCD');
    } catch (error) {
      error.message.should.equal(
        'You can not invoke removePortfolioStrategy method, because you have connected with account access token. ' +
        'Please use API access token from https://app.metaapi.cloud/token page to invoke this method.'
      );
    }
  });

  /**
   * @test {TradingClient#getSubscribers}
   */
  it('should retrieve CopyFactory subscribers from API', async () => {
    let expected = [{
      _id: 'e8867baa-5ec2-45ae-9930-4d5cea18d0d6',
      name: 'Demo account',
      reservedMarginFraction: 0.25,
      subscriptions: [
        {
          strategyId: 'ABCD',
          multiplier: 1
        }
      ]
    }];
    requestStub.resolves(expected);
    let accounts = await copyFactoryClient.getSubscribers();
    accounts.should.equal(expected);
    sinon.assert.calledOnceWithExactly(httpClient.request, {
      url: `${copyFactoryApiUrl}/users/current/configuration/subscribers`,
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
    copyFactoryClient = new ConfigurationClient(httpClient, 'token');
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
   * @test {TradingClient#getSubscriber}
   */
  it('should retrieve CopyFactory subscriber from API', async () => {
    let expected = {
      _id: 'e8867baa-5ec2-45ae-9930-4d5cea18d0d6',
      name: 'Demo account',
      reservedMarginFraction: 0.25,
      subscriptions: [
        {
          strategyId: 'ABCD',
          multiplier: 1
        }
      ]
    };
    requestStub.resolves(expected);
    let accounts = await copyFactoryClient
      .getSubscriber('e8867baa-5ec2-45ae-9930-4d5cea18d0d6');
    accounts.should.equal(expected);
    sinon.assert.calledOnceWithExactly(httpClient.request, {
      url: `${copyFactoryApiUrl}/users/current/configuration/subscribers/` +
        'e8867baa-5ec2-45ae-9930-4d5cea18d0d6',
      method: 'GET',
      headers: {
        'auth-token': token
      },
      json: true,
    });
  });

  /**
   * @test {TradingClient#getSubscriber}
   */
  it('should not retrieve CopyFactory subscriber from API with account token', async () => {
    copyFactoryClient = new ConfigurationClient(httpClient, 'token');
    try {
      await copyFactoryClient.getSubscriber('test');
    } catch (error) {
      error.message.should.equal(
        'You can not invoke getSubscriber method, because you have connected with account access token. ' +
            'Please use API access token from https://app.metaapi.cloud/token page to invoke this method.'
      );
    }
  });

  /**
   * @test {TradingClient#updateSubscriber}
   */
  it('should update CopyFactory subscriber via API', async () => {
    let subscriber = {
      name: 'Demo account',
      reservedMarginFraction: 0.25,
      subscriptions: [
        {
          strategyId: 'ABCD',
          multiplier: 1
        }
      ]
    };
    await copyFactoryClient
      .updateSubscriber('e8867baa-5ec2-45ae-9930-4d5cea18d0d6', subscriber);
    sinon.assert.calledOnceWithExactly(httpClient.request, {
      url: `${copyFactoryApiUrl}/users/current/configuration/subscribers/` +
        'e8867baa-5ec2-45ae-9930-4d5cea18d0d6',
      method: 'PUT',
      headers: {
        'auth-token': token
      },
      body: subscriber,
      json: true,
    });
  });

  /**
   * @test {TradingClient#updateSubscriber}
   */
  it('should not update CopyFactory subscriber via API with account token', async () => {
    copyFactoryClient = new ConfigurationClient(httpClient, 'token');
    try {
      await copyFactoryClient.updateSubscriber('test', {});
    } catch (error) {
      error.message.should.equal(
        'You can not invoke updateSubscriber method, because you have connected with account access token. ' +
            'Please use API access token from https://app.metaapi.cloud/token page to invoke this method.'
      );
    }
  });

  /**
   * @test {TradingClient#removeSubscriber}
   */
  it('should remove CopyFactory subscriber via API', async () => {
    const payload = {mode: 'preserve', removeAfter: '2020-08-24T00:00:00.000Z'};
    await copyFactoryClient
      .removeSubscriber('e8867baa-5ec2-45ae-9930-4d5cea18d0d6', payload);
    sinon.assert.calledOnceWithExactly(httpClient.request, {
      url: `${copyFactoryApiUrl}/users/current/configuration/subscribers/` +
        'e8867baa-5ec2-45ae-9930-4d5cea18d0d6',
      method: 'DELETE',
      headers: {
        'auth-token': token
      },
      body: payload,
      json: true,
    });
  });
  
  /**
   * @test {TradingClient#removeSubscriber}
   */
  it('should not remove CopyFactory subscriber via API with account token', async () => {
    copyFactoryClient = new ConfigurationClient(httpClient, 'token');
    try {
      await copyFactoryClient.removeSubscriber('test');
    } catch (error) {
      error.message.should.equal(
        'You can not invoke removeSubscriber method, because you have connected with account access token. ' +
              'Please use API access token from https://app.metaapi.cloud/token page to invoke this method.'
      );
    }
  });

  /**
   * @test {TradingClient#removeSubscription}
   */
  it('should remove CopyFactory subscription via API', async () => {
    const payload = {mode: 'preserve', removeAfter: '2020-08-24T00:00:00.000Z'};
    await copyFactoryClient
      .removeSubscription('e8867baa-5ec2-45ae-9930-4d5cea18d0d6', 'ABCD', payload);
    sinon.assert.calledOnceWithExactly(httpClient.request, {
      url: `${copyFactoryApiUrl}/users/current/configuration/subscribers/` +
          'e8867baa-5ec2-45ae-9930-4d5cea18d0d6/subscriptions/ABCD',
      method: 'DELETE',
      headers: {
        'auth-token': token
      },
      body: payload,
      json: true,
    });
  });
    
  /**
   * @test {TradingClient#removeSubscription}
   */
  it('should not remove CopyFactory subscription via API with account token', async () => {
    copyFactoryClient = new ConfigurationClient(httpClient, 'token');
    try {
      await copyFactoryClient.removeSubscription('test', 'ABCD');
    } catch (error) {
      error.message.should.equal(
        'You can not invoke removeSubscription method, because you have connected with account access token. ' +
          'Please use API access token from https://app.metaapi.cloud/token page to invoke this method.'
      );
    }
  });

});
