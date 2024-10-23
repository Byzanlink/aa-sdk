import { ethers,providers } from 'ethers';
import { ByzanlinkBundler, Factory, ByzanlinkAASdk } from '../src';
import { printOp } from '../src/sdk/common/OperationUtils';
import * as dotenv from 'dotenv';
import { sleep } from '../src/sdk/common';
// import { Web3Auth } from "@web3auth/node-sdk";
// import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
// import { CHAIN_NAMESPACES } from "@web3auth/base";
import { get } from 'http';
dotenv.config();

const recipient = '0xA6ecF2640C23009B66844F20a554c70f5c2EA7b8'; // recipient wallet address
const value = '10'; // transfer value
const bundlerApiKey = '8aee100f5be54e648887c8c1b31944f9';

//# AggregatorV3Interface ABI
let abi = '[{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"description","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint80","name":"_roundId","type":"uint80"}],"name":"getRoundData","outputs":[{"internalType":"uint80","name":"roundId","type":"uint80"},{"internalType":"int256","name":"answer","type":"int256"},{"internalType":"uint256","name":"startedAt","type":"uint256"},{"internalType":"uint256","name":"updatedAt","type":"uint256"},{"internalType":"uint80","name":"answeredInRound","type":"uint80"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"latestRoundData","outputs":[{"internalType":"uint80","name":"roundId","type":"uint80"},{"internalType":"int256","name":"answer","type":"int256"},{"internalType":"uint256","name":"startedAt","type":"uint256"},{"internalType":"uint256","name":"updatedAt","type":"uint256"},{"internalType":"uint80","name":"answeredInRound","type":"uint80"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"version","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}]'
//# Price Feed address
let addr = '0x001382149eBa3441043c1c66972b4772963f5D43';
addr = '0xAB594600376Ec9fD91F8e885dADF0CE036862dE0'
let provider = new providers.JsonRpcProvider('https://polygon-amoy.blockpi.network/v1/rpc/9269f7ec0c1aca11e2db14cdf7243da9778150fc');

provider = new providers.JsonRpcProvider('https://polygon.blockpi.network/v1/rpc/3f7c540a78dea07c9a92fe6ad15c1c06492ae84a');


async function main() {
  // initializating sdk...
  //const key = await getSmartContractAccountSigner("eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InoweTJZZGRja2VwV3JBR0R2UDQzSCJ9.eyJnaXZlbl9uYW1lIjoiUmFnaHVsIiwiZmFtaWx5X25hbWUiOiJBbW1hcGF0dGkgVmVua2lkdXNhbXkiLCJuaWNrbmFtZSI6InJhZ2h1bCIsIm5hbWUiOiJSYWdodWwgQW1tYXBhdHRpIFZlbmtpZHVzYW15IiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FDZzhvY0tjZlhBakl5SThwTVFfM0ZvOTZyN0lGRVFnWEc2SE5ZR2tVVThzY0xtNXJQTnd6UT1zOTYtYyIsInVwZGF0ZWRfYXQiOiIyMDI0LTA4LTEzVDExOjQyOjUyLjA3OFoiLCJlbWFpbCI6InJhZ2h1bEBieXphbmxpbmsuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImlzcyI6Imh0dHBzOi8vZGV2LXFoMTV2NjVnaGt3eHo1emcudXMuYXV0aDAuY29tLyIsImF1ZCI6IlVSeU84N1hEbXc1V0RGYjJ1MHBnUjBMV3BDUTcwQnZZIiwiaWF0IjoxNzIzNTQ5MzczLCJleHAiOjE3MjM1ODUzNzMsInN1YiI6Imdvb2dsZS1vYXV0aDJ8MTEyOTM4NDgzMTY0MTk3NjM3MzEyIiwic2lkIjoibndfSXFkWXhCdE9iSmRySHVWNDlISGszNndJRkdqYzIiLCJub25jZSI6IlZIVnBkSEZHZGpkR09XOXdOamt6TVVwc04ydDRiWEZyVjNwNFJFMUZTVlZwVWxOVmFHSmpNVkZrZFE9PSJ9.QiB0_SevzMikauQrxsSGxLVSaZ-sxXk8Aur6BU4z4O8VTQPAsL_ObBOjSRlK79FsoJXQ8_-8Xl2O8QVEwy5Yp6tyBrln0QfQMUvjCRLUHti-w5UahWDcF8x7c4NkSclqFj1bwFcSoaybUnMzopxY1tngHUpYTX8ovkRMjc1v84EzGy8b_GtnjT0y_cJad1tXKEZLZ02Vkl2PU5hDL_azAtbLvPGasTsAKEWK0G0fkBPdLd5u1z0XdJr1UFt4McvBC32YnfWNzNPr7DQaYb-QQr5fKAHOig7H5wgce-vMdwDoUr-6sJ7IIBo_wZ8l3mMss4y0BXiuqIYGFmOOzgExHg", "google-oauth2|112938483164197637312")
 
  const oracleContract = new ethers.Contract(addr, abi, provider);

  let latestData =await  oracleContract.functions.latestRoundData();
console.log('In get oracle data',latestData)

  const byzanlinkAASdk = new ByzanlinkAASdk({ privateKey: process.env.WALLET_PRIVATE_KEY },
     { chainId: Number(process.env.CHAIN_ID), 
      bundlerProvider: new ByzanlinkBundler(Number(process.env.CHAIN_ID), bundlerApiKey,process.env.BUNDLER_URL), 
      factoryWallet: Factory.BYZANLINK,
      //rpcProviderUrl: process.env.BUNDLER_URL
     }
    )

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
 // const uoHash = await byzanlinkAASdk.send(op);
 // console.log(`UserOpHash: ${uoHash}`);

  // get transaction hash...
 // console.log('Waiting for transaction...');
  //let userOpsReceipt = null;
  //const timeout = Date.now() + 60000; // 1 minute timeout
   //while((userOpsReceipt == null) && (Date.now() < timeout)) {
    // await sleep(2);
    // userOpsReceipt = await byzanlinkAASdk.getUserOpReceipt(uoHash);
  // }
  //console.log('\x1b[33m%s\x1b[0m', `Transaction Receipt: `, userOpsReceipt);
}


main()
  .catch(console.error)
  .finally(() => process.exit());


  
