// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MyContract {
    string public myVariable;
    uint256  val=0;
    constructor(string memory initialValue) {
        myVariable = initialValue;
    }

    function getValue() public view returns (uint256) {
      return val;
    }

    function incrementValue() public {
      val++;
    }
}
