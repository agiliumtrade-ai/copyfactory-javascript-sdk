let MetaApi = require('metaapi.cloud-sdk').default;
let CopyFactory = require('metaapi.cloud-sdk').CopyFactory;

// your MetaApi API token
let token = process.env.TOKEN || '<put in your token here>';
// your master MetaApi account id
// master account must have PROVIDER value in copyFactoryRoles
let masterAccountId = process.env.MASTER_ACCOUNT_ID || '<put in your masterAccountId here>';
// your slave MetaApi account id
// slave account must have SUBSCRIBER value in copyFactoryRoles
let slaveAccountId = process.env.SLAVE_ACCOUNT_ID || '<put in your slaveAccountId here>';

const api = new MetaApi(token);
const copyFactory = new CopyFactory(token);

async function externalSignal() {
  try {
    let masterMetaapiAccount = await api.metatraderAccountApi.getAccount(masterAccountId);
    if(!masterMetaapiAccount.copyFactoryRoles || !masterMetaapiAccount.copyFactoryRoles.includes('PROVIDER')) {
      throw new Error('Please specify PROVIDER copyFactoryRoles value in your MetaApi account in ' +
        'order to use it in CopyFactory API');
    }

    let slaveMetaapiAccount = await api.metatraderAccountApi.getAccount(slaveAccountId);
    if(!slaveMetaapiAccount.copyFactoryRoles || !slaveMetaapiAccount.copyFactoryRoles.includes('SUBSCRIBER')) {
      throw new Error('Please specify SUBSCRIBER copyFactoryRoles value in your MetaApi account in ' +
        'order to use it in CopyFactory API');
    }

    let configurationApi = copyFactory.configurationApi;
    const strategies = await configurationApi.getStrategies();
    const strategy = strategies.find(s => s.accountId === masterMetaapiAccount.id);
    let strategyId;
    if(strategy) {
      strategyId = strategy._id;
    } else {
      strategyId = await configurationApi.generateStrategyId();
      strategyId = strategyId.id;
    }

    // create a strategy being copied
    await configurationApi.updateStrategy(strategyId, {
      name: 'Test strategy',
      description: 'Some useful description about your strategy',
      accountId: masterMetaapiAccount.id
    });

    // create subscriber
    await configurationApi.updateSubscriber(slaveMetaapiAccount.id, {
      name: 'Test subscriber',
      subscriptions: [
        {
          strategyId: strategyId,
          multiplier: 1
        }
      ]
    });

    // send external signal
    const tradingApi = copyFactory.tradingApi;
    const signalClient = await tradingApi.getSignalClient(slaveMetaapiAccount.id);
    const signalId = signalClient.generateSignalId();
    await signalClient.updateExternalSignal(strategyId, signalId, {
      symbol: 'EURUSD',
      type: 'POSITION_TYPE_BUY',
      time: new Date(),
      volume: 0.01
    });

    await new Promise(res => setTimeout(res, 10000));

    // output trading signals
    console.log(await signalClient.getTradingSignals(slaveMetaapiAccount.id));

    // remove external signal
    await signalClient.removeExternalSignal(strategyId, signalId, {
      time: new Date()
    });
  } catch (err) {
    console.error(err);
  }
  process.exit();
}

externalSignal();
