import { ethers, providers } from 'ethers';
import { ByzanlinkBundler, ByzanlinkAASdk } from '../src';
import { printOp } from '../src/sdk/common/OperationUtils';
import * as dotenv from 'dotenv';
import { sleep } from '../src/sdk/common';

dotenv.config();

const recipient = '0x80a1874E1046B1cc5deFdf4D3153838B72fF94Ac'; // recipient wallet address
const value = '0.000001'; // transfer value
const bundlerApiKey = 'eyJvcmciOiI2NTIzZjY5MzUwOTBmNzAwMDFiYjJkZWIiLCJpZCI6IjMxMDZiOGY2NTRhZTRhZTM4MGVjYjJiN2Q2NDMzMjM4IiwiaCI6Im11cm11cjEyOCJ9';

async function main() {
  const provider = new providers.JsonRpcProvider(process.env.RPC_PROVIDER_URL);
  // initializating sdk...
  const byzanlinkAASdk = new ByzanlinkAASdk({ privateKey: process.env.WALLET_PRIVATE_KEY }, {
    chainId: Number(process.env.CHAIN_ID),
    bundlerProvider: new ByzanlinkBundler(Number(process.env.CHAIN_ID), bundlerApiKey)
  })

  console.log('address: ', byzanlinkAASdk.state.EOAAddress)

  // get address of EtherspotWallet...
  const address: string = await byzanlinkAASdk.getCounterFactualAddress();
  console.log('\x1b[33m%s\x1b[0m', `EtherspotWallet address: ${address}`);

  if ((await provider.getCode(address)).length <= 2) {
    console.log("Account must be created first");
    return;
  }

  // clear the transaction batch
  await byzanlinkAASdk.clearUserOpsFromBatch();

  // add transactions to the batch
  const transactionBatch = await byzanlinkAASdk.addUserOpsToBatch({to: recipient, value: ethers.utils.parseEther(value)});
  console.log('transactions: ', transactionBatch);

  // get balance of the account address
  const balance = await byzanlinkAASdk.getNativeBalance();

  console.log('balances: ', balance);

  // Note that usually Bundlers do not allow sending more than 10 concurrent userops from an unstaked entites (wallets, factories, paymaster)
  // Staked entities can send as many userops as they want
  let concurrentUseropsCount = 5;
  const userops = [];
  const uoHashes = [];

  while (--concurrentUseropsCount >= 0) {
    const op = await byzanlinkAASdk.estimate({ key: concurrentUseropsCount });
    console.log(`Estimate UserOp: ${await printOp(op)}`);
    userops.push(op);
  }

  console.log("Sending userops...");
  for (const op of userops) {
    const uoHash = await byzanlinkAASdk.send(op);
    console.log(`UserOpHash: ${uoHash}`);
    uoHashes.push(uoHash);
  }

  console.log('Waiting for transactions...');
  const userOpsReceipts = new Array(uoHashes.length).fill(null);
  const timeout = Date.now() + 60000; // 1 minute timeout
  while((userOpsReceipts.some(receipt => receipt == null)) && (Date.now() < timeout)) {
    await sleep(2);
    for (let i = 0; i < uoHashes.length; ++i) {
      if (userOpsReceipts[i]) continue;
      const uoHash = uoHashes[i];
      userOpsReceipts[i] = await byzanlinkAASdk.getUserOpReceipt(uoHash);
    }
  }

  if (userOpsReceipts.some(receipt => receipt != null)) {
    console.log('\x1b[33m%s\x1b[0m', `Transaction hashes: `);
    for (const uoReceipt of userOpsReceipts) {
      if (!uoReceipt) continue;
      console.log(uoReceipt.receipt.transactionHash);
    }
  } else {
    console.log("Could not submit any user op");
  }
}

main()
  .catch(console.error)
  .finally(() => process.exit());
