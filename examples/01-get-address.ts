import { ByzanlinkBundler, ByzanlinkAASdk } from '../src';
import * as dotenv from 'dotenv';

dotenv.config();


async function main() {
  const bundlerApiKey = '71935700ae7942d99ee7c6213b68978e';
  const customBundlerUrl = '';
  const policyId = '588e4c2f-b662-447c-9972-f1ccd35743ac'; 
  // initializating sdk...
  const byzanlinkAASdk = new ByzanlinkAASdk({ privateKey: process.env.WALLET_PRIVATE_KEY }, { chainId: Number(process.env.CHAIN_ID),policyId: policyId, apiKey: bundlerApiKey, bundlerProvider: new ByzanlinkBundler(Number(process.env.CHAIN_ID), bundlerApiKey) ,}) // Testnets dont need apiKey on bundlerProvider

  // get EtherspotWallet address...
  const address: string = await byzanlinkAASdk.getCounterFactualAddress();
  console.log('\x1b[33m%s\x1b[0m', `EtherspotWallet address: ${address}`);

  const balance = await byzanlinkAASdk.getNativeBalance();
  console.log('\x1b[33m%s\x1b[0m', `EtherspotWallet native balance: ${balance}`);

  

}

main()
  .catch(console.error)
  .finally(() => process.exit());
