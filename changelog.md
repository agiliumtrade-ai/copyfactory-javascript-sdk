3.0.3
  - fixed remove subscriber

3.0.2
  - updated remove REST API
  - updated StrategyStopout schema

3.0.1
  - fixed transaction REST API

3.0.0
  - breaking change: migrated to CopyFactory 2

2.2.0
  - added drawdown filter
  - changed reduceCorrelations filter allowed values

2.1.0
  - added settings to disable SL and/or TP copying
  - added settings to specify max and min trade volume
  - added settings to configure trade size scaling

2.0.0
  - breaking change: added option to filter transactions by account id in history API and altered API parameter list as a result
  - handle TooManyRequestsError in HTTP client

1.1.1
  - Added API to retrieve account / strategy / portfolio strategy by id

1.0.0
  - CopyFactory SDK is not a separate repository/module, migrated from metaapi.cloud javascript SDK