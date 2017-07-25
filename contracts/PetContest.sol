pragma solidity ^0.4.4;

contract PetContest {
    struct Dog
    {
        string name;
        string pictureUrl;
        uint age;
        string breed;
        string location;
        uint votes;
    }

    Dog[16] dogs;
    uint public numberOfDogs;

    function insertDog(string name, string pictureUrl, uint age, string breed, string location) {
        require (numberOfDogs < 15);
        dogs[numberOfDogs] = Dog(name, pictureUrl, age, breed, location, 0);
        numberOfDogs++;
    }

    function voteOnDog(uint index) {
        require (index < 0 || index >= numberOfDogs);
        dogs[index].votes++;
    }

    function resetContest() {
        numberOfDogs = 0;
    }

    function getDogName(uint index) public returns (string) {
        require (index < 0 || index >= numberOfDogs);
        return dogs[index].name;
    }

    function getDogPictureUrl(uint index) public returns (string) {
        require (index < 0 || index >= numberOfDogs);
        return dogs[index].pictureUrl;
    }

    function getDogAge(uint index) public returns (uint) {
        require (index < 0 || index >= numberOfDogs);
        return dogs[index].age;
    }

    function getDogBreed(uint index) public returns (string) {
        require (index < 0 || index >= numberOfDogs);
        return dogs[index].breed;
    }

    function getDogLocation(uint index) public returns (string) {
        require (index < 0 || index >= numberOfDogs);
        return dogs[index].location;
    }

    function getDogVotes(uint index) public returns (uint) {
        require (index < 0 || index >= numberOfDogs);
        return dogs[index].votes;
    }
}
