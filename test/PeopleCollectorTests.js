const IterableMapping = artifacts.require("IterableMapping");
const PeopleCollector = artifacts.require("PeopleCollector");

contract("PeopleCollector", (accounts) => {
  let peopleCollector;

  before(async () => {
    // Deploy the IterableMapping library
    const iterableMapping = await IterableMapping.new();

    // Deploy the PeopleCollector contract and link the IterableMapping library
    PeopleCollector.link(IterableMapping, iterableMapping.address);
    peopleCollector = await PeopleCollector.new();
  });

  it("should set user and retrieve user data correctly", async () => {
    const userAddress = accounts[1];
    const name = "John Doe";
    const isee = 12345;

    await peopleCollector.setUser(userAddress, name, isee);

    const userData = await peopleCollector.getUserByAddress(userAddress);
    const userName = userData[0];
    const userIsee = userData[1];

    assert.equal(userName, name, "User name does not match");
    assert.equal(userIsee, isee, "User iSEE does not match");
  });
});
