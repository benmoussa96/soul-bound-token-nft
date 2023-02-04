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
 * @dev This contract is used to award degrees to students who graduated in two steps:
 * 1. Only the owner of the contract can issue degrees with the function `issueDegree(address to, uint256 score)`
 * 2. Then, the student can claim the degree with the function `claimDegree()`
 * This type of token is called a Soul Bound Token because once the token 
 * has been claimed by the student, it can not be transfered to anyone else.
 */
contract UniversityDegree is ERC721URIStorage {
    using Strings for uint256;
    // ERC721 Variables:
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    // Degree Variables:
    address private immutable i_owner; // Issuer of the degrees
    uint256 internal s_degreeMaxScore; // Maximum score of the degree
    string internal s_degreeImage; // Image of the degree hosted ob IPFS
    string internal s_degreeMajor; // Major of the degree
    string internal s_degreeType; // Type of the degree
    mapping(address => bool) internal s_issuedDegrees;
    mapping(address => uint256) internal s_personToScore;
    mapping(address => string) internal s_personToDegree;

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
        s_issuedDegrees[to] = true;
        s_personToScore[to] = score;
    }

    function claimDegree() public returns (uint256) {
        if (!s_issuedDegrees[msg.sender]) {
            revert UniversityDegree__YourDegreeNotIssued();
        }

        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _mint(msg.sender, newItemId);

        string memory tokenURI = generateTokenURI(
            newItemId,
            s_personToScore[msg.sender]
        );
        _setTokenURI(newItemId, tokenURI);

        s_issuedDegrees[msg.sender] = false;
        s_personToDegree[msg.sender] = tokenURI;

        return newItemId;
    }

    function generateTokenURI(
        uint256 tokenId,
        uint256 score
    ) private view returns (string memory) {
        bytes memory dataURI = abi.encodePacked(
            '{',
                '"name": "', s_degreeMajor, ' Degree #', tokenId.toString(), '",',
                '"image": "', s_degreeImage, '",',
                '"description": "An award conferred by a college or university signifying that the recipient has satisfactorily completed a course of study",',
                '"attributes": [',
                    '{',
                        '"trait type": "Score",',
                        '"value": ', score.toString(), ',',
                        '"max_value": ', s_degreeMaxScore.toString(),
                    '},',
                    '{',
                        '"trait type": "Major",',
                        '"value": "', s_degreeMajor, '"',
                    '},',
                    '{',
                        '"trait type": "Type of degree",',
                        '"value": "', s_degreeType, '"',
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

    // Getters
    function checkDegreeOfStudent(
        address student
    ) external view returns (string memory) {
        return s_personToDegree[student];
    }

    function checkScoreOfStudent(
        address student
    ) public view returns (uint256) {
        return s_personToScore[student];
    }

    function isStudentDegreeIssued(
        address student
    ) public view returns (bool) {
        return s_issuedDegrees[student];
    }

    function getOwner() public view returns (address) {
        return i_owner;
    }

    function getDegreeMaxScore() public view returns (uint256) {
        return s_degreeMaxScore;
    }

    function getDegreeImage() public view returns (string memory) {
        return s_degreeImage;
    }

    function getDegreeMajor() public view returns (string memory) {
        return s_degreeMajor;
    }

    function getDegreeType() public view returns (string memory) {
        return s_degreeType;
    }
}
