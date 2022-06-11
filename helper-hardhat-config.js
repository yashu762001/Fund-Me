const networkConfig = {
  4: {
    name: "rinkeby",
    ethUSDpriceFeedAddress: "0x8A753747A1Fa494EC906cE90E9f37563A8AF630e",
  },
  31337: {
    name: "localhost",
  },
};

const developmentChains = ["hardhat", "localhost"];
const decimals = 8;
const INITIAL_ANSWER = 200000000000;

module.exports = {
  networkConfig,
  developmentChains,
  decimals,
  INITIAL_ANSWER,
};
