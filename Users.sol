// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract Users{
    struct User {
        string fiscalCode;
        string name;
        string surname;
        string email;
        string psw;
    }

    mapping(string => User) public users;

    function signUp(string memory fiscalCode, string memory name, string memory surname, string memory email, string memory psw) public returns (bool){
        if(bytes(users[fiscalCode].fiscalCode).length > 0){
            return false;
        }

        User memory newUser = User(fiscalCode, name, surname, email, psw);
        users[fiscalCode] = newUser;
        return true;
    }

    function login(string memory fiscalCode, string memory psw) public view returns (bool){
        if(bytes(users[fiscalCode].fiscalCode).length > 0 && keccak256(bytes(users[fiscalCode].psw)) == keccak256(bytes(psw))){
            return true;
        } else {
            return false;
        }
    }

    function getUserInfo(string memory fiscalCode) public view returns (string memory, string memory, string memory, string memory){
        if(bytes(users[fiscalCode].fiscalCode).length <= 0){
            return ("","","","");
        } else{
            return (users[fiscalCode].fiscalCode, users[fiscalCode].name, users[fiscalCode].surname, users[fiscalCode].email);
        }
    } 
}