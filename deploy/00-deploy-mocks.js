const { network } = require("hardhat");
const {
  developmentChains,
  decimals,
  INITIAL_ANSWER,
} = require("../helper-hardhat-config");

module.exports = async (hre) => {
  const { getNamedAccounts, deployments } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;

  if (developmentChains.includes(network.name)) {
    console.log("Local Network Detected. Deploying Mocks!!!!");
    await deploy("MockV3Aggregator", {
      contract: "MockV3Aggregator",
      from: deployer,
      log: true,
      args: [decimals, INITIAL_ANSWER],
    });

    console.log(
      "Deployed......................................................"
    );
  }
};

module.exports.tags = ["all", "mocks"];
