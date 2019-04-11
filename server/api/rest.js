Meteor.method("Decks-with-cards", function () {
  const decks = MeteorApp.Decks.find().fetch().map(function(deck) {

    deck.cards = deck.cards.map(function(cardId) {
      return MeteorApp.Cards.findOne(cardId);
    });

    deck.handCards = deck.handCards.map(function(cardId) {
      return MeteorApp.Cards.findOne(cardId);
    });

    return deck;
  });
  return decks;
}, {
  url: "methods/decks-with-cards",
  httpMethod: "get",
});
