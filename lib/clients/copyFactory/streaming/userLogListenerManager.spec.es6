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
  let getUserLogStub, listener, callStub;

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

    class Listener extends UserLogListener {

      async onUserLog(transactionEvent) {
        callStub(transactionEvent);
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
          qs: {
            startTime: new Date('2020-08-08T00:00:00.000Z'),
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
          url: '/users/current/strategies/ABCD/user-log/stream',
          method: 'GET',
          qs: {
            startTime: new Date('2020-08-08T08:57:30.329Z'),
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
      await clock.tickAsync(800);
      userLogListenerManager.removeStrategyLogListener(id);
      await clock.tickAsync(2200);
      sinon.assert.calledWith(callStub, expected);
      sinon.assert.callCount(callStub, 1);
    });
  
    /**
     * @test {UserLogListenerManager#addStrategyLogListener}
     */
    it('should wait if error returned', async () => {
      getUserLogStub
        .callsFake(async (opts) => {
          await new Promise(res => setTimeout(res, 500));
          return [];
        })
        .withArgs({
          url: '/users/current/strategies/ABCD/user-log/stream',
          method: 'GET',
          qs: {
            startTime: new Date('2020-08-08T00:00:00.000Z'),
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
        .onFirstCall().rejects(new Error('test'))
        .onSecondCall().rejects(new Error('test'));
      const id = userLogListenerManager.addStrategyLogListener(listener, 'ABCD', new Date('2020-08-08T00:00:00.000Z'));
      await clock.tickAsync(600);
      sinon.assert.callCount(getUserLogStub, 1);
      sinon.assert.notCalled(callStub);
      await clock.tickAsync(600);
      sinon.assert.callCount(getUserLogStub, 2);
      sinon.assert.notCalled(callStub);
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
      getUserLogStub
        .withArgs({
          url: '/users/current/strategies/ABCD/user-log/stream',
          method: 'GET',
          qs: {
            startTime: new Date('2020-08-08T08:57:30.329Z'),
            limit: 1000
          },
          headers: {
            'auth-token': token
          },
          json: true
        }).callsFake(async (opts) => {
          await new Promise(res => setTimeout(res, 1000));
          throw new NotFoundError('test');
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
          qs: {
            startTime: new Date('2020-08-08T00:00:00.000Z'),
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
          url: '/users/current/subscribers/accountId/user-log/stream',
          method: 'GET',
          qs: {
            startTime: new Date('2020-08-08T08:57:30.329Z'),
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
      await clock.tickAsync(800);
      userLogListenerManager.removeSubscriberLogListener(id);
      await clock.tickAsync(2200);
      sinon.assert.calledWith(callStub, expected);
      sinon.assert.callCount(callStub, 1);
    });
  
    /**
     * @test {UserLogListenerManager#addSubscriberLogListener}
     */
    it('should wait if error returned', async () => {
      getUserLogStub
        .callsFake(async (opts) => {
          await new Promise(res => setTimeout(res, 500));
          return [];
        })
        .withArgs({
          url: '/users/current/subscribers/accountId/user-log/stream',
          method: 'GET',
          qs: {
            startTime: new Date('2020-08-08T00:00:00.000Z'),
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
        .onFirstCall().rejects(new Error('test'))
        .onSecondCall().rejects(new Error('test'));
      const id = userLogListenerManager.addSubscriberLogListener(listener, 'accountId',
        new Date('2020-08-08T00:00:00.000Z'));
      await clock.tickAsync(600);
      sinon.assert.callCount(getUserLogStub, 1);
      sinon.assert.notCalled(callStub);
      await clock.tickAsync(600);
      sinon.assert.callCount(getUserLogStub, 2);
      sinon.assert.notCalled(callStub);
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
      getUserLogStub
        .withArgs({
          url: '/users/current/subscribers/accountId/user-log/stream',
          method: 'GET',
          qs: {
            startTime: new Date('2020-08-08T08:57:30.329Z'),
            limit: 1000
          },
          headers: {
            'auth-token': token
          },
          json: true
        }).callsFake(async (opts) => {
          await new Promise(res => setTimeout(res, 1000));
          throw new NotFoundError('test');
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
    });
    
  });

});
