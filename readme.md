# CopyFactory trade copying API for javascript (a member of [metaapi.cloud](https://metaapi.cloud) project)

CopyFactory is a powerful copy trading API which makes developing forex trade copying applications as easy as writing few lines of code.

CopyFactory API is a member of MetaApi project ([https://metaapi.cloud](https://metaapi.cloud)), a powerful cloud forex trading API which supports both MetaTrader 4 and MetaTrader 5 platforms.

MetaApi is a paid service, however API access to one MetaTrader account is free of charge.

The [MetaApi pricing](https://metaapi.cloud/#pricing) was developed with the intent to make your charges less or equal to what you would have to pay
for hosting your own infrastructure. This is possible because over time we managed to heavily optimize
our MetaTrader infrastructure. And with MetaApi you can save significantly on application development and
maintenance costs and time thanks to high-quality API, open-source SDKs and convenience of a cloud service.

## Why do we offer CopyFactory trade copying API

We found that developing reliable and flexible trade copier is a task
which requires lots of effort, because developers have to solve a series
of complex technical tasks to create a product.

We decided to share our product as it allows developers to start with a
powerful solution in almost no time, saving on development and
infrastructure maintenance costs.
## Frequently asked questions (FAQ)
FAQ is located here: [http://metaapi.cloud/docs/copyfactory/faq](http://metaapi.cloud/docs/copyfactory/faq)

## CopyFactory copytradging API features

Features supported:

- low latency trade copying API
- reliable trade copying API
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

Please check Features section of the [https://metaapi.cloud/docs/copyfactory/](https://metaapi.cloud/docs/copyfactory/) documentation for detailed description of all settings you can make

## REST API documentation
CopyFactory SDK is built on top of CopyFactory REST API.

CopyFactory REST API docs are available at [https://metaapi.cloud/docs/copyfactory/](https://metaapi.cloud/docs/copyfactory/)

## FAQ
Please check this page for FAQ: [https://metaapi.cloud/docs/copyfactory/faq/](https://metaapi.cloud/docs/copyfactory/faq/).

## Code examples
We published some code examples in our github repository, namely:

- Javascript: [https://github.com/agiliumtrade-ai/copyfactory-javascript-sdk/tree/master/examples](https://github.com/agiliumtrade-ai/copyfactory-javascript-sdk/tree/master/examples)

## Installation
```bash
npm install --save metaapi.cloud-sdk
```

## Installing SDK in browser SPA applications
```bash
npm install --save metaapi.cloud-sdk
```

## Installing SDK in browser HTML applications
```html
<script src="unpkg.com/metaapi.cloud-sdk/index.js"></script>
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
import MetaApi, {CopyFactory} from 'metaapi.cloud-sdk';

const token = '...';
const metaapi = new MetaApi(token);
const copyFactory = new CopyFactory(token);

// retrieve MetaApi MetaTrader accounts with CopyFactory as application field value
// master account must have PROVIDER value in copyFactoryRoles
const masterMetaapiAccount = await api.metatraderAccountApi.getAccount('masterMetaapiAccountId');
if(!masterMetaapiAccount.copyFactoryRoles || !masterMetaapiAccount.copyFactoryRoles.includes('PROVIDER')) {
  throw new Error('Please specify PROVIDER copyFactoryRoles value in your MetaApi account in ' +
    'order to use it in CopyFactory API');
}
// slave account must have SUBSCRIBER value in copyFactoryRoles
const slaveMetaapiAccount = await api.metatraderAccountApi.getAccount('slaveMetaapiAccountId');
if(!slaveMetaapiAccount.copyFactoryRoles || !slaveMetaapiAccount.copyFactoryRoles.includes('SUBSCRIBER')) {
  throw new Error('Please specify SUBSCRIBER copyFactoryRoles value in your MetaApi account in ' +
    'order to use it in CopyFactory API');
}

let configurationApi = copyFactory.configurationApi;

// create a strategy being copied
let strategyId = await configurationApi.generateStrategyId();
await configurationApi.updateStrategy(strategyId.id, {
  name: 'Test strategy',
  description: 'Some useful description about your strategy',
  accountId: masterMetaapiAccount.id,
  maxTradeRisk: 0.1,
  timeSettings: {
    lifetimeInHours: 192,
    openingIntervalInMinutes: 5
  }
});

// subscribe slave CopyFactory accounts to the strategy
await configurationApi.updateSubscriber(slaveMetaapiAccount.id, {
  name: 'Demo account',
  subscriptions: [
    {
      strategyId: strategyId.id,
      multiplier: 1
    }
  ]
});

// retrieve list of strategies
console.log(await configurationApi.getStrategies())

// retrieve list of provider portfolios
console.log(await configurationApi.getPortfolioStrategies())

// retrieve list of subscribers
console.log(await configurationApi.getSubscribers())

```

See esdoc in-code documentation for full definition of possible configuration options.

## Retrieving trade copying history

CopyFactory allows you to monitor transactions conducted on trading accounts in real time.

### Retrieving trading history on provider side
```javascript
let historyApi = copyFactory.historyApi;

// retrieve trading history, please note that this method support pagination and limits number of records
console.log(await historyApi.getProvidedTransactions(new Date('2020-08-01'), new Date('2020-09-01')));
```

### Retrieving trading history on subscriber side
```javascript
let historyApi = copyFactory.historyApi;

// retrieve trading history, please note that this method support pagination and limits number of records
console.log(await historyApi.getSubscriptionTransactions(new Date('2020-08-01'), new Date('2020-09-01')));
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

## Sending external trading signals to a strategy
You can submit external trading signals to your trading strategy.

```javascript
const accountId = '...';
const tradingApi = copyFactory.tradingApi;
const signalId = '...';

// get signal client
const signalClient = await tradingApi.getSignalClient(accountId);

// add trading signal
await signalClient.updateExternalSignal(strategyId, signalId, {
  symbol: 'EURUSD',
  type: 'POSITION_TYPE_BUY',
  time: new Date(),
  volume: 0.01
});

// remove signal
await signalClient.removeExternalSignal(strategyId, signalId, {
  time: new Date()
});
```

## Retrieving trading signals

```javascript
const accountId = '...';
const signalClient = await tradingApi.getSignalClient(accountId);

// retrieve trading signals
console.log(await signalClient.getTradingSignals());
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

## Managing stopout listeners
You can subscribe to a stream of stopout events using the stopout listener.
```javascript
import {StopoutListener} from 'metaapi.cloud-sdk';

let tradingApi = copyFactory.tradingApi;

// create a custom class based on the StopoutListener
class Listener extends StopoutListener {

  // specify the function called on event arrival
  async onStopout(strategyStopoutEvent) {
    console.log('Strategy stopout event', strategyStopoutEvent);
  }

}

// add listener
const listener = new Listener();
const listenerId = tradingApi.addStopoutListener(listener);

// remove listener
tradingApi.removeStopoutListener(listenerId);
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
Take a look at our website for the full list of APIs and features supported [https://metaapi.cloud/#features](https://metaapi.cloud/#features)

Some of the APIs you might decide to use together with MetaStats API are:

1. MetaApi cloud forex API [https://metaapi.cloud/docs/client/](https://metaapi.cloud/docs/client/)
2. MetaTrader account management API [https://metaapi.cloud/docs/provisioning/](https://metaapi.cloud/docs/provisioning/)
3. MetaStats forex trading metrics API [https://metaapi.cloud/docs/metastats/](https://metaapi.cloud/docs/metastats/)
4. MetaApi MT manager API [https://metaapi.cloud/docs/manager/](https://metaapi.cloud/docs/manager/>)
5. MetaApi risk management API [https://metaapi.cloud/docs/risk-management/](https://metaapi.cloud/docs/risk-management/>)
