import { ethers } from "ethers";
import { PaymasterProvider } from "../interface";
import { ErrorMessage } from "../ErrorMsg";

export class ByzanlinkPaymaster implements PaymasterProvider {
  readonly url: string;
  readonly apiKey: string;
  readonly chainId: any;
  readonly queryParams: string;
  readonly policyId: string;

  constructor(chainId: any, apiKey: string, paymasterUrl: string,policyId: string) {
    this.url = paymasterUrl;
    this.queryParams = `?apiKey=${apiKey}&chainId=${chainId}`;
    this.apiKey = apiKey;
    this.chainId = chainId;
    this.policyId = policyId;
  }

  /* This method is to whitelist the addresses given
  * @param addresses, the array of addresses that needs to be whitelisted
  */
  async addWhitelist(addresses: string[]) {
    let response = null;
    if (addresses.length > 10) throw new Error(ErrorMessage.MAX_ADDRESSES);
    const validAddresses = addresses.every(ethers.utils.isAddress);
    if (!validAddresses) throw new Error(ErrorMessage.INVALID_ADDRESS);
    try {
      response = await fetch(`${this.url}/whitelist`, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'apikey': this.apiKey,
          'chainid': this.chainId,
          'x-policy-id': this.policyId,
 
        },
        body: JSON.stringify({ addressAllowList: addresses }),
      })
        .then(async (res) => {
          const responseJson = await res.json();
          if (responseJson.error) {
            throw new Error(responseJson.error);
          }
          return responseJson
        })
        .catch((err) => {
          throw new Error(err.message);
        })
    } catch (err) {
      throw new Error(err.message)
    }
    if (response.message) return response.message;
    return response;
  }

  /* This method is to remove whitelisted addresses given
  * @param addresses, the array of addresses that needs to be removed from whitelist
  */
  async removeWhitelist(addresses: string[]) {
    let response = null;
    if (addresses.length > 10) throw new Error(ErrorMessage.MAX_ADDRESSES);
    const validAddresses = addresses.every(ethers.utils.isAddress);
    if (!validAddresses) throw new Error(ErrorMessage.INVALID_ADDRESS);
    try {
      response = await fetch(`${this.url}/removeWhitelist`, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'apikey': this.apiKey,
          'chainid': this.chainId,
          'x-policy-id': this.policyId,
        },
        body: JSON.stringify({ addressAllowList: addresses }),
      })
        .then(async (res) => {
          const responseJson = await res.json();
          if (responseJson.error) {
            throw new Error(responseJson.error);
          }
          return responseJson
        })
        .catch((err) => {
          throw new Error(err.message);
        })
    } catch (err) {
      throw new Error(err.message)
    }
    if (response.message) return response.message;
    return response;
  }

  /* This method is to check a given address is whitelisted or not
  * @param address, address that needs to be checked if its whitelisted or not
  */
  async checkWhitelist(address: string) {
    let response = null;
    if (!ethers.utils.isAddress(address)) throw new Error(ErrorMessage.INVALID_ADDRESS)
    try {
      response = await fetch(`${this.url}/checkWhitelist`, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'apikey': this.apiKey,
          'chainid': this.chainId,
          'x-policy-id': this.policyId,
        },
        body: JSON.stringify({ address }),
      })
        .then(async (res) => {
          const responseJson = await res.json();
          if (responseJson.error) {
            throw new Error(responseJson.error);
          }
          return responseJson
        })
        .catch((err) => {
          throw new Error(err.message);
        })
    } catch (err) {
      throw new Error(err.message)
    }
    if (response.message) return response.message;
    return response;
  }

 

}