import { BaseWalletInfra } from "./BaseWalletInfra";
import { WALLET_INFRA_PROVIDER } from "./WalletInfraProvider";
import { Web3Auth } from "./Web3Auth/Web3Auth";

/**
 *
 *
 * @export
 * @class ProviderFactory
 */
export class ProviderFactory {
    /**
     * getProvider
     *
     * @static
     * @param {string} providerName
     * @return {*}  {BaseWalletInfra}
     * @memberof ProviderFactory
     */
    static getProvider(providerName: string): BaseWalletInfra {
        if (providerName === WALLET_INFRA_PROVIDER.WEB3_AUTH) {
            return new Web3Auth();
        } 
        throw new Error("Unsupported provider");
    }
}