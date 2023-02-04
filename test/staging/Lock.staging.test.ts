import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers, network } from "hardhat";
import { developmentChains } from "../../helper-hardhat-config";
import { UniversityDegree } from "../../typechain-types";

developmentChains.includes(network.name)
  ? describe.skip
  : describe("UniversityDegree", async () => {
      let universityDegree: UniversityDegree, deployer: SignerWithAddress;

      beforeEach(async () => {
        const accounts = await ethers.getSigners();
        deployer = accounts[0];
        universityDegree = await ethers.getContract("UniversityDegree", deployer);
      });

      it("", async () => {});
    });
