// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MyContract {

    struct Student {
        string name;
        string surname;
        string taxcode;
        uint isee;
        uint crediti;
    }

    mapping(address => Student) public mappingStudent;

    string public myVariable;
    uint256 public val = 0;

    constructor(string memory initialValue) {
        myVariable = initialValue;
    }

    function getValue() public view returns (uint256) {
        return val;
    }

    function incrementValue() public {
        val++;
    }

    function addStudent(
    string memory _name,
    string memory _surname,
    string memory _taxcode,
    uint256 _isee,
    uint256 _crediti,
    address _address
) public {
    Student memory newStudent = Student(_name,_surname,_taxcode,_isee,_crediti);

     mappingStudent[_address] = newStudent;

}


    function getArrayValue(address index) public view returns (Student memory) {
        return mappingStudent[index];
    }


}
