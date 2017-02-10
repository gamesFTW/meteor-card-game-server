function clearFilterAndOrder() {
    Session.set('searchCardText', null);
    Session.set('searchCardTile', null);
    Session.set('filterType', null);
    Session.set('order', null);
}


Router.configure({
    layoutTemplate: 'layout'
});

Router.route('/game/:gameId/:playerId', function () {
    this.layout("layoutWithoutMenu");

    var gameId = this.params.gameId;
    this.wait(Meteor.subscribe('CardsInGame', gameId)); 
    this.wait(Meteor.subscribe('Actions', gameId));
    this.wait(Meteor.subscribe('Images'));
    this.wait(Meteor.subscribe('Games'));
    this.wait(Meteor.subscribe('CardsNames'));

    if (this.ready()) {
        var game = MeteorApp.Games.findOne(gameId);

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

    clearFilterAndOrder();

    if (this.ready()) {
        this.render('deckEdit');
    } else {
        this.render('loading');
    }
});

Router.route('/cards/edit', function () {
    this.wait(Meteor.subscribe('Cards'));
    this.wait(Meteor.subscribe('Images'));
    this.wait(Meteor.subscribe('Decks'));
    this.wait(Meteor.subscribe('Games'));
    
    clearFilterAndOrder();
    
    if (this.ready()) {
        this.render('cardsEdit');
    } else {
        this.render('loading');
    }
});

Router.route('/images/edit', function () {
    this.wait(Meteor.subscribe('Images'));
    if (this.ready()) {
        this.render('imagesEdit');
    } else {
        this.render('loading');
    }
});

Router.route('/lobby', function () {
    this.wait(Meteor.subscribe('Games'));
    this.wait(Meteor.subscribe('Decks'));
    
    if (this.ready()) {
        this.render('lobby');
    } else {
        this.render('loading');
    }
});

Router.route('/decks', function () {
    this.wait(Meteor.subscribe('Decks'));
    
    if (this.ready()) {
        this.render('decks');
    } else {
        this.render('loading');
    }
});

Router.route('/', function () {
    this.redirect('/lobby')
});
