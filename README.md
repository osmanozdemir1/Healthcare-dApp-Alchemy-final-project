# A Healthcare dApp with Hardhat, Vite and Chakra UI

This project uses Hardhat for deploying and testing Solidity smart contract, and also includes a frontend project created with Vite-React.

The purpose of this project is to build a Soulbound NFT smart contract which acts as a Hospital's Vault that stores patient's informed consents for surgeries which are crucial in healthcare. And also build a frontend application that interacts with this contract and lets the user(patient) to sign consent. After signing the transaction, a Soulbound NFT is minted to the contract's (aka the Hospital Vault) address.

You need two different .env files for this project to work. One for the Hardhat project and the other one for the Vite-React project. The first one is required for 'hardhat.config.json' file and you should fill these lines with your values:
```
PRIVATE_KEY=
RPC_URL=
API_KEY=
ETHERSCAN_API_KEY=
```

The second .env file should be in the 'vite-project' folder and you should fill these:
```
VITE_API_KEY=
VITE_AUTH=
VITE_JSON_RPC=
``` 


After completing all the necessery information you can deploy the contract to local network or goerli testnet. You can run the test scripts, run the Vite frontend app (with ```npm run dev```) and interact with the contract.

```shell
npx hardhat run scripts/deploy.js
npx hardhat test
```


