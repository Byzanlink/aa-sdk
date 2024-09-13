import { ethers } from 'ethers';
import { ByzanlinkBundler, ByzanlinkAASdk } from '../src';
import { printOp } from '../src/sdk/common/OperationUtils';
import * as dotenv from 'dotenv';
import { sleep } from '../src/sdk/common';

dotenv.config();

async function main() {
  const bundlerApiKey = '3397bd71b15a411388b0ba5cb6b2efe8';
  
  // initializating sdk...
  const byzanlinkAASdk = new ByzanlinkAASdk(
    { privateKey: process.env.WALLET_PRIVATE_KEY },
    { chainId: Number(process.env.CHAIN_ID), bundlerProvider: new ByzanlinkBundler(Number(process.env.CHAIN_ID), bundlerApiKey) },
  );

  console.log('address: ', byzanlinkAASdk.state.EOAAddress);

  // get address of EtherspotWallet
  const address: string = await byzanlinkAASdk.getCounterFactualAddress();

  // update the addresses in this array with the guardian addresses you want to set
  const guardianAddresses: string[] = [
    '0xCd7C976c47F0de6A19DE540e473e85894bF9C9b4',
    '0x13dBB7A7e1bBAFf1894cfbeb1382043060a220cb',
    '0x0266c5192fF26CDA6697e0F86Bd42c002Ee68C8E',
  ];

  console.log('\x1b[33m%s\x1b[0m', `EtherspotWallet address: ${address}`);

  const addGuardianInterface = new ethers.utils.Interface(['function addGuardian(address _newGuardian)']);

  const addGuardianData1 = addGuardianInterface.encodeFunctionData('addGuardian', [guardianAddresses[0]]);
  const addGuardianData2 = addGuardianInterface.encodeFunctionData('addGuardian', [guardianAddresses[1]]);
  const addGuardianData3 = addGuardianInterface.encodeFunctionData('addGuardian', [guardianAddresses[2]]);

  // clear the transaction batch
  await byzanlinkAASdk.clearUserOpsFromBatch();

  // add transactions to the batch
  let userOpsBatch = await byzanlinkAASdk.addUserOpsToBatch({ to: address, data: addGuardianData1 });
  //userOpsBatch = await byzanlinkAASdk.addUserOpsToBatch({ to: address, data: addGuardianData2 });
  //userOpsBatch = await byzanlinkAASdk.addUserOpsToBatch({ to: address, data: addGuardianData3 });
  console.log('transactions: ', userOpsBatch);

  // sign transactions added to the batch
  const op = await byzanlinkAASdk.estimate();
  console.log(`Estimated UserOp: ${await printOp(op)}`);

  // sign the userOps and sending to the bundler...
  const uoHash = await byzanlinkAASdk.send(op);
  console.log(`UserOpHash: ${uoHash}`);

  // get transaction hash...
  console.log('Waiting for transaction...');
  let userOpsReceipt = null;
  const timeout = Date.now() + 60000; // 1 minute timeout
  while (userOpsReceipt == null && Date.now() < timeout) {
    await sleep(2);
    userOpsReceipt = await byzanlinkAASdk.getUserOpReceipt(uoHash);
  }
  console.log('\x1b[33m%s\x1b[0m', `Transaction Receipt: `, userOpsReceipt);
}

main()
  .catch(console.error)
  .finally(() => process.exit());
