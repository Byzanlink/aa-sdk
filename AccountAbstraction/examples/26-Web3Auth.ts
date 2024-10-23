import { ByzanlinkBundler, ByzanlinkAASdk,Web3WalletProvider } from '../src';
import * as dotenv from 'dotenv';
import { logToFile } from './log-to-file';
import { ByzanlinkAAAuth, CHAIN_NAMESPACE } from '@byzanlink/aa-wallet-auth';
import { tssLib } from "@toruslabs/tss-dkls-lib";
import { jwtDecode } from 'jwt-decode';

dotenv.config();

/** This is front end SDK and can be tested on browser create areact app paste this code and run it */
async function main() {
     let map = {"test":"dfds"};
    const token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InoweTJZZGRja2VwV3JBR0R2UDQzSCJ9.eyJnaXZlbl9uYW1lIjoiUmFnaHVsIiwiZmFtaWx5X25hbWUiOiJBdiIsIm5pY2tuYW1lIjoiYXZyYWdodWwiLCJuYW1lIjoiUmFnaHVsIEF2IiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FDZzhvY0pXbFlpMDlZRUJrLWxCOEYxa3lyWm9VSF9CU0VpeHVjSEhRLUNiSW10NWlHUzVqN1ZobUE9czk2LWMiLCJ1cGRhdGVkX2F0IjoiMjAyNC0xMC0yM1QxMjoyNTowOC40MDlaIiwiZW1haWwiOiJhdnJhZ2h1bEBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6Ly9kZXYtcWgxNXY2NWdoa3d4ejV6Zy51cy5hdXRoMC5jb20vIiwiYXVkIjoiVVJ5Tzg3WERtdzVXREZiMnUwcGdSMExXcENRNzBCdlkiLCJpYXQiOjE3Mjk2ODYzMTAsImV4cCI6MTcyOTcyMjMxMCwic3ViIjoiZ29vZ2xlLW9hdXRoMnwxMDUxMDM4ODI1MzI5MzUzNTQ2MDciLCJzaWQiOiJldV9LdFFRdnd5VmhTS3AxRGFPZGlSM200ZlZTZkVzRCIsIm5vbmNlIjoiTkZwcVlXOTBZbWhCZGtKWFZrNHlMbVZTVFRCUk5YTndUa0UxTkdWbVkydFJiRTFmTTJWVmRtdFNOZz09In0.GBNHtFM9SdrOpADZtMoDNFY_710ezo8E-E44gbwPHdYg584q0QVJ3PL5PwZdJyVgEnapWe2kcP4jr4L2LlVf7R4_ddDKtp7RrcNn4HcsCpGl9WlvF6tW4FZyD7zUAXfN1SxnEs4Be6K6Kv3Nx_grzSl9v-eREtVfeQwnWAzaiYu3MNYtABgUhgroNK8Ccs5OXzsDC_qqgw4Q_Z6asAycA2yxfdJv_EOHR0Q64hSZE1kfvczNh90n_IXjghRmKLpWfNxEZJ_kT4jbCiHNTugBTbU9G7hTMYIbLkB8XTb37WOGxHxGbSW6eGQ8zjDL8nq3XDzvJoNLl0p6IlfVx3NWDg";
    const decodedToken = jwtDecode(token) as any;
    
    const chainConfig = {
        chainNamespace: CHAIN_NAMESPACE.OTHER,
        chainId: "0x13882",
        rpcTarget: "https://polygon-amoy.blockpi.network/v1/rpc/9269f7ec0c1aca11e2db14cdf7243da9778150fc",
        displayName: "Ethereum Sepolia Testnet",
        blockExplorerUrl: "https://sepolia.etherscan.io",
        ticker: "ETH",
        tickerName: "Ethereum",
        logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
      };
      let jwtLoginParams = {
        verifier: "byzanlink-demo-verifier",
        verifierId: decodedToken?.email,
        idToken: token,
        subVerifier: 'google-sub-verifier',
      }
      let walletOptions = {
        web3AuthClientId: 'BAQDxTTARnnlWBah9PYznTF7uu4GRffB1AFBN-77hxUsInFJc4w_2UnOO4CHFiztSi1yB5Uu6X3DBus5LdGm1q4',
        web3AuthNetwork: 'sapphire_devnet',
        storage:window.localStorage,
        manualSync: true, // This is the recommended approach
        tssLib: tssLib,
        uxMode:"nodejs"
      }


      const byzanlinkAuth = new ByzanlinkAAAuth({
        walletProvider: "WEB3AUth",
        walletInfraChainConfig: chainConfig,
        walletInfraOptions: walletOptions,
        jwtLoginParams: jwtLoginParams
      });
    
      // initiate with the sdk with web3Auth
      // If we dont want web3Auth, we can skip this step and go to initsmartaccountstep
      let provider = await byzanlinkAuth.getProvider();
    
      let walletProvider = await Web3WalletProvider.connect(provider);


  const bundlerApiKey = '534b456f4e2241e0bf3f5926d30a2d1d';
  const policyId = 'c4d84e60-4f52-4ff1-bb24-e2aa49506386'; 
  // initializating sdk...
  const byzanlinkAASdk = new ByzanlinkAASdk(
    walletProvider, 
    { chainId: Number(process.env.CHAIN_ID),
      policyId: policyId, 
      apiKey: bundlerApiKey, 
 }) 

  // get EtherspotWallet address...
  
  const address: string = await byzanlinkAASdk.getCounterFactualAddress();
  
  logToFile(`Log entry for thread: ${process.env.THREAD_ID}`,process.env.THREAD_ID);
  logToFile( `EtherspotWallet address: ${address}`,process.env.THREAD_ID);
  
  const balance = await byzanlinkAASdk.getNativeBalance();
  
  logToFile(`EtherspotWallet native balance: ${balance}`,process.env.THREAD_ID);
  console.log(`EtherspotWallet native balance: ${balance}`);
  console.log( `EtherspotWallet address: ${address}`,process.env.THREAD_ID);

}

main()
  .catch(console.error)
  .finally(() => process.exit());


