pragma solidity ^0.4.4;

contract PetContest {
    string[16] dogNames;
    string[16] dogPictures;
    uint[16] dogAges;
    string[16] dogBreeds;
    string[16] dogLocations;
    uint[16] dogVotes;

    uint public numberOfDogs;

    function insertDog(string name, string pictureUrl, uint age, string breed, string location) {
        dogNames[numberOfDogs] = name;
        dogPictures[numberOfDogs] = pictureUrl;
        dogAges[numberOfDogs] = age;
        dogBreeds[numberOfDogs] = breed;
        dogLocations[numberOfDogs] = location;
        dogVotes[numberOfDogs] = 0;
        numberOfDogs++;
    }

    function voteOnDog(uint index) {
        dogVotes[index]++;
    }

    function resetContest() {
        numberOfDogs = 0;
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
}
