import { BigNumber, ethers } from 'ethers';
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
const apiKey = '71935700ae7942d99ee7c6213b68978e'; 
const policyId = '7d8e99ce-484f-4c76-b047-b16378a8bdbb';
async function main() {
  // initializating sdk...
  const byzanlinkAASdk = new ByzanlinkAASdk({ privateKey: process.env.WALLET_PRIVATE_KEY }, {
    chainId: Number(process.env.CHAIN_ID),
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
  const prevPaymasterBalance = await byzanlinkAASdk.getPaymasterBalance('0x967aAA81553E5f2229aA91cd9EDD3CD630d27483');


 // sign the UserOp and sending to the bundler...
  const uoHash = await byzanlinkAASdk.send(op);
  console.log(`UserOpHash: ${uoHash}`);
 let verificationGasLimit = BigNumber.from(await op.verificationGasLimit).mul(3);
 let preVerificationGas = BigNumber.from(await op.preVerificationGas);  
 let callGasLimit = BigNumber.from(await op.callGasLimit);
let totalGasNeeded = verificationGasLimit.add(preVerificationGas).add(callGasLimit);
  // get transaction hash...
  console.log('Waiting for transaction...');
  let userOpsReceipt = null;
  const timeout = Date.now() + 60000; // 1 minute timeout
  while ((userOpsReceipt == null) && (Date.now() < timeout)) {
    await sleep(2);
    userOpsReceipt = await byzanlinkAASdk.getUserOpReceipt(uoHash);
  }
  console.log('\x1b[33m%s\x1b[0m', `Transaction Receipt: `, userOpsReceipt);
  if(userOpsReceipt!=null){
    const PaymasterBalanceAfter  = await byzanlinkAASdk.getPaymasterBalance('0x967aAA81553E5f2229aA91cd9EDD3CD630d27483');
    let paymasterBalanceConsumed = prevPaymasterBalance.sub(PaymasterBalanceAfter); 
    console.log('\x1b[33m%s\x1b[0m', `Total Estimation Gas  After paymaster Signing: `, ethers.utils.formatEther(totalGasNeeded));
    console.log('\x1b[33m%s\x1b[0m', `Total Estimation Gas Cost After paymaster Signing: `, ethers.utils.formatEther(totalGasNeeded.mul(userOpsReceipt.receipt.effectiveGasPrice)));
    console.log('\x1b[33m%s\x1b[0m', `Paymaster Balance Before: `, ethers.utils.formatEther(prevPaymasterBalance));
    console.log('\x1b[33m%s\x1b[0m', `Paymaster Balance After: `, ethers.utils.formatEther(PaymasterBalanceAfter));
    console.log('\x1b[33m%s\x1b[0m', `Paymaster Balance consumed: `, ethers.utils.formatEther(paymasterBalanceConsumed));
    console.log('\x1b[33m%s\x1b[0m', `Gas Cost From  Transaction: `, ethers.utils.formatEther(userOpsReceipt.actualGasCost));

  }
}

main()
  .catch(console.error)
  .finally(() => process.exit());
