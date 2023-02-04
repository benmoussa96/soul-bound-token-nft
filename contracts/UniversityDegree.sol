// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "./dependancies/ERC721URIStorage.sol";

error UniversityDegree__NotOwner();

contract UniversityDegree is ERC721URIStorage {
    address private immutable i_owner;

    modifier onlyOwner() {
        if (msg.sender != i_owner) {
            revert UniversityDegree__NotOwner();
        }
        _;
    }

    constructor() ERC721("SoulBountNft", "SBT") {
        i_owner = msg.sender;
    }

    function getOwner() public view returns (address) {
        return i_owner;
    }
}
