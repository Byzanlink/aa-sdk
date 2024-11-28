import { NetworkConfig } from ".";

export enum NetworkNames {
  BaseSepolia = 'baseSepolia',
  Sepolia = 'sepolia',
  Optimism = 'optimism',
  Polygon = 'polygon',
  Arbitrum = 'arbitrum',
  ArbitrumSepolia = 'arbitrumSepolia',
  Chiado = 'chiado',
  Fuse = 'fuse',
  FuseSparknet = 'fuseSparknet',
  Gnosis = 'gnosis',
  KromaTestnet = 'kromaTestnet',
  Mainnet = 'mainnet',
  OptimismSepolia = 'optimismSepolia',
  Rootstock = 'rootstock',
  RootstockTestnet = 'rootstockTestnet',
  VerseTestnet = 'verseTestnet',
  Mantle = 'Mantle',
  MantleSepolia = 'MantleSepolia',
  Avalanche = 'avalanche',
  Base = 'base',
  Bsc = 'bsc',
  BscTestnet = 'bscTestnet',
  Fuji = 'fuji',
  Linea = 'linea',
  LineaTestnet = 'lineaTestnet',
  FlareTestnet = 'flareTestnet',
  Flare = 'flare',
  ScrollSepolia = 'scrollSepolia',
  Scroll = 'scroll',
  Ancient8Testnet = 'ancient8Testnet',
  Ancient8 = 'ancient8',
  Amoy = 'amoy',

}

export const SupportedNetworks =
  [137, 80002]

export const NETWORK_NAME_TO_CHAIN_ID: {
  [key: string]: number;
} = {
  [NetworkNames.BaseSepolia]: 84532,
  [NetworkNames.Sepolia]: 11155111,
  [NetworkNames.Optimism]: 10,
  [NetworkNames.Polygon]: 137,
  [NetworkNames.Arbitrum]: 42161,
  [NetworkNames.ArbitrumSepolia]: 421614,
  [NetworkNames.Chiado]: 10200,
  [NetworkNames.Fuse]: 122,
  [NetworkNames.FuseSparknet]: 123,
  [NetworkNames.Gnosis]: 100,
  [NetworkNames.KromaTestnet]: 2357,
  [NetworkNames.Mainnet]: 1,
  [NetworkNames.OptimismSepolia]: 11155420,
  [NetworkNames.Rootstock]: 30,
  [NetworkNames.RootstockTestnet]: 31,
  [NetworkNames.VerseTestnet]: 20197,
  [NetworkNames.Mantle]: 5000,
  [NetworkNames.MantleSepolia]: 5003,
  [NetworkNames.Avalanche]: 43114,
  [NetworkNames.Base]: 8453,
  [NetworkNames.Bsc]: 56,
  [NetworkNames.BscTestnet]: 97,
  [NetworkNames.Fuji]: 43113,
  [NetworkNames.Linea]: 59144,
  [NetworkNames.LineaTestnet]: 59140,
  [NetworkNames.FlareTestnet]: 114,
  [NetworkNames.Flare]: 14,
  [NetworkNames.ScrollSepolia]: 534351,
  [NetworkNames.Scroll]: 534352,
  [NetworkNames.Ancient8Testnet]: 28122024,
  [NetworkNames.Ancient8]: 888888888,
  [NetworkNames.Amoy]: 80002,
};

export const onRamperAllNetworks = ['OPTIMISM', 'POLYGON', 'ARBITRUM', 'FUSE', 'GNOSIS', 'ETHEREUM']

export const Networks: {
  [key: string]: NetworkConfig
} = {
  
  [137]: {
    chainId: 137,
    bundler: 'https://dev.byzanlink.com/bundler/137/rpc',
    //bundler: 'http://0.0.0.0:14337/rpc',
    contracts: {
      entryPoint: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
      walletFactory: {
        byzanlink: '0xdb5cC473bbc77eFC43a004B5bb341CA47dBb7d0d'
      }
    },
  },
  [80002]: {
    chainId: 80002,
   bundler: 'https://dev.byzanlink.com/bundler/80002/rpc',
  //bundler: 'http://0.0.0.0:14337/rpc',
    contracts: {
      entryPoint: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
      walletFactory: {
       // byzanlink: '0xBAf0d462bc4E6fb4e092e5a19DEc471c7B394fB6'
     // byzanlink: '0xAF0A611edb0eb41b0177FA2eDdd670e2a84fECa8' 
     byzanlink: '0xdb5cC473bbc77eFC43a004B5bb341CA47dBb7d0d'
      }
    }
  }
  
};

interface ISafeConstant {
  MultiSend: Record<string, string>;
}

export const Safe: ISafeConstant = {
  // From https://github.com/safe-global/safe-deployments/blob/main/src/assets/v1.3.0/multi_send.json
  MultiSend: {
    "1": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "3": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "4": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "5": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "10": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "11": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "12": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "18": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "25": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "28": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "30": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "31": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "39": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "40": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "41": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "42": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "43": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "44": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "46": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "50": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "51": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "56": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "57": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "61": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "63": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "69": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "71": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "81": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "82": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "83": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "97": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "100": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "106": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "108": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "109": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "111": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "122": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "123": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "137": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "148": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "155": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "169": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "195": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "204": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "246": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "250": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "252": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "255": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "280": "0x0dFcccB95225ffB03c6FBB2559B530C2B7C8A912",
    "288": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "291": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "300": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "321": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "322": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "324": "0x0dFcccB95225ffB03c6FBB2559B530C2B7C8A912",
    "336": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "338": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "420": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "424": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "570": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "588": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "592": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "595": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "599": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "686": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "787": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "919": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "1001": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "1008": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "1030": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "1088": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "1101": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "1111": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "1112": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "1115": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "1116": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "1230": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "1231": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "1284": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "1285": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "1287": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "1294": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "1442": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "1559": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "1663": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "1807": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "1890": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "1891": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "1984": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "1998": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "2001": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "2002": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "2008": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "2019": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "2020": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "2021": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "2221": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "2222": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "2358": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "3737": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "3776": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "4002": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "4202": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "4337": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "4460": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "4689": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "4918": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "4919": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "5000": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "5003": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "5700": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "6102": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "7001": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "7332": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "7341": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "7700": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "8192": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "8194": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "8217": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "8453": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "9000": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "9001": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "9728": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "10000": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "10001": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "10081": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "10200": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "10242": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "10243": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "11235": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "11437": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "11891": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "12357": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "13337": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "17000": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "17172": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "18231": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "23294": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "23295": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "34443": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "42161": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "42170": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "42220": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "43113": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "43114": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "43288": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "44787": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "45000": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "47805": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "54211": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "56288": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "57000": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "58008": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "59140": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "59144": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "71401": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "71402": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "73799": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "80002": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "80085": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "81457": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "84531": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "84532": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "103454": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "167008": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "200101": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "200202": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "333999": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "421611": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "421613": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "421614": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "534351": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "534352": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "534353": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "622277": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "713715": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "7777777": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "11155111": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "11155420": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "168587773": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "222000222": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "245022926": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "245022934": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "333000333": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "999999999": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "1313161554": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "1313161555": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "1666600000": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "1666700000": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "11297108099": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "11297108109": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761"
  },
};


export const CHAIN_ID_TO_NETWORK_NAME: { [key: number]: NetworkNames } = Object.entries(
  NETWORK_NAME_TO_CHAIN_ID,
).reduce(
  (result, [networkName, chainId]) => ({
    ...result,
    [chainId]: networkName,
  }),
  {},
);

export function getNetworkConfig(key: number) {
  return Networks[key];
}
