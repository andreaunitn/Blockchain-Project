// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MyContract {

    uint256 public ISEE_LIMIT = 23600;
    uint256[] public CREDITS_PER_YEAR = [uint256(0), 45, 85]; //crediti richiesti per onni anno della triennale

    struct Student {
        string name;
        string surname;
        string taxcode;
        uint256 isee;
        uint256 crediti;
        uint256 year; //supposed to go from 1 to 3 (anno della triennale per cui fai richiesta della borsa)
        uint256 score;
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
        uint256 _year,
        address key
    ) public {
        Student memory newStudent = Student(_name, _surname, _taxcode, _isee, _crediti, _year, uint256(0));
        newStudent.score = computeScore(newStudent);
        mappingStudents[key] = newStudent;
        keys.push(key);
    }

    function getStudentCount() public view returns (uint256) {
        return keys.length;
    }

    function computeScore(Student memory student) public view returns (uint256) {

        uint256 score = 0;

        if(student.isee <= ISEE_LIMIT && student.year <= 3) {

            if(student.year > 1 && student.crediti >= CREDITS_PER_YEAR[student.year - 1]) {
                score = (ISEE_LIMIT - student.isee) + (student.crediti - CREDITS_PER_YEAR[student.year - 1]) * 100;
            }
            if(student.year == 1) {
                score = (ISEE_LIMIT - student.isee) + 15 * 100;
            }
        }

        return score;
    }

    function rankStudents() public view returns (address[] memory){

        address[] memory sortedArray = keys;
        uint len = sortedArray.length;

        // Order students' addresses by looking at their score
        for (uint i = 0; i < len - 1; i++) {
            for (uint j = i + 1; j < len; j++) {
                if (mappingStudents[sortedArray[i]].score < mappingStudents[sortedArray[j]].score) {
                    // Swap elements
                    address temp = sortedArray[i];
                    sortedArray[i] = sortedArray[j];
                    sortedArray[j] = temp;
                }
            }
        }

        return sortedArray;
    }

}
