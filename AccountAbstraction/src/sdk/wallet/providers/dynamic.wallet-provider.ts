import { NetworkNames, prepareNetworkName } from '../../network';
import { prepareAddress, UniqueSubject } from '../../common';
import { WalletProvider } from './interfaces';
import { ethers, TypedDataField } from 'ethers';
import { Hex } from 'viem';

export abstract class DynamicWalletProvider implements WalletProvider {
  readonly address$ = new UniqueSubject<string>();
  readonly networkName$ = new UniqueSubject<NetworkNames>();
  readonly pubKey$ =  new UniqueSubject<[Hex,Hex]>();
  
  protected constructor(readonly type: string) {
    //
  }

  get address(): string {
    return this.address$.value;
  }

  get pubKey(): [Hex,Hex]{
    let paddedValue = ethers.utils.hexZeroPad('0x00', 32) as  `0x${string}`;
    return this.pubKey$.value? this.pubKey$.value:[paddedValue,paddedValue];
  }

  get networkName(): NetworkNames {
    return this.networkName$.value;
  }

  abstract signMessage(message: any,precompiledP256Deployed?: boolean): Promise<string>;

  abstract signTypedData(typedData: TypedDataField[], message: any, accountAddress: string): Promise<string>;

  protected setAddress(address: string): void {
    this.address$.next(prepareAddress(address));
  }

  protected setPublicKey(publicKey: [Hex,Hex]): void {
    this.pubKey$.next(publicKey);
  }

  protected setNetworkName(networkNameOrChainId: string | number): void {
    this.networkName$.next(prepareNetworkName(networkNameOrChainId));
  }
}
