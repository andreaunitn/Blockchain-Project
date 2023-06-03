// // SPDX-License-Identifier: MIT
// pragma solidity ^0.8.0;
// import "./PeopleCollector.sol";

// contract NameFilter {
//     PeopleCollector public peopleCollector;

//     constructor(address collectorAddress) {
//         peopleCollector = PeopleCollector(collectorAddress);
//     }

//     function filterByIsee() public view returns(PeopleCollector.UserData[] memory) {
        
//     }

//     function filterNames() public view returns (string[] memory) {
//         uint256 peopleCount = peopleCollector.getUserCount();
//         string[] memory filteredUsers = new PeopleCollector.UserData[](peopleCount);
//         uint256 filteredCount = 0;

//         for (uint256 i = 0; i <peopleCount; i++) {
//             uint256 isee = peopleCollector.getNameAtIndex(i);
//             if (containsLetterA(name)) {
//                 filteredNames[filteredCount] = name;
//                 filteredCount++;
//             }
//         }

//         string[] memory result = new string[](filteredCount);
//         for (uint256 i = 0; i < filteredCount; i++) {
//             result[i] = filteredNames[i];
//         }

//         return result;
//     }

//     function containsLetterA(string memory name) internal pure returns (bool) {
//         bytes memory nameBytes = bytes(name);
//         for (uint256 i = 0; i < nameBytes.length; i++) {
//             if (nameBytes[i] == bytes1("a")) {
//                 return true;
//             }
//         }
//         return false;
//     }
// }