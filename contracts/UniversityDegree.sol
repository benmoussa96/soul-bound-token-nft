// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "./dependancies/ERC721URIStorage.sol";
import "./dependancies/librairies/Counters.sol";

error UniversityDegree__NotOwner();

/**
 * @title UniversityDegree
 * @author Ghaieth BEN MOUSSA
 * @notice Non-transferable Soul Bound Token (NFT) smart contract for university degrees and diplomas
 * @dev
 */
contract UniversityDegree is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    address private immutable i_owner;

    modifier onlyOwner() {
        if (msg.sender != i_owner) {
            revert UniversityDegree__NotOwner();
        }
        _;
    }

    constructor() ERC721("SoulBoundToken", "SBT") {
        i_owner = msg.sender;
    }

    function getOwner() public view returns (address) {
        return i_owner;
    }
}
