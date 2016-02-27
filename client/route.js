Router.route('/game/:gameType/:playerId', function () {
    MeteorApp.data.playerId = String(this.params.playerId);
    MeteorApp.data.gameType = this.params.gameType;
});
