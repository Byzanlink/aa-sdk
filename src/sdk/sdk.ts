import { BehaviorSubject } from 'rxjs';
import { State, StateService } from './state';
import {
  EthereumProvider,
  isWalletConnectProvider,
  isWalletProvider,
  WalletConnect2WalletProvider,
  WalletProviderLike
} from './wallet';
import { Factory, PaymasterApi, SdkOptions } from './interfaces';
import { Network } from "./network";
import { BatchUserOpsRequest, Exception, getGasFee, onRampApiKey, openUrl, UserOpsRequest } from "./common";
import { BigNumber, BigNumberish, ethers, providers, TypedDataField } from 'ethers';
import { Networks, onRamperAllNetworks } from './network/constants';
import { UserOperationStruct } from './contracts/account-abstraction/contracts/core/BaseAccount';
import { ByzanlinkWalletAPI, HttpRpcClient, VerifyingPaymasterAPI } from './base';
import { TransactionDetailsForUserOp, TransactionGasInfoForUserOp } from './base/TransactionDetailsForUserOp';
import { OnRamperDto, SignMessageDto, validateDto } from './dto';
import { ErrorHandler } from './errorHandler/errorHandler.service';
import { ByzanlinkBundler } from './bundler';
import { ByzanlinkPaymaster } from './paymaster';

/**
 * Byzanlink-AA-Sdk
 *
 * @category Prime-Sdk
 */
export class ByzanlinkAASdk {

  private byzanlinkWallet: ByzanlinkWalletAPI ;
  private bundler: HttpRpcClient;
  private chainId: number;
  private factoryUsed: Factory;
  private index: number;
  private apiKey: string;
  private policyId: string;

  private userOpsBatch: BatchUserOpsRequest = { to: [], data: [], value: [] };

  constructor(walletProvider: WalletProviderLike, optionsLike: SdkOptions) {

    let walletConnectProvider;
    if (isWalletConnectProvider(walletProvider)) {
      walletConnectProvider = new WalletConnect2WalletProvider(walletProvider as EthereumProvider);
    } else if (!isWalletProvider(walletProvider)) {
      throw new Exception('Invalid wallet provider');
    }

    const {
      index,
      chainId,
      rpcProviderUrl,
      accountAddress,
      apiKey,
      policyId,
    } = optionsLike;

    this.chainId = chainId;
    this.index = index ?? 0;
    this.apiKey = apiKey;
    this.policyId = policyId;
    if (!optionsLike.bundlerProvider) {
      optionsLike.bundlerProvider = new ByzanlinkBundler(chainId,apiKey,rpcProviderUrl);
    }

    this.factoryUsed = optionsLike.factoryWallet ?? Factory.BYZANLINK;

    let provider;

    if (rpcProviderUrl) {
      provider = new providers.JsonRpcProvider(rpcProviderUrl);
    } else provider = new providers.JsonRpcProvider(optionsLike.bundlerProvider.url);

    let entryPointAddress = '', walletFactoryAddress = '';
    if (Networks[chainId]) {
      entryPointAddress = Networks[chainId].contracts.entryPoint;
      if (Networks[chainId].contracts.walletFactory[this.factoryUsed] == '') throw new Exception('The selected factory is not deployed in the selected chain_id')
      walletFactoryAddress = Networks[chainId].contracts.walletFactory[this.factoryUsed];
    }

    if (optionsLike.entryPointAddress) entryPointAddress = optionsLike.entryPointAddress;
    if (optionsLike.walletFactoryAddress) walletFactoryAddress = optionsLike.walletFactoryAddress;

    if (entryPointAddress == '') throw new Exception('entryPointAddress not set on the given chain_id')
    if (walletFactoryAddress == '') throw new Exception('walletFactoryAddress not set on the given chain_id')


    this.byzanlinkWallet = new ByzanlinkWalletAPI({
      provider,
      walletProvider: walletConnectProvider ?? walletProvider,
      optionsLike,
      entryPointAddress,
      factoryAddress: walletFactoryAddress,
      predefinedAccountAddress: accountAddress,
      index: this.index,
    })

    this.bundler = new HttpRpcClient(optionsLike.bundlerProvider.url, entryPointAddress, chainId);

  }


  // exposes
  get state(): StateService {
    return this.byzanlinkWallet.services.stateService;
  }

  get state$(): BehaviorSubject<State> {
    return this.byzanlinkWallet.services.stateService.state$;
  }

  get supportedNetworks(): Network[] {
    return this.byzanlinkWallet.services.networkService.supportedNetworks;
  }

  /**
   * destroys
   */
  destroy(): void {
    this.byzanlinkWallet.context.destroy();
  }

  // wallet

  /**
   * signs message
   * @param dto
   * @return Promise<string>
   */
  async signMessage(dto: SignMessageDto): Promise<string> {
    const { message } = await validateDto(dto, SignMessageDto);

    await this.byzanlinkWallet.require({
      network: false,
    });

    return this.byzanlinkWallet.services.walletService.signMessage(message);
  }

  async getCounterFactualAddress(): Promise<string> {
    return this.byzanlinkWallet.getCounterFactualAddress();
  }

  async getPaymasterBalance(address: string): Promise<BigNumber> {
    return this.byzanlinkWallet.getPaymasterBalance(address);
  }

  async estimate(params: {
    paymasterDetails?: PaymasterApi,
    gasDetails?: TransactionGasInfoForUserOp,
    callGasLimit?: BigNumberish,
    key?: number
  } = {}) {
    const { paymasterDetails, gasDetails, callGasLimit, key } = params;
    let dummySignature = "0xfffffffffffffffffffffffffffffff0000000000000000000000000000000007aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa1c";

    if (this.userOpsBatch.to.length < 1) {
      throw new ErrorHandler('cannot sign empty transaction batch', 1);
    }

    if (paymasterDetails?.url) {
      const paymasterAPI = new VerifyingPaymasterAPI(paymasterDetails.url, this.byzanlinkWallet.entryPointAddress, paymasterDetails.context ?? {}, this.chainId, this.apiKey, this.policyId)
      this.byzanlinkWallet.setPaymasterApi(paymasterAPI)
    } else this.byzanlinkWallet.setPaymasterApi(null);

    const tx: TransactionDetailsForUserOp = {
      target: this.userOpsBatch.to,
      values: this.userOpsBatch.value,
      data: this.userOpsBatch.data,
      dummySignature: dummySignature,
      ...gasDetails,
    }

    const gasInfo = await this.getGasFee()

    const partialtx = await this.byzanlinkWallet.createUnsignedUserOp({
      ...tx,
      maxFeePerGas: gasInfo.maxFeePerGas,
      maxPriorityFeePerGas: gasInfo.maxPriorityFeePerGas,
    }, key);

    if (callGasLimit) {
      partialtx.callGasLimit = BigNumber.from(callGasLimit).toHexString();
    }

    const bundlerGasEstimate = await this.bundler.getVerificationGasInfo(partialtx);

    // if user has specified the gas prices then use them
    if (gasDetails?.maxFeePerGas && gasDetails?.maxPriorityFeePerGas) {
      partialtx.maxFeePerGas = gasDetails.maxFeePerGas;
      partialtx.maxPriorityFeePerGas = gasDetails.maxPriorityFeePerGas;
    }
    // if estimation has gas prices use them, otherwise fetch them in a separate call
    else if (bundlerGasEstimate.maxFeePerGas && bundlerGasEstimate.maxPriorityFeePerGas) {
      partialtx.maxFeePerGas = bundlerGasEstimate.maxFeePerGas;
      partialtx.maxPriorityFeePerGas = bundlerGasEstimate.maxPriorityFeePerGas;
    } else {
      const gas = await this.getGasFee();
      partialtx.maxFeePerGas = gas.maxFeePerGas;
      partialtx.maxPriorityFeePerGas = gas.maxPriorityFeePerGas;
    }

    if (bundlerGasEstimate.preVerificationGas) {
      partialtx.preVerificationGas = BigNumber.from(bundlerGasEstimate.preVerificationGas);
      partialtx.verificationGasLimit = BigNumber.from(bundlerGasEstimate.verificationGasLimit ?? bundlerGasEstimate.verificationGas);
      const expectedCallGasLimit = BigNumber.from(bundlerGasEstimate.callGasLimit);
      if (!callGasLimit)
        partialtx.callGasLimit = expectedCallGasLimit;
      else if (BigNumber.from(callGasLimit).lt(expectedCallGasLimit))
        throw new ErrorHandler(`CallGasLimit is too low. Expected atleast ${expectedCallGasLimit.toString()}`);
    }

    return partialtx;

  }

  async getGasFee() {
    const version = await this.bundler.getBundlerVersion();
    if (version && version.includes('byzanlink-bundler'))
      return this.bundler.getSkandhaGasPrice();
    return getGasFee(this.byzanlinkWallet.provider as providers.JsonRpcProvider);
  }

  async send(userOp: UserOperationStruct) {
    const signedUserOp = await this.byzanlinkWallet.signUserOp(userOp);
    return this.bundler.sendUserOpToBundler(signedUserOp);
  }

  async signTypedData(
    DataFields: TypedDataField[],
    message: any
  ) {
    return this.byzanlinkWallet.signTypedData(DataFields, message);
  }

  async getNativeBalance() {
    if (!this.byzanlinkWallet.accountAddress) {
      await this.getCounterFactualAddress();
    }
    const balance = await this.byzanlinkWallet.provider.getBalance(this.byzanlinkWallet.accountAddress);
    return ethers.utils.formatEther(balance);
  }

  async getUserOpReceipt(userOpHash: string) {
    return this.bundler.getUserOpsReceipt(userOpHash);
  }

  async getUserOpHash(userOp: UserOperationStruct) {
    return this.byzanlinkWallet.getUserOpHash(userOp);
  }

  async addUserOpsToBatch(
    tx: UserOpsRequest,
  ): Promise<BatchUserOpsRequest> {
    if (!tx.data && !tx.value) throw new ErrorHandler('Data and Value both cannot be empty', 1);
    this.userOpsBatch.to.push(tx.to);
    this.userOpsBatch.value.push(tx.value ?? BigNumber.from(0));
    this.userOpsBatch.data.push(tx.data ?? '0x');
    return this.userOpsBatch;
  }

  async clearUserOpsFromBatch(): Promise<void> {
    this.userOpsBatch.to = [];
    this.userOpsBatch.data = [];
    this.userOpsBatch.value = [];
  }

  async getAccountContract() {
    return this.byzanlinkWallet._getAccountContract();
  }

  async totalGasEstimated(userOp: UserOperationStruct): Promise<BigNumber> {
    const callGasLimit = BigNumber.from(await userOp.callGasLimit);
    const verificationGasLimit = BigNumber.from(await userOp.verificationGasLimit);
    const preVerificationGas = BigNumber.from(await userOp.preVerificationGas);
    return callGasLimit.add(verificationGasLimit).add(preVerificationGas);
  }

  async getFiatOnRamp(params: OnRamperDto = {}) {
    if (!params.onlyCryptoNetworks) params.onlyCryptoNetworks = onRamperAllNetworks.join(',');
    else {
      const networks = params.onlyCryptoNetworks.split(',');
      for (const network in networks) {
        if (!onRamperAllNetworks.includes(network)) throw new ErrorHandler('Included Networks which are not supported. Please Check', 1);
      }
    }

    const url = `https://buy.onramper.com/?networkWallets=ETHEREUM:${await this.getCounterFactualAddress()}` +
      `&apiKey=${onRampApiKey}` +
      `&onlyCryptoNetworks=${params.onlyCryptoNetworks}` +
      `${params.defaultCrypto ? `&defaultCrypto=${params.defaultCrypto}` : ``}` +
      `${params.excludeCryptos ? `&excludeCryptos=${params.excludeCryptos}` : ``}` +
      `${params.onlyCryptos ? `&onlyCryptos=${params.onlyCryptos}` : ``}` +
      `${params.excludeCryptoNetworks ? `&excludeCryptoNetworks=${params.excludeCryptoNetworks}` : ``}` +
      `${params.defaultAmount ? `&defaultCrypto=${params.defaultAmount}` : ``}` +
      `${params.defaultFiat ? `&defaultFiat=${params.defaultFiat}` : ``}` +
      `${params.isAmountEditable ? `&isAmountEditable=${params.isAmountEditable}` : ``}` +
      `${params.onlyFiats ? `&onlyFiats=${params.onlyFiats}` : ``}` +
      `${params.excludeFiats ? `&excludeFiats=${params.excludeFiats}` : ``}` +
      `&themeName=${params.themeName ?? 'dark'}`;

    if (typeof window === 'undefined') {
      openUrl(url);
    } else {
      window.open(url);
    }

    return url;
  }
}
