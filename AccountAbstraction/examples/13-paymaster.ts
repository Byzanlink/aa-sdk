import { BigNumber, ethers } from 'ethers';
import {  ByzanlinkAASdk } from '../src';
import { printOp } from '../src/sdk/common/OperationUtils';
import * as dotenv from 'dotenv';
import { logToFile } from './log-to-file';
import { sleep } from '../src/sdk/common';
import { log } from 'console';

dotenv.config();

const recipient = '0xC2C9b2e56d62e4839EbEa832F24eDF1be81B0621'; // recipient wallet address
const recipient1 = '0x13dBB7A7e1bBAFf1894cfbeb1382043060a220cb'; // recipient wallet address
const recipient2 = '0xCd7C976c47F0de6A19DE540e473e85894bF9C9b4'; // recipient wallet address
const value = '0.001'; // transfer value
const apiKey = '8aee100f5be54e648887c8c1b31944f9'; 
const policyId = 'f7241b95-0307-4444-be9b-ae3f8375c621';
async function main() {
  // initializating sdk...
  const byzanlinkAASdk = new ByzanlinkAASdk({ privateKey: process.env.WALLET_PRIVATE_KEY }, {
    chainId: Number(process.env.CHAIN_ID),
    apiKey: apiKey,
    policyId: policyId,  
  })

  logToFile(`Log entry for thread: ${process.env.THREAD_ID}`+'address: '+ byzanlinkAASdk.state.EOAAddress+'\n',process.env.THREAD_ID);

  // get address of EtherspotWallet...
  const address: string = await byzanlinkAASdk.getCounterFactualAddress();
  logToFile(`Log entry for thread: ${process.env.THREAD_ID}`+ `EtherspotWallet address: ${address}`,process.env.THREAD_ID);

  // clear the transaction batch
  await byzanlinkAASdk.clearUserOpsFromBatch();

  let ierationNumber = '0.000'+process.env.ITERATION_NUM;
  //let newValue = Number(ierationNumber)+ Number(value);
 // console.log(newValue);
  logToFile(`Log entry for thread: ${process.env.THREAD_ID}`+ `Iteration Number: ${process.env.ITERATION_NUM}`+` New Value: ${ierationNumber}`,process.env.THREAD_ID);
  // add transactions to the batch
  let transactionBatch = await byzanlinkAASdk.addUserOpsToBatch({ to: recipient, value: ethers.utils.parseEther(ierationNumber) });
  //transactionBatch = await byzanlinkAASdk.addUserOpsToBatch({ to: recipient1, value: ethers.utils.parseEther(value) });
  //transactionBatch =await byzanlinkAASdk.addUserOpsToBatch({ to: recipient2, value: ethers.utils.parseEther(value) });
  //transactionBatch =await byzanlinkAASdk.addUserOpsToBatch({ to: recipient2, value: ethers.utils.parseEther(value) });
  //transactionBatch =await byzanlinkAASdk.addUserOpsToBatch({ to: recipient2, value: ethers.utils.parseEther(value) });
  //transactionBatch =await byzanlinkAASdk.addUserOpsToBatch({ to: recipient2, value: ethers.utils.parseEther(value) });

  logToFile(`Log entry for thread: ${process.env.THREAD_ID}`+'transactions: '+ transactionBatch,process.env.THREAD_ID);

  // get balance of the account address
  const balance = await byzanlinkAASdk.getNativeBalance();

  logToFile(`Log entry for thread: ${process.env.THREAD_ID}`+'balances: '+ balance,process.env.THREAD_ID);

  // estimate transactions added to the batch and get the fee data for the UserOp
  const op = await byzanlinkAASdk.estimate({
    paymasterDetails: { url: `https://dev.byzanlink.com/paymasterservice/sdk/paymasterdata`, context: { mode: 'sponsor' } }
  ,key: Number(process.env.ITERATION_NUM) });
  // const op = await byzanlinkAASdk.estimate({
  //   paymasterDetails: { url: `http://localhost:5050/paymasterdata`, context: { mode: 'sponsor' } }
  // });
  logToFile(`Log entry for thread: ${process.env.THREAD_ID}`+`Estimate UserOp: ${await printOp(op)}`,process.env.THREAD_ID);
  const prevPaymasterBalance = await byzanlinkAASdk.getPaymasterBalance('0x967aAA81553E5f2229aA91cd9EDD3CD630d27483');


 // sign the UserOp and sending to the bundler...
  const uoHash = await byzanlinkAASdk.send(op);
  logToFile(`Log entry for thread: ${process.env.THREAD_ID}`+`UserOpHash: ${uoHash}`,process.env.THREAD_ID);
 let verificationGasLimit = BigNumber.from(await op.verificationGasLimit).mul(3);
 let preVerificationGas = BigNumber.from(await op.preVerificationGas);  
 let callGasLimit = BigNumber.from(await op.callGasLimit);
let totalGasNeeded = verificationGasLimit.add(preVerificationGas).add(callGasLimit);
  // get transaction hash...
  logToFile(`Log entry for thread: ${process.env.THREAD_ID}`+'Waiting for transaction...',process.env.THREAD_ID);
//   let userOpsReceipt = null;
//   const timeout = Date.now() + 60000; // 1 minute timeout
//  while ((userOpsReceipt == null) && (Date.now() < timeout)) {
//    await sleep(2);
//    userOpsReceipt = await byzanlinkAASdk.getUserOpReceipt(uoHash);
//  }
//   logToFile(`Log entry for thread: ${process.env.THREAD_ID}`+ `Transaction Receipt: `+ userOpsReceipt,process.env.THREAD_ID);
//   if(userOpsReceipt!=null){
//     const PaymasterBalanceAfter  = await byzanlinkAASdk.getPaymasterBalance('0x967aAA81553E5f2229aA91cd9EDD3CD630d27483');
//     let paymasterBalanceConsumed = prevPaymasterBalance.sub(PaymasterBalanceAfter); 
//     logToFile(`Log entry for thread: ${process.env.THREAD_ID}`+ `Total Estimation Gas  After paymaster Signing: `+ ethers.utils.formatEther(totalGasNeeded),process.env.THREAD_ID);
//     logToFile(`Log entry for thread: ${process.env.THREAD_ID}`+ `Total Estimation Gas Cost After paymaster Signing: `+ ethers.utils.formatEther(totalGasNeeded.mul(userOpsReceipt.receipt.effectiveGasPrice)),process.env.THREAD_ID);
//     logToFile(`Log entry for thread: ${process.env.THREAD_ID}`+ `Paymaster Balance Before: `+ ethers.utils.formatEther(prevPaymasterBalance),process.env.THREAD_ID);
//     logToFile(`Log entry for thread: ${process.env.THREAD_ID}`+ `Paymaster Balance After: `+ ethers.utils.formatEther(PaymasterBalanceAfter),process.env.THREAD_ID);
//     logToFile(`Log entry for thread: ${process.env.THREAD_ID}`+ `Paymaster Balance consumed: `+ ethers.utils.formatEther(paymasterBalanceConsumed),process.env.THREAD_ID);
//     logToFile(`Log entry for thread: ${process.env.THREAD_ID}`+ `Gas Cost From  Transaction: `+ ethers.utils.formatEther(userOpsReceipt.actualGasCost),process.env.THREAD_ID);

//   }
await sleep(50);
}

main()
  .catch(console.error)
  .finally(() => process.exit());

  0.00292280000175368
  0.00348830000209298
