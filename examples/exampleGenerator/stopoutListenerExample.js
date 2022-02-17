let CopyFactory = require('metaapi.cloud-sdk').CopyFactory;
let StopoutListener = require('metaapi.cloud-sdk').StopoutListener;

// your MetaApi API token
let token = process.env.TOKEN || '<put in your token here>';
// your subscriber MetaApi account id
let accountId = process.env.SLAVE_ACCOUNT_ID || '<put in your slaveAccountId here>';

const copyFactory = new CopyFactory(token);

class Listener extends StopoutListener {

  async onStopout(strategyStopoutEvent) {
    console.log('Strategy stopout event', strategyStopoutEvent);
  }

}

async function stopoutExample() {
  try {
    const listener = new Listener();

    let tradingApi = copyFactory.tradingApi;
    const listenerId = tradingApi.addStopoutListener(listener, accountId);
    await new Promise(res => setTimeout(res, 300000));
    tradingApi.removeStopoutListener(listenerId);
  } catch (err) {
    console.error(err);
  }
  process.exit();
}

stopoutExample();
