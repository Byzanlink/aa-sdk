import { EtherspotBundler, Factory, PrimeSdk } from '../src';
import * as dotenv from 'dotenv';

dotenv.config();


async function main() {
  const bundlerApiKey = '0aa572f7-39fe-492f-bca4-ba3d1a63720d';
  // initializating sdk...
  const primeSdk = new PrimeSdk({ privateKey: process.env.WALLET_PRIVATE_KEY }, {
    chainId: Number(process.env.CHAIN_ID), factoryWallet: Factory.SIMPLE_ACCOUNT,
    bundlerProvider: new EtherspotBundler(Number(process.env.CHAIN_ID), bundlerApiKey)
  })

  // get SimpleAccount address...
  const address: string = await primeSdk.getCounterFactualAddress();
  console.log('\x1b[33m%s\x1b[0m', `SimpleAccount address: ${address}`);
}

main()
  .catch(console.error)
  .finally(() => process.exit());
