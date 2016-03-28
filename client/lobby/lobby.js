Template.lobby.helpers({
    games: function() {
        return MeteorApp.Games.find({});
    }
});


Template.lobby.events({
    "click .create-game-button": function(e) {
        MeteorApp.Games.insert({
            type: 'solo',
            player1: undefined,
            player2: undefined,
            player3: undefined,
            player4: undefined
        });
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
        game[e.target.name] = e.target.value;

        MeteorApp.Games.update(this._id, game);
    }
});


Template.gameView.helpers({
    decks: function() {
        return MeteorApp.Decks.find({});
    }
});