var People = artifacts.require("./PeopleCollector.sol")
const IterableMapping = artifacts.require('./IterableMapping.sol');

module.exports = function(deployer) {
    deployer.deploy(IterableMapping).then(() => {
        deployer.deploy(People);
    });
    deployer.link(IterableMapping, People);
}
