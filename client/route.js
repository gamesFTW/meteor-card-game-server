Router.route('/game/:playerId', function () {
    MeteorApp.data.playerId = this.params.playerId;

    this.render('index');
});