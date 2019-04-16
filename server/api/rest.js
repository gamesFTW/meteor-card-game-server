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

SimpleRest.setMethodOptions('createGame', {
  getArgsFromRequest: function (request) {
    var content = request.body;

    if (!content.deckId1) {
      throw new Error('deckId1 not set');
    }

    if (!content.deckId2) {
      throw new Error('deckId2 not set');
    }
    return [content.deckId1, content.deckId2];
  }
});

