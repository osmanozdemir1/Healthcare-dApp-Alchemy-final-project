require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");
require("@nomicfoundation/hardhat-chai-matchers");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  networks: {
    goerli: {
      url: process.env.RPC_URL,
      accounts: [process.env.PRIVATE_KEY]
    }
  },
  etherscan: {
    apiKey: {
      goerli: process.env.ETHERSCAN_API_KEY
    }
  }
};
