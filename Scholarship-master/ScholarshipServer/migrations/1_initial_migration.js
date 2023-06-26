var Migrations = artifacts.require("./MyContract.sol")

module.exports = function(deployer) {
  deployer.deploy(Migrations,24000, 100000, "1InitialMigration", "00/00/0000");
}
