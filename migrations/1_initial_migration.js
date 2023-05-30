var Migrations = artifacts.require("./MyContract.sol")

module.exports = function(deployer) {
  deployer.deploy(Migrations,99);
}
