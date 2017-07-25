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

    voteOnDog: function(index) {
        getAccounts().then(function(accounts) {
            account = accounts[0];
            return App.contracts.PetContest.deployed();
        }).then(function(instance) {
            contestInstance = instance;
            return contestInstance.voteOnDog(index, {from: account});
        }).then(function() {
            App.initializePets();
        });
    },

    setPetData: function(data) {
        var petsRow = $('#petsRow');
        var petTemplate = $('#petTemplate');

        petsRow.empty();

        for (i = 0; i < data.length; i++) {
            petTemplate.find('.panel-title').text(data[i].name);
            petTemplate.find('img').attr('src', data[i].picture);
            petTemplate.find('.pet-breed').text(data[i].breed);
            petTemplate.find('.pet-age').text(data[i].age);
            petTemplate.find('.pet-location').text(data[i].location);
            petTemplate.find('.pet-votes').text(data[i].votes);

            var voteButton = petTemplate.find('.btn-vote');
            voteButton.attr('data-id', i);

            petsRow.append(petTemplate.html());
        }
    },

    clearPets: function() {
        var contestInstance;
        var account;
        getAccounts().then(function(accounts) {
            account = accounts[0];
            return App.contracts.PetContest.deployed();
        }).then(function(instance) {
            contestInstance = instance;
            return contestInstance.resetContest({from: account});
        }).then(function() {
            App.setPetData([]);
        });
    },

    initializePets: function() {
        var contestInstance;
        var account;
        getAccounts().then(function(accounts) {
            account = accounts[0];
            return App.contracts.PetContest.deployed();
        }).then(function(instance) {
            contestInstance = instance;
            return contestInstance.numberOfDogs.call();
        }).then(function(bigNumberOfDogs) {
            var promises = [];
            var numberOfDogs = bigNumberOfDogs.toNumber();
            for (var i = 0; i < numberOfDogs; i++)
            {
                var promise = (function() {
                    var index = i;
                    var data = {};
                    var promise = contestInstance.getDogName.call(index)
                        .then(function(name) {
                            data.name = name;
                            return contestInstance.getDogPictureUrl.call(index);
                        }).then(function(pictureUrl) {
                            data.picture = pictureUrl;
                            return contestInstance.getDogAge.call(index);
                        }).then(function(age) {
                            data.age = age.toNumber();
                            return contestInstance.getDogBreed.call(index);
                        }).then(function(breed) {
                            data.breed = breed;
                            return contestInstance.getDogLocation.call(index);
                        }).then(function(dogLocation) {
                            data.location = dogLocation;
                            return contestInstance.getDogVotes.call(index);
                        }).then(function(dogVotes) {
                            data.votes = dogVotes.toNumber();
                            return Promise.resolve(data);
                        });
                    return promise;
                })();

                promises.push(promise);
            }

            return Promise.all(promises).then(function(data) {
                App.setPetData(data);
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
        $('#insert-button').on('click', App.addTestDog);
        $('#clear-button').on('click', App.clearPets);
        $(document).on('click', '.btn-vote', function() {
            var id = parseInt($(this).data("id"));
            console.log("voting on " + id);
            App.voteOnDog(id);
        });
    },

    addTestDog: function() {
        var pictureUrl = "https://upload.wikimedia.org/wikipedia/commons/e/ec/Terrier_mixed-breed_dog.jpg";

        var contestInstance;

        web3.eth.getAccounts(function(error, accounts) {
            if (error) {
                alert(error);
                return;
            }

            var account = accounts[0];
            App.contracts.PetContest.deployed().then(function(instance) {
                contestInstance = instance;
                return contestInstance.insertDog("woof", pictureUrl, 3, "terrier", "USA", {from: account});
            }).then(function() {
                App.initializePets();
                console.log("Finished adding");
            });
        });
    },
};

$(function() {
    $(window).load(function() {
        App.init();
    });
});
