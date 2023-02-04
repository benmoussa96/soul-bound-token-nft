import { DeployFunction } from "hardhat-deploy/dist/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { developmentChains, networkConfig } from "../helper-hardhat-config";
import verify from "../utils/verify";

const deployUniversityDegree: DeployFunction = async function ({
  getNamedAccounts,
  deployments,
  network,
}: HardhatRuntimeEnvironment) {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId: number = network.config.chainId!;

  const degreeMaxScore = process.env.MAX_SCORE;
  const degreeImage = process.env.IMAGE;
  const degreeMajor = process.env.MAJOR;
  const degreeType = process.env.TYPE;

  const args = [degreeMaxScore, degreeImage, degreeMajor, degreeType];

  const universityDegree = await deploy("UniversityDegree", {
    from: deployer,
    args: args,
    log: true,
    waitConfirmations: networkConfig[chainId]?.blockConfirmations || 1,
  });

  if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
    await verify(universityDegree.address, args);
  }
};

export default deployUniversityDegree;
deployUniversityDegree.tags = ["all", "universitydegree"];
