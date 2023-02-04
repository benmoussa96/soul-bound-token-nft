# University Degree Soul Bound Token (NFT)

## Description

This repo contains a smart contract (`contracts/UniversityDegree.sol`) that represents a university degree as a Soul Bound NFT Token. It is deployed to the Goerli Testnet at: [0x34ea8f5eba2877971CE4370Caee7CDD188762B43](https://goerli.etherscan.io/address/0x34ea8f5eba2877971CE4370Caee7CDD188762B43)

This contract is used to award degrees to students who graduated. This is done in two steps:

1. Only the owner of the contract can issue degrees with the function `issueDegree(address student, uint256 score)`
2. Then, the student can claim the degree with the function `claimDegree()`

This type of token is called a Soul Bound Token because once the token has been claimed by the student, it can't be transfered to anyone else.

### Built with

- TypeScript
- Solidity
- Yarn
- Node.js (14.0.0)
- Hardhat
- Ethers
- OpenZeppelin

## Getting Started

### Dependencies

- [Alchemy](https://alchemy.com) account and API key.

### Installing

1. Clone the repo

   ```
   git clone https://github.com/benmoussa96/soul-bound-token-nft.git
   ```

2. Change into repo root directory

   ```
   cd soul-bound-token-nft
   ```

3. Install dependencies

   ```
   yarn
   ```

### Compiling and deploying new contract (optional)

4.  Create a `.env` file at the root of the project:

    ```
    MAINNET_RPC_URL=...
    GOERLI_RPC_URL=...
    PIVATE_KEY=...

    MAX_SCORE=...
    IMAGE=...
    MAJOR=...
    TYPE=...
    ```

5.  Deploy the contract:

    ```
    yarn hardhat deploy --network goerli
    ```

6.  Run the tests:

    ```
    yarn hardhat test
    ```
