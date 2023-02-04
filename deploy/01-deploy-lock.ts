import { DeployFunction } from "hardhat-deploy/dist/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { developmentChains, networkConfig } from "../helper-hardhat-config";
import verify from "../utils/verify";

const deployLock: DeployFunction = async function ({
  getNamedAccounts,
  deployments,
  network,
}: HardhatRuntimeEnvironment) {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId: number = network.config.chainId!;

  let lockName;

  if (developmentChains.includes(network.name)) {
    lockName = "Lock on Development Network";
  } else {
    lockName = networkConfig[chainId]["lockName"];
  }

  const lockArgs = [lockName];

  const lock = await deploy("Lock", {
    from: deployer,
    args: lockArgs,
    log: true,
    waitConfirmations: networkConfig[chainId]?.blockConfirmations || 1,
  });

  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    await verify(lock.address, lockArgs);
  }
};

export default deployLock;
deployLock.tags = ["all", "lock"];
