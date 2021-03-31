let MetaApi = require('metaapi.cloud-sdk').default;
let CopyFactory = require('metaapi.cloud-sdk').CopyFactory;

// your MetaApi API token
let token = process.env.TOKEN || '<put in your token here>';
// your master MetaApi account id
let masterAccountId = process.env.MASTER_ACCOUNT_ID || '<put in your masterAccountId here>';
// your slave MetaApi account id
let slaveAccountId = process.env.SLAVE_ACCOUNT_ID || '<put in your slaveAccountId here>';

const api = new MetaApi(token);
const copyFactory = new CopyFactory(token);

async function configureCopyFactory() {
  try {
    let accounts = await api.metatraderAccountApi.getAccounts();
    let masterMetaapiAccount = accounts.find(a => a.id === masterAccountId);
    if (masterMetaapiAccount.application !== 'CopyFactory') {
      throw new Error('Please specify CopyFactory application field value in your MetaApi account in order to use it in CopyFactory API');
    }

    let slaveMetaapiAccount = accounts.find(a => a.id === slaveAccountId);
    if (slaveMetaapiAccount.application !== 'CopyFactory') {
      throw new Error('Please specify CopyFactory application field value in your MetaApi account in order to use it in CopyFactory API');
    }

    let configurationApi = copyFactory.configurationApi;
    masterAccountId = configurationApi.generateAccountId();
    slaveAccountId = configurationApi.generateAccountId();
    await configurationApi.updateAccount(masterAccountId, {
      name: 'Demo master account',
      connectionId: masterMetaapiAccount.id,
      subscriptions: []
    });

    // create a strategy being copied
    let strategyId = await configurationApi.generateStrategyId();
    await configurationApi.updateStrategy(strategyId.id, {
      name: 'Test strategy',
      description: 'Some useful description about your strategy',
      connectionId: masterMetaapiAccount.id
    });

    // subscribe slave CopyFactory accounts to the strategy
    await configurationApi.updateAccount(slaveAccountId, {
      name: 'Demo slave account',
      connectionId: slaveMetaapiAccount.id,
      subscriptions: [
        {
          strategyId: strategyId.id,
          multiplier: 1
        }
      ]
    });

    console.log('Please note that it can take some time for CopyFactory to initialize accounts. During this time ' +
      'the MetaApi accounts may redeploy a couple of times. After initialization finishes, you can copy trades from ' +
      'your master to slave account.');
  } catch (err) {
    console.error(err);
  }
  process.exit();
}

configureCopyFactory();
