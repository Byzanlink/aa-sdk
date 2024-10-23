import { CustomChainConfig } from "./walletInfraProvider/ChainInterface";
import { JWTLoginParams, WalletAuthOptions } from "./walletInfraProvider/interfaces";


export interface SdkParams {
  walletProvider?: string;
  walletInfraChainConfig?: CustomChainConfig;
  walletInfraOptions?: WalletAuthOptions;
  jwtLoginParams?: JWTLoginParams;
}
