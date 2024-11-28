import { Hex } from "viem";

export interface Wallet {
  address: string;
  providerType: string;
  pubKey:[Hex,Hex]
}

export interface WalletOptions {
  provider?: string;
}
