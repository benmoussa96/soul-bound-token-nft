import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { deployments, ethers, network } from "hardhat";
import { developmentChains } from "../../helper-hardhat-config";
import { Lock } from "../../typechain-types";

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("Lock", async () => {
      let lock: Lock, deployer: SignerWithAddress;

      const name = "Lock";

      beforeEach(async () => {
        const accounts = await ethers.getSigners();
        deployer = accounts[0];
        await deployments.fixture(["all"]);

        lock = await ethers.getContract("Lock", deployer);
      });

      describe("constructor()", () => {
        it("sets the owner addresses correctly", async () => {
          const txnResponse = await lock.getOwner();
          expect(txnResponse).to.equal(deployer.address);
        });

        it("sets the name correctly", async () => {
          const txnResponse = await lock.getName();
          expect(txnResponse).to.include(name);
        });
      });
    });
