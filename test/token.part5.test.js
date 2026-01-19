const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PART 5 — Token Contract Tests", function () {
  let token;
  let owner, alice, bob;

  const initialSupply = ethers.parseUnits("1000", 18);

  beforeEach(async () => {
    [owner, alice, bob] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("LabToken"); // <-- поменяй на свой контракт, если нужен
    token = await Token.deploy(initialSupply);
    await token.waitForDeployment();
  });

  // ✅ Basic balance checks
  it("Basic balance checks: totalSupply and deployer balance", async () => {
    expect(await token.totalSupply()).to.equal(initialSupply);
    expect(await token.balanceOf(owner.address)).to.equal(initialSupply);
    expect(await token.balanceOf(alice.address)).to.equal(0n);
  });

  // ✅ Transfer tests
  it("Transfer: moves tokens and updates balances correctly", async () => {
    const amount = ethers.parseUnits("10", 18);

    const ownerBefore = await token.balanceOf(owner.address);
    const aliceBefore = await token.balanceOf(alice.address);

    const tx = await token.transfer(alice.address, amount);
    await tx.wait();

    expect(await token.balanceOf(owner.address)).to.equal(ownerBefore - amount);
    expect(await token.balanceOf(alice.address)).to.equal(aliceBefore + amount);
  });

  // ✅ Event emission tests
  it("Events: emits Transfer with correct args", async () => {
    const amount = ethers.parseUnits("5", 18);

    await expect(token.transfer(alice.address, amount))
      .to.emit(token, "Transfer")
      .withArgs(owner.address, alice.address, amount);
  });

  // ✅ Edge case: transferring to yourself
  it("Edge: transfer to yourself should not change balance (net effect 0)", async () => {
    const amount = ethers.parseUnits("7", 18);

    const before = await token.balanceOf(owner.address);
    const tx = await token.transfer(owner.address, amount);
    await tx.wait();
    const after = await token.balanceOf(owner.address);

    expect(after).to.equal(before); // -amount +amount обратно себе

    await expect(token.transfer(owner.address, amount))
      .to.emit(token, "Transfer")
      .withArgs(owner.address, owner.address, amount);
  });

  // ✅ Failing transfer tests (insufficient balance)
  it("Failing transfer: reverts when amount > balance", async () => {
    const tooMuch = initialSupply + 1n;
    await expect(token.transfer(alice.address, tooMuch))
      .to.be.revertedWith("INSUFFICIENT_BALANCE");
  });

  // ✅ Negative tests: zero address
  it("Negative: reverts on transfer to zero address", async () => {
    const amount = ethers.parseUnits("1", 18);
    await expect(token.transfer(ethers.ZeroAddress, amount))
      .to.be.revertedWith("ZERO_ADDRESS");
  });

  // ✅ Negative tests: amount=0 (в этом токене запрещено)
  it("Negative: reverts on amount = 0", async () => {
    await expect(token.transfer(alice.address, 0n))
      .to.be.revertedWith("AMOUNT_ZERO");
  });

  // ✅ Storage verification (state/invariants)
  it("Storage verification: totalSupply constant, balances consistent after transfer", async () => {
    const amount = ethers.parseUnits("20", 18);

    const totalBefore = await token.totalSupply();
    const ownerBefore = await token.balanceOf(owner.address);
    const aliceBefore = await token.balanceOf(alice.address);

    await (await token.transfer(alice.address, amount)).wait();

    const totalAfter = await token.totalSupply();
    const ownerAfter = await token.balanceOf(owner.address);
    const aliceAfter = await token.balanceOf(alice.address);

    expect(totalAfter).to.equal(totalBefore); // transfer не меняет supply
    expect(ownerAfter).to.equal(ownerBefore - amount);
    expect(aliceAfter).to.equal(aliceBefore + amount);

    // простой инвариант (для двух адресов)
    expect(ownerAfter + aliceAfter).to.equal(ownerBefore + aliceBefore);
  });

  // ✅ Gas estimation tests
  it("Gas estimation: estimateGas(transfer) within reasonable bound", async () => {
    const amount = ethers.parseUnits("1", 18);

    const gasEstimate = await token.transfer.estimateGas(alice.address, amount);
    expect(gasEstimate).to.be.lessThan(150000n); // разумный лимит для простого токена
  });

  it("Gas used: receipt.gasUsed is measured and reasonable", async () => {
    const amount = ethers.parseUnits("2", 18);

    const tx = await token.transfer(alice.address, amount);
    const receipt = await tx.wait();

    expect(receipt.gasUsed).to.be.greaterThan(0n);
    expect(receipt.gasUsed).to.be.lessThan(200000n);
  });
});
