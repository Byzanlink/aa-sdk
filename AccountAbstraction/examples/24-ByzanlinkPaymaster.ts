import { ByzanlinkPaymaster } from "../src";
import * as dotenv from 'dotenv';

dotenv.config();

async function main() {
  const apiKey = process.env.API_KEY; // Only testnets are available, if you need further assistance in setting up a paymaster service for your dapp, please reach out to us on discord or https://etherspot.fyi/arka/intro
  const paymasterUrl = process.env.PAYMASTER_URL; // Only testnets are available, if you need further assistance in setting up a paymaster service for your dapp, please reach out to us on discord or https://etherspot.fyi/arka/intro
  const policyId = process.env.POLICY_ID; // Only testnets are available, if you need further assistance in setting up a paymaster service for your dapp, please reach out to us on discord or https://etherspot.fyi/arka/intro
  // initializating sdk...
  const arkaPaymaster = new ByzanlinkPaymaster(Number(process.env.CHAIN_ID), apiKey, paymasterUrl, policyId);

 
  //console.log(await arkaPaymaster.addWhitelist(["0x13dBB7A7e1bBAFf1894cfbeb1382043060a220cb"]));
  console.log(await arkaPaymaster.removeWhitelist(["0x373e0056F2eA6849AF99752C7a2F5Bb58b31b057"]));
  //console.log(await arkaPaymaster.checkWhitelist("0x13dBB7A7e1bBAFf1894cfbeb1382043060a220cb"));
}

main()
  .catch(console.error)
  .finally(() => process.exit());