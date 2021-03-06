# CopyFactory SDK for javascript (a member of metaapi.cloud project)

CopyFactory is a powerful trade copying API which makes developing forex trade copying applications as easy as writing few lines of code.

CopyFactory API is a member of MetaApi project ([https://metaapi.cloud](https://metaapi.cloud)), a powerful cloud forex trading API which supports both MetaTrader 4 and MetaTrader 5 platforms.

MetaApi is a paid service, however API access to one MetaTrader account is free of charge.

The [MetaApi pricing](https://metaapi.cloud/#pricing) was developed with the intent to make your charges less or equal to what you would have to pay
for hosting your own infrastructure. This is possible because over time we managed to heavily optimize
our MetaTrader infrastructure. And with MetaApi you can save significantly on application development and
maintenance costs and time thanks to high-quality API, open-source SDKs and convenience of a cloud service.

## Why do we offer CopyFactory API

We found that developing reliable and flexible trade copier is a task
which requires lots of effort, because developers have to solve a series
of complex technical tasks to create a product.

We decided to share our product as it allows developers to start with a
powerful solution in almost no time, saving on development and
infrastructure maintenance costs.

## Frequently asked questions (FAQ)
FAQ is located here: [http://metaapi.cloud/docs/copyfactory/faq](http://metaapi.cloud/docs/copyfactory/faq)

## CopyFactory features

Features supported:

- low latency trade copying
- reliable trade copying
- suitable for large-scale deployments
- suitable for large number of subscribers
- connect arbitrary number of strategy providers and subscribers
- subscribe accounts to multiple strategies at once
- select arbitrary copy ratio for each subscription
- configure symbol mapping between strategy providers and subscribers
- apply advanced risk filters on strategy provider side
- override risk filters on subscriber side
- provide multiple strategies from a single account based on magic or symbol filters
- supports manual trading on subscriber accounts while copying trades
- synchronize subscriber account with strategy providers
- monitor trading history
- calculate trade copying commissions for account managers
- support portfolio strategies as trading signal source, i.e. the strategies which include signals of several other strategies (also known as combos on some platforms)

Please note that trade copying to MT5 netting accounts is not supported in the current API version

## REST API documentation
CopyFactory SDK is built on top of CopyFactory REST API.

CopyFactory REST API docs are available at [https://metaapi.cloud/docs/copyfactory/](https://metaapi.cloud/docs/copyfactory/)

## Code examples
We published some code examples in our github repository, namely:

- Javascript: [https://github.com/agiliumtrade-ai/copyfactory-javascript-sdk/tree/master/examples](https://github.com/agiliumtrade-ai/copyfactory-javascript-sdk/tree/master/examples)

## Installation
```bash
npm install --save metaapi.cloud-copyfacory-sdk
```

## Installing SDK in browser SPA applications
```bash
npm install --save metaapi.cloud-copyfactory-sdk
```

## Installing SDK in browser HTML applications
```html
<script src="unpkg.com/metaapi.cloud-copyfactory-sdk/index.js"></script>
<script>
    const token = '...';
    const api = new CopyFactory(token);
</script>
```

## Retrieving API token
Please visit [https://app.metaapi.cloud/token](https://app.metaapi.cloud/token) web UI to obtain your API token.

## Configuring trade copying

In order to configure trade copying you need to:

- add MetaApi MetaTrader accounts with CopyFactory as application field value (see above)
- create CopyFactory master and slave accounts and connect them to MetaApi accounts via connectionId field
- create a strategy being copied
- subscribe slave CopyFactory accounts to the strategy

```javascript
import MetaApi from 'metaapi.cloud-sdk';
import CopyFactory from 'metaapi.cloud-copyfactory-sdk';

const token = '...';
const metaapi = new MetaApi(token);
const copyFactory = new CopyFactory(token);

// retrieve MetaApi MetaTrader accounts with CopyFactory as application field value
const masterMetaapiAccount = await metaapi.metatraderAccountApi.getAccount('masterMetaapiAccountId');
if (masterMetaapiAccount.application !== 'CopyFactory') {
  throw new Error('Please specify CopyFactory application field value in your MetaApi account in order to use it in CopyFactory API');
}
const slaveMetaapiAccount = await metaapi.metatraderAccountApi.getAccount('slaveMetaapiAccountId');
if (slaveMetaapiAccount.application !== 'CopyFactory') {
  throw new Error('Please specify CopyFactory application field value in your MetaApi account in order to use it in CopyFactory API');
}

// create CopyFactory master and slave accounts and connect them to MetaApi accounts via connectionId field
let configurationApi = copyFactory.configurationApi;
let masterAccountId = configurationApi.generateAccountId();
let slaveAccountId = configurationApi.generateAccountId();
await configurationApi.updateAccount(masterAccountId, {
  name: 'Demo account',
  connectionId: masterMetaapiAccount.id,
  subscriptions: []
});

// create a strategy being copied
let strategyId = await configurationApi.generateStrategyId();
await configurationApi.updateStrategy(strategyId.id, {
  name: 'Test strategy',
  description: 'Some useful description about your strategy',
  positionLifecycle: 'hedging',
  connectionId: masterMetaapiAccount.id,
  maxTradeRisk: 0.1,
  stopOutRisk: {
    value: 0.4,
    startTime: new Date('2020-08-24T00:00:00.000Z')
  },
  timeSettings: {
    lifetimeInHours: 192,
    openingIntervalInMinutes: 5
  }
});

// subscribe slave CopyFactory accounts to the strategy
await configurationApi.updateAccount(slaveAccountId, {
  name: 'Demo account',
  connectionId: slaveMetaapiAccount.id,
  subscriptions: [
    {
      strategyId.id,
      multiplier: 1
    }
  ]
});
```

See esdoc in-code documentation for full definition of possible configuration options.

## Retrieving trade copying history

CopyFactory allows you to monitor transactions conducted on trading accounts in real time.

### Retrieving trading history on provider side
```javascript
let historyApi = copyFactory.historyApi;

// retrieve list of subscribers
console.log(await historyApi.getSubscribers());

// retrieve list of strategies provided
console.log(await historyApi.getProvidedStrategies());

// retrieve trading history, please note that this method support pagination and limits number of records
console.log(await historyApi.getProvidedStrategiesTransactions(new Date('2020-08-01'), new Date('2020-09-01')));
```

### Retrieving trading history on subscriber side
```javascript
let historyApi = copyFactory.historyApi;

// retrieve list of providers
console.log(await historyApi.getProviders());

// retrieve list of strategies subscribed to
console.log(await historyApi.getStrategiesSubscribed());

// retrieve trading history, please note that this method support pagination and limits number of records
console.log(await historyApi.getStrategiesSubscribedTransactions(new Date('2020-08-01'), new Date('2020-09-01')));
```

## Resynchronizing slave accounts to masters
There is a configurable time limit during which the trades can be opened. Sometimes trades can not open in time due to broker errors or trading session time discrepancy.
You can resynchronize a slave account to place such late trades. Please note that positions which were
closed manually on a slave account will also be reopened during resynchronization.

```javascript
let accountId = '...'; // CopyFactory account id

// resynchronize all strategies
await copyFactory.tradingApi.resynchronize(accountId);

// resynchronize specific strategy
await copyFactory.tradingApi.resynchronize(accountId, ['ABCD']);
```

## Managing stopouts
A subscription to a strategy can be stopped if the strategy have exceeded allowed risk limit.
```javascript
let tradingApi = copyFactory.tradingApi;
let accountId = '...'; // CopyFactory account id
let strategyId = '...'; // CopyFactory strategy id

// retrieve list of strategy stopouts
console.log(await tradingApi.getStopouts(accountId));

// reset a stopout so that subscription can continue
await tradingApi.resetStopout(accountId, strategyId, 'daily-equity');
```

## Retrieving slave trading logs
```javascript
let tradingApi = copyFactory.tradingApi;
let accountId = '...'; // CopyFactory account id

// retrieve slave trading log
console.log(await tradingApi.getUserLog(accountId));

// retrieve paginated slave trading log by time range
console.log(await tradingApi.getUserLog(accountId, new Date(Date.now() - 24 * 60 * 60 * 1000), undefined, 20, 10));
```

## Related projects:
See our website for the full list of APIs and features supported [https://metaapi.cloud/#features](https://metaapi.cloud/#features)

Some of the APIs you might decide to use together with this module:

1. MetaApi cloud forex trading API [https://metaapi.cloud/docs/client/](https://metaapi.cloud/docs/client/)
2. MetaStats cloud forex trading statistics API [https://metaapi.cloud/docs/metastats/](https://metaapi.cloud/docs/metastats/)
