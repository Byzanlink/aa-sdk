import { ByzanlinkBundler, ByzanlinkAASdk } from '../src';
import * as dotenv from 'dotenv';

dotenv.config();

const bundlerApiKey = 'eyJvcmciOiI2NTIzZjY5MzUwOTBmNzAwMDFiYjJkZWIiLCJpZCI6IjMxMDZiOGY2NTRhZTRhZTM4MGVjYjJiN2Q2NDMzMjM4IiwiaCI6Im11cm11cjEyOCJ9';

async function main() {
  // initializating sdk for index 0...
  const byzanlinkAASdk = new ByzanlinkAASdk(
    { privateKey: process.env.WALLET_PRIVATE_KEY },
    { chainId: Number(process.env.CHAIN_ID), bundlerProvider: new ByzanlinkBundler(Number(process.env.CHAIN_ID), bundlerApiKey) },
  );

  // get EtherspotWallet address for index 0...
  const address: string = await byzanlinkAASdk.getCounterFactualAddress();
  console.log('\x1b[33m%s\x1b[0m', `EtherspotWallet address for index 0: ${address}`);

  // initializating sdk for index 1...
  const byzanlinkAASdk1 = new ByzanlinkAASdk(
    { privateKey: process.env.WALLET_PRIVATE_KEY },
    { chainId: Number(process.env.CHAIN_ID), index: 1, bundlerProvider: new ByzanlinkBundler(Number(process.env.CHAIN_ID), bundlerApiKey) },
  );

  // get EtherspotWallet address for index 1...
  const address1: string = await byzanlinkAASdk1.getCounterFactualAddress();
  console.log('\x1b[33m%s\x1b[0m', `EtherspotWallet address for index 1: ${address1}`);
}

main()
  .catch(console.error)
  .finally(() => process.exit());
