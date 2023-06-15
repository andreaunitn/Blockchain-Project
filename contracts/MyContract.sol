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

    mapping(address => Student) public mappingStudents;

    mapping(address => Student) public rankedStudents;

    address[] public keys;

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

    function getKeys() public view returns (address[] memory) {
        return keys;
    }

    function getStudent(address key) public view returns (Student memory) {
        return mappingStudents[key];
    }

    function addStudent(
    string memory _name,
    string memory _surname,
    string memory _taxcode,
    uint256 _isee,
    uint256 _crediti,
    address key
    ) public {
    Student memory newStudent = Student(_name,_surname,_taxcode,_isee,_crediti);

        mappingStudents[key] = newStudent;
        keys.push(key);

    }

    function getStudentCount() public view returns (uint256) {
        return keys.length;
    }

    function rankStudents() public returns (uint256) {

        uint swap=0;

        // Perform sorting based on the parameter (ascending order)
        for (uint256 i = 0; i < keys.length - 1; i++) {
            for (uint256 j = 0; j < keys.length - i - 1; j++) {
                if (mappingStudents[keys[j]].isee > mappingStudents[keys[j + 1]].isee) {
                    swap++;
                    Student memory temp = mappingStudents[keys[j]];
                    mappingStudents[keys[j]] = mappingStudents[keys[j + 1]];
                    mappingStudents[keys[j + 1]] = temp;
                }
            }
        }

        return swap;
    }


}
