'use strict';

import HttpClient from '../../httpClient';
import sinon from 'sinon';
import DomainClient from '../../domain.client';
import StopoutListener from './stopoutListener';
import StopoutListenerManager from './stopoutListenerManager';

/**
 * @test {StopoutListenerManager}
 */
describe('StopoutListenerManager', () => {

  const token = 'header.payload.sign';
  let httpClient = new HttpClient();
  let domainClient;
  let sandbox;
  let clock;
  let stopoutListenerManager;
  let getStopoutStub, listener, callStub, errorStub;

  let expected = [{
    subscriberId: 'accountId',
    reason: 'monthly-balance',
    stoppedAt: new Date('2020-08-08T07:57:30.328Z'),
    strategy: {
      id: 'ABCD',
      name: 'Strategy'
    },
    reasonDescription: 'total strategy equity drawdown exceeded limit',
    sequenceNumber: 2
  },
  {
    subscriberId: 'accountId',
    reason: 'monthly-balance',
    stoppedAt: new Date('2020-08-08T07:57:31.328Z'),
    strategy: {
      id: 'ABCD',
      name: 'Strategy'
    },
    reasonDescription: 'total strategy equity drawdown exceeded limit',
    sequenceNumber: 3
  }];

  let expected2 = [{
    subscriberId: 'accountId',
    reason: 'monthly-balance',
    stoppedAt: new Date('2020-08-08T07:57:32.328Z'),
    strategy: {
      id: 'ABCD',
      name: 'Strategy'
    },
    reasonDescription: 'total strategy equity drawdown exceeded limit',
    sequenceNumber: 4
  },
  {
    subscriberId: 'accountId',
    reason: 'monthly-balance',
    stoppedAt: new Date('2020-08-08T07:57:33.328Z'),
    strategy: {
      id: 'ABCD',
      name: 'Strategy'
    },
    reasonDescription: 'total strategy equity drawdown exceeded limit',
    sequenceNumber: 5
  }];


  before(() => {
    sandbox = sinon.createSandbox();
  });

  beforeEach(() => {
    clock = sandbox.useFakeTimers({shouldAdvanceTime: true});
    domainClient = new DomainClient(httpClient, token);
    stopoutListenerManager = new StopoutListenerManager(domainClient);
    getStopoutStub = sandbox.stub(domainClient, 'requestCopyFactory');
    getStopoutStub
      .callsFake(async (opts) => {
        await new Promise(res => setTimeout(res, 1000));
        return [];
      })
      .withArgs({
        url: '/users/current/stopouts/stream',
        method: 'GET',
        qs: {
          previousSequenceNumber: 1,
          subscriberId: 'accountId',
          strategyId: 'ABCD',
          limit: 1000
        },
        headers: {
          'auth-token': token
        },
        json: true
      }).callsFake(async (opts) => {
        await new Promise(res => setTimeout(res, 1000));
        return expected;
      })
      .withArgs({
        url: '/users/current/stopouts/stream',
        method: 'GET',
        qs: {
          previousSequenceNumber: 3,
          subscriberId: 'accountId',
          strategyId: 'ABCD',
          limit: 1000
        },
        headers: {
          'auth-token': token
        },
        json: true
      }).callsFake(async (opts) => {
        await new Promise(res => setTimeout(res, 1000));
        return expected2;
      });

    callStub = sinon.stub();
    errorStub = sinon.stub();

    class Listener extends StopoutListener {

      async onStopout(strategyStopoutEvent) {
        callStub(strategyStopoutEvent);
      }

      async onError(error) {
        errorStub(error);
      }

    }

    listener = new Listener();
  });

  afterEach(() => {
    sandbox.restore();
    clock.restore();
  });

  /**
   * @test {StopoutListenerManager#addStopoutListener}
   */
  it('should add stopout listener', async () => {
    const id = stopoutListenerManager.addStopoutListener(listener, 'accountId', 'ABCD', 1);
    await clock.tickAsync(2200);
    sinon.assert.calledWith(callStub, expected);
    sinon.assert.calledWith(callStub, expected2);
    stopoutListenerManager.removeStopoutListener(id);
  });

  /**
   * @test {StopoutListenerManager#addStopoutListener}
   */
  it('should remove stopout listener', async () => {
    const id = stopoutListenerManager.addStopoutListener(listener, 'accountId', 'ABCD', 1);
    await clock.tickAsync(800);
    stopoutListenerManager.removeStopoutListener(id);
    await clock.tickAsync(2200);
    sinon.assert.calledWith(callStub, expected);
    sinon.assert.callCount(callStub, 1);
  });

  /**
   * @test {StopoutListenerManager#addStopoutListener}
   */
  it('should wait if error returned', async () => {
    const error = new Error('test');
    const error2 = new Error('test');
    getStopoutStub
      .callsFake(async (opts) => {
        await new Promise(res => setTimeout(res, 500));
        return [];
      })
      .withArgs({
        url: '/users/current/stopouts/stream',
        method: 'GET',
        qs: {
          previousSequenceNumber: 1,
          subscriberId: 'accountId',
          strategyId: 'ABCD',
          limit: 1000
        },
        headers: {
          'auth-token': token
        },
        json: true
      }).callsFake(async (opts) => {
        await new Promise(res => setTimeout(res, 500));
        return expected;
      })
      .onFirstCall().rejects(error)
      .onSecondCall().rejects(error2);
    const id = stopoutListenerManager.addStopoutListener(listener, 'accountId', 'ABCD', 1);
    await clock.tickAsync(600);
    sinon.assert.callCount(getStopoutStub, 1);
    sinon.assert.notCalled(callStub);
    sinon.assert.calledOnce(errorStub);
    sinon.assert.calledWith(errorStub, error);
    await clock.tickAsync(600);
    sinon.assert.callCount(getStopoutStub, 2);
    sinon.assert.notCalled(callStub);
    sinon.assert.calledTwice(errorStub);
    sinon.assert.calledWith(errorStub, error2);
    await clock.tickAsync(2000);
    sinon.assert.callCount(getStopoutStub, 3);
    sinon.assert.notCalled(callStub);
    await clock.tickAsync(800);
    sinon.assert.calledWith(callStub, expected);
    stopoutListenerManager.removeStopoutListener(id);
  });

});
