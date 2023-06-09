const MyContract = artifacts.require("MyContract");
const truffleAssert = require('truffle-assertions');

contract("MyContract", (accounts) => {
    let contract;

    describe("Try to instantiate an invalid contract", async () => {
        it("Triggered require exception", async () => {
            await truffleAssert.reverts(MyContract.new(0, 0, [0, 60, 350], [1200, 1900, 2850], "First call", "25/07/2023"));
        });
    });

    before(async () => {
        contract = await MyContract.deployed(500000, 100, [0, 60, 120], [1200, 1900, 2850], "First call", "25/07/2023");
    });

    describe("Contract deployment and instantiation", async () => {
        it("check contract attributes", async () => {
            const isee_limit = await contract.ISEE_LIMIT();
            const budget = await contract.BUDGET();
            const credit_first_year = await contract.CREDITS_PER_YEAR(0);
            const credit_second_year = await contract.CREDITS_PER_YEAR(1);
            const credit_third_year = await contract.CREDITS_PER_YEAR(2);
            const funds_in_sede = await contract.FUNDS(0);
            const funds_pendolare = await contract.FUNDS(1);
            const funds_fuori_sede = await contract.FUNDS(2);
            const name = await contract.NAME();
            const date = await contract.DATE();
            
            assert.equal(isee_limit, 100);
            assert.equal(budget, 500000);
            assert.equal(credit_first_year, 0);
            assert.equal(credit_second_year, 60);
            assert.equal(credit_third_year, 120);
            assert.equal(funds_in_sede, 1200);
            assert.equal(funds_pendolare, 1900);
            assert.equal(funds_fuori_sede, 2850);
            assert.equal(name, "First call");
            assert.equal(date, "25/07/2023");
        });
    });

    describe("Try to add invalid student", async () => {
        it("Triggered require exception", async () => {
            await truffleAssert.reverts(contract.addStudent(0, 400, 4, accounts[0], 0, { from: accounts[0] }));
        });
    });

    describe("Add new student", async () => {
        let expectedStudent;

        before("add a new student, not eligible by isee", async () => {
            await contract.addStudent(110, 80, 2, accounts[0], 0, { from: accounts[0] });
            expectedStudent = [accounts[0], 110, 80, 2, 0, 0, false, 0];
        });

        it("can fetch student inserted", async () => {
            const student = await contract.mappingStudents(accounts[0]);

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

            assert.deepEqual(studentParsed, expectedStudent, "Student");
        });

        it("can get rankedKeys (1 student)", async () => {
            await contract.rankStudents();
            
            const rankedKeys = await contract.getRankedKeys();

            assert.equal(rankedKeys.length, 1, "Lenght");
            assert.equal(rankedKeys[0], expectedStudent[0], "Address");
        });
    });

    describe("Edit student infos", async () => {

        before("add the same student with updated values, ok isee", async () => {
            await contract.addStudent(100, 80, 2, accounts[0], 0, { from: accounts[0] });
            expectedStudent = [accounts[0], 100, 80, 2, 100, 0, true, 0];
        });

        it("check student is not re-inserted in list", async () => {
            
            const keys = await contract.getKeys();

            assert.equal(keys.length, 1, "Lenght");
        });

        it("check student values are updated, is eligible by isee", async () => {
            
            const student = await contract.mappingStudents(accounts[0]);

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

            assert.deepEqual(studentParsed, expectedStudent, "Student");
        });
    
    });

    describe("Add new student", async () => {

        before("add a new student, eligible", async () => {
            await contract.addStudent(1, 0, 1, accounts[1], 1, { from: accounts[1] });
            expectedStudent2 = [accounts[1], 1, 0, 1, 1, 0, true, 1];
        });

        it("check student2 is inserted in list", async () => {
            
            const keys = await contract.getKeys();

            assert.equal(keys.length, 2, "Lenght");
        });

        it("check student2 values", async () => {
            
            const student2 = await contract.mappingStudents(accounts[1]);

            const studentParsed2 = [
                student2.accountAddress,
                Number(student2.isee),
                Number(student2.credits),
                Number(student2.year),
                Number(student2.score),
                Number(student2.funds),
                student2.eligible,
                Number(student2._status)
            ];

            assert.deepEqual(studentParsed2, expectedStudent2, "Student");
        });

        it("correct ranking of two students", async () => {
            await contract.rankStudents();
            
            const rankedKeys = await contract.getRankedKeys();

            assert.equal(rankedKeys.length, 2, "Lenght");
            assert.equal(rankedKeys[0], expectedStudent2[0], "Address");
            assert.equal(rankedKeys[1], expectedStudent[0], "Address");
        });
    });


    describe("Add new student", async () => {

        before("add a new student, eligible", async () => {
            await contract.addStudent(60, 120, 3, accounts[2], 2, { from: accounts[2] });
            expectedStudent3 = [accounts[2], 60, 120, 3, 60, 0, true, 2];
        });

        it("check student3 is inserted in list", async () => {
            
            const keys = await contract.getKeys();

            assert.equal(keys.length, 3, "Lenght");
        });

        it("check student3 values", async () => {
            
            const student3 = await contract.mappingStudents(accounts[2]);

            const studentParsed3 = [
                student3.accountAddress,
                Number(student3.isee),
                Number(student3.credits),
                Number(student3.year),
                Number(student3.score),
                Number(student3.funds),
                student3.eligible,
                Number(student3._status)
            ];

            assert.deepEqual(studentParsed3, expectedStudent3, "Student");
        });

        it("correct ranking of three students", async () => {
            await contract.rankStudents();
            
            const rankedKeys = await contract.getRankedKeys();

            assert.equal(rankedKeys.length, 3, "Lenght");
            assert.equal(rankedKeys[0], expectedStudent2[0], "Address");
            assert.equal(rankedKeys[1], expectedStudent3[0], "Address");
            assert.equal(rankedKeys[2], expectedStudent[0], "Address");
        });

    });
    

    describe("Assign funds", async () => {

        it("check each students gets the correct amount", async () => {
            
            await contract.assignFunding();
            const student1 = await contract.mappingStudents(accounts[0]);
            const student2 = await contract.mappingStudents(accounts[1]);
            const student3 = await contract.mappingStudents(accounts[2]);

            assert.equal(Number(student1.funds), 1200, "Funds1");  //Looks like something is wrong in funds assignment
            assert.equal(Number(student2.funds), 1900*2, "Funds2");
            assert.equal(Number(student3.funds), Number(2*2850 - Math.floor((2850*(60-2)/(100-2)))), "Funds3"); //Rounding problem
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

//1200/98 * -98 + 2400