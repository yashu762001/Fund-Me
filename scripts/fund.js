const { getNamedAccounts, ethers } = require("hardhat");

async function main() {
  const { deployer } = await getNamedAccounts();
  const fundMe = await ethers.getContract("FundMe", deployer);
  console.log("Funding Contract");

  const transactionResponse = await fundMe.fund({
    value: ethers.utils.parseEther("0.45"),
  });
  await transactionResponse.wait(1);

  console.log("Contract Funded");
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch(() => {
    process.exit(1);
  });
