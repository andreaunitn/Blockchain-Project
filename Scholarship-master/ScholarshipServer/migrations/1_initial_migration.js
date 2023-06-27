var Migrations = artifacts.require("./MyContract.sol")

module.exports = function(deployer) {
  deployer.deploy(Migrations,500000, 100, [0,60,120], [1200, 1900, 2850], "First call", "25/07/2023");
}
