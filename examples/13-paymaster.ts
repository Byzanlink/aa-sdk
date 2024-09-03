import { ethers } from 'ethers';
import { ByzanlinkBundler, ByzanlinkAASdk } from '../src';
import { printOp } from '../src/sdk/common/OperationUtils';
import * as dotenv from 'dotenv';
import { sleep } from '../src/sdk/common';
import { SimpleAccount } from '../../aa_bundler/packages/types/lib/executor/contracts/SimpleAccount';

dotenv.config();

const recipient = '0x17577D3175cd7518299a6C1c5b4f71525aF13b1A'; // recipient wallet address
const recipient1 = '0x13dBB7A7e1bBAFf1894cfbeb1382043060a220cb'; // recipient wallet address
const recipient2 = '0xCd7C976c47F0de6A19DE540e473e85894bF9C9b4'; // recipient wallet address
const value = '0.001'; // transfer value
const apiKey = '94afbf54e375464eba22935607b8e2e4'; 
const policyId = '21c67dce-3115-4d1b-9e4a-0d453cb4e438';
async function main() {
  // initializating sdk...
  const byzanlinkAASdk = new ByzanlinkAASdk({ privateKey: process.env.WALLET_PRIVATE_KEY }, {
    chainId: Number(process.env.CHAIN_ID),
    bundlerProvider: new ByzanlinkBundler(Number(process.env.CHAIN_ID), apiKey),
    apiKey: apiKey,
    policyId: policyId,  
  })

  console.log('address: ', byzanlinkAASdk.state.EOAAddress)

  // get address of EtherspotWallet...
  const address: string = await byzanlinkAASdk.getCounterFactualAddress();
  console.log('\x1b[33m%s\x1b[0m', `EtherspotWallet address: ${address}`);

  // clear the transaction batch
  await byzanlinkAASdk.clearUserOpsFromBatch();

  // add transactions to the batch
  let transactionBatch = await byzanlinkAASdk.addUserOpsToBatch({ to: recipient, value: ethers.utils.parseEther(value) });
 // transactionBatch = await byzanlinkAASdk.addUserOpsToBatch({ to: recipient1, value: ethers.utils.parseEther(value) });
  //transactionBatch =await byzanlinkAASdk.addUserOpsToBatch({ to: recipient2, value: ethers.utils.parseEther(value) });
  console.log('transactions: ', transactionBatch);

  // get balance of the account address
  const balance = await byzanlinkAASdk.getNativeBalance();

  console.log('balances: ', balance);

  // estimate transactions added to the batch and get the fee data for the UserOp
  // const op = await byzanlinkAASdk.estimate({
  //   paymasterDetails: { url: `https://dev.byzanlink.com/paymasterservice/sdk/paymasterdata`, context: { mode: 'sponsor' } }
  // });
  const op = await byzanlinkAASdk.estimate({
    paymasterDetails: { url: `http://localhost:5050/paymasterdata`, context: { mode: 'sponsor' } }
  });
  console.log(`Estimate UserOp: ${await printOp(op)}`);

 // sign the UserOp and sending to the bundler...
  const uoHash = await byzanlinkAASdk.send(op);
  console.log(`UserOpHash: ${uoHash}`);

  // get transaction hash...
  console.log('Waiting for transaction...');
  let userOpsReceipt = null;
  const timeout = Date.now() + 60000; // 1 minute timeout
  while ((userOpsReceipt == null) && (Date.now() < timeout)) {
    await sleep(2);
    userOpsReceipt = await byzanlinkAASdk.getUserOpReceipt(uoHash);
  }
  console.log('\x1b[33m%s\x1b[0m', `Transaction Receipt: `, userOpsReceipt);
}

main()
  .catch(console.error)
  .finally(() => process.exit());
