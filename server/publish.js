Meteor.publish('Cards', function() { return MeteorApp.Cards.find() });
Meteor.publish('CardsNames', function() { return MeteorApp.Cards.find({}, {fields: {name: 1, _id: 1}}); });
Meteor.publish('Decks', function() { return MeteorApp.Decks.find() });
Meteor.publish('Games', function() { return MeteorApp.Games.find() });
Meteor.publish('Images', function() { return MeteorApp.Images.find() });
Meteor.publish('Sounds', function() { return MeteorApp.Sounds.find() });
Meteor.publish('SoundPacks', function() { return MeteorApp.SoundPacks.find() });

MeteorApp.Images.allow({
  'insert': function () {
    return true;
  }
});

MeteorApp.Sounds.allow({
  'insert': function () {
    return true;
  }
});

