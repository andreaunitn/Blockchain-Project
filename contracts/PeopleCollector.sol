// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.0;
import "./IterableMapping.sol";

// Contract for collecting users' personal information
contract PeopleCollector {

    // Struct holding our data.
    itmap students;
    // Apply library functions to the data type.
    using IterableMapping for itmap;

    constructor() {
        // Initialize the students mapping.
        students.keys.push();
        students.size = 0;
    }

    function setUser(address userAddress, string memory name, uint256 isee) public {
        Student memory student = Student(name, isee);
        students.insert(userAddress, student);
    }

    function getUserByAddress(address userAddress) public view returns (string memory, uint256) {
        Student memory userData = students.getStudent(userAddress);
        return (userData.name, userData.isee);
    }

    function printStudents() public view returns (string memory) {
        string memory s = "";

        for (
            Iterator i = students.iterateStart();
            students.iterateValid(i);
            i = students.iterateNext(i)
        ) {
            (, Student memory student) = students.iterateGet(i);
            // s = string(abi.encodePacked(s, student.name));
            // s = string(abi.encodePacked(s, " "));
            // s = string(abi.encodePacked(s, student.isee.toString()));
            // s = string(abi.encodePacked(s, ", "));
            s = string(bytes.concat(bytes(s), bytes(student.name), ", "));
        }

        return s;
    }
}


// Ma gli utenti sono pronti a dover avere un portafoglio metamask ed accettare il contratto tramite lo stesso?
// Come funziona la soluzione di Trenitalia?