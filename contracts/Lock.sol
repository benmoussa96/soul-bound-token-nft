// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

error Lock__NotOwner();

contract Lock {
    address private immutable i_owner;
    string private name;

    modifier onlyOwner() {
        if (msg.sender != i_owner) { revert Lock__NotOwner(); }
        _;
    }

    constructor(string memory _name) {
        i_owner = msg.sender;
        name = _name;
    }
    
    function getOwner() public view returns (address) {
      return i_owner;
    }
    
    function getName() public view returns (string memory) {
      return name;
    }
}
