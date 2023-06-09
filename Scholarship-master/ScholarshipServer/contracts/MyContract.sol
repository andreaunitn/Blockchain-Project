// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MyContract {

    /////////////////////////////////////////////////////////////////////
    // STRUCTS AND GLOBAL VARIABLES

    struct Student {
        address accountAddress; //address of the account of the student
        uint256 isee; // [1, 1000000]
        uint256 credits; // [0, 1000]
        uint256 year; //year you are asking for the scholarship [1, 3]
        uint256 score; //computed for ranking 
        uint256 funds; //scholarship value for the student
        bool eligible; // true/false
        status _status;
    }

    enum status{ IN_SEDE, PENDOLARE, FUORI_SEDE } //the three allowed statuses for students

    uint256 public immutable ISEE_LIMIT; //maximum allowed ISEE to be eligible
    uint256 public constant ISEE_MIN = 2; //supposed minimum ISEE (for scholarship computation)
    uint256 public immutable BUDGET; //entire budget for the scholarships
    string public NAME; //name of scholarship
    string public DATE; //end date to apply for the scholarship
    uint256[] public CREDITS_PER_YEAR; //required credits for each year of the bachelor to be eligible
    uint256[] public FUNDS; //minimum scholarsip value for each student status (max is double)
    
    mapping(address => Student) public mappingStudents; //contains the association address->student
    address[] public keys; //stores the key of each applying student
    address[] public rankedKeys; //stores the keys of students after rankStudents() gets called

    /////////////////////////////////////////////////////////////////////

    constructor(uint256 budget, uint256 isee_limit, uint256[] memory credits, uint256[] memory funds, string memory name, string memory date) {
        require((budget > 0 && isee_limit > 0 && credits[0] < 300 && credits[1] < 300 && credits[2] < 300 && funds[0] > 0 && funds[1] > 0 && funds[2] > 0), "Invalid parameter");
        
        ISEE_LIMIT = isee_limit;
        BUDGET = budget;
        CREDITS_PER_YEAR = credits;
        FUNDS = funds;
        NAME = name;
        DATE = date;
    }

    /////////////////////////////////////////////////////////////////////
    // STUDENTS

    function getKeys() external view returns (address[] memory) {
        return keys;
    }

     function getRankedKeys() external view returns (address[] memory) {
        return rankedKeys;
    }

    function getStudents() external view returns (Student[] memory){
        uint256 len = rankedKeys.length;
        Student[] memory studentArray = new Student[](len);

        for (uint256 i = 0; i < len; i++) {
            studentArray[i] = mappingStudents[rankedKeys[i]];
        }

        return studentArray;
    }

    function addStudent(uint256 _isee, uint256 _crediti, uint256 _year, address key, status _status) external{
        require((_isee > 0 && _crediti < 300 && (_year >= 1 && _year <= 3) && (_status == status.FUORI_SEDE || _status == status.IN_SEDE || _status == status.PENDOLARE)), "Invalid parameter");

        Student memory newStudent = Student(key, _isee, _crediti, _year, uint256(0), uint256(0), false, _status);

        newStudent.eligible = isEligible(newStudent);
        if(newStudent.eligible)
            newStudent.score = computeScore(newStudent);

        if(mappingStudents[key].isee == 0) //check if students is already inserted by looking at isee value
            keys.push(key);

        mappingStudents[key] = newStudent;
    }

    function getStudentCount() external view returns (uint256) {
        return keys.length;
    }

    function computeScore(Student memory student) private pure returns (uint256) {
        //To be modified if a different ranking metric is necessary
        return student.isee;
    }

    function rankStudents() external {
        address[] memory sortedArray = keys;
        uint256 len = sortedArray.length;

        rankedKeys = new address[](0);

        if(len == 1) {
            rankedKeys.push(sortedArray[0]);
        }
        else 
        {
            // Order students' addresses by looking at their score
            for (uint256 i = 0; i < len - 1; i++) {
                for (uint256 j = i + 1; j < len; j++) {
                    if (mappingStudents[sortedArray[i]].score > mappingStudents[sortedArray[j]].score) {
                        (sortedArray[i], sortedArray[j]) = (sortedArray[j], sortedArray[i]); 
                    }
                }
            }

            rankedKeys = sortedArray;
        }
            
    }

    //Uses the student's ranking to assign funds to each student until funds are depleted
    function assignFunding() external {
        uint256 len = rankedKeys.length;
        uint256 budget = BUDGET;
        uint256 isee = 0;
        uint256 minFund = 0;
        uint256 funds;

        for (uint256 i = 0; i < len; i++) {
            if(mappingStudents[rankedKeys[i]].eligible){
                isee = mappingStudents[rankedKeys[i]].isee > ISEE_MIN ? mappingStudents[rankedKeys[i]].isee : ISEE_MIN;

                if(mappingStudents[rankedKeys[i]]._status == status.IN_SEDE) {
                    minFund = FUNDS[0];
                } else if (mappingStudents[rankedKeys[i]]._status == status.PENDOLARE) {
                    minFund = FUNDS[1];
                } else if (mappingStudents[rankedKeys[i]]._status == status.FUORI_SEDE) {
                    minFund = FUNDS[2];
                }

                /// SAFE MATH LIBRARY NOT NEEDED SINCE FROM VERSION 0.8.0 IT IS AUTOMATICALLY IMPLEMENTED          
                funds = uint256(2 * int256(minFund) - int256((uint256(int256(minFund) * (int256(isee) - int256(ISEE_MIN))) / (ISEE_LIMIT - ISEE_MIN))));

                if(budget >= funds) {
                    budget = budget - funds;
                    mappingStudents[rankedKeys[i]].funds = funds;
                } else {
                    return;
                }
            }
        }
    }

    // Checks if a student should be eligible for the scholarship based on its ISEE and credits
    function isEligible(Student memory student) private view returns (bool) {
        bool eligible = true;
        uint256 studentYear = student.year-1;
        if(student.isee > ISEE_LIMIT || student.credits < CREDITS_PER_YEAR[studentYear]) {
            eligible = false;
        }

        return eligible;
    }
    /////////////////////////////////////////////////////////////////////
}