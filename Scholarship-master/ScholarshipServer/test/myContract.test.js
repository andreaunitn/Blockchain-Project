const MyContract = artifacts.require("MyContract");

contract("MyContract", (accounts) => {
    let contract;

    before(async () => {
        contract = await MyContract.deployed(500000, 100, [0, 60, 120], [1200, 1900, 2850], "First call", "25/07/2023");
    });

    describe("Add new student", async () => {
        let expectedStudent;

        before("add a new student", async () => {
            await contract.addStudent(10, 80, 2, accounts[0], 1, { from: accounts[0] });
            expectedStudent = [accounts[0], 10, 80, 2, 10, 0, true, 1];
        });

        it("can fetch student inserted", async () => {
            const student = await contract.getStudent(accounts[0]);

            const studentParsed = [
                student.accountAddress,
                Number(student.isee),
                Number(student.credits),
                Number(student.year),
                Number(student.score),
                Number(student.funds),
                student.eligible,
                Number(student._status)
            ];

            assert.deepEqual(studentParsed, expectedStudent, "OK");
        });
    });
});



/*
address accountAddress; //address of the account of the student
        uint256 isee; // [1, 1000000]
        uint256 credits; // [0, 1000]
        uint256 year; //year you are asking for the scholarship [1, 3]
        uint256 score; //computed for ranking 
        uint256 funds; //scholarship value for the student
        bool eligible; // true/false
        status _status;*/