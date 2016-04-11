Meteor.publish('Cards', function() { return MeteorApp.Cards.find() });
Meteor.publish('Decks', function() { return MeteorApp.Decks.find() });
Meteor.publish('CardsInGame', function(gameId) { return MeteorApp.CardsInGame.find({gameId: gameId}) });
Meteor.publish('Actions', function(gameId) { return MeteorApp.Actions.find({gameId: gameId}) });
Meteor.publish('Games', function() { return MeteorApp.Games.find() });
Meteor.publish('Images', function() { return MeteorApp.Images.find() });

MeteorApp.Images.allow({
  'insert': function () {
    return true;
  }
});
