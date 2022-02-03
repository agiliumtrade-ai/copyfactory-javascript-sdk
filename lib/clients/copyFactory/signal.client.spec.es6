'use strict';

import sinon from 'sinon';
import SignalClient from './signal.client';
 
/**
  * @test {SignalClient}
  */
describe('SignalClient', () => {
 
  let signalClient;
  const token = 'header.payload.sign';
  let domainClient;
  let host = {
    host: 'https://copyfactory-api-v1',
    region: 'vint-hill',
    domain: 'agiliumtrade.ai'
  };
  let sandbox;
  let requestStub;
 
  before(() => {
    sandbox = sinon.createSandbox();
  });
 
  beforeEach(() => {
    domainClient = {
      token: token,
      requestSignal: () => {}
    };
    signalClient = new SignalClient('accountId', host, domainClient);
    requestStub = sandbox.stub(domainClient, 'requestSignal');
  });
 
  afterEach(() => {
    sandbox.restore();
  });
 
  /**
    * @test {SignalClient#generateSignalId}
    */
  it('should generate signal id', async () => {
    signalClient.generateSignalId().length.should.equal(8);
  });
 
  /**
    * @test {SignalClient#updateExternalSignal}
    */
  it('should update external signal', async () => {
    const signal = {
      symbol: 'EURUSD',
      type: 'POSITION_TYPE_BUY',
      time: '2020-08-24T00:00:00.000Z',
      updateTime: '2020-08-24T00:00:00.000Z',
      volume: 1
    };
    await signalClient.updateExternalSignal('ABCD', '0123456', signal);
    sinon.assert.calledOnceWithExactly(domainClient.requestSignal, {
      url: '/users/current/strategies/ABCD/external-signals/0123456',
      method: 'PUT',
      headers: {
        'auth-token': token
      },
      json: true,
      body: signal}, host, 'accountId');
  });
 
  /**
    * @test {SignalClient#removeExternalSignal}
    */
  it('should remove external signal', async () => {
    const signal = {
      time: '2020-08-24T00:00:00.000Z',
    };
    await signalClient.removeExternalSignal('ABCD', '0123456', signal);
    sinon.assert.calledOnceWithExactly(domainClient.requestSignal, {
      url: '/users/current/strategies/ABCD/external-signals/0123456/remove',
      method: 'POST',
      headers: {
        'auth-token': token
      },
      json: true,
      body: signal}, host, 'accountId');
  });
 
  /**
    * @test {SignalClient#getTradingSignals}
    */
  it('should retrieve signals', async () => {
    const expected = [{
      symbol: 'EURUSD',
      type: 'POSITION_TYPE_BUY',
      time: '2020-08-24T00:00:00.000Z',
      closeAfter: '2020-08-24T00:00:00.000Z',
      volume: 1
    }];
    requestStub.resolves(expected);
    let stopouts = await signalClient.getTradingSignals();
    stopouts.should.equal(expected);
    sinon.assert.calledOnceWithExactly(domainClient.requestSignal, {
      url: '/users/current/subscribers/accountId/signals',
      method: 'GET',
      headers: {
        'auth-token': token
      },
      json: true,
    }, host, 'accountId');
  });
 
});
 