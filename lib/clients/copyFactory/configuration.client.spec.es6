'use strict';

import should from 'should';
import sinon from 'sinon';
import HttpClient from '../httpClient';
import ConfigurationClient from './configuration.client';

const copyFactoryApiUrl = 'https://trading-api-v1.agiliumtrade.agiliumtrade.ai';

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
   * @test {MetatraderAccountClient#generateAccountId}
   */
  it('should generate account id', async () => {
    copyFactoryClient.generateAccountId().length.should.equal(64);
  });

  /**
   * @test {ConfigurationClient#updateAccount}
   */
  it('should update CopyFactory account via API', async () => {
    await copyFactoryClient.updateAccount('0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef', {
      name: 'Demo account',
      connectionId: 'e8867baa-5ec2-45ae-9930-4d5cea18d0d6',
      reservedMarginFraction: 0.25,
      subscriptions: [
        {
          strategyId: 'ABCD',
          multiplier: 1
        }
      ]
    });
    sinon.assert.calledOnceWithExactly(httpClient.request, {
      url: `${copyFactoryApiUrl}/users/current/configuration/accounts/` +
              '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
      method: 'PUT',
      headers: {
        'auth-token': token
      },
      json: true,
      body: {
        name: 'Demo account',
        connectionId: 'e8867baa-5ec2-45ae-9930-4d5cea18d0d6',
        reservedMarginFraction: 0.25,
        subscriptions: [
          {
            strategyId: 'ABCD',
            multiplier: 1
          }
        ]
      }
    });
  });

  /**
   * @test {ConfigurationClient#updateAccount}
   */
  it('should not update CopyFactory account via API with account token', async () => {
    copyFactoryClient = new ConfigurationClient(httpClient, 'token');
    try {
      await copyFactoryClient.updateAccount('id', {});
    } catch (error) {
      error.message.should.equal(
        'You can not invoke updateAccount method, because you have connected with account access token. ' +
        'Please use API access token from https://app.metaapi.cloud/token page to invoke this method.'
      );
    }
  });

  /**
   * @test {ConfigurationClient#getAccounts}
   */
  it('should retrieve CopyFactory accounts from API', async () => {
    let expected = [{
      _id: '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
      subscriberId: 'subscriberId',
      name: 'Demo account',
      connectionId: 'e8867baa-5ec2-45ae-9930-4d5cea18d0d6',
      reservedMarginFraction: 0.25,
      subscriptions: [
        {
          strategyId: 'ABCD',
          multiplier: 1
        }
      ]
    }];
    requestStub.resolves(expected);
    let accounts = await copyFactoryClient.getAccounts();
    accounts.should.equal(expected);
    sinon.assert.calledOnceWithExactly(httpClient.request, {
      url: `${copyFactoryApiUrl}/users/current/configuration/accounts`,
      method: 'GET',
      headers: {
        'auth-token': token
      },
      json: true,
    });
  });

  /**
   * @test {ConfigurationClient#getAccounts}
   */
  it('should not retrieve CopyFactory accounts from API with account token', async () => {
    copyFactoryClient = new ConfigurationClient(httpClient, 'token');
    try {
      await copyFactoryClient.getAccounts();
    } catch (error) {
      error.message.should.equal(
        'You can not invoke getAccounts method, because you have connected with account access token. ' +
        'Please use API access token from https://app.metaapi.cloud/token page to invoke this method.'
      );
    }
  });

  /**
   * @test {ConfigurationClient#getAccount}
   */
  it('should retrieve CopyFactory account from API', async () => {
    let expected = {
      _id: '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
      subscriberId: 'subscriberId',
      name: 'Demo account',
      connectionId: 'e8867baa-5ec2-45ae-9930-4d5cea18d0d6',
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
      .getAccount('0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef');
    accounts.should.equal(expected);
    sinon.assert.calledOnceWithExactly(httpClient.request, {
      url: `${copyFactoryApiUrl}/users/current/configuration/accounts/` +
              '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
      method: 'GET',
      headers: {
        'auth-token': token
      },
      json: true,
    });
  });

  /**
   * @test {ConfigurationClient#getAccount}
   */
  it('should not retrieve CopyFactory account from API with account token', async () => {
    copyFactoryClient = new ConfigurationClient(httpClient, 'token');
    try {
      await copyFactoryClient.getAccount('test');
    } catch (error) {
      error.message.should.equal(
        'You can not invoke getAccount method, because you have connected with account access token. ' +
        'Please use API access token from https://app.metaapi.cloud/token page to invoke this method.'
      );
    }
  });

  /**
   * @test {ConfigurationClient#removeAccount}
   */
  it('should remove CopyFactory account via API', async () => {
    await copyFactoryClient.removeAccount('0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef');
    sinon.assert.calledOnceWithExactly(httpClient.request, {
      url: `${copyFactoryApiUrl}/users/current/configuration/accounts/` +
              '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
      method: 'DELETE',
      headers: {
        'auth-token': token
      },
      json: true,
    });
  });

  /**
   * @test {ConfigurationClient#removeAccount}
   */
  it('should not remove CopyFactory account from via with account token', async () => {
    copyFactoryClient = new ConfigurationClient(httpClient, 'token');
    try {
      await copyFactoryClient.removeAccount('id');
    } catch (error) {
      error.message.should.equal(
        'You can not invoke removeAccount method, because you have connected with account access token. ' +
        'Please use API access token from https://app.metaapi.cloud/token page to invoke this method.'
      );
    }
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
   * @test {ConfigurationClient#updateStrategy}
   */
  it('should update strategy via API', async () => {
    await copyFactoryClient.updateStrategy('ABCD', {
      name: 'Test strategy',
      positionLifecycle: 'hedging',
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
    });
    sinon.assert.calledOnceWithExactly(httpClient.request, {
      url: `${copyFactoryApiUrl}/users/current/configuration/strategies/ABCD`,
      method: 'PUT',
      headers: {
        'auth-token': token
      },
      json: true,
      body: {
        name: 'Test strategy',
        positionLifecycle: 'hedging',
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
      }
    });
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
   * @test {ConfigurationClient#getStrategies}
   */
  it('should retrieve strategies from API', async () => {
    let expected = [{
      _id: 'ABCD',
      providerId: 'providerId',
      platformCommissionRate: 0.01,
      name: 'Test strategy',
      positionLifecycle: 'hedging',
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
      positionLifecycle: 'hedging',
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
   * @test {ConfigurationClient#removeStrategy}
   */
  it('should remove strategy via API', async () => {
    await copyFactoryClient.removeStrategy('ABCD');
    sinon.assert.calledOnceWithExactly(httpClient.request, {
      url: `${copyFactoryApiUrl}/users/current/configuration/strategies/ABCD`,
      method: 'DELETE',
      headers: {
        'auth-token': token
      },
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
    await copyFactoryClient.updatePortfolioStrategy('ABCD', {
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
    });
    sinon.assert.calledOnceWithExactly(httpClient.request, {
      url: `${copyFactoryApiUrl}/users/current/configuration/portfolio-strategies/ABCD`,
      method: 'PUT',
      headers: {
        'auth-token': token
      },
      json: true,
      body: {
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
      }
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
    await copyFactoryClient.removePortfolioStrategy('ABCD');
    sinon.assert.calledOnceWithExactly(httpClient.request, {
      url: `${copyFactoryApiUrl}/users/current/configuration/portfolio-strategies/ABCD`,
      method: 'DELETE',
      headers: {
        'auth-token': token
      },
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
   * @test {ConfigurationClient#getActiveResynchronizationTasks}
   */
  it('should retrieve active resynchronization tasks via API', async () => {
    let expected = [{
      _id: 'ABCD',
      type: 'CREATE_STRATEGY',
      createdAt: '2020-08-25T00:00:00.000Z',
      status: 'EXECUTING'
    }];
    requestStub.resolves(expected);
    let tasks = await copyFactoryClient.getActiveResynchronizationTasks('accountId');
    tasks.should.equal(expected);
    sinon.assert.calledOnceWithExactly(httpClient.request, {
      url: `${copyFactoryApiUrl}/users/current/configuration/connections/` 
              + 'accountId/active-resynchronization-tasks',
      method: 'GET',
      headers: {
        'auth-token': token
      },
      json: true,
    });
  });

  /**
   * @test {ConfigurationClient#getActiveResynchronizationTasks}
   */
  it('should not retrieve active resynchronization tasks from API with account token', async () => {
    copyFactoryClient = new ConfigurationClient(httpClient, 'token');
    try {
      await copyFactoryClient.getActiveResynchronizationTasks('accountId');
    } catch (error) {
      error.message.should.equal(
        'You can not invoke getActiveResynchronizationTasks method, because you have connected with account ' +
        'access token. Please use API access token from https://app.metaapi.cloud/token page to invoke this method.'
      );
    }
  });

  describe('ConfigurationClient.waitResynchronizationTasksCompleted', () => {

    /**
     * @test {ConfigurationClient#waitResynchronizationTasksCompleted}
     */
    it('should wait until active resynchronization tasks are completed', async () => {
      let activeTasks = [{
        _id: 'ABCD',
        type: 'CREATE_STRATEGY',
        createdAt: '2020-08-25T00:00:00.000Z',
        status: 'EXECUTING'
      }];
      requestStub
        .onFirstCall().resolves(activeTasks)
        .onSecondCall().resolves(activeTasks)
        .onThirdCall().resolves([]);

      await copyFactoryClient.waitResynchronizationTasksCompleted('accountId', 1, 50);
      sinon.assert.calledWith(httpClient.request, {
        url: `${copyFactoryApiUrl}/users/current/configuration/connections/`
          + 'accountId/active-resynchronization-tasks',
        method: 'GET',
        headers: {
          'auth-token': token
        },
        json: true
      });
      sinon.assert.calledThrice(httpClient.request);
    });

    /**
     * @test {ConfigurationClient#waitResynchronizationTasksCompleted}
     */
    it('should time out waiting for active resynchronization tasks are completed', async () => {
      let activeTasks = [{
        _id: 'ABCD',
        type: 'CREATE_STRATEGY',
        createdAt: '2020-08-25T00:00:00.000Z',
        status: 'EXECUTING'
      }];
      requestStub.resolves(activeTasks);
      try {
        await copyFactoryClient.waitResynchronizationTasksCompleted('accountId', 1, 50);
        throw new Error('TimeoutError is expected');
      } catch (err) {
        err.name.should.equal('TimeoutError');
      }
      sinon.assert.calledWith(httpClient.request, {
        url: `${copyFactoryApiUrl}/users/current/configuration/connections/`
          + 'accountId/active-resynchronization-tasks',
        method: 'GET',
        headers: {
          'auth-token': token
        },
        json: true
      });
    });

  });

});
