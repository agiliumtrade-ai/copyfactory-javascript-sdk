'use strict';

import HttpClient from '../../httpClient';
import sinon from 'sinon';
import DomainClient from '../../domain.client';
import TransactionListener from './userLogListener';
import TransactionListenerManager from './transactionListenerManager';
import {NotFoundError} from '../../errorHandler';

/**
 * @test {TransactionListenerManager}
 */
describe('TransactionListenerManager', () => {

  const token = 'header.payload.sign';
  let httpClient = new HttpClient();
  let domainClient;
  let sandbox;
  let clock;
  let transactionListenerManager;
  let getTransactionsStub, listener, callStub;

  let expected = [{
    id: '64664661:close',
    type: 'DEAL_TYPE_SELL',
    time: new Date('2020-08-08T08:57:30.328Z'),
  },
  {
    id: '64664660:close',
    type: 'DEAL_TYPE_SELL',
    time: new Date('2020-08-08T07:57:30.328Z'),
  }];

  let expected2 = [{
    id: '64664663:close',
    type: 'DEAL_TYPE_SELL',
    time: new Date('2020-08-08T10:57:30.328Z'),
  },
  {
    id: '64664662:close',
    type: 'DEAL_TYPE_SELL',
    time: new Date('2020-08-08T09:57:30.328Z'),
  }];

  before(() => {
    sandbox = sinon.createSandbox();
  });

  beforeEach(() => {
    clock = sandbox.useFakeTimers({shouldAdvanceTime: true});
    domainClient = new DomainClient(httpClient, token);
    transactionListenerManager = new TransactionListenerManager(domainClient);
    getTransactionsStub = sandbox.stub(domainClient, 'requestCopyFactory');
    callStub = sinon.stub();

    class Listener extends TransactionListener {

      async onTransaction(transactionEvent) {
        console.log('EVENT', transactionEvent);
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
      getTransactionsStub
        .callsFake(async (opts) => {
          await new Promise(res => setTimeout(res, 1000));
          return [];
        })
        .withArgs({
          url: '/users/current/strategies/ABCD/transactions/stream',
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
          url: '/users/current/strategies/ABCD/transactions/stream',
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
     * @test {TransactionListenerManager#addStrategyTransactionListener}
     */
    it('should add listener', async () => {
      const id = transactionListenerManager.addStrategyTransactionListener(listener, 'ABCD',
        new Date('2020-08-08T00:00:00.000Z'));
      await clock.tickAsync(2200);
      sinon.assert.calledWith(callStub, expected);
      sinon.assert.calledWith(callStub, expected2);
      transactionListenerManager.removeStrategyTransactionListener(id);
    });
  
    /**
     * @test {TransactionListenerManager#addStrategyTransactionListener}
     */
    it('should remove listener', async () => {
      const id = transactionListenerManager.addStrategyTransactionListener(listener, 'ABCD',
        new Date('2020-08-08T00:00:00.000Z'));
      await clock.tickAsync(800);
      transactionListenerManager.removeStrategyTransactionListener(id);
      await clock.tickAsync(2200);
      sinon.assert.calledWith(callStub, expected);
      sinon.assert.callCount(callStub, 1);
    });
  
    /**
     * @test {TransactionListenerManager#addStrategyTransactionListener}
     */
    it('should wait if error returned', async () => {
      getTransactionsStub
        .callsFake(async (opts) => {
          await new Promise(res => setTimeout(res, 500));
          return [];
        })
        .withArgs({
          url: '/users/current/strategies/ABCD/transactions/stream',
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
      const id = transactionListenerManager.addStrategyTransactionListener(listener, 'ABCD',
        new Date('2020-08-08T00:00:00.000Z'));
      await clock.tickAsync(600);
      sinon.assert.callCount(getTransactionsStub, 1);
      sinon.assert.notCalled(callStub);
      await clock.tickAsync(600);
      sinon.assert.callCount(getTransactionsStub, 2);
      sinon.assert.notCalled(callStub);
      await clock.tickAsync(2000);
      sinon.assert.callCount(getTransactionsStub, 3);
      sinon.assert.notCalled(callStub);
      await clock.tickAsync(800);
      sinon.assert.calledWith(callStub, expected);
      transactionListenerManager.removeStrategyTransactionListener(id);
    });

    /**
     * @test {TransactionListenerManager#addStrategyTransactionListener}
     */
    it('should remove listener on not found error', async () => {
      getTransactionsStub
        .withArgs({
          url: '/users/current/strategies/ABCD/transactions/stream',
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
      transactionListenerManager.addStrategyTransactionListener(listener, 'ABCD',
        new Date('2020-08-08T00:00:00.000Z'));
      await clock.tickAsync(100);
      sinon.assert.callCount(getTransactionsStub, 1);
      await clock.tickAsync(1000);
      sinon.assert.callCount(getTransactionsStub, 2);
      sinon.assert.callCount(callStub, 1);
      await clock.tickAsync(1000);
      sinon.assert.callCount(getTransactionsStub, 2);
      sinon.assert.callCount(callStub, 1);
      await clock.tickAsync(1100);
      sinon.assert.callCount(callStub, 1);
    });
    
  });

  describe('Subscriber transactions', () => {

    beforeEach(() => {
      getTransactionsStub
        .callsFake(async (opts) => {
          await new Promise(res => setTimeout(res, 1000));
          return [];
        })
        .withArgs({
          url: '/users/current/subscribers/accountId/transactions/stream',
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
          url: '/users/current/subscribers/accountId/transactions/stream',
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
     * @test {TransactionListenerManager#addSubscriberTransactionListener}
     */
    it('should add listener', async () => {
      const id = transactionListenerManager.addSubscriberTransactionListener(listener, 'accountId',
        new Date('2020-08-08T00:00:00.000Z'));
      await clock.tickAsync(2200);
      sinon.assert.calledWith(callStub, expected);
      sinon.assert.calledWith(callStub, expected2);
      transactionListenerManager.removeSubscriberTransactionListener(id);
    });
  
    /**
     * @test {TransactionListenerManager#addSubscriberTransactionListener}
     */
    it('should remove listener', async () => {
      const id = transactionListenerManager.addSubscriberTransactionListener(listener, 'accountId',
        new Date('2020-08-08T00:00:00.000Z'));
      await clock.tickAsync(800);
      transactionListenerManager.removeSubscriberTransactionListener(id);
      await clock.tickAsync(2200);
      sinon.assert.calledWith(callStub, expected);
      sinon.assert.callCount(callStub, 1);
    });
  
    /**
     * @test {TransactionListenerManager#addSubscriberTransactionListener}
     */
    it('should wait if error returned', async () => {
      getTransactionsStub
        .callsFake(async (opts) => {
          await new Promise(res => setTimeout(res, 500));
          return [];
        })
        .withArgs({
          url: '/users/current/subscribers/accountId/transactions/stream',
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
      const id = transactionListenerManager.addSubscriberTransactionListener(listener, 'accountId',
        new Date('2020-08-08T00:00:00.000Z'));
      await clock.tickAsync(600);
      sinon.assert.callCount(getTransactionsStub, 1);
      sinon.assert.notCalled(callStub);
      await clock.tickAsync(600);
      sinon.assert.callCount(getTransactionsStub, 2);
      sinon.assert.notCalled(callStub);
      await clock.tickAsync(2000);
      sinon.assert.callCount(getTransactionsStub, 3);
      sinon.assert.notCalled(callStub);
      await clock.tickAsync(800);
      sinon.assert.calledWith(callStub, expected);
      transactionListenerManager.removeSubscriberTransactionListener(id);
    });

    /**
     * @test {TransactionListenerManager#addSubscriberTransactionListener}
     */
    it('should remove listener on not found error', async () => {
      getTransactionsStub
        .withArgs({
          url: '/users/current/subscribers/accountId/transactions/stream',
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
      transactionListenerManager.addSubscriberTransactionListener(listener, 'accountId',
        new Date('2020-08-08T00:00:00.000Z'));
      await clock.tickAsync(100);
      sinon.assert.callCount(getTransactionsStub, 1);
      await clock.tickAsync(1000);
      sinon.assert.callCount(getTransactionsStub, 2);
      sinon.assert.callCount(callStub, 1);
      await clock.tickAsync(1000);
      sinon.assert.callCount(getTransactionsStub, 2);
      sinon.assert.callCount(callStub, 1);
      await clock.tickAsync(1100);
      sinon.assert.callCount(callStub, 1);
    });
    
  });

});
