const { expect } = require("chai");
const { ethers } = require("hardhat");

const tokens = (n) => {
  return ethers.parseUnits(n.toString(), 'ether')
}

describe("Vault Contract", function () {
  let vault, deployer, user;

  beforeEach(async function () {
    // Get the contract factory
    const Vault = await ethers.getContractFactory("Vault");
    // Deploy the contract
    [deployer, user] = await ethers.getSigners();
    vault = await Vault.deploy();
    // await vault.deployed();
  });

  it("should allow users to deposit Ether", async function () {
    const depositAmount = tokens(1.0); // 1 Ether

    // User deposits Ether
    await expect(
      vault.connect(user).deposit({ value: depositAmount })
    ).to.emit(vault, "Deposit") // Check that Deposit event is emitted
      .withArgs(user.address, depositAmount);

    // Check user's balance in the vault
    const balance = await vault.connect(user).getBalance();
    expect(balance).to.equal(depositAmount);
  });

  it("should allow users to withdraw their Ether", async function () {
    const depositAmount = tokens(2);
    const withdrawAmount = tokens(1);

    // User deposits Ether
    await vault.connect(user).deposit({ value: depositAmount });

    // User withdraws Ether
    await expect(
      vault.connect(user).withdraw(withdrawAmount)
    ).to.emit(vault, "Withdrawal") // Check that Withdrawal event is emitted
      .withArgs(user.address, withdrawAmount);

    // Check remaining balance
    const balance = await vault.connect(user).getBalance();
    expect(balance).to.equal(depositAmount - withdrawAmount);
  });

  it("should prevent withdrawals exceeding the user's balance", async function () {
    const depositAmount = tokens(1);
    await vault.connect(user).deposit({ value: depositAmount });

    const withdrawAmount = tokens(2);
    await expect(
      vault.connect(user).withdraw(withdrawAmount)
    ).to.be.revertedWith("Insufficient balance");
  });

  it("should prevent deposits of zero Ether", async function () {
    await expect(
      vault.connect(user).deposit({ value: 0 })
    ).to.be.revertedWith("Deposit must be greater than 0");
  });

  it("should prevent withdrawals of zero Ether", async function () {
    await expect(
      vault.connect(user).withdraw(0)
    ).to.be.revertedWith("Withdrawal amount must be greater than 0");
  });
});
