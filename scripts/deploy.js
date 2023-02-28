const hre = require("hardhat");

async function main() {
  const ProofOfConsent = await hre.ethers.getContractFactory("ProofOfConsent");
  const proofOfConsent = await ProofOfConsent.deploy();

  await proofOfConsent.deployed();

  console.log(
    `ProofOfConsent is deployed to ${proofOfConsent.address}`
  );
}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
