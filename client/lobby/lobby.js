/**
 * 
 * @param {[String]} playerId1
 * @param {[String]} playerId2
 * @returns {string} - game ID
 */
MeteorApp.createLobbyGame = function(playerId1 = null, playerId2 = null) {
    var defaultDeckId = MeteorApp.Decks.findOne()._id;
    playerId1 = playerId1 || defaultDeckId;
    playerId2 = playerId2 || defaultDeckId;

    return MeteorApp.Games.insert({
        type: 'solo',
        started: false,
        date: new Date(),
        playerId1: playerId1,
        playerId2: playerId2,
        playerId3: undefined,
        playerId4: undefined,
        mapWidth: 10,
        mapHeight: 10
    });
};

MeteorApp.startLobbyGame = function (gameId) {
    var game = MeteorApp.Games.findOne(gameId);
    game.started = true;

    MeteorApp.Games.update(gameId, game);

    Meteor.call('startGame', game);
};

Template.lobby.helpers({
    games: function() {
        return MeteorApp.Games.find({}, { sort: { date: -1 } });
    }
});


Template.lobby.events({
    "click .create-game-button": function() { 
        return MeteorApp.createLobbyGame();
    },
    "change .game-type-selector": function(e) {
        var game = MeteorApp.Games.findOne(this._id);
        game.type = e.target.value;

        MeteorApp.Games.update(this._id, game);
    }
});


Template.gameView.events({
    "change .game-deck-selector": function(e) {
        var game = MeteorApp.Games.findOne(this._id);
        //set playerId
        game[e.target.name] = e.target.value;

        MeteorApp.Games.update(this._id, game);
    },
    "change .lobby__deck-size": function(e) {
        var game = MeteorApp.Games.findOne(this._id);
        // set map size
        game[e.target.name] = e.target.value;
        MeteorApp.Games.update(this._id, game);
    },
    "click .start-game-button": function(e) {
       MeteorApp.startLobbyGame(this._id);
    },
    "click .delete-game-button": function(e) {
        if (confirm('Удалить игру?!')) {
            Meteor.call('removeGameById', this._id);
        }
    }
});


Template.gameView.helpers({
    decks: function() {
        return MeteorApp.Decks.find({});
    },
    getPlayerNameById: function(id) {
        return MeteorApp.Decks.findOne(id).name;
    }
});
