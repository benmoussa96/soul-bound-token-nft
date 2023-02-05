import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { BigNumber } from "ethers";
import { deployments, ethers, network } from "hardhat";
import { developmentChains } from "../../helper-hardhat-config";
import { UniversityDegree } from "../../typechain-types";

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("UniversityDegree", async () => {
      let universityDegree: UniversityDegree,
        deployer: SignerWithAddress,
        student: SignerWithAddress;

      const name = "SoulBoundToken";
      const symbol = "SBT";
      const score = 16;
      const maxScore = parseInt(process.env.MAX_SCORE || "20");
      const image =
        process.env.IMAGE || "https://ipfs.io/ipfs/QmWDe3t8gb9ySJjPVaGQBFNXWmF4WgF4Bjnx9wKGfRxRzU";
      const major = process.env.MAJOR || "Master Of Business Administration";
      const type = process.env.TYPE || "Bachelor's degree";

      beforeEach(async () => {
        const accounts = await ethers.getSigners();
        deployer = accounts[0];
        student = accounts[1];
        await deployments.fixture(["all"]);

        universityDegree = await ethers.getContract("UniversityDegree", deployer);
      });

      describe("constructor()", () => {
        it("is a soul bound token and cannot be transfered", async () => {
          expect(universityDegree.interface.functions).to.not.include.keys([
            "transferFrom(address,address,uint256)",
            "safeTransferFrom(address,address,uint256)",
            "safeTransferFrom(address,address,uint256,bytes)",
          ]);
        });

        it("sets the `owner` addresses correctly", async () => {
          const txnResponse = await universityDegree.getOwner();
          expect(txnResponse).to.equal(deployer.address);
        });

        it("sets the `name` correctly", async () => {
          const txnResponse = await universityDegree.name();
          expect(txnResponse).to.include(name);
        });

        it("sets the `symbol` correctly", async () => {
          const txnResponse = await universityDegree.symbol();
          expect(txnResponse).to.include(symbol);
        });

        it("sets the `image` correctly", async () => {
          const txnResponse = await universityDegree.getDegreeImage();
          expect(txnResponse).to.include(image);
        });

        it("sets the `major` correctly", async () => {
          const txnResponse = await universityDegree.getDegreeMajor();
          expect(txnResponse).to.include(major);
        });

        it("sets the `type` correctly", async () => {
          const txnResponse = await universityDegree.getDegreeType();
          expect(txnResponse).to.include(type);
        });
      });

      describe("issueDegree(address to)", () => {
        it("reverts with 'NotOwner' error when caller is not the owner", async () => {
          const notOwnerConnectedContract = await universityDegree.connect(student);

          await expect(
            notOwnerConnectedContract.issueDegree(deployer.address, score)
          ).to.be.revertedWithCustomError(universityDegree, "UniversityDegree__NotOwner");
        });

        it("reverts with 'ScoreTooHigh' error when `score` is greater than `maxScore`", async () => {
          await expect(
            universityDegree.issueDegree(student.address, maxScore + 1)
          ).to.be.revertedWithCustomError(universityDegree, "UniversityDegree__ScoreTooHigh");
        });

        it("emits 'degreeIssued()' event", async () => {
          await expect(universityDegree.issueDegree(student.address, score)).to.emit(
            universityDegree,
            "degreeIssued"
          );
        });

        it("issues degree", async () => {
          const txnResponse = await universityDegree.issueDegree(student.address, score);
          const txnReceipt = await txnResponse.wait(1);

          const isDegreeIssued = await universityDegree.isStudentDegreeIssued(student.address);
          const studentScore = await universityDegree.checkScoreOfStudent(student.address);
          expect(isDegreeIssued).to.be.true;
          expect(studentScore).to.equal(score);
        });
      });

      describe("claimDegree()", () => {
        let studentConnectedContract: UniversityDegree;

        beforeEach(async () => {
          studentConnectedContract = await universityDegree.connect(student);
        });

        describe("when the degree is not issued", () => {
          it("reverts with 'YourDegreeNotIssued' error", async () => {
            await expect(studentConnectedContract.claimDegree()).to.be.revertedWithCustomError(
              studentConnectedContract,
              "UniversityDegree__YourDegreeNotIssued"
            );
          });
        });

        describe("when the degree is issued", () => {
          beforeEach(async () => {
            const txnResponse = await universityDegree.issueDegree(student.address, score);
            const txnReceipt = await txnResponse.wait(1);
          });

          it("mints the NFT, claims it to the student and emits 'degreeClaimed()' event", async () => {
            await new Promise<void>(async (resolve, reject) => {
              studentConnectedContract.once("degreeClaimed", async () => {
                try {
                  const tokenCounter = await studentConnectedContract.getTokenCounter();
                  const tokenUri = await studentConnectedContract.tokenURI(tokenCounter[0]);
                  const studentDegree = await studentConnectedContract.checkDegreeOfStudent(
                    student.address
                  );
                  const isDegreeIssued = await studentConnectedContract.isStudentDegreeIssued(
                    student.address
                  );

                  expect(tokenCounter[0]).to.equal(1);
                  expect(tokenUri.toString().includes("data:application/json;base64")).to.be.true;
                  expect(studentDegree).to.equal(tokenUri);
                  expect(isDegreeIssued).to.be.false;
                  resolve();
                } catch (error) {
                  reject(error);
                }
              });

              const txnResponse = await studentConnectedContract.claimDegree();
              const txnReceipt = await txnResponse.wait(1);
            });
          });
        });
      });
    });
