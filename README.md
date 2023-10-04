# University Degree Soul Bound Token (On-Chain NFT)

## Description

This repo contains a smart contract (`contracts/UniversityDegree.sol`) that represents a university degree as a Soul Bound NFT Token.

The contract is deployed to the Goerli Testnet:

1. Etherscan: [0xE458995851B9Dd0D1C06f94333e06655Da5D736C](https://goerli.etherscan.io/address/0xE458995851B9Dd0D1C06f94333e06655Da5D736C)
2. OpenSea: [UniversityDegreeSoulBoundToken](https://testnets.opensea.io/assets/goerli/0xe458995851b9dd0d1c06f94333e06655da5d736c/1)

This contract is used to award degrees to students who graduated. This is done in two steps:

1. Only the owner of the contract can issue degrees with the function `issueDegree(address student, uint256 score)` (Usage: ~ 70,000 Gas)
2. Then, only the the student to which that degree was issued can claim it with the function `claimDegree()`. This mints the token and generates the metadata URI 100% on-chain. (Usage: ~ 1,150,000 Gas)

> :bangbang: **This type of NFT is called a Soul Bound Token because once the token has been claimed by the student, it can't be transfered to anyone else. It is forever linked to the identity of this student.**

### Built with

- Solidity
- OpenZeppelin
- Hardhat
- TypeScript
- Ethers
- Yarn
- Node.js

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
