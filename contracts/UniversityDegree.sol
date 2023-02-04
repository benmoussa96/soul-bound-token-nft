// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "./dependancies/ERC721URIStorage.sol";
import "./dependancies/librairies/Counters.sol";
import "./dependancies/librairies/Base64.sol";

error UniversityDegree__NotOwner();
error UniversityDegree__YourDegreeNotIssued();
error UniversityDegree__ScoreTooHigh();

/**
 * @title UniversityDegree
 * @author Ghaieth BEN MOUSSA
 * @notice Non-transferable Soul Bound Token (NFT) smart contract for university degrees and diplomas
 * @dev
 */
contract UniversityDegree is ERC721URIStorage {
    using Strings for uint256;
    // ERC721 Variables:
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    // Degree Variables:
    address private immutable i_owner; // Issuer of the degrees
    uint256 public s_degreeMaxScore; // Maximum score of the degree hosted ob IPFS
    string public s_degreeImage; // Image of the degree hosted ob IPFS
    string public s_degreeMajor; // Major of the dgree
    string public s_degreeType; // Type of the degree
    mapping(address => bool) public issuedDegrees;
    mapping(address => uint256) public personToScore;
    mapping(address => string) public personToDegree;

    modifier onlyOwner() {
        if (msg.sender != i_owner) {
            revert UniversityDegree__NotOwner();
        }
        _;
    }

    constructor(
        uint256 degreeMaxScore,
        string memory degreeImage,
        string memory degreeMajor,
        string memory degreeType
    ) ERC721("SoulBoundToken", "SBT") {
        i_owner = msg.sender;
        s_degreeMaxScore = degreeMaxScore;
        s_degreeImage = degreeImage;
        s_degreeMajor = degreeMajor;
        s_degreeType = degreeType;
    }

    function issueDegree(address to, uint256 score) external onlyOwner {
        if (score > s_degreeMaxScore) {
            revert UniversityDegree__ScoreTooHigh();
        }
        issuedDegrees[to] = true;
        personToScore[to] = score;
    }

    function claimDegree() public returns (uint256) {
        if (!issuedDegrees[msg.sender]) {
            revert UniversityDegree__YourDegreeNotIssued();
        }

        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _mint(msg.sender, newItemId);

        string memory tokenURI = generateTokenURI(
            newItemId,
            personToScore[msg.sender]
        );
        _setTokenURI(newItemId, tokenURI);

        issuedDegrees[msg.sender] = false;
        personToDegree[msg.sender] = tokenURI;

        return newItemId;
    }

    function generateTokenURI(
        uint256 tokenId,
        uint256 score
    ) public view returns (string memory) {
        bytes memory dataURI = abi.encodePacked(
            '{',
                '"name": "', s_degreeMajor, ' #', tokenId.toString(), '",',
                '"image": "', s_degreeImage, '",',
                '"description": "An award conferred by a college or university signifying that the recipient has satisfactorily completed a course of study",',
                '"attributes": [',
                    '{',
                        '"trait type": "Score",',
                        '"value": "', score.toString(), '",',
                        '"max_value": ', s_degreeMaxScore, '",',
                    '}',
                    '{',
                        '"trait type": "Major",',
                        '"value": "', s_degreeMajor, '",',
                    '}',
                    '{',
                        '"trait type": "Type of degree",',
                        '"value": "', s_degreeType, '",',
                    '}',
                ']',
            '}'
        );
        return string(
            abi.encodePacked(
                "data:application/json;base64,",
                Base64.encode(dataURI)
            )
        );
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
