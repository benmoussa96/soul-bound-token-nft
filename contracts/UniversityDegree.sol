// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "./dependancies/ERC721URIStorage.sol";
import "./dependancies/librairies/Counters.sol";

error UniversityDegree__NotOwner();
error UniversityDegree__YourDegreeNotIssued();

/**
 * @title UniversityDegree
 * @author Ghaieth BEN MOUSSA
 * @notice Non-transferable Soul Bound Token (NFT) smart contract for university degrees and diplomas
 * @dev
 */
contract UniversityDegree is ERC721URIStorage {
    // ERC721 Variables:
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    address private immutable i_owner; // Issuer of degrees

    // Degree Variables:
    mapping(address => bool) public issuedDegrees;
    mapping(address => string) public personToDegree;

    modifier onlyOwner() {
        if (msg.sender != i_owner) {
            revert UniversityDegree__NotOwner();
        }
        _;
    }

    constructor() ERC721("SoulBoundToken", "SBT") {
        i_owner = msg.sender;
    }

    function issueDegree(address to) external onlyOwner {
        issuedDegrees[to] = true;
    }

    function claimDegree(string memory tokenURI) public returns (uint256) {
        if (!issuedDegrees[msg.sender]) {
            revert UniversityDegree__YourDegreeNotIssued();
        }

        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);

        issuedDegrees[msg.sender] = false;
        personToDegree[msg.sender] = tokenURI;

        return newItemId;
    }

    function checkDegreeOfPerson(
        address person
    ) external view returns (string memory) {
        return personToDegree[person];
    }

    function getOwner() public view returns (address) {
        return i_owner;
    }
}
