// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MyContract {

    // Adjustments and imput checking needed to functions

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


    uint256 public ISEE_LIMIT = 24; //maximum allowed ISEE to be eligible
    uint256 public ISEE_MIN = 2; //supposed minimum ISEE (for scholarship computation)
    uint256[] public CREDITS_PER_YEAR = [0, 45, 85]; //required credits for each year of the bachelor to be eligible
    uint256[] public FUNDS = [1300, 1800, 3079]; //minimum scholarsip value for each student status (max is double)
    uint256 public BUDGET; //entire budget for the scholarships
    string public NAME; //name of scholarship
    string public DATE; //end date to apply for the scholarship
    
    mapping(address => Student) public mappingStudents; //contains the association address->student

    address[] public keys; //stores the key of each applying student
    address[] public rankedKeys; //stores the keys of students after rankStudents() gets called

    /////////////////////////////////////////////////////////////////////

    constructor(uint256 budget, uint256 isee_limit, uint256[] memory credits, uint256[] memory funds, string memory name, string memory date) {
        ISEE_LIMIT = isee_limit;
        BUDGET = budget;
        CREDITS_PER_YEAR = credits;
        FUNDS = funds;
        NAME = name;
        DATE = date;
    }

    /////////////////////////////////////////////////////////////////////
    // STUDENTS

    function getKeys() public view returns (address[] memory) {
        return keys;
    }

     function getRankedKeys() public view returns (address[] memory) {
        return rankedKeys;
    }

    function getStudent(address key) public view returns (Student memory) {
        return mappingStudents[key];
    }

    function getStudents() public view returns (Student[] memory){
        uint len = rankedKeys.length;
        Student[] memory studentArray = new Student[](len);

        for (uint i = 0; i < len; i++) {
            studentArray[i] = mappingStudents[rankedKeys[i]];
        }

        return studentArray;
    }

    function addStudent(uint256 _isee, uint256 _crediti, uint256 _year, address key, status _status) public  returns (bool){
        // input checking
        if(_isee == 0 || _crediti > 300 || _year < 1 || _year > 3 || (_status != status.FUORI_SEDE && _status != status.IN_SEDE && _status != status.PENDOLARE)) {
            return false;
        }

        Student memory newStudent = Student(key, _isee, _crediti, _year, uint256(0), uint256(0), false, _status);

        newStudent.eligible = isEligible(newStudent);
        if(newStudent.eligible)
            newStudent.score = computeScore(newStudent);

        if(mappingStudents[key].isee == 0) //check if students is already inserted by looking at isee value
            keys.push(key);

        mappingStudents[key] = newStudent;

        return true;
    }

    function getStudentCount() public view returns (uint256) {
        return keys.length;
    }

    function computeScore(Student memory student) public pure returns (uint256) {

        //To be modified if a different ranking metric is necessary
        return student.isee;
    }

    function rankStudents() public {
        address[] memory sortedArray = keys;
        uint len = sortedArray.length;

        rankedKeys = new address[](0);

        if(len == 1) {
            rankedKeys.push(sortedArray[0]);
        }
        else 
        {
            // Order students' addresses by looking at their score
            for (uint i = 0; i < len - 1; i++) {
                for (uint j = i + 1; j < len; j++) {
                    if (mappingStudents[sortedArray[i]].score > mappingStudents[sortedArray[j]].score) {
                        // Swap elements
                        (sortedArray[i], sortedArray[j]) = (sortedArray[j], sortedArray[i]); 
                    }
                }
            }

            rankedKeys = sortedArray;
        }
            
    }

    //Uses the student's ranking to assign funds to each student until funds are depleted
    function assignFunding() public {

        uint len = rankedKeys.length;
        uint256 budget = BUDGET;
        uint256 isee = 0;
        uint256 minFund = 0;
        uint256 funds;

        for (uint i = 0; i < len; i++) {
            if(mappingStudents[rankedKeys[i]].eligible){
                isee = mappingStudents[rankedKeys[i]].isee; //> ISEE_MIN ? mappingStudents[rankedKeys[i]].isee : ISEE_MIN + 1;

                if(mappingStudents[rankedKeys[i]]._status == status.IN_SEDE) {
                    minFund = FUNDS[0];
                } else if (mappingStudents[rankedKeys[i]]._status == status.PENDOLARE) {
                    minFund = FUNDS[1];
                } else if (mappingStudents[rankedKeys[i]]._status == status.FUORI_SEDE) {
                    minFund = FUNDS[2];
                }
              
                //funds = uint256(int256((minFund / (ISEE_LIMIT - ISEE_MIN))) * (int256(ISEE_MIN) - int256(isee)) + 2 * int256(minFund))
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
    function isEligible(Student memory student) public view returns (bool) {
        bool eligible = true;
        uint studentYear = student.year-1;
        if(student.isee > ISEE_LIMIT || student.credits < CREDITS_PER_YEAR[studentYear]) {
            eligible = false;
        }

        return eligible;
    }

    /////////////////////////////////////////////////////////////////////

}
