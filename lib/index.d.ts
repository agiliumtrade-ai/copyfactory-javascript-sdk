import CopyFactory from "./copyFactory";
import MetaApiClient from './clients/metaApi.client';
import ConfigurationClient from "./clients/copyFactory/configuration.client";
import HistoryClient from "./clients/copyFactory/history.client";
import TradingClient from "./clients/copyFactory/trading.client";
import HttpClient from "./clients/httpClient";
import MethodAccessError from "./clients/methodAccessError";
import TimeoutError from "./clients/timeoutError";
import StopoutListener from './clients/copyFactory/stopoutListener';

export default CopyFactory;
export * from './clients/copyFactory/configuration.client';
export * from './clients/copyFactory/history.client';
export * from './clients/copyFactory/trading.client';
export * from './clients/errorHandler';
export * from './clients/httpClient';


export {
  CopyFactory, 
  MetaApiClient, 
  ConfigurationClient, 
  HistoryClient,
  TradingClient,
  HttpClient,
  MethodAccessError, 
  TimeoutError,
  StopoutListener
};
