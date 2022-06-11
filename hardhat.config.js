require("dotenv").config();

require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-waffle");
require("hardhat-gas-reporter");
require("solidity-coverage");
require("hardhat-deploy");

const RINKEBY_RPC_URL = process.env.RINKEBY_RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    compilers: [{ version: "0.8.8" }, { version: "0.6.6" }],
  },
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 31337,
      // gasPrice: 130000000000,
    },
    rinkeby: {
      url: "https://rinkeby.infura.io/v3/691ae7b9dd734318a93915f697628eac",
      accounts: [
        "6d2e13246a2dc82c220ccfe00674a8c4f7f419ada6d4be1c7226ddce6cf52977",
      ],
      chainId: 4,
      blockConfirmations: 6,
    },
  },
  gasReporter: {
    enabled: true,
    outputFile: "gas-report.txt",
    noColors: true,
    currency: "USD",
    coinmarketcap: "a9dc9e96-c0cb-40cc-8eaa-d1d42d58ec9e",
  },
  etherscan: {
    apiKey: "WDZSAW2WMPJ86P9WEDDEX763G3Z7FYYSRM",
  },

  namedAccounts: {
    deployer: {
      default: 0,
    },
  },
};
