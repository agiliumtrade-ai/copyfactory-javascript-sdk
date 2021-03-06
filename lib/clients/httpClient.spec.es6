'use strict';

import should from 'should';
import assert from 'assert';
import sinon  from 'sinon';
import HttpClient, {HttpClientMock} from './httpClient';
import {ValidationError, ApiError} from './errorHandler';
import TimeoutError from './timeoutError';

/**
 * @test {HttpClient}
 */
describe('HttpClient', () => {

  let httpClient;

  beforeEach(() => {
    httpClient = new HttpClient();
  });

  /**
   * @test {HttpClient#request}
   */
  it('should load HTML page from example.com', (done) => {
    let opts = {
      url: 'http://example.com'
    };
    httpClient.request(opts)
      .then((body) => {
        body.should.match(/doctype html/);
      })
      .then(done, done);
  }).timeout(10000);

  /**
   * @test {HttpClient#request}
   */
  it('should return NotFound error if server returns 404', (done) => {
    let opts = {
      url: 'http://example.com/not-found'
    };
    httpClient.request(opts)
      .catch((err) => {
        err.name.should.eql('NotFoundError');
      })
      .then(done, done);
  }).timeout(10000);

  /**
   * @test {HttpClient#request}
   */
  it('should return timeout error if request is timed out', (done) => {
    httpClient = new HttpClient(0.0001, {retries: 2});
    let opts = {
      url: 'http://metaapi.cloud'
    };
    httpClient.request(opts)
      .catch((err) => {
        err.name.should.eql('ApiError');
        err.message.should.eql('ETIMEDOUT');
      })
      .then(done, done);
  }).timeout(10000);
  
  describe('Retry request', () => {

    let sandbox, callStub;
    let opts = {url: 'http://metaapi.cloud'};

    before(() => {
      sandbox = sinon.createSandbox();
    });

    beforeEach(() => {
      callStub = sandbox.stub();
    });

    afterEach(() => {
      sandbox.restore();
    });

    /**
     * @test {HttpClient#request}
     */
    it('should retry request on fail', (done) => {
      let stub = callStub.onFirstCall().rejects(new ApiError(TimeoutError, 'test'))
        .onSecondCall().rejects(new ApiError(TimeoutError, 'test'))
        .onThirdCall().resolves('response');
      httpClient = new HttpClientMock(stub);
      httpClient.request(opts)
        .then((body) => {
          body.should.match('response');
        })
        .then(done, done);
    }).timeout(10000);

    /**
     * @test {HttpClient#request}
     */
    it('should return error if retry limit exceeded', (done) => {
      let stub = callStub.rejects(new ApiError(TimeoutError, 'test'));
      httpClient = new HttpClientMock(stub, 60, {retries: 2});
      httpClient.request(opts)
        .catch((err) => {
          err.name.should.eql('ApiError');
          err.message.should.eql('test');
        })
        .then(done, done);
    }).timeout(10000);

    /**
     * @test {HttpClient#request}
     */
    it('should not retry if error not specified', (done) => {
      let stub = callStub.onFirstCall().rejects(new ValidationError('test'))
        .onSecondCall().rejects(new ValidationError('test'))
        .onThirdCall().resolves('response');
      httpClient = new HttpClientMock(stub);
      httpClient.request(opts)
        .catch((err) => {
          err.name.should.eql('ValidationError');
          err.message.should.eql('test');
        })
        .then(done, done);
    }).timeout(10000);

  });

});
