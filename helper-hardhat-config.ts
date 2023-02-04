export interface NetworkConfigItem {
  name?: string;
  blockConfirmations?: number;
}

export interface NetworkConfigInfo {
  [key: string]: NetworkConfigItem;
}

export const networkConfig: NetworkConfigInfo = {
  1: {
    name: "mainnet",
    blockConfirmations: 6,
  },
  5: {
    name: "goerli",
    blockConfirmations: 6,
  },
  137: {
    name: "polygon",
    blockConfirmations: 6,
  },
};

// export const developmentChains = [31337];

export const developmentChains = ["hardhat", "localhost"];
