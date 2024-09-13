import { ethers } from 'ethers';
import { ByzanlinkBundler, ByzanlinkAASdk } from '../src';
import { printOp } from '../src/sdk/common/OperationUtils';
import * as dotenv from 'dotenv';
import { sleep } from '../src/sdk/common';

dotenv.config();

// add/change these values
const recipient = '0xD129dB5e418e389c3F7D3ae0B8771B3f76799A52'; // recipient wallet address
const tokenAddress = '0xe55C5793a52AF819fBf3e87a23B36708E6FDd2Cc';
const tokenId = 4;
const bundlerApiKey = '3397bd71b15a411388b0ba5cb6b2efe8';

async function main() {
  // initializating sdk...
  const byzanlinkAASdk = new ByzanlinkAASdk({ privateKey: process.env.WALLET_PRIVATE_KEY }, { chainId: Number(process.env.CHAIN_ID), bundlerProvider: new ByzanlinkBundler(Number(process.env.CHAIN_ID), bundlerApiKey) })

  console.log('address: ', byzanlinkAASdk.state.EOAAddress)

  // get address of EtherspotWallet...
  const address: string = await byzanlinkAASdk.getCounterFactualAddress();
  console.log('\x1b[33m%s\x1b[0m', `EtherspotWallet address: ${address}`);

  const erc721Interface = new ethers.utils.Interface([
    'function safeTransferFrom(address _from, address _to, uint256 _tokenId)'
  ])

  const erc721Data = erc721Interface.encodeFunctionData('safeTransferFrom', [address, recipient, tokenId]);

  // clear the transaction batch
  await byzanlinkAASdk.clearUserOpsFromBatch();

  // add transactions to the batch
  const userOpsBatch = await byzanlinkAASdk.addUserOpsToBatch({to: tokenAddress, data: erc721Data});
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
  while((userOpsReceipt == null) && (Date.now() < timeout)) {
    await sleep(2);
    userOpsReceipt = await byzanlinkAASdk.getUserOpReceipt(uoHash);
  }
  console.log('\x1b[33m%s\x1b[0m', `Transaction Receipt: `, userOpsReceipt);
}

main()
  .catch(console.error)
  .finally(() => process.exit());
