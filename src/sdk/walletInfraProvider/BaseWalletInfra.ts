import { Web3AuthMPCCoreKit } from "@web3auth/mpc-core-kit";
import { CustomChainConfig } from "./ChainInterface";
import { JWTLoginParams, WalletAuthOptions } from "./interfaces";
import { Web3Auth } from "./Web3Auth/Web3Auth";

/**
 * Abstract class for Wallet Infra Provider
 * 
 * @export
 * @abstract
 * @class BaseWalletInfra
 */
export abstract class BaseWalletInfra {
  /**
   * This Function is used to initialize the External Wallet Infra Provider
   * @abstract
   * @param {CustomChainConfig} customChainConfig
   * @param {WalletAuthOptions} web3options
   * @param {JWTLoginParams} jwtLoginParams
   * @return {*}  {Promise<void>}
   * @memberof BaseWalletInfra
   */
  abstract init(customChainConfig: CustomChainConfig, web3options:WalletAuthOptions,jwtLoginParams: JWTLoginParams): Promise<void>;
  
  /**
   * This Function is used to login to the External Wallet Infra Provider
   * 
   * @abstract
   * @return {*}  {Promise<Web3AuthMPCCoreKit>}
   * @memberof BaseWalletInfra
   */
  abstract login(): Promise<Web3AuthMPCCoreKit>;

  /**
   * This Function is used to get the Ethereum Provider from the External Wallet Infra Provider
   * This is used to sign the transactions
   *
   * @abstract
   * @return {*}  {any}
   * @memberof BaseWalletInfra
   */
  abstract getEthereumProvider(): any;

}