pragma solidity ^0.4.4;

contract PetContest {
    string[16] dogNames;
    string[16] dogPictures;
    uint[16] dogAges;
    string[16] dogBreeds;
    string[16] dogLocations;
    uint[16] dogVotes;
    address[16] dogSubmitters;

    uint public numberOfDogs;

    function insertDog(string name, string pictureUrl, uint age, string breed, string location) payable {
        require(msg.value >= 5000000000000);

        dogNames[numberOfDogs] = name;
        dogPictures[numberOfDogs] = pictureUrl;
        dogAges[numberOfDogs] = age;
        dogBreeds[numberOfDogs] = breed;
        dogLocations[numberOfDogs] = location;
        dogVotes[numberOfDogs] = 0;
        dogSubmitters[numberOfDogs] = msg.sender;

        numberOfDogs++;
    }

    function getSender() returns (address) {
        return msg.sender;
    }

    function voteOnDog(uint index) {
        require(dogSubmitters[index] != msg.sender);
        dogVotes[index]++;
    }

    function resetContest() {
        numberOfDogs = 0;
    }

    function closeContest() returns (address) {
        require(numberOfDogs > 0);
        uint payout = numberOfDogs * 25;
        uint mostVotes = dogVotes[0];
        uint winner = 0;

        for (uint i = 1; i < numberOfDogs; i++) {
            if (dogVotes[i] > mostVotes) {
                mostVotes = dogVotes[i];
                winner = i;
            }
        }

        dogSubmitters[i].transfer(payout);
        resetContest();

        return dogSubmitters[i];
    }

    function getDogName(uint index) public returns (string) {
        return dogNames[index];
    }

    function getDogPictureUrl(uint index) public returns (string) {
        return dogPictures[index];
    }

    function getDogAge(uint index) public returns (uint) {
        return dogAges[index];
    }

    function getDogBreed(uint index) public returns (string) {
        return dogBreeds[index];
    }

    function getDogLocation(uint index) public returns (string) {
        return dogLocations[index];
    }

    function getDogVotes(uint index) public returns (uint) {
        return dogVotes[index];
    }

    function getDogSubmitter(uint index) public returns (address) {
        return dogSubmitters[index];
    }
}
