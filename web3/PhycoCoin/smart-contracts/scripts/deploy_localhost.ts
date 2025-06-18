import { ethers } from "hardhat";

async function main() {
  const phycoCoinContract = await ethers.deployContract("PhycoCoin");
  await phycoCoinContract.waitForDeployment();
  console.log("PhycoCoin deployed to:", phycoCoinContract.target);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
