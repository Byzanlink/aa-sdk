import { BundlerProviderLike } from './bundler';
import { StateStorage } from './state';
import { WalletProviderLike } from './wallet';
import { CustomChainConfig } from '@byzanlink/aa-wallet-auth/src/sdk/walletInfraProvider/ChainInterface';
import { JWTLoginParams, WalletAuthOptions } from '@byzanlink/aa-wallet-auth/src/sdk/walletInfraProvider/interfaces';
import { WALLET_INFRA_PROVIDER } from '@byzanlink/aa-wallet-auth/src/sdk/walletInfraProvider/WalletInfraProvider';

export interface PaymasterApi {
  url: string;
  context?: any;
}

export enum Factory {
  BYZANLINK = 'byzanlink',
}

export interface SdkOptions {
  chainId: number;
  bundlerProvider?: BundlerProviderLike;
  stateStorage?: StateStorage;
  rpcProviderUrl?: string;
  factoryWallet?: Factory;
  walletFactoryAddress?: string;
  entryPointAddress?: string;
  accountAddress?: string;
  index?: number;
  apiKey?: string;
  policyId?: string;
}
