import { SdkParams } from "./interfaces";
import { BaseWalletInfra } from "./walletInfraProvider/BaseWalletInfra";
import { CustomChainConfig } from "./walletInfraProvider/ChainInterface";
import { ProviderFactory } from "./walletInfraProvider/WalletInfraFactory";
import { JWTLoginParams, WalletAuthOptions } from "./walletInfraProvider/interfaces";

/**
 *
 * This class is used to initialize the sdk with the wallet provider
 * This will Instanstiate the wallet provider and connect to Byzanlink Wallet
 *
 * @export
 * @class ByzanlinkAAAuth    
 */
export class ByzanlinkAAAuth {

    private walletProvider?: string;
    private walletInfraChainConfig?: CustomChainConfig;
    private walletInfraOptions?: WalletAuthOptions;
    private jwtLoginParams?: JWTLoginParams;
    private provider: BaseWalletInfra;


    constructor(sdkParameters: SdkParams) {
        this.walletInfraChainConfig = sdkParameters.walletInfraChainConfig;
        this.walletInfraOptions = sdkParameters.walletInfraOptions;
        this.jwtLoginParams = sdkParameters.jwtLoginParams;
        this.walletProvider = sdkParameters.walletProvider;
    }

    /**
  * This function initializes the sdk with the wallet infra provider
  * Current supported providers are Web3Auth in which JWT Authentication is supported with Web3Auth
  * @memberof ByzanlinkAAAuth
  */
    async getProvider() {

        if (this.walletProvider && this.walletInfraChainConfig && this.walletInfraOptions) {
            this.provider = ProviderFactory.getProvider(this.walletProvider);
            await this.provider.init(this.walletInfraChainConfig, this.walletInfraOptions, this.jwtLoginParams);
            await this.provider.login();
            let evmProvider = this.provider.getEthereumProvider();
            return evmProvider;
        }
    }
}