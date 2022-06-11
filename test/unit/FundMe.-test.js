const { assert, expect, AssertionError } = require("chai");
const { deployments, ethers, getNamedAccounts } = require("hardhat");
const { intToBuffer } = require("hardhat/node_modules/ethereumjs-util");

describe("FundMe", async function () {
  let fundMe;
  let deployer;
  let MockV3Aggregator;
  const sendValue = "1000000000000000000"; // 1 ETH.
  beforeEach(async function () {
    // deploying our fundMe contract using hardhat deploy.
    //accounts = ethers.getSigner() ; // Gives lost of all the accounts on the
    await deployments.fixture("all");
    deployer = (await getNamedAccounts()).deployer;
    fundMe = await ethers.getContract("FundMe", deployer);
    MockV3Aggregator = await ethers.getContract("MockV3Aggregator", deployer);
  });
  describe("Constructor", async function () {
    it("sets aggregator address correctly", async function () {
      const response = fundMe.priceFeed;
      const mock = await MockV3Aggregator.address;

      assert(response, mock);
    });
  });

  describe("Fund", async function () {
    it("Fails if enough ethers are not sent", async function () {
      await expect(fundMe.fund()).to.be.reverted;
    });

    it("Updates the amount funded data structure", async function () {
      await fundMe.fund({ value: sendValue });
      const response = await fundMe.addressToAmountFunded(deployer);
      assert.equal(response.toString(), sendValue.toString());
    });

    it("Adds funder to funder array", async function () {
      await fundMe.fund({ value: sendValue });
      const response = await fundMe.funders(0);
      assert.equal(response, deployer);
    });
  });

  describe("Withdraw", async function () {
    beforeEach(async function () {
      await fundMe.fund({ value: sendValue });
    });

    it("Withdraw from single doner", async function () {
      const currentContractBalance = await fundMe.provider.getBalance(
        fundMe.address
      );
      const OwnersBalance = await fundMe.provider.getBalance(deployer);

      const transactionResponse = await fundMe.withdraw();
      const transactionReceipt = await transactionResponse.wait(1);

      const endingContractBalance = await fundMe.provider.getBalance(
        fundMe.address
      );
      const endingOwnerBalance = await fundMe.provider.getBalance(deployer);
      const gasFees = transactionReceipt.gasUsed.mul(
        transactionReceipt.effectiveGasPrice
      );

      assert.equal(endingContractBalance, 0);
      assert.equal(
        OwnersBalance.add(currentContractBalance).toString(),
        endingOwnerBalance.add(gasFees).toString()
      );
    });

    it("Allows to withdraw from multiple doners", async function () {
      const accounts = await ethers.getSigners();
      for (let i = 1; i < 6; i++) {
        const fundMeConnectedContract = await fundMe.connect(accounts[i]);
        await fundMeConnectedContract.fund({ value: sendValue });
      }

      const currentContractBalance = await fundMe.provider.getBalance(
        fundMe.address
      );
      const OwnersBalance = await fundMe.provider.getBalance(deployer);

      const transactionResponse = await fundMe.withdraw();
      const transactionReceipt = await transactionResponse.wait(1);

      const endingContractBalance = await fundMe.provider.getBalance(
        fundMe.address
      );
      const endingOwnerBalance = await fundMe.provider.getBalance(deployer);
      const gasFees = transactionReceipt.gasUsed.mul(
        transactionReceipt.effectiveGasPrice
      );

      assert.equal(endingContractBalance, 0);
      assert.equal(
        OwnersBalance.add(currentContractBalance).toString(),
        endingOwnerBalance.add(gasFees).toString()
      );
    });

    it("Only allows owner to withdraw", async function () {
      const accounts = await ethers.getSigners();
      const attackerConnectedContract = fundMe.connect(accounts[1]);

      await expect(attackerConnectedContract.withdraw()).to.be.reverted;
    });
  });
});
