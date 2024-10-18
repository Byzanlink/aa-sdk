import { ByzanlinkBundler, ByzanlinkAASdk } from '../src';
import * as dotenv from 'dotenv';
import { logToFile } from './log-to-file';

dotenv.config();


async function main() {
  const bundlerApiKey = '8aee100f5be54e648887c8c1b31944f9';
  const customBundlerUrl = '';
  const policyId = '588e4c2f-b662-447c-9972-f1ccd35743ac'; 
  // initializating sdk...
  const byzanlinkAASdk = new ByzanlinkAASdk(
    { privateKey: process.env.WALLET_PRIVATE_KEY }, 
    { chainId: Number(process.env.CHAIN_ID),
      policyId: policyId, 
      apiKey: bundlerApiKey, 
      bundlerProvider: new ByzanlinkBundler(Number(process.env.CHAIN_ID),
       bundlerApiKey) ,}) 

  // get EtherspotWallet address...
  
  const address: string = await byzanlinkAASdk.getCounterFactualAddress();
  
  logToFile(`Log entry for thread: ${process.env.THREAD_ID}`,process.env.THREAD_ID);
  logToFile( `EtherspotWallet address: ${address}`,process.env.THREAD_ID);
  
  const balance = await byzanlinkAASdk.getNativeBalance();
  
  logToFile(`EtherspotWallet native balance: ${balance}`,process.env.THREAD_ID);
  console.log(`EtherspotWallet native balance: ${balance}`);
  console.log( `EtherspotWallet address: ${address}`,process.env.THREAD_ID);

}

main()
  .catch(console.error)
  .finally(() => process.exit());
