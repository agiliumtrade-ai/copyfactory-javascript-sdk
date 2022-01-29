'use strict';

import HttpClient from './httpClient';
import sinon from 'sinon';
import DomainClient from './domain.client';
import { ValidationError, InternalError } from './errorHandler';

/**
 * @test {DomainClient}
 */
describe('DomainClient', () => {

  let domainClient;
  const token = 'header.payload.sign';
  let httpClient = new HttpClient();
  let sandbox;
  let requestStub;
  let getRegionsStub;
  let getHostStub;
  let clock;
  const expected = [{_id: 'ABCD'}];

  before(() => {
    sandbox = sinon.createSandbox();
  });

  beforeEach(() => {
    domainClient = new DomainClient(httpClient, token);
    clock = sandbox.useFakeTimers({shouldAdvanceTime: true});
    requestStub = sandbox.stub(httpClient, 'request');
    requestStub.withArgs({
      url: 'https://copyfactory-api-v1.vint-hill.agiliumtrade.agiliumtrade.ai/users/current/configuration/strategies',
      method: 'GET',
      headers: {
        'auth-token': token
      },
    }).resolves(expected);
    getRegionsStub = requestStub.withArgs({
      url: 'https://mt-provisioning-api-v1.agiliumtrade.agiliumtrade.ai/users/current/regions',
      method: 'GET',
      headers: {
        'auth-token': token
      },
      json: true,
    }).resolves(['vint-hill', 'us-west']);
    getHostStub = requestStub.withArgs({
      url: 'https://mt-provisioning-api-v1.agiliumtrade.agiliumtrade.ai/users/current/servers/mt-client-api',
      method: 'GET',
      headers: {
        'auth-token': token
      },
      json: true,
    }).resolves({domain: 'agiliumtrade.agiliumtrade.ai'});
  });

  afterEach(() => {
    sandbox.restore();
    clock.restore();
  });

  describe('requestCopyFactory', () => {

    const opts = {
      url: '/users/current/configuration/strategies',
      method: 'GET',
      headers: {
        'auth-token': token
      },
    };

    /**
     * @test {TradingClient#generateSignalId}
     */
    it('should execute request', async () => {
      const response = await domainClient.requestCopyFactory(opts);
      sinon.assert.match(response, expected);
      sinon.assert.calledWith(requestStub, {
        url: 'https://copyfactory-api-v1.vint-hill.agiliumtrade.agiliumtrade.ai/users/current/configuration/strategies',
        method: 'GET',
        headers: {
          'auth-token': token
        },
      });
    });

    it('should use cached url on repeated request', async () => {
      await domainClient.requestCopyFactory(opts);
      const response = await domainClient.requestCopyFactory(opts);
      sinon.assert.calledWith(requestStub, {
        url: 'https://copyfactory-api-v1.vint-hill.agiliumtrade.agiliumtrade.ai/users/current/configuration/strategies',
        method: 'GET',
        headers: {
          'auth-token': token
        },
      });
      sinon.assert.match(response, expected);
      sinon.assert.calledOnce(getHostStub);
      sinon.assert.calledOnce(getRegionsStub);
    });

    it('should request url again if expired', async () => {
      await domainClient.requestCopyFactory(opts);
      await clock.tickAsync(610000);
      const response = await domainClient.requestCopyFactory(opts);
      sinon.assert.match(response, expected);
      sinon.assert.calledWith(requestStub, {
        url: 'https://copyfactory-api-v1.vint-hill.agiliumtrade.agiliumtrade.ai/users/current/configuration/strategies',
        method: 'GET',
        headers: {
          'auth-token': token
        },
      });
      sinon.assert.calledTwice(getHostStub);
      sinon.assert.calledTwice(getRegionsStub);
    });

    it('should return request error', async () => {
      requestStub.withArgs({
        url: 'https://copyfactory-api-v1.vint-hill.agiliumtrade.agiliumtrade.ai/users/current/configuration/strategies',
        method: 'GET',
        headers: {
          'auth-token': token
        },
      }).throws(new ValidationError('test'));
      try {
        await domainClient.requestCopyFactory(opts);
        throw new Error('ValidationError expected');
      } catch (error) {
        error.name.should.equal('ValidationError');
      }
    });

    it('should return error if failed to get host', async () => {
      getHostStub.throws(new ValidationError('test'));
      try {
        await domainClient.requestCopyFactory(opts);
        throw new Error('ValidationError expected');
      } catch (error) {
        error.name.should.equal('ValidationError');
      }
    });

    describe('regions', () => {

      it('should return error if failed to get regions', async () => {
        getRegionsStub.throws(new ValidationError('test'));
        try {
          await domainClient.requestCopyFactory(opts);
          throw new Error('ValidationError expected');
        } catch (error) {
          error.name.should.equal('ValidationError');
        }
      });

      it('should try another region if the first failed', async () => {
        requestStub.withArgs({
          url: 'https://copyfactory-api-v1.vint-hill.agiliumtrade.agiliumtrade.ai/users/' +
          'current/configuration/strategies',
          method: 'GET',
          headers: {
            'auth-token': token
          },
        }).rejects(new InternalError('test'));
        requestStub.withArgs({
          url: 'https://copyfactory-api-v1.us-west.agiliumtrade.agiliumtrade.ai/users/current/configuration/strategies',
          method: 'GET',
          headers: {
            'auth-token': token
          },
        }).resolves(expected);
        const response = await domainClient.requestCopyFactory(opts);
        sinon.assert.calledWith(requestStub, {
          url: 'https://copyfactory-api-v1.us-west.agiliumtrade.agiliumtrade.ai/users/current/configuration/strategies',
          method: 'GET',
          headers: {
            'auth-token': token
          },
        });
        sinon.assert.match(response, expected);

        sinon.assert.calledOnce(getHostStub);
        sinon.assert.calledOnce(getRegionsStub);
      });

      it('should return error if all regions failed', async () => {
        requestStub.withArgs({
          url: 'https://copyfactory-api-v1.vint-hill.agiliumtrade.agiliumtrade.ai/users/' + 
          'current/configuration/strategies',
          method: 'GET',
          headers: {
            'auth-token': token
          },
        }).throws(new InternalError('test'));
        requestStub.withArgs({
          url: 'https://copyfactory-api-v1.us-west.agiliumtrade.agiliumtrade.ai/users/current/configuration/strategies',
          method: 'GET',
          headers: {
            'auth-token': token
          },
        }).throws(new InternalError('test'));

        try {
          await domainClient.requestCopyFactory(opts);
          throw new Error('InternalError expected');
        } catch (error) {
          error.name.should.equal('InternalError');
        }
      });

    });

  });

  describe('request', () => {

    it('should execute request', async () => {
      const opts = {
        url:  'https://mt-provisioning-api-v1.agiliumtrade.agiliumtrade.ai/users/current/accounts/accountId',
        method: 'GET',
        headers: {
          'auth-token': token
        },
        json: true
      };

      requestStub.withArgs(opts).resolves(expected);
      const response = await domainClient.request(opts);
      sinon.assert.match(response, expected);
      sinon.assert.calledWith(requestStub, opts);
    });

  });

  describe('requestSignal', () => {

    const signalOpts = {
      url: '/users/current/subscribers/accountId/signals',
      method: 'GET',
      json: true
    };

    const expectedSignals = [{
      strategy: { id: '1234', name: 'Test strategy' },
      positionId: '123456',
      time: '2021-11-19T18:56:32.590Z',
      symbol: 'GBPUSD',
      type: 'limit',
      side: 'buy',
    }];

    const host = {
      host: 'https://copyfactory-api-v1',
      region: 'vint-hill',
      domain: 'agiliumtrade.ai'
    };

    beforeEach(async () => {
      requestStub.withArgs({
        url: 'https://copyfactory-api-v1.vint-hill.agiliumtrade.ai/users/current/subscribers/accountId/signals',
        method: 'GET',
        json: true,
        headers: {
          'auth-token': token
        },
      }).resolves(expectedSignals);
      await domainClient.getSignalClientHost('vint-hill');
    });

    it('should execute a request', async () => {
      const response = await domainClient.requestSignal(signalOpts, host);
      sinon.assert.match(response, expectedSignals);
      sinon.assert.calledWith(requestStub, {
        url: 'https://copyfactory-api-v1.vint-hill.agiliumtrade.ai/users/current/subscribers/accountId/signals',
        method: 'GET',
        json: true,
        headers: {
          'auth-token': token
        },
      });
    });

    it('should return an error on request', async () => {
      requestStub.withArgs({
        url: 'https://copyfactory-api-v1.vint-hill.agiliumtrade.ai/users/current/subscribers/accountId/signals',
        method: 'GET',
        json: true,
        headers: {
          'auth-token': token
        },
      }).throws(new ValidationError('test'));
      try {
        await domainClient.requestSignal(signalOpts, host);
        throw new Error('ValidationError expected');
      } catch (error) {
        error.name.should.equal('ValidationError');
      }
    });

    it('should try another region on timeout', async () => {
      requestStub.withArgs({
        url: 'https://copyfactory-api-v1.vint-hill.agiliumtrade.ai/users/current/subscribers/accountId/signals',
        method: 'GET',
        json: true,
        headers: {
          'auth-token': token
        },
      }).rejects(new InternalError('test'));
      requestStub.withArgs({
        url: 'https://copyfactory-api-v1.us-west.agiliumtrade.ai/users/current/subscribers/accountId/signals',
        method: 'GET',
        json: true,
        headers: {
          'auth-token': token
        },
      }).resolves(expectedSignals);
      const response = await domainClient.requestSignal(signalOpts, host);
      sinon.assert.calledWith(requestStub, {
        url: 'https://copyfactory-api-v1.us-west.agiliumtrade.ai/users/current/subscribers/accountId/signals',
        method: 'GET',
        json: true,
        headers: {
          'auth-token': token
        },
      });
      sinon.assert.match(response, expectedSignals);
    });

    it('should return an error if all regions failed', async () => {
      requestStub.withArgs({
        url: 'https://copyfactory-api-v1.vint-hill.agiliumtrade.ai/users/current/subscribers/accountId/signals',
        method: 'GET',
        json: true,
        headers: {
          'auth-token': token
        },
      }).rejects(new InternalError('test'));
      requestStub.withArgs({
        url: 'https://copyfactory-api-v1.us-west.agiliumtrade.ai/users/current/subscribers/accountId/signals',
        method: 'GET',
        json: true,
        headers: {
          'auth-token': token
        },
      }).rejects(new InternalError('test'));

      try {
        await domainClient.requestSignal(signalOpts, host);
        throw new Error('InternalError expected');
      } catch (error) {
        error.name.should.equal('InternalError');
      }
      sinon.assert.calledWith(requestStub, {
        url: 'https://copyfactory-api-v1.us-west.agiliumtrade.ai/users/current/subscribers/accountId/signals',
        method: 'GET',
        json: true,
        headers: {
          'auth-token': token
        },
      });
    });

  });

  describe('getSignalClientHost', () => {

    it('should return signal client host', async () => {
      const response = await domainClient.getSignalClientHost('vint-hill');
      sinon.assert.match(response, { 
        host: 'https://copyfactory-api-v1',
        region: 'vint-hill',
        domain: 'agiliumtrade.agiliumtrade.ai' 
      });
    });

  });

});
