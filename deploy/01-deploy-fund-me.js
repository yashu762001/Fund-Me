// function deployFunc() {
//   console.log("jkghrig");
// }

// module.exports.default = deployFunc; // Now hardhat will look for this function at the time of deploying by default.
// hre stands for hardhat run time environment.

const {
  networkConfig,
  developmentChains,
} = require("../helper-hardhat-config");
const { network } = require("hardhat");
const { verify } = require("../utils/verify");

module.exports = async (hre) => {
  const { getNamedAccounts, deployments } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;

  let ethUSDpriceFeedAddress;

  if (developmentChains.includes(network.name)) {
    const ethUSDAggregator = await deployments.get("MockV3Aggregator");
    ethUSDpriceFeedAddress = ethUSDAggregator.address;
  } else {
    ethUSDpriceFeedAddress = networkConfig[chainId]["ethUSDpriceFeedAddress"];
  }

  const fundMe = await deploy("FundMe", {
    from: deployer,
    args: [ethUSDpriceFeedAddress], // Put pricefeed address here
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  });

  if (!developmentChains.includes(network.name)) {
    console.log("Verification Started");
    await verify(fundMe.address, [ethUSDpriceFeedAddress]);

    console.log("Contract Verfied");
  }

  console.log(".......................................");
};

module.exports.tags = ["all", "fundme"];
