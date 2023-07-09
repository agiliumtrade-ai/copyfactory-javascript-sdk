'use strict';

import HttpClient from '../../httpClient';
import sinon from 'sinon';
import DomainClient from '../../domain.client';
import UserLogListener from './userLogListener';
import UserLogListenerManager from './userLogListenerManager';
import {NotFoundError} from '../../errorHandler';

/**
 * @test {UserLogListenerManager}
 */
describe('UserLogListenerManager', () => {

  const token = 'header.payload.sign';
  let httpClient = new HttpClient();
  let domainClient;
  let sandbox;
  let clock;
  let userLogListenerManager;
  let getUserLogStub, listener, callStub, errorStub;

  let expected = [{
    time: new Date('2020-08-08T08:57:30.328Z'),
    level: 'INFO',
    message: 'message1'
  },
  {
    time: new Date('2020-08-08T07:57:30.328Z'),
    level: 'INFO',
    message: 'message0'
  }];

  let expected2 = [{
    time: new Date('2020-08-08T10:57:30.328Z'),
    level: 'INFO',
    message: 'message3'
  },
  {
    time: new Date('2020-08-08T09:57:30.328Z'),
    level: 'INFO',
    message: 'message2'
  }];

  before(() => {
    sandbox = sinon.createSandbox();
  });

  beforeEach(() => {
    clock = sandbox.useFakeTimers({shouldAdvanceTime: true});
    domainClient = new DomainClient(httpClient, token);
    userLogListenerManager = new UserLogListenerManager(domainClient);
    getUserLogStub = sandbox.stub(domainClient, 'requestCopyFactory');
    callStub = sinon.stub();
    errorStub = sinon.stub();

    class Listener extends UserLogListener {

      async onUserLog(transactionEvent) {
        callStub(transactionEvent);
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

  describe('Strategy transactions', () => {

    beforeEach(() => {
      getUserLogStub
        .callsFake(async (opts) => {
          await new Promise(res => setTimeout(res, 1000));
          return [];
        })
        .withArgs({
          url: '/users/current/strategies/ABCD/user-log/stream',
          method: 'GET',
          params: {
            startTime: new Date('2020-08-08T00:00:00.000Z'),
            limit: undefined,
            positionId: undefined,
            level: undefined,
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
          url: '/users/current/strategies/ABCD/user-log/stream',
          method: 'GET',
          params: {
            startTime: new Date('2020-08-08T08:57:30.329Z'),
            limit: undefined,
            positionId: undefined,
            level: undefined,
          },
          headers: {
            'auth-token': token
          },
          json: true
        }).callsFake(async (opts) => {
          await new Promise(res => setTimeout(res, 1000));
          return expected2;
        });
    });

    /**
     * @test {UserLogListenerManager#addStrategyLogListener}
     */
    it('should add listener', async () => {
      const id = userLogListenerManager.addStrategyLogListener(listener, 'ABCD', new Date('2020-08-08T00:00:00.000Z'));
      await clock.tickAsync(2200);
      sinon.assert.calledWith(callStub, expected);
      sinon.assert.calledWith(callStub, expected2);
      userLogListenerManager.removeStrategyLogListener(id);
    });
  
    /**
     * @test {UserLogListenerManager#addStrategyLogListener}
     */
    it('should remove listener', async () => {
      const id = userLogListenerManager.addStrategyLogListener(listener, 'ABCD', new Date('2020-08-08T00:00:00.000Z'));
      await clock.tickAsync(1100);
      userLogListenerManager.removeStrategyLogListener(id);
      await clock.tickAsync(2200);
      sinon.assert.calledWith(callStub, expected);
      sinon.assert.callCount(callStub, 1);
    });
  
    /**
     * @test {UserLogListenerManager#addStrategyLogListener}
     */
    it('should wait if error returned', async () => {
      const error = new Error('test');
      const error2 = new Error('test');
      getUserLogStub
        .callsFake(async (opts) => {
          await new Promise(res => setTimeout(res, 500));
          return [];
        })
        .withArgs({
          url: '/users/current/strategies/ABCD/user-log/stream',
          method: 'GET',
          params: {
            startTime: new Date('2020-08-08T00:00:00.000Z'),
            limit: undefined,
            positionId: undefined,
            level: undefined,
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
      const id = userLogListenerManager.addStrategyLogListener(listener, 'ABCD', new Date('2020-08-08T00:00:00.000Z'));
      await clock.tickAsync(600);
      sinon.assert.callCount(getUserLogStub, 1);
      sinon.assert.notCalled(callStub);
      sinon.assert.calledOnce(errorStub);
      sinon.assert.calledWith(errorStub, error);
      await clock.tickAsync(600);
      sinon.assert.callCount(getUserLogStub, 2);
      sinon.assert.notCalled(callStub);
      sinon.assert.calledTwice(errorStub);
      sinon.assert.calledWith(errorStub, error2);
      await clock.tickAsync(2000);
      sinon.assert.callCount(getUserLogStub, 3);
      sinon.assert.notCalled(callStub);
      await clock.tickAsync(800);
      sinon.assert.calledWith(callStub, expected);
      userLogListenerManager.removeStrategyLogListener(id);
    });

    /**
     * @test {UserLogListenerManager#addStrategyLogListener}
     */
    it('should remove listener on not found error', async () => {
      const error = new NotFoundError('test');
      getUserLogStub
        .withArgs({
          url: '/users/current/strategies/ABCD/user-log/stream',
          method: 'GET',
          params: {
            startTime: new Date('2020-08-08T08:57:30.329Z'),
            limit: undefined,
            positionId: undefined,
            level: undefined,
          },
          headers: {
            'auth-token': token
          },
          json: true
        }).callsFake(async (opts) => {
          await new Promise(res => setTimeout(res, 1000));
          throw error;
        });
      userLogListenerManager.addStrategyLogListener(listener, 'ABCD',
        new Date('2020-08-08T00:00:00.000Z'));
      await clock.tickAsync(100);
      sinon.assert.callCount(getUserLogStub, 1);
      await clock.tickAsync(1000);
      sinon.assert.callCount(getUserLogStub, 2);
      sinon.assert.callCount(callStub, 1);
      await clock.tickAsync(1000);
      sinon.assert.callCount(getUserLogStub, 2);
      sinon.assert.callCount(callStub, 1);
      await clock.tickAsync(1100);
      sinon.assert.callCount(callStub, 1);
      sinon.assert.calledOnce(errorStub);
      sinon.assert.calledWith(errorStub, error);
    });
    
  });

  describe('Subscriber transactions', () => {

    beforeEach(() => {
      getUserLogStub
        .callsFake(async (opts) => {
          await new Promise(res => setTimeout(res, 1000));
          return [];
        })
        .withArgs({
          url: '/users/current/subscribers/accountId/user-log/stream',
          method: 'GET',
          params: {
            startTime: new Date('2020-08-08T00:00:00.000Z'),
            strategyId: undefined,
            positionId: undefined,
            level: undefined,
            limit: undefined
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
          url: '/users/current/subscribers/accountId/user-log/stream',
          method: 'GET',
          params: {
            startTime: new Date('2020-08-08T08:57:30.329Z'),
            strategyId: undefined,
            positionId: undefined,
            level: undefined,
            limit: undefined
          },
          headers: {
            'auth-token': token
          },
          json: true
        }).callsFake(async (opts) => {
          await new Promise(res => setTimeout(res, 1000));
          return expected2;
        });
    });

    /**
     * @test {UserLogListenerManager#addSubscriberLogListener}
     */
    it('should add listener', async () => {
      const id = userLogListenerManager.addSubscriberLogListener(listener, 'accountId',
        new Date('2020-08-08T00:00:00.000Z'));
      await clock.tickAsync(2200);
      sinon.assert.calledWith(callStub, expected);
      sinon.assert.calledWith(callStub, expected2);
      userLogListenerManager.removeSubscriberLogListener(id);
    });
  
    /**
     * @test {UserLogListenerManager#addSubscriberLogListener}
     */
    it('should remove stopout listener', async () => {
      const id = userLogListenerManager.addSubscriberLogListener(listener, 'accountId',
        new Date('2020-08-08T00:00:00.000Z'));
      await clock.tickAsync(1100);
      userLogListenerManager.removeSubscriberLogListener(id);
      await clock.tickAsync(2200);
      sinon.assert.calledWith(callStub, expected);
      sinon.assert.callCount(callStub, 1);
    });
  
    /**
     * @test {UserLogListenerManager#addSubscriberLogListener}
     */
    it('should wait if error returned', async () => {
      const error = new Error('test');
      const error2 = new Error('test');
      getUserLogStub
        .callsFake(async (opts) => {
          await new Promise(res => setTimeout(res, 500));
          return [];
        })
        .withArgs({
          url: '/users/current/subscribers/accountId/user-log/stream',
          method: 'GET',
          params: {
            startTime: new Date('2020-08-08T00:00:00.000Z'),
            strategyId: undefined,
            positionId: undefined,
            level: undefined,
            limit: undefined
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
      const id = userLogListenerManager.addSubscriberLogListener(listener, 'accountId',
        new Date('2020-08-08T00:00:00.000Z'));
      await clock.tickAsync(600);
      sinon.assert.callCount(getUserLogStub, 1);
      sinon.assert.notCalled(callStub);
      sinon.assert.calledOnce(errorStub);
      sinon.assert.calledWith(errorStub, error);
      await clock.tickAsync(600);
      sinon.assert.callCount(getUserLogStub, 2);
      sinon.assert.notCalled(callStub);
      sinon.assert.calledTwice(errorStub);
      sinon.assert.calledWith(errorStub, error2);
      await clock.tickAsync(2000);
      sinon.assert.callCount(getUserLogStub, 3);
      sinon.assert.notCalled(callStub);
      await clock.tickAsync(800);
      sinon.assert.calledWith(callStub, expected);
      userLogListenerManager.removeSubscriberLogListener(id);
    });

    /**
     * @test {UserLogListenerManager#addSubscriberLogListener}
     */
    it('should remove listener on not found error', async () => {
      const error = new NotFoundError('test');
      getUserLogStub
        .withArgs({
          url: '/users/current/subscribers/accountId/user-log/stream',
          method: 'GET',
          params: {
            startTime: new Date('2020-08-08T08:57:30.329Z'),
            strategyId: undefined,
            positionId: undefined,
            level: undefined,
            limit: undefined
          },
          headers: {
            'auth-token': token
          },
          json: true
        }).callsFake(async (opts) => {
          await new Promise(res => setTimeout(res, 1000));
          throw error;
        });
      userLogListenerManager.addSubscriberLogListener(listener, 'accountId',
        new Date('2020-08-08T00:00:00.000Z'));
      await clock.tickAsync(100);
      sinon.assert.callCount(getUserLogStub, 1);
      await clock.tickAsync(1000);
      sinon.assert.callCount(getUserLogStub, 2);
      sinon.assert.callCount(callStub, 1);
      await clock.tickAsync(1000);
      sinon.assert.callCount(getUserLogStub, 2);
      sinon.assert.callCount(callStub, 1);
      await clock.tickAsync(1100);
      sinon.assert.callCount(callStub, 1);
      sinon.assert.calledOnce(errorStub);
      sinon.assert.calledWith(errorStub, error);
    });
    
  });

});
