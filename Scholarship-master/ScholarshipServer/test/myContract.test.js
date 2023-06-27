const MyContract = artifacts.require("MyContract");

contract("MyContract", (accounts) => {
    let contract;

    //uint256 budget, uint256 isee_limit, uint256[] memory credits, uint256[] memory funds, string memory name, string memory date
    before(async () => {
        contract = await MyContract.deployed(500000, 100, [0,60,120], [1200, 1900, 2850], "First call", "25/07/2023");
    })

    describe("Add new student", async () => {
        before("add a new student", async () => {
            //uint256 _isee, uint256 _crediti, uint256 _year, address key, status _status
            await contract.addStudent(10,80, 2, accounts[0], 1, {from: accounts[0]});
            expectedStudent = [accounts[0],10n, 80n, 2n, 10n, 0n, true, 1n] 
        })

        it("can fetch student inserted", async() => {
            const student = await contract.getStudent(accounts[0]);
            assert.equal(student, expectedStudent, "OK");
        })
    });
})

/*
address accountAddress; //address of the account of the student
        uint256 isee; // [1, 1000000]
        uint256 credits; // [0, 1000]
        uint256 year; //year you are asking for the scholarship [1, 3]
        uint256 score; //computed for ranking 
        uint256 funds; //scholarship value for the student
        bool eligible; // true/false
        status _status;*/