import { ethers } from "../ethers-5.6.esm.min.js";
import { abi, contractAddress } from "../constants.js";

const connectButton = document.getElementById("connectButton");
const fundButton = document.getElementById("fundButton");
const balanceButton = document.getElementById("balanceButton");
const withdrawButton = document.getElementById("withdrawButton");

connectButton.onclick = ethereum_connect;
fundButton.onclick = fund;
balanceButton.onclick = getBalance;
withdrawButton.onclick = withdraw;

async function ethereum_connect() {
  console.log("Entered");
  connectButton.disabled = true;
  try {
    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    console.log(accounts);
    connectButton.innerHTML = "Connected";
  } catch (err) {
    connectButton.disabled = false;
    console.log("Wallet Connection Request Rejected By User");
  }
}

async function fund() {
  console.log("Funding to Contract !!!");
  // connecting to blockchain
  // signer/wallet address with some gas
  // contract we are interating with : its ABI and address.

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(contractAddress, abi, signer);
  const sendValue = document.getElementById("eth").value;
  console.log(sendValue);
  const transactionResponse = await contract.fund({
    value: ethers.utils.parseEther(sendValue),
  });
  await listenTransactionMined(transactionResponse, provider);
  console.log("Donated!!!");

  getBalance();
}

function listenTransactionMined(transactionResponse, provider) {
  // listen for this transaction to finish :
  return new Promise((resolve, reject) => {
    provider.once(transactionResponse.hash, (transactionReceipt) => {
      console.log(
        `Completed with ${transactionReceipt.confirmations} confirmations`
      );
      resolve();
    });
  });
}

async function getBalance() {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  let balance = await provider.getBalance(contractAddress);
  balance = balance / 1000000000000000000;
  balanceButton.innerHTML = `${balance} ETH`;
}

async function withdraw() {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(contractAddress, abi, signer);

  try {
    const transactionResponse = await contract.withdraw();
    await listenTransactionMined(transactionResponse, provider);
    getBalance();
  } catch (err) {
    withdrawButton.innerHTML =
      "Only the Author of contract has permission to withdraw";
    withdrawButton.width = "100%";
  }
}
