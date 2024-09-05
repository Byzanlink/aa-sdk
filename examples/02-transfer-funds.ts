import { ethers } from 'ethers';
import { ByzanlinkBundler, Factory, ByzanlinkAASdk } from '../src';
import { printOp } from '../src/sdk/common/OperationUtils';
import * as dotenv from 'dotenv';
import { sleep } from '../src/sdk/common';
// import { Web3Auth } from "@web3auth/node-sdk";
// import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
// import { CHAIN_NAMESPACES } from "@web3auth/base";
import { get } from 'http';
dotenv.config();

const recipient = '0xCd7C976c47F0de6A19DE540e473e85894bF9C9b4'; // recipient wallet address
const value = '0.0001'; // transfer value
const bundlerApiKey = '3397bd71b15a411388b0ba5cb6b2efe8';

async function main() {
  // initializating sdk...
  //const key = await getSmartContractAccountSigner("eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InoweTJZZGRja2VwV3JBR0R2UDQzSCJ9.eyJnaXZlbl9uYW1lIjoiUmFnaHVsIiwiZmFtaWx5X25hbWUiOiJBbW1hcGF0dGkgVmVua2lkdXNhbXkiLCJuaWNrbmFtZSI6InJhZ2h1bCIsIm5hbWUiOiJSYWdodWwgQW1tYXBhdHRpIFZlbmtpZHVzYW15IiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FDZzhvY0tjZlhBakl5SThwTVFfM0ZvOTZyN0lGRVFnWEc2SE5ZR2tVVThzY0xtNXJQTnd6UT1zOTYtYyIsInVwZGF0ZWRfYXQiOiIyMDI0LTA4LTEzVDExOjQyOjUyLjA3OFoiLCJlbWFpbCI6InJhZ2h1bEBieXphbmxpbmsuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImlzcyI6Imh0dHBzOi8vZGV2LXFoMTV2NjVnaGt3eHo1emcudXMuYXV0aDAuY29tLyIsImF1ZCI6IlVSeU84N1hEbXc1V0RGYjJ1MHBnUjBMV3BDUTcwQnZZIiwiaWF0IjoxNzIzNTQ5MzczLCJleHAiOjE3MjM1ODUzNzMsInN1YiI6Imdvb2dsZS1vYXV0aDJ8MTEyOTM4NDgzMTY0MTk3NjM3MzEyIiwic2lkIjoibndfSXFkWXhCdE9iSmRySHVWNDlISGszNndJRkdqYzIiLCJub25jZSI6IlZIVnBkSEZHZGpkR09XOXdOamt6TVVwc04ydDRiWEZyVjNwNFJFMUZTVlZwVWxOVmFHSmpNVkZrZFE9PSJ9.QiB0_SevzMikauQrxsSGxLVSaZ-sxXk8Aur6BU4z4O8VTQPAsL_ObBOjSRlK79FsoJXQ8_-8Xl2O8QVEwy5Yp6tyBrln0QfQMUvjCRLUHti-w5UahWDcF8x7c4NkSclqFj1bwFcSoaybUnMzopxY1tngHUpYTX8ovkRMjc1v84EzGy8b_GtnjT0y_cJad1tXKEZLZ02Vkl2PU5hDL_azAtbLvPGasTsAKEWK0G0fkBPdLd5u1z0XdJr1UFt4McvBC32YnfWNzNPr7DQaYb-QQr5fKAHOig7H5wgce-vMdwDoUr-6sJ7IIBo_wZ8l3mMss4y0BXiuqIYGFmOOzgExHg", "google-oauth2|112938483164197637312")
  const byzanlinkAASdk = new ByzanlinkAASdk({ privateKey: process.env.WALLET_PRIVATE_KEY }, { chainId: Number(process.env.CHAIN_ID), bundlerProvider: new ByzanlinkBundler(Number(process.env.CHAIN_ID), bundlerApiKey), 
      factoryWallet: Factory.BYZANLINK })

  console.log('address: ', byzanlinkAASdk.state.EOAAddress)

  // get address of EtherspotWallet...
  const address: string = await byzanlinkAASdk.getCounterFactualAddress();
  console.log('\x1b[33m%s\x1b[0m', `EtherspotWallet address: ${address}`);

  // clear the transaction batch
  await byzanlinkAASdk.clearUserOpsFromBatch();

  // add transactions to the batch
  const transactionBatch = await byzanlinkAASdk.addUserOpsToBatch({to: recipient, value: ethers.utils.parseEther(value)});
  console.log('transactions: ', transactionBatch);

  // get balance of the account address
  const balance = await byzanlinkAASdk.getNativeBalance();

  console.log('balances: ', balance);

  // estimate transactions added to the batch and get the fee data for the UserOp
  const op = await byzanlinkAASdk.estimate();
  console.log(`Estimate UserOp: ${await printOp(op)}`);

  // sign the UserOp and sending to the bundler...
  const uoHash = await byzanlinkAASdk.send(op);
  console.log(`UserOpHash: ${uoHash}`);

  // get transaction hash...
  console.log('Waiting for transaction...');
  let userOpsReceipt = null;
  const timeout = Date.now() + 60000; // 1 minute timeout
  // while((userOpsReceipt == null) && (Date.now() < timeout)) {
  //   await sleep(2);
  //   userOpsReceipt = await byzanlinkAASdk.getUserOpReceipt(uoHash);
  // }
  console.log('\x1b[33m%s\x1b[0m', `Transaction Receipt: `, userOpsReceipt);
}


main()
  .catch(console.error)
  .finally(() => process.exit());
