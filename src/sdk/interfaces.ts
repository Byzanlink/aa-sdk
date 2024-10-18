import { BundlerProviderLike } from './bundler';
import { StateStorage } from './state';
import { WalletProviderLike } from './wallet';
import { CustomChainConfig } from './walletInfraProvider/ChainInterface';
import { JWTLoginParams, WalletAuthOptions } from './walletInfraProvider/interfaces';
import { WALLET_INFRA_PROVIDER } from './walletInfraProvider/WalletInfraProvider';

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
  walletProvider?: string;
  walletInfraChainConfig?: CustomChainConfig;
  walletInfraOptions?: WalletAuthOptions;
  jwtLoginParams?: JWTLoginParams;
}
