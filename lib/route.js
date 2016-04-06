Router.configure({
    layoutTemplate: 'layout'
});

Router.route('/game/:gameId/:playerId', function () {
    this.wait(Meteor.subscribe('CardsInGame'));
    this.wait(Meteor.subscribe('Actions'));
    this.wait(Meteor.subscribe('Games'));

    if (this.ready()) {
        var game = MeteorApp.Games.findOne(this.params.gameId);

        var allPlayersIds = [String(game.playerId1), String(game.playerId2)];
        if (game.type == 'ogre') {
            allPlayersIds = allPlayersIds.concat(
                [String(game.playerId3), String(game.playerId4)]
            );
        }

        MeteorApp.data.allPlayersIds = allPlayersIds;
        MeteorApp.data.currentPlayerId = String(this.params.playerId);
        MeteorApp.data.gameType = game.type;
        MeteorApp.data.gameId = game._id;
        MeteorApp.data.mapWidth = game.mapWidth;
        MeteorApp.data.mapHeight = game.mapHeight;
        this.render('game');
    } else {
        this.render('loading');
    }
});

Router.route('/cards/deck/:playerId/edit', function () {
    MeteorApp.data.playerId = String(this.params.playerId);
    this.wait(Meteor.subscribe('Cards'));
    this.wait(Meteor.subscribe('Decks'));

    if (this.ready()) {
        this.render('deckEdit');
    } else {
        this.render('loading');
    }
});

Router.route('/cards/edit', function () {
    this.render('cardsEdit');
});

Router.route('/images/edit', function () {
    this.render('imagesEdit');
});

Router.route('/lobby', function () {
    this.render('lobby');
});

Router.route('/decks', function () {
    this.render('decks');
});

Router.route('/', function () {
    this.redirect('/lobby')
});
