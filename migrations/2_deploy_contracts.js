var Meter = artifacts.require("./Meter.sol");

module.exports = function(deployer) {
  deployer.deploy(Meter);
};
