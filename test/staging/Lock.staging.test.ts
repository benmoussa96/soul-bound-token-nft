import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers, network } from "hardhat";
import { developmentChains } from "../../helper-hardhat-config";
import { Lock } from "../../typechain-types";

developmentChains.includes(network.name)
  ? describe.skip
  : describe("Lock", async () => {
      let lock: Lock, deployer: SignerWithAddress;

      beforeEach(async () => {
        const accounts = await ethers.getSigners();
        deployer = accounts[0];
        lock = await ethers.getContract("Lock", deployer);
      });

      it("", async () => {});
    });
