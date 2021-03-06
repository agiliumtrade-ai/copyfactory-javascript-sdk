'use strict';

import {HttpClientMock} from './httpClient';
import MetaApiClient from './metaApi.client';

const provisioningApiUrl = 'https://mt-provisioning-api-v1.agiliumtrade.agiliumtrade.ai';

/**
 * @test {MetaApiClient}
 */
describe('MetaApiClient', () => {

  let apiClient;
  let httpClient = new HttpClientMock(() => 'empty');

  beforeEach(() => {
    apiClient = new MetaApiClient(httpClient, 'token');
  });

  it('should return account token type', () => {
    apiClient._tokenType.should.equal('account');
  });

  it('should return api token type', () => {
    apiClient = new MetaApiClient(httpClient, 'header.payload.sign');
    apiClient._tokenType.should.equal('api');
  });

  it('should check that current token is not JWT', () => {
    apiClient._isNotJwtToken().should.equal(true);
  });

  it('should check that current token is not account token', () => {
    apiClient = new MetaApiClient(httpClient, 'header.payload.sign');
    apiClient._isNotAccountToken().should.equal(true);
  });

  it('should handle no access error with account token', async () => {
    try {
      await apiClient._handleNoAccessError('methodName');
    } catch (error) {
      error.message.should.equal(
        'You can not invoke methodName method, because you have connected with account access token. ' +
        'Please use API access token from https://app.metaapi.cloud/token page to invoke this method.'
      );
    }
  });

  it('should handle no access error with api token', async () => {
    apiClient = new MetaApiClient(httpClient, 'header.payload.sign');
    try {
      await apiClient._handleNoAccessError('methodName');
    } catch (error) {
      error.message.should.equal(
        'You can not invoke methodName method, because you have connected with API access token. ' +
        'Please use account access token to invoke this method.'
      );
    }
  });

});