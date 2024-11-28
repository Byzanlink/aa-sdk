import { Wallet, BytesLike, TypedDataField,ethers } from 'ethers';
import { WalletProvider } from './interfaces';
import { Hex } from 'viem';

export class KeyWalletProvider implements WalletProvider {
  readonly type = 'Key';
  readonly address: string;

  readonly wallet: Wallet;
  paddedValue = ethers.utils.hexZeroPad('0x00', 32) as  `0x${string}`;
  readonly pubKey:[Hex,Hex] = [this.paddedValue, this.paddedValue];
  constructor(privateKey: string) {
    this.wallet = new Wallet(privateKey);

    const { address } = this.wallet;

    this.address = address;
  }

  async signMessage(message: BytesLike): Promise<string> {
    return this.wallet.signMessage(message);
  }

  async signTypedData(typedData: TypedDataField[], message: any, accountAddress: string): Promise<string> {
    throw new Error('Not supported in this connectedProvider');
  }
}
