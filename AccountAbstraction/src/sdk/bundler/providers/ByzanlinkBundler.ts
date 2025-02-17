import { Exception } from "../../common";
import { getNetworkConfig } from "../../network/constants";
import { BundlerProvider } from "../interface";

export class ByzanlinkBundler implements BundlerProvider {
  readonly url: string;
  readonly apiKey: string;
  readonly chainId: string;


  constructor(chainId: number, apiKey?: string, bundlerUrl?: string,policyId?: string) {
    if (!bundlerUrl) {
      const networkConfig = getNetworkConfig(chainId);
      if (!networkConfig || networkConfig.bundler == '') throw new Exception('No bundler url provided')
      bundlerUrl = networkConfig.bundler;
    }
    if (apiKey) {
      if (bundlerUrl.includes('?apiKey=')) this.url = bundlerUrl + apiKey;
      else this.url = bundlerUrl + '?apiKey=' + apiKey;
    }
    else this.url = bundlerUrl;

    if (policyId) {
      this.url = this.url + '&policyId=' + policyId;
    }

    this.apiKey = apiKey;
  }
}