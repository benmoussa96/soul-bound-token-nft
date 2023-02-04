import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { deployments, ethers, network } from "hardhat";
import { developmentChains } from "../../helper-hardhat-config";
import { UniversityDegree } from "../../typechain-types";

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("UniversityDegree", async () => {
      let universityDegree: UniversityDegree, deployer: SignerWithAddress;

      const name = "SoulBoundToken";
      const symbol = "SBT";

      beforeEach(async () => {
        const accounts = await ethers.getSigners();
        deployer = accounts[0];
        await deployments.fixture(["all"]);

        universityDegree = await ethers.getContract("UniversityDegree", deployer);
      });

      describe("constructor()", () => {
        it("sets the owner addresses correctly", async () => {
          const txnResponse = await universityDegree.getOwner();
          expect(txnResponse).to.equal(deployer.address);
        });

        it("sets the name correctly", async () => {
          const txnResponse = await universityDegree.name();
          expect(txnResponse).to.include(name);
        });

        it("sets the symbol correctly", async () => {
          const txnResponse = await universityDegree.symbol();
          expect(txnResponse).to.include(symbol);
        });
      });

      describe("issueDegree(address to)", () => {
        it("reverts if caller is not the owner", async () => {
          const accounts = await ethers.getSigners();
          const notOwner = accounts[1];
          const notOwnerConnectedContract = await universityDegree.connect(notOwner);

          await expect(
            notOwnerConnectedContract.issueDegree(accounts[3].address)
          ).to.be.revertedWithCustomError(universityDegree, "UniversityDegree__NotOwner");
        });

        it("issues degree", async () => {
          const accounts = await ethers.getSigners();
          const student = accounts[1];

          const txnResponse = await universityDegree.issueDegree(student.address);
          const txnReceipt = await txnResponse.wait(1);

          const isDegreeIssued = await universityDegree.issuedDegrees(student.address);
          expect(isDegreeIssued).to.be.true;
        });
      });
    });
