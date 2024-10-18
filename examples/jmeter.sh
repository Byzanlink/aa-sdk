#!/bin/bash

export API_KEY="8aee100f5be54e648887c8c1b31944f9"
export POLICY_ID="f7241b95-0307-4444-be9b-ae3f8375c621"
export CHAIN_ID="80002"
export WALLET_PRIVATE_KEY="$1" # Use the private key passed from JMeter
#../node_modules/.bin/ts-node ./01-get-address
# Run the Node.js script
../node_modules/.bin/ts-node ./13-paymaster.ts
