// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;


contract ScholarshipCall{
    struct Scholarship {
        string name;
        string description;
        int32  ISEE100;
        string residenceRegion;
        int16 credits;
        int32 averageRating100;
        int16 birthYear;
    }

    mapping(string => Scholarship) public scholarshipCalls;

    function newScholarshipCall(string memory name, string memory description, int32 ISEE100, string memory residenceRegion, int16 credits, int32 averageRating100, int16 birthYear) public returns (bool){
        if(bytes(scholarshipCalls[name].name).length > 0){
            return false;
        }

        Scholarship memory newScholarship = Scholarship(name, description, ISEE100, residenceRegion, credits, averageRating100, birthYear);
        scholarshipCalls[name] = newScholarship;
        return true;
    }

    function getScholarshipInfo(string memory name) public view returns (string memory, int32, string memory, int16, int32, int16){
        if(bytes(scholarshipCalls[name].name).length <= 0){
            return ("",0,"",0,0,0);
        } else{
            return (scholarshipCalls[name].description, scholarshipCalls[name].ISEE100, scholarshipCalls[name].residenceRegion, scholarshipCalls[name].credits, scholarshipCalls[name].averageRating100, scholarshipCalls[name].birthYear);
        }
    } 
}