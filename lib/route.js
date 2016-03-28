Router.configure({
    layoutTemplate: 'layout'
});

Router.route('/game/:gameType/:playerId', function () {
    MeteorApp.data.playerId = String(this.params.playerId);
    MeteorApp.data.gameType = this.params.gameType;
    this.wait(Meteor.subscribe('CardsInGame'));
    this.wait(Meteor.subscribe('Actions'));

    if (this.ready()) {
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

Router.route('/lobby', function () {
    this.render('lobby');
});
