import { BaseWalletInfra } from "../BaseWalletInfra";
import { ethers } from "ethers";
import {
  Web3AuthMPCCoreKit,
  WEB3AUTH_NETWORK,
  AggregateVerifierLoginParams,
  TssShareType,
  generateFactorKey,
  COREKIT_STATUS,
  keyToMnemonic,
  mnemonicToKey,
  makeEthereumSigner,
} from "@web3auth/mpc-core-kit";
import { EthereumSigningProvider } from '@web3auth/ethereum-mpc-provider';
import { CHAIN_NAMESPACES, IProvider } from "@web3auth/base";
// IMP END - Quick Start
import { BN } from "bn.js";
import { CustomChainConfig } from '../ChainInterface';
import { JWTLoginParams, WalletAuthOptions, OAuthLoginParams } from '../interfaces';

/**
 *
 *
 * @export
 * @class Web3Auth
 * @implements {BaseWalletInfra}
 */
export class Web3Auth implements BaseWalletInfra {

  /**
   * This Object to get the chain configuration which Web3 Auth is going to connect
   *
   * @private
   * @type {CustomChainConfig}
   * @memberof Web3Auth
   */
  private customChainConfig: CustomChainConfig;

  /**
   * This Object to get the Web3 Auth client id and networks it want to connect and other options
   *
   * @private
   * @type {WalletAuthOptions}
   * @memberof Web3Auth
   */
  private web3options: WalletAuthOptions;

  /**
   * This is the MPC Core Kit object which is used to connect to Web3 Auth
   *
   * @private
   * @type {Web3AuthMPCCoreKit}
   * @memberof Web3Auth
   */
  private web3AuthCoreKit: Web3AuthMPCCoreKit;

  /**
   * JWT login params which is used to connect to Web3 Auth. 
   * Either Google or Custom Auth Provider is used to login
   * @private
   * @type {JWTLoginParams}
   * @memberof Web3Auth
   */
  private jwtLoginParams: JWTLoginParams;

  /**
   * This will be used when OAuth login is used
   *
   * @private
   * @type {OAuthLoginParams}
   * @memberof Web3Auth
   */
  private oAuthLoginParams: OAuthLoginParams;

/**
 * This function initializes the MPC Core Kit Product of Web3 Auth
 * The initialized Function will be used to login to Web3 Auth
 * @param {CustomChainConfig} customChainConfig
 * @param {WalletAuthOptions} web3options
 * @param {JWTLoginParams} jwtLoginParams
 * @return {*}  {Promise<void>}
 * @memberof Web3Auth
 */
async init(customChainConfig: CustomChainConfig, web3options: WalletAuthOptions,jwtLoginParams: JWTLoginParams): Promise<void> {
    this.customChainConfig = customChainConfig;
    this.jwtLoginParams = jwtLoginParams;
    this.web3options = web3options;
    console.log("Web3AuthCoreKit before initialized");

    this.web3AuthCoreKit = new Web3AuthMPCCoreKit({
      web3AuthClientId: this.web3options.web3AuthClientId,
      web3AuthNetwork: this.web3options.web3AuthNetwork,
      storage: this.web3options.storage,
      tssLib: this.web3options.tssLib,
      manualSync:this.web3options.manualSync,
      uxMode:this.web3options.uxMode
    });
     await this.web3AuthCoreKit.init();
    console.log("Web3AuthCoreKit initialized");
  }

/**
 * This Method is used to login to Web3 Auth using JWT Login
 * Pass the JWT token and verifier details to login.
 * If Aggregated Login is used, pass the sub verifier details to login
 * @return {*}  {Promise<Web3AuthMPCCoreKit>}
 * @memberof Web3Auth
 */
async login(): Promise<Web3AuthMPCCoreKit> {
    let jwtLoginParams = {
      verifier: this.jwtLoginParams.verifier,
      verifierId: this.jwtLoginParams.verifierId,
      idToken: this.jwtLoginParams.idToken,
      subVerifier: this.jwtLoginParams.subVerifier,

    }
    console.log("JWT Params", JSON.stringify(jwtLoginParams));
    try{
      console.log("Before login status", this.web3AuthCoreKit.status);
    
      if(this.web3AuthCoreKit.status !== COREKIT_STATUS.LOGGED_IN){ 
        await this.web3AuthCoreKit.loginWithJWT(jwtLoginParams);
      }
    
    console.log("After login status", this.web3AuthCoreKit.status);
   
    if(this.web3AuthCoreKit.status === COREKIT_STATUS.LOGGED_IN){ 
      await this.web3AuthCoreKit.commitChanges();
    }
    if(this.web3AuthCoreKit.status === COREKIT_STATUS.REQUIRED_SHARE){ 
      // TODO: to be implemented Critical

    }

    console.log("Login Success");
    return this.web3AuthCoreKit;
  }
  catch(e){
    console.error("error while login",e)
  }
  }

  /**
   * This Method is used to get the Ethereum Provider from the MPC Core Kit Product
   * This is used to sign the transactions
   *
   * @return {*}  {EthereumSigningProvider}
   * @memberof Web3Auth
   */
  getEthereumProvider(): EthereumSigningProvider {
    console.log("getEthereumProvider");
    console.log("this.web3AuthCoreKit.status", this.web3AuthCoreKit.status);
    if (this.web3AuthCoreKit.status === COREKIT_STATUS.LOGGED_IN) {
      const evmProvider = new EthereumSigningProvider({ config: { chainConfig: this.customChainConfig } });
      evmProvider.setupProvider(makeEthereumSigner(this.web3AuthCoreKit));
      return evmProvider;
    }
    return null;

  }

/**
 * This Method is used to reset the account in Web3 Auth. This Should be used only for testing purposes
 *
 * @param {*} coreKitInstance
 * @memberof Web3Auth
 */
protected criticalResetAccount = async (coreKitInstance): Promise<void> => {
    // This is a critical function that should only be used for testing purposes
    // Resetting your account means clearing all the metadata associated with it from the metadata server
    // The key details will be deleted from our server and you will not be able to recover your account
    if (!coreKitInstance) {
      throw new Error("coreKitInstance is not set");
    }
    //@ts-ignore
    // if (selectedNetwork === WEB3AUTH_NETWORK.MAINNET) {
    //   throw new Error("reset account is not recommended on mainnet");
    // }
    await coreKitInstance.tKey.storageLayer.setMetadata({
      privKey: new BN(coreKitInstance.state.postBoxKey!, "hex"),
      input: { message: "KEY_NOT_FOUND" },
    });
    if (coreKitInstance.status === COREKIT_STATUS.LOGGED_IN) {
      await coreKitInstance.commitChanges();
    }
   coreKitInstance.logout();
  };

}