var getDeck = function() {
    var playerId = MeteorApp.data.playerId;
    var deck = MeteorApp.Decks.findOne({ playerId: playerId });
    if (!deck) {
        return createDeck();
    }
    return deck;
};

var createDeck = function() {
    var playerId = MeteorApp.data.playerId;
    var deckId = MeteorApp.Decks.insert({ playerId: playerId, cards: [] });
    return MeteorApp.Decks.findOne(deckId);
};

Template.deckEdit.helpers({
    cards: MeteorApp.Cards.find({}),
    cardsIdsInDeck: function() {
        return getDeck().cards;
    },
    getCardById: function(_id) {
        return MeteorApp.Cards.findOne(_id);
    }
});


Template.cardView.events({
    "click .card-add-btn": function(e) {
        var card = this;
        var deck = getDeck();
        deck.cards.push(card._id);
        MeteorApp.Decks.update(deck._id, deck);
    },
    "click .card-remove-btn": function(e) {
        var card = this;
        var deck = getDeck();
        var index = deck.cards.indexOf(card._id);
        index !== -1 && deck.cards.splice(index, 1);

        MeteorApp.Decks.update(deck._id, deck);
    }
});
