import { DataUtils, graphqlEndpoints } from '../src';
import * as dotenv from 'dotenv';

dotenv.config();

async function main(): Promise<void> {
  // initializating Data service...
  const dataService = new DataUtils('public-prime-testnet-key', graphqlEndpoints.QA)

  const tokenLists = await dataService.getTokenLists();

  console.log('\x1b[33m%s\x1b[0m', `TokenLists:`, tokenLists);

  const { name } = tokenLists[0];

  let tokenListTokens = await dataService.getTokenListTokens();

  console.log('\x1b[33m%s\x1b[0m', `Default token list tokens length:`, tokenListTokens.length);

  tokenListTokens = await dataService.getTokenListTokens({
    name,
  });

  console.log('\x1b[33m%s\x1b[0m', `${name} token list tokens length:`, tokenListTokens.length);
}

main()
  .catch(console.error)
  .finally(() => process.exit());
