const { assert } = require("chai");
const { getNamedAccounts, ethers, network } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");

if (developmentChains.includes(network.name)) {
  console.log(
    "In Development Chain. Cannot Run Staging Tests. Change your network and try again!!!"
  );
} else {
  describe("FundMe", async function () {
    let fundMe;
    let deployer;
    const sendValue = ethers.utils.parseEther("0.1");
    beforeEach(async function () {
      deployer = (await getNamedAccounts()).deployer;
      fundMe = await ethers.getContract("FundMe", deployer);
    });

    it("allows people to fund and withdraw", async function () {
      await fundMe.fund({ value: sendValue });
      await fundMe.withdraw();

      const endingContractBalance = await fundMe.provider.getBalance(
        fundMe.address
      );
      assert.equal(endingContractBalance.toString(), "0");
    });
  });
}
