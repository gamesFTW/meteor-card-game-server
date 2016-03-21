Meteor.publish('Cards', function() { return MeteorApp.Cards.find() });
Meteor.publish('Decks', function() { return MeteorApp.Decks.find() });
Meteor.publish('CardsInGame', function() { return MeteorApp.CardsInGame.find() });