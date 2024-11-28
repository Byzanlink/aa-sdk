// @ts-ignore
import config from "../../config.json";
import { ByzanlinkAASdk } from "../../../src";

export default async function main() {
  const byzanlinkAASdk = new ByzanlinkAASdk({ privateKey: config.signingKey }, { chainId: 80001 })
  const address = await byzanlinkAASdk.getCounterFactualAddress();

  console.log(`Byzanlink AA address: ${address}`);
}
