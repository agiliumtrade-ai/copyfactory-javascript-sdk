4.0.2
  - fixed esdoc

4.0.1
  - fix broken release

4.0.0
  - breaking change: updated exported typescript types

3.3.1
  - updated typescript types

3.3.0
  - added removePortfolioStrategyMember method
  - added closeOnRemovalMode to strategy, portfolio strategy and portfolio strategy member

3.2.2
  - fixed export declared types in typings

3.2.1
  - added typings for public classes and objects

3.2.0
  - added includeRemoved and pagination to getStrategies, getPortfolioStrategies, getSubscribers

3.1.4
  - added removeAfter field to closeInstructions

3.1.3
  - removed positionLifecycle property

3.1.2
  - updated docs

3.1.1
  - added subscriber profit field to trading signal model

3.1.0
  - fixed remove subscriber
  - added remove subscription method

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