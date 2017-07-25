function getAccounts() {
    return new Promise((resolve, reject) => {
        web3.eth.getAccounts(function(error, accounts) {
            if (error) {
                reject(error);
            } else {
                resolve(accounts);
            }
        });
    });
};

App = {
    web3Provider: null,
    contracts: {},

    init: function() {
        App.initWeb3();
    },

    addPet: function(data) {
        var petsRow = $('#petsRow');
        var petTemplate = $('#petTemplate');

        for (i = 0; i < data.length; i ++) {
            petTemplate.find('.panel-title').text(data[i].name);
            petTemplate.find('img').attr('src', data[i].picture);
            petTemplate.find('.pet-breed').text(data[i].breed);
            petTemplate.find('.pet-age').text(data[i].age);
            petTemplate.find('.pet-location').text(data[i].location);
            petTemplate.find('.btn-adopt').attr('data-id', data[i].id);

            petsRow.append(petTemplate.html());
        }
    },

    initializePets: function() {
        var contestInstance;
        App.contracts.PetContest.deployed().then(function(instance) {
            contestInstance = instance;
            return contestInstance.numberOfDogs.call();
        }).then(function(bigNumberOfDogs) {
            var promises = [];
            var numberOfDogs = bigNumberOfDogs.toNumber();
            console.log(numberOfDogs);
            for (var i = 0; i < numberOfDogs; i++)
            {
                console.log(i);
                var data = {};
                var promise = contestInstance.getDogName.call(i)
                .then(function(name) {
                    console.log(name);
                    data.name = name;
                    return contestInstance.getDogPictureUrl.call(i);
                }).then(function(pictureUrl) {
                    data.picture = pictureUrl;
                    return contestInstance.getDogAge.call(i);
                }).then(function(age) {
                    data.age = age.toNumber();
                    return contestInstance.getDogBreed.call(i);
                }).then(function(breed) {
                    data.breed = breed;
                    return contestInstance.getDogLocation.call(i);
                }).then(function(dogLocation) {
                    data.location = dogLocation;
                    return contestInstance.getDogVotes.call(i);
                }).then(function(dogVotes) {
                    data.votes = dogVotes.toNumber();
                    Promise.resolve(data);
                });

                promises.push(promise);
            }

            return Promise.all(promises).then(function(data) {
                for (var i = 0; i < data.length; i++) {
                    addPet(data[i]);
                }
            });
        });
    },

    initWeb3: function() {
        // Initialize web3 and set the provider to the testRPC.
        if (typeof web3 !== 'undefined') {
            App.web3Provider = web3.currentProvider;
            web3 = new Web3(web3.currentProvider);
        } else {
            // set the provider you want from Web3.providers
            App.web3Provider = new web3.providers.HttpProvider('http://localhost:8545');
            web3 = new Web3(App.web3Provider);
        }

        return App.initContract();
    },

    initContract: function() {
        $.getJSON('PetContest.json', function(data) {
            // Get the necessary contract artifact file and instantiate it with truffle-contract.
            var PetContestArtifact = data;
            App.contracts.PetContest = TruffleContract(PetContestArtifact);

            // Set the provider for our contract.
            App.contracts.PetContest.setProvider(App.web3Provider);

            // Use our contract to retieve and mark the adopted pets.
            return App.initializePets();
        });

        return App.bindEvents();
    },

    bindEvents: function() {
        $('#test-button').on('click', App.addTestDog);
    },

    addTestDog: function() {
        var pictureUrl = "https://en.wikipedia.org/wiki/Dog#/media/File:Terrier_mixed-breed_dog.jpg";

        var contestInstance;

        web3.eth.getAccounts(function(error, accounts) {
            if (error) {
                alert(error);
                return;
            }

            var account = accounts[0];
            console.log(account);
            App.contracts.PetContest.deployed().then(function(instance) {
                contestInstance = instance;
                return contestInstance.insertDog("woof", pictureUrl, 3, "terrier", "USA", {from: account});
            }).then(function() {
                alert("k");
            });
        });
    },
};

$(function() {
    $(window).load(function() {
        App.init();
    });
});
