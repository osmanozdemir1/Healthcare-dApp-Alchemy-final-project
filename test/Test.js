const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");

describe("ProofOfConsent", function () {
  async function deployContractAndSetVariables() {
    const [deployer, tokenCreator, otherAccount ] = await ethers.getSigners();

    const ProofOfConsent = await ethers.getContractFactory("ProofOfConsent");
    const proofOfConsent = await ProofOfConsent.deploy();

    const vaultAddress = proofOfConsent.address;

    return { proofOfConsent, deployer, tokenCreator, otherAccount, vaultAddress };
  }


  it("Should deploy and set owner", async function () {
    const { proofOfConsent, deployer } = await loadFixture(deployContractAndSetVariables);

    expect(await proofOfConsent.owner()).to.equal(deployer.address);
  });

  it("Should let EOA to mint token", async function () {
    const { proofOfConsent, vaultAddress, tokenCreator } = await loadFixture(deployContractAndSetVariables);
    let name = "x";
    let date = 5;
    let uri = "z";

    await expect(proofOfConsent.connect(tokenCreator).addSurgery(name, date, vaultAddress, uri)).not.to.be.reverted;
  })

  it("Should update contract storage and can be checked", async function () {
    const { proofOfConsent, vaultAddress, tokenCreator } = await loadFixture(deployContractAndSetVariables);
    let name = "x";
    let date = 5;
    let uri = "z";

    // Call addSurgery function which will update the mapping and also mint the soulbound nft.
    await proofOfConsent.connect(tokenCreator).addSurgery(name, date, vaultAddress, uri);

    // Call checkSurgery function whcih will return an array -> patients[address].surgeries 
    let arr = await proofOfConsent.checkSurgery(tokenCreator.address);

    // Check if the first element in the array has the value we passed when creating the token.
    expect(arr[0]).to.include("x");
  })

  it("Should not let token transfer", async function () {
    const { proofOfConsent, tokenCreator, otherAccount } = await loadFixture(deployContractAndSetVariables);
    let name = "x";
    let date = 5;
    let uri = "z";

    // Create a token to creator address and try to transfer it.
    // It should be reverted with "Token not transferable"
    await proofOfConsent.connect(tokenCreator).addSurgery(name, date, tokenCreator.address, uri);
    await expect(proofOfConsent.connect(tokenCreator).transferFrom(tokenCreator.address, otherAccount.address, 0)).to.be.revertedWith("Token not transferable");
  })
});
