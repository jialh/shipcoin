var PetContest = artifacts.require("./PetContest.sol");

module.exports = function(deployer) {
  deployer.deploy(PetContest);
};
