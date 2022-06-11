const { getNamedAccounts, ethers } = require("hardhat");

async function main() {
  const { deployer } = await getNamedAccounts();
  const fundMe = await ethers.getContract("FundMe", deployer);

  console.log("Funding");

  const transactionResponse = await fundMe.withdraw();
  await transactionResponse.wait(1);
  console.log("MOney withdrawn");
}

main()
  .then(() => {
    process.exit(0);
  })

  .catch(() => {
    process.exit(1);
  });
